import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() hamburgerToggle = new EventEmitter<boolean>();

  hamburgerToggled = false;

  constructor() {}

  ngOnInit(): void {}

  onHamburgerToggle(open: boolean): void {
    this.hamburgerToggle.emit(open);
  }

  setHamburgerState(toggled: boolean): void {
    this.hamburgerToggled = toggled;
  }
}
