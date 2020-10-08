import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

export enum HamburgerSize {
  Medium = 'medium',
  Large = 'large',
}

@Component({
  selector: 'app-hamburger',
  templateUrl: './hamburger.component.html',
  styleUrls: ['./hamburger.component.scss'],
})
export class HamburgerComponent implements OnInit {
  @Output() onToggle = new EventEmitter<boolean>();

  @Input() open = false;
  @Input() size: HamburgerSize = HamburgerSize.Medium;

  HamburgerSize = HamburgerSize;

  constructor() {}

  ngOnInit(): void {}

  toggle(): void {
    this.open = !this.open;
    this.onToggle.emit(this.open);
  }
}
