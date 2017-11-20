import {
    Directive,
    Input,
    TemplateRef,
    ViewContainerRef
} from '@angular/core';

@Directive({
    selector: '[flxVar]',
})
export class VarDirective {

    @Input() set flxVar(ctx: any) {
        this.ctx.$implicit = this.ctx.flxVar = ctx;
        this.updateView();
    }

    ctx: any = {};

    constructor(
        private _viewContainerRef: ViewContainerRef,
        private _templateRef: TemplateRef<any>
    ) { }

    updateView() {
        this._viewContainerRef.clear();
        this._viewContainerRef.createEmbeddedView(this._templateRef, this.ctx);
    }
}