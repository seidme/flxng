import {
    Directive,
    Input,
    TemplateRef,
    ViewContainerRef
} from '@angular/core';

@Directive({
    selector: '[flxTemplate]'
    //host: { }
})
export class TemplateDirective {

    @Input('flxTemplate') type: string = '';

    constructor(public templateRef: TemplateRef<any>) { }
}
