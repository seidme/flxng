import { Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { LoaderService } from './loader.service';

@Directive({
  selector: '[flxLoader]',
})
export class LoaderDirective implements OnInit, OnChanges {
  @Input() flxLoaderVisible = false; // Controlling the loader by providing the flag

  loaderElem: HTMLElement;
  visible = false;

  constructor(protected elementRef: ElementRef, protected loaderService: LoaderService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.loaderElem) {
      // This is also needed here as the change might happen before ngOnInit is fired
      this.loaderElem = this.loaderService.appendLoader(this.elementRef.nativeElement);
    }

    if (changes['flxLoaderVisible']) {
      const visible = changes['flxLoaderVisible'].currentValue;
      if (visible) {
        this.show();
      } else {
        this.hide();
      }
    }
  }

  ngOnInit(): void {
    if (!this.loaderElem) {
      this.loaderElem = this.loaderService.appendLoader(this.elementRef.nativeElement);
    }
  }

  show(): void {
    if (this.loaderElem) {
      this.loaderElem.style['display'] = 'flex';
      this.visible = true;
    }
  }

  hide(): void {
    if (this.loaderElem) {
      this.loaderElem.style['display'] = 'none';
      this.visible = false;
    }
  }

  isVisible() {
    return this.visible;
  }
}
