import {
    Component,
    Inject,
    SkipSelf,
    Optional,
    ViewChild,
    ViewChildren,
    ContentChild,
    ContentChildren,
    QueryList,
    Input,
    Output,
    EventEmitter,
    ElementRef,
    OnInit,
    OnDestroy,
    AfterContentInit,
    AfterViewInit,
    AfterViewChecked,
    DoCheck,
    forwardRef,
    IterableDiffers,
    KeyValueDiffer,
    Renderer,
    NgZone,
    ViewContainerRef,
    ChangeDetectorRef
} from '@angular/core';

import { animate, style, trigger, transition } from '@angular/animations';

import { StorageService } from '@flxng/common';
import { TemplateDirective } from '@flxng/common/src/directives';
import { getScrollbarWidth, animateScroll, findAncestor } from '@flxng/common/src/utils-dom';
import { mapToIterable, compareValues, calcPercentage, resolveDeepValue, isValueValidForView, filterDuplicates, debounce} from '@flxng/common/src/utils';

import { PaginatorComponent } from '@flxng/paginator';

import { ColumnComponent } from './column/column.component';
import { PaginationComponent } from './pagination/pagination.component';

import { ResizeModes, GridTemplates, ColumnTemplates, PaginatorSettings, ElementIds } from './shared/constants';

declare var componentHandler: any;

@Component({
    selector: 'flx-treetable',
    templateUrl: './treetable.component.html',
    styleUrls: ['./treetable.component.scss'],
    animations: [
        trigger('rowExpansion', [ // TODO: get rid of dependency on @angular/animations
            transition('void => *', [
                style({height: 0}),
                animate('120ms ease-out', style({ height: '*' }))
            ]),
            transition('* => void', [
                style({height: '*'}),
                animate('120ms ease-out', style({ height: '0' }))
            ])
        ])
    ]
})
export class TreetableComponent implements OnInit, AfterContentInit, AfterViewInit, DoCheck, AfterViewChecked, OnDestroy {

    @Input() data: Array<any>;
    @Input() includeHead: boolean = true;
    @Input() reorderable: boolean = false;
    @Input() saveSettings: boolean = false;
    @Input() settingsStorageKey: string = '';
    @Input() globalFilterInputRef: ElementRef;
    @Input() resizeMode: string = '';
    @Input() templateRefs: any = {};
    @Input() bodyStyle: any = {};
    @Input() parentRef: TreetableComponent;


    @ViewChild('contentRef') contentRef: ElementRef;
    @ViewChild('contentInnerRef') contentInnerRef: ElementRef;
    @ViewChild('headRef') headRef: ElementRef;
    @ViewChild('bodyRef') bodyRef: ElementRef;

    @ViewChild(PaginatorComponent) paginator: PaginatorComponent;

    @ContentChild(PaginationComponent) pagination: PaginationComponent;

    @ContentChildren(forwardRef(() => ColumnComponent)) columnList: QueryList<ColumnComponent>;
    @ContentChildren(TemplateDirective) templateList: QueryList<TemplateDirective>;


    self: TreetableComponent = this;

    onColsMetaPositionChange: EventEmitter<null>;

    allData: Array<any> = [];
    filteredData: Array<any> = [];
    renderData: Array<any> = [];
    cols: Array<ColumnComponent>;
    colsMap: { [key: string]: ColumnComponent };
    expanderCol: ColumnComponent;
    level: number = 0;
    inheritsMetas: boolean = false;
    readyToProcessData: boolean = false;
    hasScrollFocus: boolean = false;
    iterableDiffer: any;

    pageLinks: Array<number> = [1];
    visiblePageLinks: Array<number> = [1];
    currentPage: number = 1;

    globalFilterValue: string = '';
    bodyWidth: string = '';
    parentRowElement: any;

    // storable/inheritable properties
    metas: any = {
        width: {
            value: ''
        },
        resizeMode: {
            value: ''
        },
        itemsPerPage: {
            value: NaN
        }
    };

    // constants
    readonly ElementIds: any = ElementIds;
    readonly ResizeModes: any = ResizeModes;
    readonly GridTemplates: any = GridTemplates;
    readonly ColumnTemplates: any = ColumnTemplates;
    readonly PaginatorSettings: any = PaginatorSettings;
    readonly colMinWidth: number = 60; // px

    constructor(
        private _ngZone: NgZone,
        private _renderer: Renderer,
        private _elementRef: ElementRef,
        private _iterableDiffers: IterableDiffers,
        private _changeDetectorRef: ChangeDetectorRef,
        private _storageService: StorageService,
        //private _injector: Injector
        //private _viewContainerRef: ViewContainerRef,
       // @SkipSelf() @Optional() @Inject(forwardRef(() => ParentTreetableComponent)) private _parentRef?: TreetableComponent
    ) { }


    ngOnInit() {
        this.checkInputParamsValidity();

        this.setLevel();

        this.iterableDiffer = this._iterableDiffers.find([]).create(null);

        if (!this.parentRef) {
            this.includeHead = true;
            this.hasScrollFocus = true;
        }
    }


    ngOnDestroy(): void {

    }


    ngAfterContentInit() {
        this.initCols();
        this.collectTemplateRefs();
    }


    ngAfterViewInit() {
        this.setMetas();

        if(this.parentRef) {
            this.parentRowElement = this.getParentRowElement();

            this.checkAndAdjustBodyHeight();
        }

        this.initScrollbarVisibilityHandlers();


        this.onColsMetaPositionChange.subscribe(_ => {
            // sort columns by their meta position value
            this.cols.sort((colA: ColumnComponent, colB: ColumnComponent) => colA.metas.position.value - colB.metas.position.value);
        });

        this.onColsMetaPositionChange.emit(null);


        let globalFilterInputElem = this.globalFilterInputRef 
            ? this.globalFilterInputRef
            : this._elementRef.nativeElement.querySelector(`input#${ElementIds.globalFilter}`);
    
        if (globalFilterInputElem) {
            this.globalFilterValue = globalFilterInputElem.value;
            this.listenGlobalFilterInputEvents(globalFilterInputElem);
        }


        this.readyToProcessData = true;
        this.ngDoCheck();
        this._changeDetectorRef.detectChanges();
    }


    ngDoCheck(): void {
        if (this.readyToProcessData) {
            this.checkAndProcessInputDataChanges();
        }
    }


    ngAfterViewChecked(): void {

    }


    checkInputParamsValidity(): void {
        if(this.parentRef && !(this.parentRef instanceof TreetableComponent))
            throw new Error('Invalid parameter: \'parentRef\'.');

        if (this.saveSettings && (!this.settingsStorageKey || typeof this.settingsStorageKey !== 'string'))
            throw new Error('Mandatory parameter is missing or invalid: \'settingsStorageKey\'.');

        if (this.bodyStyle && this.bodyStyle['max-height'] && (typeof this.bodyStyle['max-height'] !== 'string' || this.bodyStyle['max-height'].indexOf('px') === -1 || !parseInt(this.bodyStyle['max-height'])))
            throw new Error('Invalid value for: \'max-height\'. Expecting positive number as string representing the value in px.');

        if (this.bodyStyle && this.bodyStyle['height'] && (typeof this.bodyStyle['height'] !== 'string' || this.bodyStyle['height'].indexOf('px') === -1 || !parseInt(this.bodyStyle['height'])))
            throw new Error('Invalid value for: \'height\'. Expecting positive number as string representing the value in px.');
    }


    checkAndProcessInputDataChanges(): void {
        if (!this.data || this.data.constructor !== Array || !this.data.length) {
            if (this.allData.length) {
                this.allData = [];
                this.filteredData = [];

                if (!this.pagination) {
                    this.renderData = this.filteredData.slice();
                }
            }

            return;
        }

        if (this.data.length !== this.allData.length) {
            // this check is needed since iterableDiffer is able to detect changes over an array while it holds the same reference,
            // if array's reference changes, iterableDiffer won't detect any change, and it needs to be updated

            this.onInputDataChanges();

            // update the differ
            this.iterableDiffer.diff(this.data);

            return;
        }

        let changes = this.iterableDiffer.diff(this.data);
        // check whether an element inside an input array has been added, moved or removed
        if (changes)
            this.onInputDataChanges();
    }


    onInputDataChanges(): void {
        this.allData = this.data.map((rowData: any, i: number) => {
            rowData = rowData || {};
            rowData.ttIndex = i;
            rowData.ttExpanded = false;

            return rowData;
        });


        let sortedColumns = this.getSortedColumns();
        if (sortedColumns.length) {
            // does not really matter which one is passed if there are multiple sorted columns, 
            // they will be sorted respecting the sortIndex meta
            this.sortColumn(sortedColumns[0], true);
        }

        this.globalFilterValue
            ? this.filterData(this.getVisibleCols(), this.globalFilterValue)
            : this.filteredData = this.allData.slice();

        if (!this.pagination) {
            this.renderData = this.filteredData.slice();
        }
    }


    getSortedColumns(): ColumnComponent[] {
        if(!this.cols) {
            return [];
        }

        return this.cols
            .filter(c => c.metas.sortIndex.value > -1)
            .sort((cA: ColumnComponent, cB: ColumnComponent) => {
                return cA.metas.sortIndex.value - cB.metas.sortIndex.value;
            });
    }


    setLevel(): void {
        this.level = this.parentRef ? this.parentRef.level + 1 : 0;
    }


    initCols(): void {
        // at this point cols are ordered by default (as defined in the template),
        // they will be appropriately ordered after setting the metas
        this.cols = this.columnList.toArray();

        let dupColIds = filterDuplicates(this.cols.map(c => c.id));
        if(dupColIds.length) {
            throw new Error(`Duplicate column field: ${dupColIds[0]}`);
        }

        let expanderColIdx = this.cols.findIndex(c => c.expander);
        if (expanderColIdx !== -1) {
            this.expanderCol = this.cols[expanderColIdx];

            if (expanderColIdx !== 0) {
                this.cols.splice(expanderColIdx, 1);
                this.cols.unshift(this.expanderCol);
            }
        }

        this.colsMap = {};
        this.cols.forEach((col: ColumnComponent) => {
            this.colsMap[col.id] = col;
        });
    }


    getVisibleCols(): ColumnComponent[] {
        return this.cols.filter((c: ColumnComponent) => c.metas.visibility.value);
    }


    setMetas(): void { // TODO: setting metas needs to be in the following order: default -> stored -> inheritable.... (default metas need to be set no matter what..)
        if (this.parentRef && this.doColsMapsMatch(this.colsMap, this.parentRef.colsMap)) {
            this.inheritsMetas = true;

            let inheritableGridMetaKeys = ['width', 'resizeMode'];
            let inheritableColMetaKeys = ['width', 'position', 'visibility'];

            this.inheritMetas(inheritableGridMetaKeys, inheritableColMetaKeys);

            this.onColsMetaPositionChange = this.parentRef.onColsMetaPositionChange;

            // set metas that are non-inheritable but can be restored from storage
            let storedMetasMap = this.getStoredMetasMap(false);
            if(this.canApplyStoredMetas(storedMetasMap)) { // TODO: no need for check using canApplyStoredMetas method? Is the method even doing right thing??
                let gridMetaKeysToApply = ['itemsPerPage'];
                let colMetaKeysToApply = ['sortOrder', 'sortIndex'];

                this.applyStoredMetas(storedMetasMap, gridMetaKeysToApply, colMetaKeysToApply);
            }
            else {
                // set default metas partially
                this.metas.itemsPerPage.value = this.pagination 
                ? this.pagination.itemsPerPage
                : NaN;
            }
        }
        else {
            let storedMetasMap = this.getStoredMetasMap(false);

            if(this.canApplyStoredMetas(storedMetasMap)) {
                let storableGridMetaKeys = ['width', 'resizeMode', 'itemsPerPage'];
                let storableColMetaKeys = ['width', 'position', 'visibility', 'sortOrder', 'sortIndex'];

                this.applyStoredMetas(storedMetasMap, storableGridMetaKeys, storableColMetaKeys)
            }
            else {
                this.setDefaultMetas();
            }

            this.onColsMetaPositionChange = new EventEmitter<null>();
        }
    }


    inheritMetas(gridMetaKeysToInherit: string[], colMetaKeysToInherit: string[]): void {
        // Grid metas -->
        Object.keys(this.parentRef.metas)
            .filter((metaKey: string) => gridMetaKeysToInherit.indexOf(metaKey) > -1)
            .forEach((inheritableMetaKey: string) => {
                this.metas[inheritableMetaKey] = this.parentRef.metas[inheritableMetaKey];
            });


        // Cols metas -->
        this.cols.forEach((col: ColumnComponent, i: number) => {
            Object.keys(this.parentRef.colsMap[col.id].metas)
                .filter((metaKey: string) => colMetaKeysToInherit.indexOf(metaKey) > -1)
                .forEach((inheritableMetaKey: string) => {
                    col.metas[inheritableMetaKey] = this.parentRef.colsMap[col.id].metas[inheritableMetaKey];
                });
        });

        this._changeDetectorRef.detectChanges();
    }


    canApplyStoredMetas(storedMetasMap: any): boolean {
        if (!storedMetasMap)
            return false;

        let resizeModeChanged = storedMetasMap['grid'].resizeMode.value !== this.resizeMode;
        let doColsMapMatchesStoredColsMetasMap = this.doColsMapsMatch(this.colsMap, storedMetasMap['columns']);

        return !resizeModeChanged && doColsMapMatchesStoredColsMetasMap;
    }


    doColsMapsMatch(colsMapA: any, colsMapB: any): boolean {
        if (Object.keys(colsMapA).length !== Object.keys(colsMapB).length)
            return false;

        for (let key in colsMapA) {
            if (!colsMapB[key])
                return false;
        }

        return true;
    }


    applyStoredMetas(storedMetasMap: any, gridMetaKeysToApply: string[], colMetaKeysToApply: string[]): void {
        // Grid metas -->
        Object.keys(storedMetasMap['grid'])
            .filter((metaKey: string) => gridMetaKeysToApply.indexOf(metaKey) > -1)
            .forEach((storableMetaKey: string) => {
                this.metas[storableMetaKey] = storedMetasMap['grid'][storableMetaKey];
            });

        // Cols metas -->
        this.cols.forEach((col: ColumnComponent, i: number) => {
            Object.keys(storedMetasMap['columns'][col.id])
                .filter((metaKey: string) => colMetaKeysToApply.indexOf(metaKey) > -1)
                .forEach((storableMetaKey: string) => {
                    col.metas[storableMetaKey] = storedMetasMap['columns'][col.id][storableMetaKey];
                });
        })

        this._changeDetectorRef.detectChanges();
    }


    setDefaultMetas(): void {
        // Treetable metas -->
        this.metas.resizeMode.value = this.resizeMode;
        this.metas.itemsPerPage.value = this.pagination 
            ? this.pagination.itemsPerPage
            : NaN;

        // Cols Metas -->
        this.cols.forEach((col: ColumnComponent, i: number) => {
            col.metas.position.value = i; // set default position (as they appear in the template)
            col.metas.visibility.value = true;
            col.metas.sortOrder.value = 0;
            col.metas.sortIndex.value = -1;
        });

        // Width -->
        //setTimeout(() => { // TODO: try to get rid of the timer, or return promise.
            this.reflectComputedStyleWidths();
        //});
    }


    reflectComputedStyleWidths(): void {
        let contentInnerElem = this.contentInnerRef.nativeElement;
        let contentInnerElemComputedWidth = parseFloat(getComputedStyle(contentInnerElem).width);

        console.log('contentInnerElemComputedWidth', contentInnerElemComputedWidth);

        let visibleCols = this.getVisibleCols();

        let colDefaultWidthValue = contentInnerElemComputedWidth / visibleCols.length;
        let colDefaultWidth = this.metas.resizeMode.value === this.ResizeModes.expand
            ? colDefaultWidthValue + 'px'
            : calcPercentage(colDefaultWidthValue, contentInnerElemComputedWidth) + '%';

        visibleCols.forEach((col: ColumnComponent, i: number) => {
            col.metas.width.value = colDefaultWidth;
        });

        this.metas.width.value = this.metas.resizeMode.value === this.ResizeModes.expand
            ? contentInnerElemComputedWidth + 'px'
            : '100%';
    }


    collectTemplateRefs(): void {
        this.templateList.toArray().forEach((t: TemplateDirective) => {
            if (!this.GridTemplates[t.type]) {
                console.warn(`Unknown template type: ${t.type}. Possible value/s: ${mapToIterable(this.GridTemplates).join(', ')}.`);
                return;
            }

            this.templateRefs[t.type] = t.templateRef;
        });
    }


    initScrollbarVisibilityHandlers(): void {
        let mousemoveListener;
        let mouseleaveListener;

        this._ngZone.runOutsideAngular(() => {
            mousemoveListener = this._renderer.listen(this._elementRef.nativeElement, 'mousemove', (e) => {
                e.stopPropagation();

                this.checkAndSetScrollFocus();
            });
        });

        this._ngZone.runOutsideAngular(() => {
            mouseleaveListener = this._renderer.listen(this._elementRef.nativeElement, 'mouseleave', (e) => {
                if(this.level !== 0) { // keep scrollbar on root table if mouse leaves
                    this.setNotInScrollFocus(false);
                }
            });
        });
    }


    checkAndSetScrollFocus(): void {
        if (!this.isBodyScrollableVertically() && this.parentRef) {
            this.hasScrollFocus = false;
            // find first scrollable instance up the tree (end with the root table)
            this.parentRef.checkAndSetScrollFocus();
            return;
        }

        if (this.hasScrollFocus) {
            return;
        }

        this.hasScrollFocus = true;
        
        if (this.parentRef) {
            this.parentRef.setNotInScrollFocus(true);

            if(this.parentRowElement && this.parentRef.level !== 0 && this.parentRef.isBodyScrollableVertically()) {
                this.parentRef.scrollRowElemIntoView(this.parentRowElement);
            }
        }
        else {
            this._changeDetectorRef.detectChanges();
        }
        
    }


    setNotInScrollFocus(bubble: boolean): void {
        this.hasScrollFocus = false;

        if (bubble && this.parentRef) {
            this.parentRef.setNotInScrollFocus(true);
        }
        else {
            this._changeDetectorRef.detectChanges();
        }
    }


    scrollRowElemIntoView(rowElem: any): void {
        this._ngZone.runOutsideAngular(() => {
            // TODO: breaks initial mouse wheel scrolling in Chrome (for nested tables)..
            animateScroll(this.bodyRef.nativeElement, rowElem.offsetTop, 250);
            //this.bodyRef.nativeElement.scrollTop = rowElem.offsetTop;
        });
    }


    getParentRowElement(): HTMLElement {
        let parentExpandedContentContainerElem = findAncestor(this._elementRef.nativeElement, 'row-expanded-content-container');
        if(!parentExpandedContentContainerElem) {
            return null;
        }

        let parentTableRowNodes = Array.prototype.slice.call(parentExpandedContentContainerElem.parentElement.children);
        let parentExpandedContentContainerElemIndex = parentTableRowNodes.indexOf(parentExpandedContentContainerElem);

        // 'row-expanded-content-container' element always comes right after expanded row
        return parentTableRowNodes[parentExpandedContentContainerElemIndex - 1];
    }


    checkAndAdjustBodyHeight(): void {
        if(!this.parentRowElement || !this.isBodyHeightProvided()) {
            return;
        }

        const attrKey = this.bodyStyle['max-height'] 
            ? 'max-height' 
            : 'height';

        const parentRowElemHeight = parseFloat(getComputedStyle(this.parentRowElement).height);
        
        // child table's height can't be higher then parent's.. Increse parent's height or decrese child's
        this.bodyStyle[attrKey] = parseInt(this.bodyStyle[attrKey]) - (this.level - 1) * parentRowElemHeight + 'px'; // TODO: max-height and height have to be in pixels..? Also, root's height has to be heigher.. (needed checks within input params validity)
    }


    isBodyHeightProvided(): boolean {
        return !!(this.bodyStyle && (this.bodyStyle['max-height'] || this.bodyStyle['height']));
    }


    isBodyScrollableVertically(): boolean {
        return this.bodyRef.nativeElement.scrollHeight > this.bodyRef.nativeElement.clientHeight;
        //return this.isBodyHeightProvided() || !!(this.bodyStyle && this.bodyStyle['flex-basis']);
    }


    listenGlobalFilterInputEvents(filterInputElem: Element): void {
        this._ngZone.runOutsideAngular(() => {
            let onInput = debounce((e) => {
                this.globalFilterValue = e.target.value.trim();
                
                this.globalFilterValue
                    ? this.filterData(this.getVisibleCols(), this.globalFilterValue)
                    : this.filteredData = this.allData.slice();

                if (!this.pagination) {
                    this.renderData = this.filteredData.slice();
                }

                this._changeDetectorRef.detectChanges();
            }, 250, false);

            this._renderer.listen(filterInputElem, 'input', onInput);
        });
    }


    onPageChange(settings: any): void {
        this.renderData = this.filteredData.slice(settings.startIndex, settings.endIndex);
        
        // TODO: if detectChanges isn't called explicitely here, ExpressionChangedAfterItHasBeenCheckedError is being thrown on component initialization (this.filteredData property's value shouldn't be set within the ngAfterViewInit method)
        // also, changing pages stops working properly after interaction with global filter
        this._changeDetectorRef.detectChanges();
    }


    onItemsPerPageValueChange(value: number): void {
        this.metas.itemsPerPage.value = value;
        this.storeMetasMap(true);
    }


    filterData(cols: Array<ColumnComponent>, value: string): void {
        value = value.toUpperCase();

        this.filteredData = this.allData.filter((rowData: any, i: number) => {
            return !!cols.find((col: ColumnComponent) => this.resolveFieldValue(rowData, col.field).toUpperCase().indexOf(value) > -1);
        });
    }


    isRowExpandable(rowData: any): boolean {
        if (!this.expanderCol || !this.templateRefs[this.GridTemplates.rowExpansion])
            return false;

        let rowExpandableIndicatorPropertyValue = rowData[this.expanderCol.rowExpandableIndicatorProperty];
        return rowExpandableIndicatorPropertyValue && rowExpandableIndicatorPropertyValue.constructor === Array
            ? !!rowExpandableIndicatorPropertyValue.length
            : !!rowExpandableIndicatorPropertyValue;
    }


    toggleRow(rowData: any): void {
        rowData.ttExpanded = !rowData.ttExpanded;
    }


    resolveFieldValue(rowData: any, field: any): string {
        if (typeof field === 'string') {
            let resolvedValue = resolveDeepValue(rowData, field);

            return isValueValidForView(resolvedValue)
                ? resolvedValue.toString()
                : '';
        }

        if (Array.isArray(field)) {
            let compoundValue = '';

            field.forEach(k => {
                if (typeof k !== 'string') return;

                if (k[0] === '+' && k[k.length - 1] === '+') {
                    compoundValue += k.slice(1, -1)
                }
                else {
                    let resolvedValue = resolveDeepValue(rowData, k);
                    if (isValueValidForView(resolvedValue))
                        compoundValue += resolvedValue;
                }
            });

            return compoundValue;
        }

        return '';
    }


    sortColumn(col: ColumnComponent, autoSorting: boolean, event?: any): void {
        let columnsToSort = this.getSortedColumns();

        if (!autoSorting) {
            // previously ordered ? reverse order : set ascending order
            col.metas.sortOrder.value = col.metas.sortOrder.value ? col.metas.sortOrder.value * -1 : 1;

            if(event && event.ctrlKey) {
                if(columnsToSort.indexOf(col) === -1) {
                    col.metas.sortIndex.value = columnsToSort.length
                        ? columnsToSort[columnsToSort.length - 1].metas.sortIndex.value + 1 // column with highest sortIndex incremented
                        : 0; // make it first column to sort by

                    columnsToSort.push(col);
                }
            }
            else {
                // make it first column to sort by
                col.metas.sortIndex.value = 0;
                columnsToSort = [col];

                // reset all other columns
                this.cols.forEach((c: ColumnComponent) => {
                    if (c !== col) {
                        c.metas.sortOrder.value = 0;
                        c.metas.sortIndex.value = -1;
                    }
                });
            }

            if (this.saveSettings)
                this.storeMetasMap(true);
        }


        let getCompareResult = (c: ColumnComponent, rowDataA: any, rowDataB: any): number => {
            if(c.sortComparator) {
                return c.sortComparator(rowDataA, rowDataB);
            }
            else {
                let valA = this.resolveFieldValue(rowDataA, c.field);
                let valB = this.resolveFieldValue(rowDataB, c.field);

                return compareValues(valA, valB, c.sortCollator);
            }
        }

        this.allData.sort((a, b) => {
            let columnToSortIndex = 0;
            let compareResult = 0;

            while(compareResult === 0 || typeof compareResult !== 'number' || isNaN(compareResult)) {
                compareResult = columnsToSort[columnToSortIndex]
                    ? getCompareResult(columnsToSort[columnToSortIndex], a, b) * columnsToSort[columnToSortIndex].metas.sortOrder.value
                    : a.ttIndex > b.ttIndex ? 1 : -1; // fix for Chromium's unstable sorting algorithm: http://stackoverflow.com/questions/3195941/sorting-an-array-of-objects-in-chrome

                columnToSortIndex++;
            }

            return compareResult;
        });

        this.allData.forEach((rowData: any, i: number) => {
            // set new order index
            rowData.ttIndex = i;
        });



        if (!autoSorting) {
            this.allData.length !== this.filteredData.length
                ? this.filteredData.sort((rowDataA: any, rowDataB: any) => rowDataA.ttIndex - rowDataB.ttIndex)
                : this.filteredData = this.allData.slice();

            if (!this.pagination) {
                this.renderData = this.filteredData.slice();
            }
            else {
                this.paginator.init();
            }
        }
    };


    toggleColumnVisibility(targetedCol: ColumnComponent): void {
        if (this.metas.resizeMode.value === this.ResizeModes.expand) {
            targetedCol.metas.visibility.value = !targetedCol.metas.visibility.value;

            let visibleCols = this.getVisibleCols();
            let visibleColsWidthSum = 0;
            visibleCols.forEach((col: ColumnComponent, i: number) => {
                visibleColsWidthSum += parseFloat(col.metas.width.value);
            });

            this.metas.width.value = visibleColsWidthSum + 'px';
        }
        else if (this.metas.resizeMode.value === this.ResizeModes.fit) {
            if (targetedCol.metas.visibility.value) {
                let affectedCols = this.getVisibleCols().filter(c => c !== targetedCol); // exclude targeted col
                let targetedColWidthPct = parseFloat(targetedCol.metas.width.value);
                let targetedColDividedWithPct = targetedColWidthPct / affectedCols.length;

                affectedCols.forEach((c: ColumnComponent) => {
                    let colWidthPct = parseFloat(c.metas.width.value);
                    let colNewWidthPct = colWidthPct + targetedColDividedWithPct;

                    c.metas.width.value = colNewWidthPct + '%';
                });
            }
            else {
                let contentInnerElem = this.contentInnerRef.nativeElement;
                let contentInnerElemWidth = parseFloat(getComputedStyle(contentInnerElem).width);
                let targetedColWidthPct = parseFloat(targetedCol.metas.width.value);
                let targetedColDividedWithPct: number;
                let affectedCols: Array<ColumnComponent>;

                let determineAffectedCols = (cols: Array<ColumnComponent>): void => {
                    targetedColDividedWithPct = targetedColWidthPct / cols.length;
                    affectedCols = [];

                    for (let i = 0; i < cols.length; ++i) {
                        let colWidthPct = parseFloat(cols[i].metas.width.value);
                        let colNewWidthPct = colWidthPct - targetedColDividedWithPct;
                        let colNewWidthPx = (colNewWidthPct / 100) * contentInnerElemWidth;

                        if (colNewWidthPx < this.colMinWidth) {
                            // re-set affected cols excluding this one
                            cols.splice(i, 1);
                            determineAffectedCols(cols);

                            return;
                        }

                        affectedCols.push(cols[i]);
                    }
                }

                determineAffectedCols(this.getVisibleCols());

                affectedCols.forEach((c: ColumnComponent) => {
                    let colWidthPct = parseFloat(c.metas.width.value);
                    let colNewWidthPct = colWidthPct - targetedColDividedWithPct;

                    c.metas.width.value = colNewWidthPct + '%';
                });
            }

            targetedCol.metas.visibility.value = !targetedCol.metas.visibility.value;
        }
        else {
            targetedCol.metas.visibility.value = !targetedCol.metas.visibility.value;
            this.reflectComputedStyleWidths();
        }


        if (this.saveSettings)
            this.storeMetasMap(true);
    }


    shouldEmbedColResizer(col: ColumnComponent, colIndex: number, resizerSide: string): boolean {
        if (!this.ResizeModes[this.metas.resizeMode.value] || col.expander || !col.metas.visibility.value)
            return false;

        if (resizerSide === 'right') {
            if (this.metas.resizeMode.value === this.ResizeModes.expand)
                return true;

            let isLastVisibleColumn = !this.cols.find((c: ColumnComponent, i: number) => {
                return c.metas.visibility.value && i > colIndex;
            });

            return !isLastVisibleColumn;
        }
        else {
            let expanderColExists = !!this.expanderCol;
            if (expanderColExists)
                return true;

            let isFirstVisibleColumn = !this.cols.find((c: ColumnComponent, i: number) => {
                return c.metas.visibility.value && i < colIndex;
            });

            return !isFirstVisibleColumn;
        }
    }


    handleColResizing(event: any, colIndex: number, resizerSide: string): void {
        let colResizerElem = event.target;
        //if (colResizerElem.setCapture) colResizerElem.setCapture();
        this.appendDragCoverElem('col-resize');

        let mouseInitialClientX = event.clientX;
        let documentElem = document.documentElement;

        let headCellNodeList = this.headRef.nativeElement.querySelectorAll('.cell');
        let visibleCols = this.getVisibleCols();

        let contentInnerElem = this.contentInnerRef.nativeElement;
        let contentInnerElemInitialWidth = parseFloat(getComputedStyle(contentInnerElem).width);

        let targetedColumn, targetedColumnIdx, targetedHeadCellElem, targetedHeadCellElemInitialWidth;
        let affectedColumn, affectedColumnIdx, affectedHeadCellElem, affectedHeadCellElemInitialWidth;

        let setTargetedColumn = (): void => {
            if (resizerSide === 'right') {
                targetedColumn = this.cols[colIndex];
                targetedColumnIdx = colIndex;
            }
            else {
                for (let i = colIndex - 1; i > -1; --i) {
                    if (this.cols[i].metas.visibility.value) {
                        targetedColumn = this.cols[i];
                        targetedColumnIdx = i;
                        break;
                    }
                }
            }

            targetedHeadCellElem = headCellNodeList[visibleCols.indexOf(targetedColumn)];
            targetedHeadCellElemInitialWidth = parseFloat(getComputedStyle(targetedHeadCellElem).width);
        }

        let setAffectedColumn = (): void => {
            affectedColumn = this.cols.find((c: ColumnComponent, i: number) => i > targetedColumnIdx && c.metas.visibility.value);
            affectedColumnIdx = this.cols.indexOf(affectedColumn);
            affectedHeadCellElem = headCellNodeList[visibleCols.indexOf(affectedColumn)];
            affectedHeadCellElemInitialWidth = parseFloat(getComputedStyle(affectedHeadCellElem).width);
        }

        setTargetedColumn();

        if (this.metas.resizeMode.value === this.ResizeModes.fit)
            setAffectedColumn();


        let globalMouseupListener = this._renderer.listen(documentElem, 'mouseup', (e) => {
            if (globalMousemoveListener) globalMousemoveListener(); // unbind
            if (globalMouseupListener) globalMouseupListener(); // unbind
            //if (colResizerElem.releaseCapture) colResizerElem.releaseCapture();
            this.removeDragCoverElem();

            if (this.saveSettings)
                this.storeMetasMap(true);
        });


        let globalMousemoveListener;
        this._ngZone.runOutsideAngular(() => {
            globalMousemoveListener = this._renderer.listen(documentElem, 'mousemove', (e) => {
                let mouseClientX = e.clientX;
                let pxDelta = mouseClientX - mouseInitialClientX;

                let targetedHeadCellElemNewWidth = targetedHeadCellElemInitialWidth + pxDelta;

                if (this.metas.resizeMode.value === this.ResizeModes.expand) {
                    if (targetedHeadCellElemNewWidth >= this.colMinWidth) {
                        this.metas.width.value = (contentInnerElemInitialWidth + pxDelta) + 'px';
                        targetedColumn.metas.width.value = targetedHeadCellElemNewWidth + 'px';

                        this._changeDetectorRef.detectChanges();
                    }
                }
                else {
                    let affectedHeadCellElemNewWidth = affectedHeadCellElemInitialWidth - pxDelta;

                    if (targetedHeadCellElemNewWidth >= this.colMinWidth && affectedHeadCellElemNewWidth >= this.colMinWidth) {
                        targetedColumn.metas.width.value = calcPercentage(targetedHeadCellElemNewWidth, contentInnerElemInitialWidth) + '%';
                        affectedColumn.metas.width.value = calcPercentage(affectedHeadCellElemNewWidth, contentInnerElemInitialWidth) + '%';

                        this._changeDetectorRef.detectChanges();
                    }
                }
            });
        });
    }


    handleColDragging(event: any, draggedColumn: ColumnComponent): void {
        if (!this.reorderable || !draggedColumn.isReorderable())
            return;

        let documentElem = document.documentElement;
        let mouseInitialClientX = event.clientX;
        let mouseStartClientX = mouseInitialClientX;

        let visibleCols = this.getVisibleCols();
        let draggedCol = draggedColumn;
        let draggedColIdx = this.cols.indexOf(draggedColumn);
        let draggedColVisibleIdx = visibleCols.indexOf(draggedCol);

        let headCellNodeList = this.headRef.nativeElement.querySelectorAll('.cell');
        let draggedCellElem = headCellNodeList[draggedColVisibleIdx];
        let draggedCellElemWidth = parseFloat(getComputedStyle(draggedCellElem).width);
        let draggedCellElemViewportOffset = draggedCellElem.getBoundingClientRect();

        let draggedCellElemClone = draggedCellElem.cloneNode(true);
        draggedCellElemClone.className += ' cloned';
        draggedCellElemClone.style['top'] = draggedCellElemViewportOffset.top + 'px';
        draggedCellElemClone.style['left'] = draggedCellElemViewportOffset.left + 'px';
        draggedCellElemClone.style['width'] = draggedCellElemWidth + 'px';

        draggedCol.dragged = true;
        this.appendDragCoverElem('move');
        draggedCellElem.parentNode.appendChild(draggedCellElemClone);
        //draggedCellElem.parentNode.insertBefore(draggedCellElemClone, draggedCellElem.parentNode.children[0]);

        let globalMouseupListener = this._renderer.listen(documentElem, 'mouseup', (e) => {
            if (globalMousemoveListener) globalMousemoveListener(); // unbind
            if (globalMouseupListener) globalMouseupListener(); // unbind

            draggedCol.dragged = false;
            this.removeDragCoverElem();
            draggedCellElem.parentNode.removeChild(draggedCellElemClone);

            if (this.saveSettings)
                this.storeMetasMap(true);
        });


        let globalMousemoveListener;
        this._ngZone.runOutsideAngular(() => {
            globalMousemoveListener = this._renderer.listen(documentElem, 'mousemove', (e) => {
                let pxDeltaX = e.clientX - mouseInitialClientX;

                draggedCellElemClone.style['left'] = draggedCellElemViewportOffset.left + pxDeltaX + 'px';

                let isDraggedColMovedRight = e.clientX - mouseStartClientX > 0;

                let affectedColVisibleIdx = isDraggedColMovedRight ? draggedColVisibleIdx + 1 : draggedColVisibleIdx - 1;
                let affectedCol = this.getVisibleCols()[affectedColVisibleIdx];
                let affectedColIdx = this.cols.indexOf(affectedCol);

                headCellNodeList = this.headRef.nativeElement.querySelectorAll('.cell');
                let affectedCellElem = headCellNodeList[affectedColVisibleIdx];

                if (affectedCellElem && affectedCol && affectedCol.isReorderable()) {
                    let affectedCellElemWidth = parseFloat(getComputedStyle(affectedCellElem).width);
                    let affectedCellElemOffsetLeft = affectedCellElem.getBoundingClientRect().left;

                    let shouldSwapCols = isDraggedColMovedRight
                        ? e.clientX >= affectedCellElemOffsetLeft + (affectedCellElemWidth / 2)
                        : e.clientX <= affectedCellElemOffsetLeft + (affectedCellElemWidth / 2);

                    if (shouldSwapCols) {
                        draggedCol.metas.position.value = affectedColIdx;
                        affectedCol.metas.position.value = draggedColIdx;
                        this.onColsMetaPositionChange.emit(null);

                        // set new index for further moving
                        draggedColIdx = affectedColIdx;
                        draggedColVisibleIdx = affectedColVisibleIdx;

                        mouseStartClientX = e.clientX;
                    }
                }

                this._changeDetectorRef.detectChanges();
            });
        });

    }


    appendDragCoverElem(cursorStyle: string = ''): Element {
        let wholeContentCoverElem = document.createElement('div');
        wholeContentCoverElem.className = 'flx-whole-content-cover';
        wholeContentCoverElem.style['cursor'] = cursorStyle;

        document.body.appendChild(wholeContentCoverElem);

        return wholeContentCoverElem;
    }

    removeDragCoverElem(): void {
        let wholeContentCoverElem = document.querySelector('.flx-whole-content-cover');

        if (wholeContentCoverElem)
            document.body.removeChild(wholeContentCoverElem);
    }


    onBodyWidthChange(width: string) {
        this.bodyWidth = width;
        this._changeDetectorRef.detectChanges();
    }


    getScrollbarWidthOffset(scrollableElem: any): string {
        // calculates scrollbar's width for given element, returns '0px' if scrollbar isn't visible...
        // TODO: move to dom-utils..
        let offsetWidth = -(scrollableElem.offsetWidth  - scrollableElem.clientWidth) + 'px';
        return offsetWidth;
    }


    stopPropagation(event: any): void {
        if (event && event.stopPropagation)
            event.stopPropagation();
    }


    bindFnContext(fn: Function): Function {
        return fn.bind(this);
    }


    getStoredMetasMap(async?: boolean): Promise<any> | any {
        if (!this.saveSettings || !this.settingsStorageKey)
            return null;

        return async
            ? this._storageService.getAsync(this.settingsStorageKey)
            : this._storageService.get(this.settingsStorageKey);
    }

    storeMetasMap(async?: boolean): Promise<any> | any {
        // TODO: filter storable metas prior storing..
        let colsMetasMap = {};
        this.cols.forEach((col: ColumnComponent) => {
            colsMetasMap[col.id] = col.metas;
        });

        let metasMapToStore = {
            'grid': this.metas,
            'columns': colsMetasMap
        };

        return async
            ? this._storageService.setAsync(this.settingsStorageKey, metasMapToStore)
            : this._storageService.set(this.settingsStorageKey, metasMapToStore);
    }

    removeStoredMetasMap(async?: boolean): Promise<any> | any {
        return async
            ? this._storageService.removeAsync(this.settingsStorageKey)
            : this._storageService.remove(this.settingsStorageKey);
    }

}
