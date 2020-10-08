import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-hamburger',
  templateUrl: './hamburger.component.html',
  styleUrls: ['./hamburger.component.scss'],
})
export class HamburgerComponent implements OnInit {
  @Input() toggled = false;
  @Output() onToggle = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {}

  toggle(): void {
    this.toggled = !this.toggled;
    this.onToggle.emit(this.toggled);
  }
}
