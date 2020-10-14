import { Directive, ElementRef, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { LoaderService } from './loader.service';

@Directive({
  selector: '[flxLoader]',
})
export class LoaderDirective implements OnInit {
  @Input('flxLoader') set flxLoader(loading: boolean) {
    if (loading) {
      this.show();
    } else {
      this.hide();
    }
  }

  loaderElem: HTMLElement;
  visible = false;

  constructor(protected elementRef: ElementRef, protected loaderService: LoaderService) {}

  ngOnInit(): void {
    this.loaderElem = this.loaderService.appendLoader(this.elementRef.nativeElement);
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
