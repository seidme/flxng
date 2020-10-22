import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Output() hamburgerToggle = new EventEmitter<boolean>();

  hamburgerOpen = false;

  constructor() {}

  ngOnInit(): void {}

  toggleHamburger(open: boolean): void {
    this.hamburgerOpen = open;
    this.hamburgerToggle.emit(open);
  }
}
