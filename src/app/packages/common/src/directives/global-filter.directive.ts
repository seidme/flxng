import {
    Directive,
    Input,
    ElementRef
} from '@angular/core';

@Directive({
    selector: '[flxGlobalFilter]'
    //host: { }
})
export class globalFilterDirective {
    // dummy directive used to query global filter input element

    //@Input('flxGlobalFilter') type: string = '';

    constructor(public elementRef: ElementRef) { }
}
