import {
    Component,
    Inject,
    ContentChildren,
    QueryList,
    Output,
    Input,
    OnInit,
    AfterContentInit,
    forwardRef
} from '@angular/core';

//import { TemplateDirective, mapToIterable } from '@flxng/common';
import { TemplateDirective, mapToIterable } from '../../../common';

 import { PaginatorMetaTemplates } from './paginator-meta-templates';


@Component({
    selector: 'flx-paginator-meta',
    template: ``
})
export class PaginatorMetaComponent implements OnInit, AfterContentInit {

    @Input() itemsPerPage: number = 5;
    @Input() pageLinksSize: number = 5;
    @Input() templateRefs: any = {};

    @ContentChildren(TemplateDirective) templateList: QueryList<TemplateDirective>;


    constructor() { }


    ngOnInit() {
        if (!this.pageLinksSize || typeof this.pageLinksSize !== 'number' || this.pageLinksSize < 3)
            throw new Error('`pageLinksSize` input parameter should be positive number greater then 2.');

        if (!this.itemsPerPage || typeof this.pageLinksSize !== 'number' || this.pageLinksSize < 1)
            throw new Error('`itemsPerPage` input parameter should be positive number.');
    }


    ngAfterContentInit() {
        this._collectTemplateRefs()
    }


    // toggle(): void {
    //     this._dtcRef.toggleColumnVisibility(this);
    // }


    private _collectTemplateRefs(): void {
        this.templateList.toArray().forEach((t: TemplateDirective) => {
            if (!PaginatorMetaTemplates[t.type]) {
                console.warn(`Unknown template type: ${t.type}. Possible value/s: ${mapToIterable(PaginatorMetaTemplates).join(', ')}.`);
                return;
            }

            this.templateRefs[t.type] = t.templateRef;
        });
    }

}
