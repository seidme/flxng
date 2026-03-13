import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Output() sidebarVisibilityAutoChange = new EventEmitter<boolean>();

  mobileView = false;
  sidebarVisible = false;
  fixedSidebarVisible = false;

  constructor() {}

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: any) {
    const wasMobileView = this.mobileView;
    this.mobileView = this.isMobileView();

    if (this.mobileView) {
      if (!wasMobileView) {
        this.fixedSidebarVisible = this.sidebarVisible;
      }
      this.sidebarVisible = false;
    } else {
      if (wasMobileView) {
        this.sidebarVisible = this.fixedSidebarVisible;
      }
      this.fixedSidebarVisible = false;
    }
  }

  ngOnInit(): void {
    this.mobileView = this.isMobileView();
    this.sidebarVisible = !this.mobileView;
    this.fixedSidebarVisible = false;
    // this.fixedSidebarVisible = this.mobileView;

    this.sidebarVisibilityAutoChange.emit(this.sidebarVisible || this.fixedSidebarVisible);
  }

  toggle(visible: boolean): void {
    if (this.mobileView) {
      this.fixedSidebarVisible = visible;
    } else {
      this.sidebarVisible = visible;
    }
  }

  isMobileView(): boolean {
    return window.innerWidth < 768;
  }

  isMobileDevice(): boolean {
    const width = window.screen.width;
    const height = window.screen.height;

    const mobileLandscape = width > height && height < 768;
    const mobilePortrait = height > width && width < 768;

    return mobileLandscape || mobilePortrait;
  }
}
