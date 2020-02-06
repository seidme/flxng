import {
    Component,
    ViewChild,
    ContentChildren,
    QueryList,
    Input,
    Output,
    EventEmitter,
    ElementRef,
    OnInit,
    AfterContentInit
} from '@angular/core';

import { animate, style, trigger, transition } from '@angular/animations';

import { TemplateDirective, mapToIterable } from '@flxng/common';


@Component({
    selector: 'flx-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    animations: [
        trigger('slideFadeIn', [
            transition('void => *', [
                style({ opacity: 0, width: '0', height: '0' }),
                animate('120ms ease-out', style({ opacity: 1, width: '*', height: '*' }))
            ])
        ])
    ]
})
export class MenuComponent implements OnInit, AfterContentInit {

    // constants
    readonly templateTypes: any = {
        menuHead: 'menuHead'
    };

    readonly alignments: any = {
        bottom: 'bottom',
        top: 'top',
        right: 'right',
        left: 'left'
    };

    @Input() bodyAlignment: string = '';
    @Input() headAlignment: string = '';
    @Input() bodyStyle: any = {};
    @Input() header: string = '';
    @Input() templateRefs: any = {};

    @Output() onToggle: EventEmitter<boolean> = new EventEmitter<boolean>();

    @ViewChild('containerRef', {static: true}) containerRef: ElementRef;
    @ViewChild('headRef', {static: false}) headRef: ElementRef;
    @ViewChild('bodyRef', {static: true}) bodyRef: ElementRef;

    @ContentChildren(TemplateDirective) templateList: QueryList<TemplateDirective>;

    props: any = {
        opened: false
    }

    constructor(
        private _elementRef: ElementRef
    ) { }


    ngOnInit() {
        this.checkInputParamsValidity();
    }

    ngAfterContentInit() {
        this.collectTemplateRefs();
    }


    checkInputParamsValidity(): void {
        if (typeof this.headAlignment !== 'string')
            throw new Error('Invalid parameter: headAlignment. Possible values and combinations: ' + mapToIterable(this.alignments).join(', ') + '.');

        if (typeof this.bodyAlignment !== 'string')
            throw new Error('Invalid parameter: bodyAlignment. Possible values and combinations:: ' + mapToIterable(this.alignments).join(', ') + '.');
    }


    open(): void {
        let headElem = this.headRef.nativeElement;
        let headElemComputedStyle = getComputedStyle(headElem);


        if (this.headAlignment.toLowerCase().indexOf(this.alignments.top) > -1) {
            this.bodyAlignment.toLowerCase().indexOf(this.alignments.top) > -1
                ? this.bodyStyle['top'] = '0px'
                : this.bodyStyle['bottom'] = headElemComputedStyle.height;
        }
        else {
            if (this.bodyAlignment.toLowerCase().indexOf(this.alignments.bottom) > -1)
                this.bodyStyle['bottom'] = '0px';
        }


        if (this.headAlignment.toLowerCase().indexOf(this.alignments.right) > -1) {
            this.bodyAlignment.toLowerCase().indexOf(this.alignments.left) > -1
                ? this.bodyStyle['left'] = headElemComputedStyle.width
                : this.bodyStyle['right'] = '0px';
        }
        else {
            if (this.bodyAlignment.toLowerCase().indexOf(this.alignments.right) > -1)
                this.bodyStyle['right'] = headElemComputedStyle.width;
        }


        this.props.opened = true;
        this.onToggle.emit(this.props.opened);
    }


    close(): void {
        this.props.opened = false;
        this.onToggle.emit(this.props.opened);
    }


    toggle(): void {
        this.props.opened ? this.close() : this.open();
    }


    bindFnContext(fn: Function): Function {
        return fn.bind(this);
    }


    collectTemplateRefs(): void {
        this.templateList.toArray().forEach((t: TemplateDirective) => {
            if (!this.templateTypes[t.type]) {
                console.warn(`Unknown template type: ${t.type}. Possible value/s: ${mapToIterable(this.templateTypes).join(', ')}.`);
                return;
            }

            this.templateRefs[t.type] = t.templateRef;
        });
    }

}
