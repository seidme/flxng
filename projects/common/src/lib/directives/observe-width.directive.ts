import {
  Directive,
  Input,
  Output,
  NgZone,
  Renderer2,
  ElementRef,
  OnInit,
  OnChanges,
  AfterViewChecked,
  SimpleChanges,
  EventEmitter,
} from '@angular/core';

@Directive({
  selector: '[flxObserveWidth]',
})
export class ObserveWidthDirective implements OnInit, OnChanges, AfterViewChecked {
  @Input('flxObserveWidth') shouldObserve = false;

  @Output() onWidthChange = new EventEmitter<string>();

  width = '';
  windowResizeListener: any;

  constructor(private _ngZone: NgZone, private _renderer: Renderer2, private _elementRef: ElementRef) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.shouldObserve) {
      if (changes.shouldObserve.currentValue) {
        //this._ngZone.runOutsideAngular(() => {
        //setTimeout(() => {
        this.width = getComputedStyle(this._elementRef.nativeElement).width;
        this.onWidthChange.emit(this.width);

        this.windowResizeListener = this._renderer.listen(window, 'resize', (e) => {
          const width = getComputedStyle(this._elementRef.nativeElement).width;
          if (this.width !== width) {
            this.width = width;
            this.onWidthChange.emit(this.width);
          }
        });
        //});
        //});
      } else {
        if (this.width) {
          this.width = '';
          this.onWidthChange.emit(this.width);
        }

        if (this.windowResizeListener) {
          this.windowResizeListener(); // unbind
        }
      }
    }
  }

  ngAfterViewChecked(): void {
    if (!this.shouldObserve) {
      return;
    }

    const width = getComputedStyle(this._elementRef.nativeElement).width;
    if (width !== this.width) {
      this.width = width;
      this.onWidthChange.emit(this.width);
    }
  }
}
