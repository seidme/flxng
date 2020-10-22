import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-chevron',
  templateUrl: './chevron.component.html',
  styleUrls: ['./chevron.component.scss'],
})
export class ChevronComponent implements OnInit {
  @Output() onToggle = new EventEmitter<boolean>();

  @Input() opened = false;
  @Input() standalone = true;
  // @Input() cssColor = '';

  constructor() {}

  ngOnInit() {}

  toggle(): void {
    this.opened = !this.opened;
    this.onToggle.emit(this.opened);
  }

  open(): void {
    this.opened = true;
  }

  close(): void {
    this.opened = false;
  }
}
