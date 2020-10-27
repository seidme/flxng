import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[flxTemplate]',
  //host: { }
})
export class TemplateDirective {
  @Input('flxTemplate') type = '';

  constructor(public templateRef: TemplateRef<any>) {}
}
