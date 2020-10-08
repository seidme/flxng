import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EventManager } from '@angular/platform-browser';

@Component({
  selector: 'app-chevron',
  templateUrl: './chevron.component.html',
  styleUrls: ['./chevron.component.scss'],
})
export class ChevronComponent implements OnInit {
  @Output() onToggle = new EventEmitter<boolean>();

  @Input() open = false;
  // @Input() cssColor = '';

  constructor() {}

  ngOnInit() {}

  toggle(): void {
    this.open = !this.open;
    this.onToggle.emit(this.open);
  }
}
