import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';

import { ChoiceWithIndices } from './text-input-autocomplete';
import { TagMouseEvent } from './text-input-highlight';

@Component({
  selector: 'flx-mentions',
  templateUrl: './mentions.component.html',
  styleUrls: ['./mentions.component.scss'],
})
export class MentionsComponent implements OnInit {
  /**
   * Reference to the text input element
   */
  @Input() textInputElement: HTMLTextAreaElement | HTMLInputElement;

  /**
   * Reference to the menu template
   */
  @Input() menuTemplate: TemplateRef<any>;

  /**
   * The character that will trigger the menu to appear
   */
  @Input() triggerCharacter = '@';

  /**
   * The regular expression that will match the search text after the trigger character
   */
  @Input() searchRegexp = /^\w*$/;

  /**
   * Whether to close the menu when the host textInputElement loses focus
   */
  @Input() closeMenuOnBlur = false;

  /**
   * Selected choices (required in editing mode in order to keep track of choices)
   */
  @Input() selectedChoices: any[] = [];

  /**
   * A function that formats the selected choice once selected.
   * The result (label) is also used as a choice identifier (e.g. when editing choices)
   */
  @Input() getChoiceLabel: (choice: any) => string;

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
   * Called on user input after entering trigger character. Emits search term to search by
   */
  @Output() choicesSearch = new EventEmitter<string>();

  // --- text-input-highlight.component inputs/outputs ---
  /**
   * The CSS class to add to highlighted tags
   */
  @Input() tagCssClass: string = '';

  /**
   * Called when the area over a tag is clicked
   */
  @Output() tagClick = new EventEmitter<TagMouseEvent>();

  /**
   * Called when the area over a tag is moused over
   */
  @Output() tagMouseEnter = new EventEmitter<TagMouseEvent>();

  /**
   * Called when the area over the tag has the mouse is removed from it
   */
  @Output() tagMouseLeave = new EventEmitter<TagMouseEvent>();

  selectedCwis: ChoiceWithIndices[] = [];

  constructor() {}

  ngOnInit(): void {}

  onSelectedChoicesChange(cwis: ChoiceWithIndices[]): void {
    this.selectedCwis = cwis;
    this.selectedChoicesChange.emit(cwis);
  }
}
