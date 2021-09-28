import {
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';

import { getCaretCoordinates } from './textarea-caret-position';
// @ts-ignore
// import toPX from 'to-px';

export interface ChoiceWithIndices {
  choice: any;
  indices: {
    start: number;
    end: number;
  };
}

@Component({
  selector: 'flx-text-input-autocomplete',
  templateUrl: './text-input-autocomplete.component.html',
  styleUrls: ['./text-input-autocomplete.component.scss'],
})
export class TextInputAutocompleteComponent implements OnChanges, OnInit, OnDestroy {
  /**
   * Reference to the text input element.
   */
  @Input() textInputElement: HTMLTextAreaElement | HTMLInputElement;

  /**
   * Reference to the menu template (used to display the search results).
   */
  @Input() menuTemplate: TemplateRef<any>;

  /**
   * The character which will trigger the search.
   */
  @Input() triggerCharacter = '@';

  /**
   * The regular expression that will match the search text after the trigger character.
   * No match will hide the menu.
   */
  @Input() searchRegexp = /^\w*$/;

  /**
   * Whether to close the menu when the host textInputElement loses focus.
   */
  @Input() closeMenuOnBlur = false;

  /**
   * Pre-set choices for edit text mode, or to select/mark choices from outside the mentions component.
   */
  @Input() selectedChoices: any[] = [];

  /**
   * A function that formats the selected choice once selected.
   * The result (label) is also used as a choice identifier (e.g. when editing choices).
   */
  @Input() getChoiceLabel: (choice: any) => string;

  /**
   * Called when the choices menu is shown.
   */
  @Output() menuShow = new EventEmitter();

  /**
   * Called when the choices menu is hidden.
   */
  @Output() menuHide = new EventEmitter();

  /**
   * Called when a choice is selected.
   */
  @Output() choiceSelected = new EventEmitter<ChoiceWithIndices>();

  /**
   * Called when a choice is removed.
   */
  @Output() choiceRemoved = new EventEmitter<ChoiceWithIndices>();

  /**
   * Called when a choice is selected, removed, or if any of the choices' indices change.
   */
  @Output() selectedChoicesChange = new EventEmitter<ChoiceWithIndices[]>();

  /**
   * Called on user input after entering trigger character. Emits search term to search by.
   */
  @Output() search = new EventEmitter<string>();

  private _eventListeners: Array<() => void> = [];

  private _selectedCwis: ChoiceWithIndices[] = [];
  private _dumpedCwis: ChoiceWithIndices[] = [];
  private _editingCwi: ChoiceWithIndices;

  private readonly KEY_BUFFERED = 229;
  private lastKeyCode: number;

  menuCtrl?: {
    template: TemplateRef<any>;
    context: any;
    position: {
      top: number;
      left: number;
    };
    triggerCharacterPosition: number;
    lastCaretPosition?: number;
  };

  constructor(private ngZone: NgZone, private renderer: Renderer2) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedChoices) {
      if (Array.isArray(this.selectedChoices)) {
        /**
         * Timeout needed since ngOnChanges is fired before the textInputElement value is updated.
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
    const onKeydown = this.renderer.listen(this.textInputElement, 'keydown', (event) => this.onKeydown(event));
    this._eventListeners.push(onKeydown);

    const onInput = this.renderer.listen(this.textInputElement, 'input', (event) => this.onInput(event));
    this._eventListeners.push(onInput);

    const onBlur = this.renderer.listen(this.textInputElement, 'blur', (event) => this.onBlur(event));
    this._eventListeners.push(onBlur);

    const onClick = this.renderer.listen(this.textInputElement, 'click', (event) => this.onClick(event));
    this._eventListeners.push(onClick);
  }

  ngOnDestroy() {
    this.hideMenu();
    this._eventListeners.forEach((unregister) => unregister());
  }

  onKeydown(event: KeyboardEvent): void {
    const cursorPosition = this.textInputElement.selectionStart;
    const precedingChar = this.textInputElement.value.charAt(cursorPosition - 1);

    this.lastKeyCode = event.keyCode;
    if (event.keyCode === this.KEY_BUFFERED) {
      return;
    }
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

  onInput(event: any): void {
    const value = event.target.value;
    const selectedCwisPrevious = JSON.stringify(this._selectedCwis);

    if (this.lastKeyCode === this.KEY_BUFFERED && event.data) {
      const cursorPosition = this.textInputElement.selectionStart;
      const precedingChar = this.textInputElement.value.charAt(cursorPosition - 2);

      if (event.data.charAt(0) === this.triggerCharacter && precedingCharValid(precedingChar)) {
        this.showMenu();
      }
    }

    if (!this.menuCtrl) {
      // dump choices that are removed from the text (e.g. select all + paste),
      // and/or retrieve them if user e.g. UNDO the action
      // BUG: if text that contains mentions is selected and deleted using trigger char, no choices will be dumped (this.menuCtrl will be defined)!
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

    const triggerCharacterPosition = this.patchAndroidChromeIndex(this.menuCtrl.triggerCharacterPosition);
    if (value[triggerCharacterPosition] !== this.triggerCharacter) {
      this.hideMenu();
      return;
    }

    const cursorPosition = this.textInputElement.selectionStart;
    if (cursorPosition < this.menuCtrl.triggerCharacterPosition) {
      this.hideMenu();
      return;
    }

    const searchText = value.slice(this.menuCtrl.triggerCharacterPosition + 1, cursorPosition);
    if (!searchText.match(this.searchRegexp)) {
      this.hideMenu();
      return;
    }

    this.search.emit(searchText);
  }

  onBlur(event: FocusEvent): void {
    if (!this.menuCtrl) {
      return;
    }

    this.menuCtrl.lastCaretPosition = this.textInputElement.selectionStart;

    if (this.closeMenuOnBlur) {
      this.hideMenu();
    }
  }

  onClick(event: MouseEvent): void {
    if (!this.menuCtrl) {
      return;
    }

    const cursorPosition = this.textInputElement.selectionStart;
    if (cursorPosition <= this.menuCtrl.triggerCharacterPosition) {
      this.hideMenu();
      return;
    }

    const searchText = this.textInputElement.value.slice(this.menuCtrl.triggerCharacterPosition + 1, cursorPosition);
    if (!searchText.match(this.searchRegexp)) {
      this.hideMenu();
      return;
    }
  }

  private patchAndroidChromeIndex(inputIndex: number): number {
    return this.lastKeyCode === this.KEY_BUFFERED ? inputIndex - 1 : inputIndex;
  }

  private hideMenu() {
    if (!this.menuCtrl) {
      return;
    }

    this.menuCtrl = undefined;
    this.menuHide.emit();

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
    if (this.menuCtrl) {
      return;
    }

    const lineHeight = this.getLineHeight(this.textInputElement);
    const { top, left } = getCaretCoordinates(this.textInputElement, this.textInputElement.selectionStart);

    this.menuCtrl = {
      template: this.menuTemplate,
      context: {
        selectChoice: this.selectChoice,
        // $implicit: {
        //   selectChoice: this.selectChoice
        // },
      },
      position: {
        top: top + lineHeight,
        left: left,
      },
      triggerCharacterPosition: this.textInputElement.selectionStart,
    };

    this.menuShow.emit();
  }

  selectChoice = (choice: any) => {
    const label = this.getChoiceLabel(choice);
    const startIndex = this.patchAndroidChromeIndex(this.menuCtrl!.triggerCharacterPosition);
    const start = this.textInputElement.value.slice(0, startIndex);
    const caretPosition = this.menuCtrl!.lastCaretPosition || this.textInputElement.selectionStart;
    const end = this.textInputElement.value.slice(caretPosition);
    const insertValue = label + ' ';
    this.textInputElement.value = start + insertValue + end;
    // force ng model / form control to update
    this.textInputElement.dispatchEvent(new Event('input'));

    const setCursorAt = (start + insertValue).length;
    this.textInputElement.setSelectionRange(setCursorAt, setCursorAt);
    this.textInputElement.focus();

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
  };

  editChoice(choice: any): void {
    const label = this.getChoiceLabel(choice);
    const startIndex = this.getChoiceIndex(label);
    const endIndex = startIndex + label.length;

    this._editingCwi = this._selectedCwis.find((cwi) => this.getChoiceLabel(cwi.choice) === label);
    this.removeFromSelected(this._editingCwi);
    this.selectedChoicesChange.emit(this._selectedCwis);

    this.textInputElement.focus();
    this.textInputElement.setSelectionRange(endIndex, endIndex);

    this.showMenu();
    this.menuCtrl.triggerCharacterPosition = startIndex;

    // TODO: editValue to be provided externally?
    const editValue = label.replace(this.triggerCharacter, '');
    this.search.emit(editValue);
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
    const text = this.textInputElement && this.textInputElement.value;
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

// TODO: move to common!
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
