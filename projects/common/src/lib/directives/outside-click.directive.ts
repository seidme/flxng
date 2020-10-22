import {
    Directive,
    Output,
    ElementRef,
    HostListener,
    EventEmitter
} from '@angular/core';

@Directive({
    selector: '[flxOutsideClick]'
})
export class OutsideClickDirective {

    @Output() onOutsideClick: EventEmitter<null> = new EventEmitter<null>();

    constructor(
        private _elementRef: ElementRef
    ) { }


    @HostListener('document:click', ['$event']) onClick(event: any) {
        if (!this._elementRef.nativeElement.contains(event.target)) {
            this.onOutsideClick.emit(null);
        }
    }

}
