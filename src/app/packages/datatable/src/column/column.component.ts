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

import { TemplateDirective } from '@flxng/common/src/directives';
import { mapToIterable } from '@flxng/common/src/utils';

import { DatatableComponent } from '../datatable.component';
import { ColumnTemplates } from '../shared/constants';


@Component({
    selector: 'flx-column',
    template: ``
})
export class ColumnComponent implements OnInit, AfterContentInit {

    @Input() field: string | Array<string>;
    @Input() header: string = '';
    @Input() width: string = '';
    @Input() expander: boolean = false;
    @Input() sortable: boolean = true;
    @Input() sortComparator: Function;
    @Input() sortCollator: Intl.Collator;
    @Input() templateRefs: any = {};
    @Input() rowExpandableIndicatorProperty: string = '';

    @ContentChildren(TemplateDirective) templateList: QueryList<TemplateDirective>;

    id: string = '';
    dragged: boolean = false;

    //storable/inheritable properties
    metas = {
        width:  {
            value: ''
        },
        position: {
            value: -1
        },
        visibility: {
            value: true
        },
        sortOrder: {
            value: 0
        },
        sortIndex: {
            value: -1
        }
    };

    constructor(
        @Inject(forwardRef(() => DatatableComponent)) private _dtcRef: DatatableComponent
    ) { }


    ngOnInit() {
        if (!this.expander && !this._isFieldInputParamValid())
            throw new Error('Mandatory parameter is missing or invalid: \'field\'.');

        if (this.sortable) {
            if (!this.sortCollator) {
                this.sortCollator = new Intl.Collator(undefined, { sensitivity: 'accent', numeric: true });
            }
            else {
                if (!(this.sortCollator instanceof Intl.Collator))
                    throw new Error('Invalid parameter: \'sortCollator\'.');
            }
        }


        this._setId();
    }


    ngAfterContentInit() {
        this._collectTemplateRefs()
    }


    toggle(): void {
        this._dtcRef.toggleColumnVisibility(this);
    }

    sort(event: any): void {
        this._dtcRef.sortColumn(this, false, event);
    }

    isVisible(): boolean {
        return this.metas.visibility.value;
    }

    isSorted(): boolean {
        return this.metas.sortOrder.value !== 0;
    }

    isReorderable(): boolean {
        return !this.expander;
    }


    private _setId(): void {
        this.id = this.expander && !this._isFieldInputParamValid()
            ? 'expander'
            : Array.isArray(this.field)
                ? this.field.join(',')
                : this.field;
    }

    private _collectTemplateRefs(): void {
        this.templateList.toArray().forEach((t: TemplateDirective) => {
            if (!ColumnTemplates[t.type]) {
                console.warn(`Unknown template type: ${t.type}. Possible value/s: ${mapToIterable(ColumnTemplates).join(', ')}.`);
                return;
            }

            this.templateRefs[t.type] = t.templateRef;
        });
    }

    private _isFieldInputParamValid(): boolean {

        let isFieldArrayValid = (field: Array<string>): boolean => {
            if (!Array.isArray(field) || !field.length)
                return false;

            for (let i = 0; i < field.length; ++i) {
                if (!field[i] || typeof field[i] !== 'string')
                    return false;
            }

            return true;
        }

        if (!this.field || (typeof this.field !== 'string' && !Array.isArray(this.field)) || (Array.isArray(this.field) && !isFieldArrayValid(this.field)))
            return false;

        return true;
    }

}
