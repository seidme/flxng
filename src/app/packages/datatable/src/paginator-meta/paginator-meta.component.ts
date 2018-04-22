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

import { TemplateDirective, mapToIterable } from '@flxng/common';

 import { PaginatorMetaTemplates } from './paginator-meta-templates';


@Component({
    selector: 'flx-paginator-meta',
    template: ``
})
export class PaginatorMetaComponent implements OnInit, AfterContentInit {

    @Input() itemsPerPage: number = 5;
    @Input() itemsPerPageOptions: number[] = [5, 10, 20, 50, 100];
    @Input() pageLinksSize: number = 5;

    @Input() templateRefs: any = {};

    @ContentChildren(TemplateDirective) templateList: QueryList<TemplateDirective>;


    constructor() { }


    ngOnInit() {

    }


    ngAfterContentInit() {
        this._collectTemplateRefs()
    }


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
