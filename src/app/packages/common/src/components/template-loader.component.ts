import {
    Component,
    Input,
    TemplateRef,
    ViewContainerRef
} from '@angular/core';

@Component({
    selector: 'flx-templateLoader',
    template: ``
})
export class TemplateLoaderComponent {

    @Input() templateRef: TemplateRef<any>;
    @Input() templateCtx: { [key: string]: any };

    constructor(private viewContainer: ViewContainerRef) { }

    ngOnInit() {
        let view = this.viewContainer.createEmbeddedView(this.templateRef, this.templateCtx);
        //view.setLocal('data', this.data);
    }
}