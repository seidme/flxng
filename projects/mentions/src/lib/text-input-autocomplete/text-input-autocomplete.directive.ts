import {
  AfterViewInit,
  ChangeDetectorRef,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Injector,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewContainerRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { getCaretCoordinates } from './textarea-caret-position';
import { TextInputAutocompleteMenuComponent } from './text-input-autocomplete-menu.component';
// @ts-ignore
// import toPX from 'to-px';

export interface ChoiceWithIndices {
  choice: any;
  indices: {
    start: number;
    end: number;
  };
}

@Directive({
  selector: 'textarea[flxTextInputAutocomplete],input[type="text"][flxTextInputAutocomplete]',
})
export class TextInputAutocompleteDirective implements OnChanges, OnInit, OnDestroy {
  /**
   * The character that will trigger the menu to appear
   */
  @Input() triggerCharacter = '@';

  /**
   * The regular expression that will match the search text after the trigger character
   */
  @Input() searchRegexp = /^\w*$/;

  /**
   * Whether to close the menu when the host textarea loses focus
   */
  @Input() closeMenuOnBlur = false;

  /**
   * Selected choices (required in editing mode in order to keep track of choices)
   */
  @Input() selectedChoices: ChoiceWithIndices[] = [];

  /**
   * The menu component to show with available options.
   * You can extend the built in `TextInputAutocompleteMenuComponent` component to use a custom template
   */
  @Input() menuComponent = TextInputAutocompleteMenuComponent;

  /**
   * Called when the options menu is shown
   */
  @Output() menuShown = new EventEmitter();

  /**
   * Called when the options menu is hidden
   */
  @Output() menuHidden = new EventEmitter();

  /**
   * Called when a choice is selected
   */
  @Output() choiceSelected = new EventEmitter<ChoiceWithIndices>();

  /**
   * Called when a choice is removed
   */
  @Output() choiceRemoved = new EventEmitter<ChoiceWithIndices>();

  /**
   * Called when a choice is selected, removed, or if any of the choices' indices change
   */
  @Output() selectedChoicesChange = new EventEmitter<ChoiceWithIndices[]>();

  /**
   * A function that accepts a search string and returns an array of choices. Can also return a promise.
   */
  @Input() findChoices: (searchText: string) => any[] | Promise<any[]>;

  /**
   * A function that formats the selected choice once selected.
   * The result (label) is also used as a choice identifier (e.g. when editing choices)
   */
  @Input() getChoiceLabel: (choice: any) => string;

  textarea: HTMLTextAreaElement;

  /* tslint:disable member-ordering */
  private menu:
    | {
        component: ComponentRef<TextInputAutocompleteMenuComponent>;
        triggerCharacterPosition: number;
        lastCaretPosition?: number;
      }
    | undefined;

  private menuHidden$ = new Subject();

  private _selectedCwis: ChoiceWithIndices[] = [];
  private _dumpedCwis: ChoiceWithIndices[] = [];
  private _editingCwi: ChoiceWithIndices;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private injector: Injector,
    private elementRef: ElementRef
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedChoices) {
      if (Array.isArray(this.selectedChoices)) {
        /**
         * Timeout needed since ngOnChanges is fired before the textarea value is updated.
         * The problem is specific to publisher.landing component implementation, i.e. single
         * textarea element is used for each account, only text changes..
         * Use ngZone.runOutsideAngular to optimize the timeout so it doesn't fire
         * global change detection events continuously..
         */
        this.ngZone.runOutsideAngular(() => {
          setTimeout(() => {
            const selectedCwisPrevious = JSON.stringify(this._selectedCwis);

            this._selectedCwis = this.selectedChoices.map((c) => {
              return {
                choice: c,
                indices: { start: -1, end: -1 },
              };
            });
            this.updateIndices();

            // Remove choices that index couldn't be found for
            this._selectedCwis = this._selectedCwis.filter((cwi) => cwi.indices.start > -1);

            if (JSON.stringify(this._selectedCwis) !== selectedCwisPrevious) {
              // TODO: Should check for indices change only (ignoring the changes inside choice object)
              this.ngZone.run(() => {
                this.selectedChoicesChange.emit(this._selectedCwis);
              });
            }
          });
        });
      }
    }
  }

  ngOnInit() {
    this.textarea = this.elementRef.nativeElement;
  }

  ngOnDestroy() {
    this.hideMenu();
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    const cursorPosition = this.textarea.selectionStart;
    const precedingChar = this.textarea.value.charAt(cursorPosition - 1);

    if (event.key === this.triggerCharacter && precedingCharValid(precedingChar)) {
      this.showMenu();
      return;
    }

    const keyCode = event.keyCode || event.charCode;
    if (keyCode === 8 || keyCode === 46) {
      // backspace or delete
      const cwiToEdit = this._selectedCwis.find((cwi) => {
        const label = this.getChoiceLabel(cwi.choice);
        const labelEndIndex = this.getChoiceIndex(label) + label.length;
        return cursorPosition === labelEndIndex;
      });

      if (cwiToEdit) {
        this.editChoice(cwiToEdit.choice);
      }
    }
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    const selectedCwisPrevious = JSON.stringify(this._selectedCwis);

    if (!this.menu) {
      // dump choices that are removed from the text (e.g. select all + paste),
      // and/or retrieve them if user e.g. UNDO the action
      this.dumpNonExistingChoices();
      this.retrieveExistingChoices();
      this.updateIndices();
      if (JSON.stringify(this._selectedCwis) !== selectedCwisPrevious) {
        // TODO: Should probably check for indices change only (ignoring the changes inside choice object)
        this.selectedChoicesChange.emit(this._selectedCwis);
      }
      return;
    }

    this.updateIndices();
    if (JSON.stringify(this._selectedCwis) !== selectedCwisPrevious) {
      this.selectedChoicesChange.emit(this._selectedCwis);
    }

    if (value[this.menu.triggerCharacterPosition] !== this.triggerCharacter) {
      this.hideMenu();
      return;
    }

    const cursorPosition = this.textarea.selectionStart;
    if (cursorPosition < this.menu.triggerCharacterPosition) {
      this.hideMenu();
      return;
    }

    const searchText = value.slice(this.menu.triggerCharacterPosition + 1, cursorPosition);
    if (!searchText.match(this.searchRegexp)) {
      this.hideMenu();
      return;
    }

    this.loadChoices(searchText);
  }

  loadChoices(searchText): void {
    this.menu.component.instance.searchText = searchText;
    this.menu.component.instance.choices = [];
    this.menu.component.instance.choiceLoadError = undefined;
    this.menu.component.instance.choiceLoading = true;
    this.menu.component.changeDetectorRef.detectChanges();

    Promise.resolve(this.findChoices(searchText))
      .then((choices) => {
        if (this.menu) {
          this.menu.component.instance.choices = choices;
          this.menu.component.instance.choiceLoading = false;
          this.menu.component.changeDetectorRef.detectChanges();
        }
      })
      .catch((err) => {
        if (this.menu) {
          this.menu.component.instance.choiceLoading = false;
          this.menu.component.instance.choiceLoadError = err;
          this.menu.component.changeDetectorRef.detectChanges();
        }
      });
  }

  @HostListener('blur')
  onBlur() {
    if (!this.menu) {
      return;
    }

    this.menu.lastCaretPosition = this.textarea.selectionStart;

    if (this.closeMenuOnBlur) {
      this.hideMenu();
    }
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.menu) {
      return;
    }

    const cursorPosition = this.textarea.selectionStart;
    if (cursorPosition <= this.menu.triggerCharacterPosition) {
      this.hideMenu();
      return;
    }

    const searchText = this.textarea.value.slice(this.menu.triggerCharacterPosition + 1, cursorPosition);
    if (!searchText.match(this.searchRegexp)) {
      this.hideMenu();
      return;
    }
  }

  private hideMenu() {
    if (!this.menu) {
      return;
    }

    this.menu.component.destroy();
    this.menuHidden$.next();
    this.menuHidden.emit();
    this.menu = undefined;

    if (this._editingCwi) {
      // If user didn't make any changes to it, add it back to the selected choices
      const label = this.getChoiceLabel(this._editingCwi.choice);
      const labelExists = this.getChoiceIndex(label + ' ') > -1;
      const choiceExists = this._selectedCwis.find((cwi) => this.getChoiceLabel(cwi.choice) === label);
      if (labelExists && !choiceExists) {
        this.addToSelected(this._editingCwi);
        this.updateIndices();
        this.selectedChoicesChange.emit(this._selectedCwis);
      }
    }
    this._editingCwi = undefined;
  }

  private showMenu() {
    if (this.menu) {
      return;
    }

    const menuFactory = this.componentFactoryResolver.resolveComponentFactory<TextInputAutocompleteMenuComponent>(
      this.menuComponent
    );

    this.menu = {
      component: this.viewContainerRef.createComponent(menuFactory, 0, this.injector),
      triggerCharacterPosition: this.textarea.selectionStart,
    };

    const lineHeight = this.getLineHeight(this.textarea);
    const { top, left } = getCaretCoordinates(this.textarea, this.textarea.selectionStart);
    this.menu.component.instance.position = {
      top: top + lineHeight,
      left,
    };
    this.menu.component.changeDetectorRef.detectChanges();
    this.menu.component.instance.selectChoice.pipe(takeUntil(this.menuHidden$)).subscribe((choice: any) => {
      const label = this.getChoiceLabel(choice);
      const startIndex = this.menu!.triggerCharacterPosition;
      const start = this.textarea.value.slice(0, startIndex);
      const caretPosition = this.menu!.lastCaretPosition || this.textarea.selectionStart;
      const end = this.textarea.value.slice(caretPosition);
      const insertValue = label + ' ';
      this.textarea.value = start + insertValue + end;
      // force ng model / form control to update
      this.textarea.dispatchEvent(new Event('input'));

      const setCursorAt = (start + insertValue).length;
      this.textarea.setSelectionRange(setCursorAt, setCursorAt);
      this.textarea.focus();

      const choiceWithIndices = {
        choice,
        indices: {
          start: startIndex,
          end: startIndex + label.length,
        },
      };

      this.addToSelected(choiceWithIndices);
      this.updateIndices();
      this.selectedChoicesChange.emit(this._selectedCwis);

      this.hideMenu();
    });

    this.menuShown.emit();
  }

  editChoice(choice: any): void {
    const label = this.getChoiceLabel(choice);
    const startIndex = this.getChoiceIndex(label);
    const endIndex = startIndex + label.length;

    this._editingCwi = this._selectedCwis.find((cwi) => this.getChoiceLabel(cwi.choice) === label);
    this.removeFromSelected(this._editingCwi);
    this.selectedChoicesChange.emit(this._selectedCwis);

    this.textarea.focus();
    this.textarea.setSelectionRange(endIndex, endIndex);

    this.showMenu();
    this.menu.triggerCharacterPosition = startIndex;

    // TODO: editValue to be provided externally?
    const editValue = label.replace(this.triggerCharacter, '');
    this.loadChoices(editValue);
  }

  dumpNonExistingChoices(): void {
    const choicesToDump = this._selectedCwis.filter((cwi) => {
      const label = this.getChoiceLabel(cwi.choice);
      return this.getChoiceIndex(label) === -1;
    });

    if (choicesToDump.length) {
      choicesToDump.forEach((cwi) => {
        this.removeFromSelected(cwi);
        this._dumpedCwis.push(cwi);
      });
    }
  }

  retrieveExistingChoices(): void {
    const choicesToRetrieve = this._dumpedCwis.filter((dcwi) => {
      const label = this.getChoiceLabel(dcwi.choice);
      const labelExists = this.getChoiceIndex(label) > -1;
      const choiceExists = this._selectedCwis.find((scwi) => this.getChoiceLabel(scwi.choice) === label);
      return labelExists && !choiceExists;
    });

    if (choicesToRetrieve.length) {
      choicesToRetrieve.forEach((c) => {
        this.addToSelected(c);
        this._dumpedCwis.splice(this._dumpedCwis.indexOf(c), 1);
      });
    }
  }

  addToSelected(cwi: ChoiceWithIndices): void {
    const exists = this._selectedCwis.some(
      (scwi) => this.getChoiceLabel(scwi.choice) === this.getChoiceLabel(cwi.choice)
    );

    if (!exists) {
      this._selectedCwis.push(cwi);
      this.choiceSelected.emit(cwi);
    }
  }

  removeFromSelected(cwi: ChoiceWithIndices): void {
    const exists = this._selectedCwis.some(
      (scwi) => this.getChoiceLabel(scwi.choice) === this.getChoiceLabel(cwi.choice)
    );

    if (exists) {
      this._selectedCwis.splice(this._selectedCwis.indexOf(cwi), 1);
      this.choiceRemoved.emit(cwi);
    }
  }

  getLineHeight(elm: HTMLElement): number {
    const lineHeightStr = getComputedStyle(elm).lineHeight || '';
    const lineHeight = parseFloat(lineHeightStr);
    const normalLineHeight = 1.2;

    const fontSizeStr = getComputedStyle(elm).fontSize || '';
    // const fontSize = +toPX(fontSizeStr);
    const fontSize = parseFloat(fontSizeStr);

    if (lineHeightStr === lineHeight + '') {
      return fontSize * lineHeight;
    }

    if (lineHeightStr.toLowerCase() === 'normal') {
      return fontSize * normalLineHeight;
    }

    // return toPX(lineHeightStr);
    return parseFloat(lineHeightStr);
  }

  getChoiceIndex(label: string): number {
    const text = this.textarea && this.textarea.value;
    const labels = this._selectedCwis.map((cwi) => this.getChoiceLabel(cwi.choice));

    return getChoiceIndex(text, label, labels);
  }

  updateIndices(): void {
    this._selectedCwis = this._selectedCwis.map((cwi) => {
      const label = this.getChoiceLabel(cwi.choice);
      const index = this.getChoiceIndex(label);
      return {
        choice: cwi.choice,
        indices: {
          start: index,
          end: index + label.length,
        },
      };
    });
  }
}

export function getChoiceIndex(text: string, label: string, labels: string[]): number {
  text = text || '';

  labels.forEach((l) => {
    // Mask other labels that contain given label,
    // e.g. if the given label is '@TED', mask '@TEDEducation' label
    if (l !== label && l.indexOf(label) > -1) {
      text = text.replace(new RegExp(l, 'g'), '*'.repeat(l.length));
    }
  });

  return findStringIndex(text, label, (startIndex, endIndex) => {
    // Only labels that are preceded with below defined chars are valid,
    // (avoid 'labels' found in e.g. links being mistaken for choices)
    const precedingChar = text[startIndex - 1];
    return precedingCharValid(precedingChar) || text.slice(startIndex - 4, startIndex) === '<br>';
  });
}

export function precedingCharValid(char: string): boolean {
  return !char || char === '\n' || char === ' ' || char === '(';
}

export function findStringIndex(
  text: string,
  value: string,
  callback: (startIndex: number, endIndex: number) => boolean
): number {
  let index = text.indexOf(value);
  if (index === -1) {
    return -1;
  }

  let conditionMet = callback(index, index + value.length);

  while (!conditionMet && index > -1) {
    index = text.indexOf(value, index + 1);
    conditionMet = callback(index, index + value.length);
  }

  return index;
}
