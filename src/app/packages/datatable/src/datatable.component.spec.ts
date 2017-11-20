import { async, TestBed, ComponentFixture, inject, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, QueryList, Component, ViewChild, OnInit, TemplateRef } from '@angular/core';

import { DatatableComponent } from './datatable.component';
import { ColumnComponent } from './column/column.component';
import { TemplateLoaderComponent } from '../../../shared/components/template-loader/template-loader.component';
import { ContextMenuComponent } from '../../../shared/components/context-menu/context-menu.component';

import { VarDirective } from '../../../shared/directives/var.directive';

import { StorageService } from '../../../core/storage.service';

import { ResizeModes, GridTemplates, ColumnTemplates } from './shared/constants';


class StorageServiceMock {
    get(key: string) { }
    getAsync(key: string) { }
    set(key: string, value: any) { }
    setAsync(key: string, value: any) { }
    remove(key: string) { }
    removeAsync(key: string) { }
}


@Component({
    selector: 'flx-dtHostComponent',
    template: `
            <flx-datatable [data]="testData" [resizeMode]="'expand'" [reorderable]="true" [saveSettings]="true" [settingsStorageKey]="'test-datatable-settings'" [supportMdl]="true" id="test-datatable">

                <flx-column [expander]="true" [rowExpandableIndicatorProperty]="'children'"></flx-column>
                <flx-column [field]="'createdTime'" [header]="'DATE'"></flx-column>
                <flx-column [field]="'faultCode'" [header]="'FAULT CODE'" [sortable]="false"></flx-column>
                <flx-column [field]="'status'" [header]="'STATUS'">
                    <ng-template flxTemplate="bodyCell" let-rowData="rowData" let-ri="rowIndex" let-col="column" let-ci="columnIndex" let-cols="columns" let-colsMap="columnsMap">
                        <div class="grid-cell-content">
                            <span>{{rowData[col.field]}}</span>
                            <i *ngIf="rowData[col.field] >= 200 && rowData[col.field] < 300" class="material-icons status-icon-container ok">check</i>
                            <i *ngIf="rowData[col.field] < 200 || rowData[col.field] >= 300" class="material-icons status-icon-container bad">close</i>
                        </div>
                    </ng-template>
                </flx-column>

                <ng-template flxTemplate="rowExpansion" let-rowData="rowData" let-ri="rowIndex" let-pCols="columns" let-pColsMap="columnsMap">
                    <flx-datatable [data]="rowData.children" [includeHead]="false">
                        <ng-container *ngFor="let pCol of pCols">
                            <flx-column [field]="pCol.field" [expander]="pCol.expander" [rowExpandableIndicatorProperty]="'children'" [templateRefs]="pCol.templateRefs"></flx-column>
                        </ng-container>
                    </flx-datatable>
                </ng-template>

            </flx-datatable>
    `,
    styles: [':host { width: 900px; height: 900px; }']
})
class dtHostComponent implements OnInit {

    @ViewChild(DatatableComponent) dtCompRef: DatatableComponent;

    testData: Array<any>;

    constructor() { }

    ngOnInit() {
        this.testData = [
            {
                createdTime: '2017-04-25T12:03:03.359Z',
                faultCode: '999',
                status: 200,
                children: [
                    {
                        createdTime: '2017-08-25T12:03:03.359Z',
                        faultCode: '333',
                        status: 404
                    },
                    {
                        createdTime: '2017-07-25T12:03:03.359Z',
                        faultCode: '111',
                        status: 404
                    }
                ]
            },
            null,
            {
                createdTime: '2017-05-25T12:03:03.359Z',
                faultCode: '888',
                status: 500
            }
        ];
    }
}



describe('DatatableComponent (dtHostComponent) >> ', () => {

    let compileAndCreateComponents = (): ComponentFixture<dtHostComponent> => {
        TestBed.configureTestingModule({
            declarations: [
                dtHostComponent,
                DatatableComponent,
                ColumnComponent,
                TemplateLoaderComponent,
                ContextMenuComponent,
                VarDirective
            ],
            providers: [
                { provide: StorageService, useClass: StorageServiceMock }
                //{ provide: ComponentFixtureAutoDetect, useValue: true }
            ]
        }).compileComponents();  // compile template and css

        return TestBed.createComponent(dtHostComponent);
    };


    describe('Without detecting changes >> ', () => {
        let hostCompFixture: ComponentFixture<dtHostComponent>;
        let dtComp: any; // DatatableComponent

        beforeEach(async(() => {
            hostCompFixture = compileAndCreateComponents();
        }));

        beforeEach(() => {
            dtComp = <DatatableComponent>hostCompFixture.debugElement.children[0].componentInstance;
        });


        describe('Component Input members declarations >> ', () => {

            it('@Input() Boolean member `includeHead` should be declared', () => {
                expect(dtComp.hasOwnProperty('includeHead')).toBe(true);
            });

            it('@Input() Boolean member `includePaginator` should be declared', () => {
                expect(dtComp.hasOwnProperty('includePaginator')).toBe(true);
            });

            it('@Input() Boolean member `supportMdl` should be declared', () => {
                expect(dtComp.hasOwnProperty('supportMdl')).toBe(true);
            });

            it('@Input() Boolean member `saveSettings` should be declared', () => {
                expect(dtComp.hasOwnProperty('saveSettings')).toBe(true);
            });

            it('@Input() String member `settingsStorageKey` should be declared', () => {
                expect(dtComp.hasOwnProperty('settingsStorageKey')).toBe(true);
            });

            it('@Input() String member `resizeMode` should be declared', () => {
                expect(dtComp.hasOwnProperty('resizeMode')).toBe(true);
            });

            it('@Input() Object member `templateRefs` should be declared', () => {
                expect(dtComp.hasOwnProperty('templateRefs')).toBe(true);
            });

        });


        describe('Component members default initializations >> ', () => {

            it('@Input() Boolean member `includeHead` should be initialized with `true`', () => {
                expect(dtComp.includeHead).toBe(true);
            });

            it('@Input() Boolean member `includePaginator` should be initialized with `false`', () => {
                expect(dtComp.includePaginator).toBe(false);
            });

            it('@Input() Boolean member `supportMdl` should be initialized with `false`', () => {
                expect(dtComp.supportMdl).toBe(false);
            });

            it('@Input() Boolean member `saveSettings` should be initialized with `false`', () => {
                expect(dtComp.saveSettings).toBe(false);
            });

            it('@Input() String member `settingsStorageKey` should be initialized as empty string', () => {
                expect(dtComp.settingsStorageKey).toBe('');
            });

            it('@Input() String member `resizeMode` should be initialized as empty string', () => {
                expect(dtComp.resizeMode).toBe('');
            });

            it('@Input() Object member `templateRefs` should be initialized as empty object', () => {
                expect(dtComp.templateRefs).toEqual({});
            });

            it('`gridData` member should be initialized as empty array', () => {
                expect(dtComp.gridData).toEqual([]);
            });

            it('`cols` member should not be initialized', () => {
                expect(dtComp.cols).toBe(undefined);
            });

            it('`colsMap` member should not be initialized', () => {
                expect(dtComp.colsMap).toBe(undefined);
            });

            it('`expanderCol` member should not be initialized', () => {
                expect(dtComp.expanderCol).toBe(undefined);
            });

            it('`level` member should be initialized with `0` value', () => {
                expect(dtComp.level).toBe(0);
            });

            it('`iterableDiffer` member should not be initialized', () => {
                expect(dtComp.iterableDiffer).toBe(undefined);
            });

            it('`metas` member should be initialized as object and should not be null', () => {
                expect(typeof dtComp.metas === 'object').toBe(true);
                expect(dtComp.metas).not.toBe(null);
            });

            it('`metas.width` property should be initialized as object containing the `value` property initialized as empty string', () => {
                expect(typeof dtComp.metas.width === 'object').toBe(true);
                expect(dtComp.metas.width.value).toBe('');
            });

            it('`metas.resizeMode` property should be initialized as object containing the `value` property initialized as empty string', () => {
                expect(typeof dtComp.metas.resizeMode === 'object').toBe(true);
                expect(dtComp.metas.resizeMode.value).toBe('');
            });

            it('reanonly member `ResizeModes` should be initialized as `ResizeModes` constant', () => {
                expect(dtComp.ResizeModes).toBe(ResizeModes);
            });

            it('reanonly member `GridTemplates` should be initialized as `GridTemplates` constant', () => {
                expect(dtComp.GridTemplates).toBe(GridTemplates);
            });

            it('reanonly member `ColumnTemplates` should be initialized as `ColumnTemplates` constant', () => {
                expect(dtComp.ColumnTemplates).toBe(ColumnTemplates);
            });

            it('reanonly member `colMinWidth` should be initialized with numberic value representing the pixels', () => {
                expect(typeof dtComp.colMinWidth === 'number').toBe(true);
            });

            it('reanonly member `colMinWidth` should be initialized with number greater then 10', () => {
                expect(dtComp.colMinWidth > 10).toBe(true);
            });

            it('string member `globalFilterValue` should be initialized as empty string', () => {
                expect(dtComp.globalFilterValue).toBe('');
            });

            it('boolean member `readyToProcessInputData` should be initialized with false valaue', () => {
                expect(dtComp.readyToProcessInputData).toBe(false);
            });

            // ------------------------------ METHODS ----------------------------------
            it('`checkAndProcessInputDataChanges` method should be defined', () => {
                expect(typeof dtComp.checkAndProcessInputDataChanges === 'function').toBe(true);
            });

            it('`onInputDataChanges` member should be initialized as empty array', () => {
                expect(typeof dtComp.onInputDataChanges === 'function').toBe(true);
            });

            it('`setLevel` member should be initialized as empty array', () => {
                expect(typeof dtComp.setLevel === 'function').toBe(true);
            });

            it('`initCols` member should be initialized as empty array', () => {
                expect(typeof dtComp.initCols === 'function').toBe(true);
            });

            it('`getVisibleCols` member should be initialized as empty array', () => {
                expect(typeof dtComp.getVisibleCols === 'function').toBe(true);
            });

            it('`setMetas` member should be defined', () => {
                expect(typeof dtComp.setMetas === 'function').toBe(true);
            });

            it('`inheritMetas` method should be defined', () => {
                expect(typeof dtComp.inheritMetas === 'function').toBe(true);
            });

            it('`canApplyStoredMetas` method should be defined', () => {
                expect(typeof dtComp.canApplyStoredMetas === 'function').toBe(true);
            });

            it('`applyStoredMetas` method should be defined', () => {
                expect(typeof dtComp.applyStoredMetas === 'function').toBe(true);
            });

            it('`setDefaultMetas` method should be defined', () => {
                expect(typeof dtComp.setDefaultMetas === 'function').toBe(true);
            });

            it('`reflectComputedStyleWidths` method should be defined', () => {
                expect(typeof dtComp.reflectComputedStyleWidths === 'function').toBe(true);
            });

            it('`collectTemplateRefs` method should be defined', () => {
                expect(typeof dtComp.collectTemplateRefs === 'function').toBe(true);
            });

            it('`doColsMapsMatch` method should be defined', () => {
                expect(typeof dtComp.doColsMapsMatch === 'function').toBe(true);
            });

            it('`isRowExpandable` method should be defined', () => {
                expect(typeof dtComp.isRowExpandable === 'function').toBe(true);
            });

            it('`toggleRow` method should be defined', () => {
                expect(typeof dtComp.toggleRow === 'function').toBe(true);
            });

            it('`sortColumn` method should be defined', () => {
                expect(typeof dtComp.sortColumn === 'function').toBe(true);
            });

            it('`toggleColumnVisibility` method should be defined', () => {
                expect(typeof dtComp.toggleColumnVisibility === 'function').toBe(true);
            });

            it('`shouldEmbedColResizer` method should be defined', () => {
                expect(typeof dtComp.shouldEmbedColResizer === 'function').toBe(true);
            });

            it('`handleColResizing` method should be defined', () => {
                expect(typeof dtComp.handleColResizing === 'function').toBe(true);
            });

            it('`handleColDragging` method should be defined', () => {
                expect(typeof dtComp.handleColDragging === 'function').toBe(true);
            });

            it('`bindFnContext` method should be defined', () => {
                expect(typeof dtComp.bindFnContext === 'function').toBe(true);
            });

            it('`getStoredMetasMap` method should be defined', () => {
                expect(typeof dtComp.getStoredMetasMap === 'function').toBe(true);
            });

            it('`storeMetasMap` method should be defined', () => {
                expect(typeof dtComp.storeMetasMap === 'function').toBe(true);
            });

            it('`removeStoredMetasMap` method should be defined', () => {
                expect(typeof dtComp.removeStoredMetasMap === 'function').toBe(true);
            });

            it('`resolveFieldValue` method should be defined', () => {
                expect(typeof dtComp.resolveFieldValue === 'function').toBe(true);
            });
        });
    });


    describe('After detecting initial changes >> ', () => {
        let hostCompFixture: ComponentFixture<dtHostComponent>;
        let dtComp: any; // DatatableComponent

        beforeEach(async(() => {
            hostCompFixture = compileAndCreateComponents();
            hostCompFixture.detectChanges();
        }));

        beforeEach(() => {
            dtComp = <DatatableComponent>hostCompFixture.debugElement.children[0].componentInstance;
        });


        describe('`ngOnInit` Lifecycle Hook >> ', () => {

            beforeEach(() => {
                spyOn(dtComp, 'checkInputParamsValidity');
                spyOn(dtComp, 'setLevel');

                dtComp.ngOnInit();
            });

            it('should call `checkInputParamsValidity` method', () => {
                expect(dtComp.checkInputParamsValidity).toHaveBeenCalled();
            });

            it('should call `setLevel` method', () => {
                expect(dtComp.setLevel).toHaveBeenCalled();
            });

            it('`iterableDiffer` member should be initialized', () => {
                expect(typeof dtComp.iterableDiffer === 'object').toBe(true);
            });

            it('`resizeMode` input value should be moved to `metas` member in order to be inheritable', () => {
                expect(dtComp.metas.resizeMode.value).toBe(dtComp.resizeMode);
            });
        });


        describe('`ngAfterContentInit` Lifecycle Hook >> ', () => {

            beforeEach(() => {
                spyOn(dtComp, 'initCols');
                spyOn(dtComp, 'collectTemplateRefs');

                dtComp.ngAfterContentInit();
            });


            it('should call `initCols` method', () => {
                expect(dtComp.initCols).toHaveBeenCalled();
            });

            it('should call `collectTemplateRefs` method', () => {
                expect(dtComp.collectTemplateRefs).toHaveBeenCalled();
            });
        });


        describe('`ngAfterViewInit` Lifecycle Hook >> ', () => {

            beforeEach(() => {
                spyOn(dtComp, 'setMetas');
                spyOn(dtComp.onColsMetaPositionChange, 'subscribe');
                spyOn(dtComp.onColsMetaPositionChange, 'emit');

                dtComp.ngAfterViewInit();
            });

            it('should call `setMetas` method', () => {
                expect(dtComp.setMetas).toHaveBeenCalled();
            });

            it('should subscribe to `onColsMetaPositionChange` EventEmitter', () => {
                expect(dtComp.onColsMetaPositionChange.subscribe).toHaveBeenCalled();
            });

            it('should emit `onColsMetaPositionChange`', () => {
                expect(dtComp.onColsMetaPositionChange.emit).toHaveBeenCalledWith(null);
            });
        });


        describe('`ngDoCheck` Lifecycle Hook >> ', () => {

            beforeEach(() => {
                spyOn(dtComp, 'checkAndProcessInputDataChanges');

                dtComp.ngDoCheck();
            });


            it('should call `checkAndProcessInputDataChanges` method', () => {
                expect(dtComp.checkAndProcessInputDataChanges).toHaveBeenCalled();
            });
        });


        describe('`checkAndProcessInputDataChanges` method >> ', () => {

            it('`gridData` member should be initialized as empty array if input data is undefined or non-array type', () => {
                dtComp.data = undefined;
                dtComp.gridData = [{}, {}];

                dtComp.checkAndProcessInputDataChanges();

                expect(dtComp.gridData).toEqual([]);
            });


            it('`onInputDataChanges` method should not be called if input data is undefined or non-array type', () => {
                dtComp.data = undefined;
                spyOn(dtComp, 'onInputDataChanges');

                dtComp.checkAndProcessInputDataChanges();

                expect(dtComp.onInputDataChanges).not.toHaveBeenCalled();
            });
        });


        describe('`onInputDataChanges` method >> ', () => {

            it('Input member `data` should be an array of objects, gapes should be replaced with empty objects when mapping to `gridData`', () => {
                dtComp.data = [{}, null, {}];

                dtComp.onInputDataChanges();

                expect(dtComp.gridData).toEqual([{ dtIndex: 0, dtExpanded: false }, { dtIndex: 1, dtExpanded: false }, { dtIndex: 2, dtExpanded: false }]);
            });

            it('`gridData` member should be re-initialized if input data changes (`data` member should be adequatelly copied-mapped)', () => {
                dtComp.data = [{}, { prop1: 'prop1' }, {}];

                dtComp.onInputDataChanges();

                expect(dtComp.gridData).toEqual(dtComp.data);
            });


            it('should call `sortColumn` method if sorted column exists', () => {
                dtComp.cols[1].metas.sortOrder.value = 1;
                spyOn(dtComp, 'sortColumn');

                dtComp.onInputDataChanges();

                expect(dtComp.sortColumn).toHaveBeenCalledWith(dtComp.cols[1], true);
            });

            it('should not call `sortColumn` method if sorted column does not exists', () => {
                dtComp.cols.forEach(c => c.metas.sortOrder.value = 0);
                spyOn(dtComp, 'sortColumn');

                dtComp.onInputDataChanges();

                expect(dtComp.sortColumn).not.toHaveBeenCalled();
            });
        });


        describe('`initCols` method >> ', () => {

            it('should define `cols` array', () => {
                expect(Array.isArray(dtComp.cols)).toBe(true);
            });

            it('`cols` array should contain 4 elements', () => {
                expect(dtComp.cols.length).toBe(4);
            });

            it('`cols` array elements should be instances of ColumnComponent class', () => {
                expect(dtComp.cols[0] instanceof ColumnComponent).toBe(true);
            });

            it('`expanderCol` member should be defined', () => {
                expect(dtComp.expanderCol instanceof ColumnComponent).toBe(true);
            });

            it('`expander` column should be at position 0', () => {
                // move to the last position
                dtComp.cols.splice(0, 1);
                dtComp.cols.push(dtComp.expanderCol);

                dtComp.initCols();

                expect(dtComp.cols[0].expander).toBe(true);
            });

            it('`colsMap` member should be defined', () => {
                expect(typeof dtComp.colsMap === 'object').toBe(true);
            });

        });



        describe('`getVisibleCols` method >> ', () => {

            it('should return new array containing the visible cols', () => {
                // make the last column not visible (by default all cols are visible)
                dtComp.cols[dtComp.cols.length - 1].metas.visibility.value = false;

                expect(dtComp.getVisibleCols().length).toBe(dtComp.cols.length - 1);
            });

        });

        describe('`setMetas` method >> ', () => {

            it('`metas` shoud be inherited from parent grid component (if exists) if cols on both sides match', () => {
                dtComp._parentRef = Object.assign({}, dtComp);

                spyOn(dtComp, 'inheritMetas');
                dtComp.setMetas();

                expect(dtComp.inheritMetas).toHaveBeenCalled();
            });

            it('`onColsMetaPositionChange` EventEmitter shoud be inherited from parent grid component (if exists) if cols on both sides match', () => {
                dtComp._parentRef = Object.assign({}, dtComp);
                dtComp._parentRef.onColsMetaPositionChange = { p1: 'just a test' };
                dtComp.setMetas();

                expect(dtComp.onColsMetaPositionChange).toEqual({ p1: 'just a test' });
            });

            it('should check whether stored `metas` can be applied (no parent grid component scenario)', () => {
                spyOn(dtComp, 'canApplyStoredMetas');
                dtComp.setMetas();

                expect(dtComp.canApplyStoredMetas).toHaveBeenCalled();
            });

            it('should apply stored metas if allowed (no parent grid component scenario)', () => {
                spyOn(dtComp, 'canApplyStoredMetas').and.returnValue(true);
                spyOn(dtComp, 'applyStoredMetas');
                dtComp.setMetas();

                expect(dtComp.applyStoredMetas).toHaveBeenCalled();
            });

            it('should init metas if can\'t apply stored metas (no parent grid component scenario)', () => {
                spyOn(dtComp, 'canApplyStoredMetas').and.returnValue(false);
                spyOn(dtComp, 'setDefaultMetas');
                dtComp.setMetas();

                expect(dtComp.setDefaultMetas).toHaveBeenCalled();
            });

        });


        describe('`canApplyStoredMetas` method >> ', () => {

            it('should return `false` if there is no stored metas data', () => {
                expect(dtComp.canApplyStoredMetas(null)).toBe(false);
            });
        });


        describe('`applyStoredMetas` method >> ', () => {

            it('should apply stored col width', () => {
                let storedMetasMap = {
                    grid: {},
                    columns: {
                        expander: {},
                        createdTime: {},
                        status: {},
                        faultCode: {
                            width: {
                                value: 590 + 'px'
                            },
                            visibility: {
                                value: false
                            }
                        }
                    }
                };

                dtComp.applyStoredMetas(storedMetasMap);

                let faultCodeColumn = dtComp.cols.find(c => c.field === 'faultCode');

                expect(faultCodeColumn.metas.width.value).toBe(storedMetasMap.columns.faultCode.width.value);
            });

            it('should apply stored col visibility state', () => {
                let storedMetasMap = {
                    grid: {},
                    columns: {
                        expander: {},
                        createdTime: {},
                        status: {},
                        faultCode: {
                            width: {
                                value: 590 + 'px'
                            },
                            visibility: {
                                value: false
                            }
                        }
                    }
                };

                dtComp.applyStoredMetas(storedMetasMap);

                let faultCodeColumn = dtComp.cols.find(c => c.field === 'faultCode');

                expect(faultCodeColumn.metas.visibility.value).toBe(storedMetasMap.columns.faultCode.visibility.value);
            });
        });


        describe('`collectTemplateRefs` method >> ', () => {

            it('should collect ng-templates and store them to `templateRefs` object', () => {
                dtComp.collectTemplateRefs();

                expect(typeof dtComp.templateRefs === 'object').toBe(true);
            });

        });


        describe('`doColsMapsMatch` method >> ', () => {

            it('columns and parent grid columns should match', () => {
                let colsMap = { expander: { field: undefined }, createdTime: { field: 'createdTime' }, faultCode: { field: 'faultCode' } };
                let pColsMap = { expander: { field: null }, createdTime: { field: 'createdTime' }, faultCode: { field: 'faultCode' } };

                expect(dtComp.doColsMapsMatch(colsMap, pColsMap)).toBe(true);
            });

            it('columns and parent grid columns should match 2 (cols order should not make any difference)', () => {
                let colsMap = { 'expander': { field: '' }, createdTime: { field: 'createdTime' }, faultCode: { field: 'faultCode' } };
                let pColsMap = { expander: { field: null }, faultCode: { field: 'faultCode' }, 'createdTime': { field: 'createdTime' } };

                expect(dtComp.doColsMapsMatch(colsMap, pColsMap)).toBe(true);
            });

            it('columns and parent grid columns should not match', () => {
                let colsMap = { expander: { field: undefined }, createdTime: { field: 'createdTime' }, faultCode: { field: 'faultCode' } };
                let pColsMap = { expander: { field: undefined }, createdTime: { field: 'createdTime' }, faultDescription: { field: 'faultCode' } };

                expect(dtComp.doColsMapsMatch(colsMap, pColsMap)).toBe(false);
            });

            it('columns and parent grid columns should not match 2 (expander col is missing from pColsMap)', () => {
                let colsMap = { expander: { field: undefined }, createdTime: { field: 'createdTime' }, faultCode: { field: 'faultCode' } };
                let pColsMap = { createdTime: { field: 'createdTime' }, faultCode: { field: 'faultCode' } };

                expect(dtComp.doColsMapsMatch(colsMap, pColsMap)).toBe(false);
            });
        });


        describe('`isRowExpandable` method >> ', () => {

            it('should return true if row expandable indicator points to proeprty that has truthy value (and other requirements are met)', () => {
                dtComp.templateRefs[dtComp.GridTemplates.rowExpansion] = {};
                dtComp.expanderCol.rowExpandableIndicatorProperty = 'children';

                let rowData = { children: true };

                expect(dtComp.isRowExpandable(rowData)).toBe(true);
            });

            it('should return true if row expandable indicator points to non-empty array property (and other requirements are met)', () => {
                dtComp.templateRefs[dtComp.GridTemplates.rowExpansion] = {};
                dtComp.expanderCol.rowExpandableIndicatorProperty = 'children';

                let rowData = { children: [{}] };

                expect(dtComp.isRowExpandable(rowData)).toBe(true);
            });

            it('should return false if there is no expander column defined (even though other requirements are met)', () => {
                dtComp.templateRefs[dtComp.GridTemplates.rowExpansion] = {};
                dtComp.expanderCol = null;

                let rowData = { children: [{}] };

                expect(dtComp.isRowExpandable(rowData)).toBe(false);
            });

            it('should return false if there is no rowExpansion template provided (even though other requirements are met)', () => {
                dtComp.templateRefs[dtComp.GridTemplates.rowExpansion] = null;
                dtComp.expanderCol.rowExpandableIndicatorProperty = 'children';
                let rowData = { children: [{}] };

                expect(dtComp.isRowExpandable(rowData)).toBe(false);
            });

            it('should return false if row expandable indicator points to proeprty that has falsy value (even though other requirements are met)', () => {
                dtComp.templateRefs[dtComp.GridTemplates.rowExpansion] = {};
                dtComp.expanderCol.rowExpandableIndicatorProperty = 'children';

                let rowData = { children: 0 };

                expect(dtComp.isRowExpandable(rowData)).toBe(false);
            });

            it('should return false if row expandable indicator points to empty array property (even though other requirements are met)', () => {
                dtComp.templateRefs[dtComp.GridTemplates.rowExpansion] = {};
                dtComp.expanderCol.rowExpandableIndicatorProperty = 'children';

                let rowData = { children: [] };

                expect(dtComp.isRowExpandable(rowData)).toBe(false);
            });
        });


        describe('`toggleRow` method >> ', () => {

            it('should set row state to expanded', () => {
                let rowData: any = {};

                dtComp.toggleRow(rowData);

                expect(rowData.dtExpanded).toBe(true);
            });

            it('should set row state to collapsed', () => {
                let rowData: any = { dtExpanded: true };

                dtComp.toggleRow(rowData);

                expect(rowData.dtExpanded).toBe(false);
            });
        });


        describe('`sortColumn` method >> ', () => {

            let defaultSortCollator = new Intl.Collator(undefined, { sensitivity: 'accent', numeric: true });

            it('should set sort order to ascending if column was in not-ordered state (user initiated sort)', () => {
                dtComp.cols[1].metas.sortOrder.value = 0;

                spyOn(dtComp.gridData, 'sort').and.callFake(() => { }); // skip sorting, not needed for this test case

                dtComp.sortColumn(dtComp.cols[1], false);

                expect(dtComp.cols[1].metas.sortOrder.value).toBe(1);
            });

            it('should set sort order to ascending if previous sort order was descending for given column (user initiated sort)', () => {
                dtComp.cols[1].metas.sortOrder.value = -1;

                spyOn(dtComp.gridData, 'sort').and.callFake(() => { }); // skip sorting, not needed for this test case

                dtComp.sortColumn(dtComp.cols[1], false);

                expect(dtComp.cols[1].metas.sortOrder.value).toBe(1);
            });

            it('should set sort order to descending if previous sort order was ascending for given column (user initiated sort)', () => {
                dtComp.cols[1].metas.sortOrder.value = 1;

                spyOn(dtComp.gridData, 'sort').and.callFake(() => { }); // skip sorting, not needed for this test case

                dtComp.sortColumn(dtComp.cols[1], false);

                expect(dtComp.cols[1].metas.sortOrder.value).toBe(-1);
            });

            it('when column is sorted, all other columns should be set to not-ordered state', () => {
                let sortCol = dtComp.cols[1];

                dtComp.cols[2].metas.sortOrder.value = 1;

                spyOn(dtComp.gridData, 'sort').and.callFake(() => { }); // skip sorting, not needed for this test case

                dtComp.sortColumn(sortCol, false);

                expect(dtComp.cols[2].metas.sortOrder.value).toBe(0);
            });

            it('should call `storeMetasMap` method if saveSettings is enabled', () => {
                dtComp.saveSettings = true;

                spyOn(dtComp, 'storeMetasMap');
                spyOn(dtComp.gridData, 'sort').and.callFake(() => { }); // skip sorting, not needed for this test case

                dtComp.sortColumn(dtComp.cols[1], false);

                expect(dtComp.storeMetasMap).toHaveBeenCalledWith(true);
            });

            it('should sort an array of objects by string value (ascending order)', () => {
                let sortedtridData = [{ v: 'cg5', dtIndex: 0 }, { v: 'hg2', dtIndex: 1 }, { v: 'hg5', dtIndex: 2 }, { v: 'hh5', dtIndex: 3 }];
                let sortColumn = { field: 'v', metas: { sortOrder: { value: 1 } }, sortCollator: defaultSortCollator };

                dtComp.gridData = [{ v: 'hg2' }, { v: 'hh5' }, { v: 'cg5' }, { v: 'hg5' }];

                dtComp.sortColumn(sortColumn, true);

                expect(dtComp.gridData).toEqual(sortedtridData);
            });

            it('should sort an array of objects by string value (descending order)', () => {
                let sortedtridData = [{ v: 'hh5', dtIndex: 0 }, { v: 'hg5', dtIndex: 1 }, { v: 'hg2', dtIndex: 2 }, { v: 'cg5', dtIndex: 3 }];
                let sortColumn = { field: 'v', metas: { sortOrder: { value: -1 } }, sortCollator: defaultSortCollator };

                dtComp.gridData = [{ v: 'hg2' }, { v: 'hh5' }, { v: 'cg5' }, { v: 'hg5' }];

                dtComp.sortColumn(sortColumn, true);

                expect(dtComp.gridData).toEqual(sortedtridData);
            });

            it('should sort an array of objects by string value (case insensitivity test - all elements should keep their initial position (stable sort))', () => {
                let sortedtridData = [{ v: 'p', position: 0, dtIndex: 0 }, { v: 'P', position: 1, dtIndex: 1 }, { v: 'p', position: 2, dtIndex: 2 }];
                let sortColumn = { field: 'v', metas: { sortOrder: { value: 1 } }, sortCollator: defaultSortCollator };

                dtComp.gridData = [{ v: 'p', position: 0 }, { v: 'P', position: 1 }, { v: 'p', position: 2 }];

                dtComp.sortColumn(sortColumn, true);

                expect(dtComp.gridData).toEqual(sortedtridData);
            });

            it('should sort an array of objects by string value (interloper test - interloper (empty string) should be moved to first position)', () => {
                let sortedtridData = [{ v: '', dtIndex: 0 }, { v: 'cg5', dtIndex: 1 }, { v: 'hg5', dtIndex: 2 }, { v: 'hh5', dtIndex: 3 }];
                let sortColumn = { field: 'v', metas: { sortOrder: { value: 1 } }, sortCollator: defaultSortCollator };

                dtComp.gridData = [{ v: 'hh5' }, { v: '' }, { v: 'cg5' }, { v: 'hg5' }];

                dtComp.sortColumn(sortColumn, true);

                expect(dtComp.gridData).toEqual(sortedtridData);
            });

            it('should sort an array of objects by string value (interloper test - interloper (null) should be moved to first position)', () => {
                let sortedtridData = [{ v: null, dtIndex: 0 }, { v: 'cg5', dtIndex: 1 }, { v: 'hg5', dtIndex: 2 }, { v: 'hh5', dtIndex: 3 }];
                let sortColumn = { field: 'v', metas: { sortOrder: { value: 1 } }, sortCollator: defaultSortCollator };

                dtComp.gridData = [{ v: 'hh5' }, { v: null }, { v: 'cg5' }, { v: 'hg5' }];

                dtComp.sortColumn(sortColumn, true);

                expect(dtComp.gridData).toEqual(sortedtridData);
            });

            it('should sort an array of objects by string value (interloper test - interloper (undefined) should be moved to first position)', () => {
                let sortedtridData = [{ v: undefined, dtIndex: 0 }, { v: 'cg5', dtIndex: 1 }, { v: 'hg5', dtIndex: 2 }, { v: 'hh5', dtIndex: 3 }];
                let sortColumn = { field: 'v', metas: { sortOrder: { value: 1 } }, sortCollator: defaultSortCollator };

                dtComp.gridData = [{ v: 'hh5' }, { v: undefined }, { v: 'cg5' }, { v: 'hg5' }];

                dtComp.sortColumn(sortColumn, true);

                expect(dtComp.gridData).toEqual(sortedtridData);
            });

            it('should sort an array of objects by numeric value (ascending order)', () => {
                let sortedtridData = [{ v: 1, dtIndex: 0 }, { v: 5, dtIndex: 1 }, { v: 8, dtIndex: 2 }];
                let sortColumn = { field: 'v', metas: { sortOrder: { value: 1 } }, sortCollator: defaultSortCollator };

                dtComp.gridData = [{ v: 5 }, { v: 8 }, { v: 1 }];

                dtComp.sortColumn(sortColumn, true);

                expect(dtComp.gridData).toEqual(sortedtridData);
            });

            it('should sort an array of objects by numeric value (descending order)', () => {
                let sortedtridData = [{ v: 8, dtIndex: 0 }, { v: 5, dtIndex: 1 }, { v: 1, dtIndex: 2 }];
                let sortColumn = { field: 'v', metas: { sortOrder: { value: -1 } }, sortCollator: defaultSortCollator };

                dtComp.gridData = [{ v: 5 }, { v: 8 }, { v: 1 }];

                dtComp.sortColumn(sortColumn, true);

                expect(dtComp.gridData).toEqual(sortedtridData);
            });

            it('should not reorder array elements if all compared values are same (falsy values except 0 are treated the same)', () => {
                let sortedtridData = [{ v: '', position: 0, dtIndex: 0 }, { v: null, position: 1, dtIndex: 1 }, { v: undefined, position: 2, dtIndex: 2 }, { v: null, position: 3, dtIndex: 3 }];
                let sortColumn = { field: 'v', metas: { sortOrder: { value: 1 } }, sortCollator: defaultSortCollator };

                dtComp.gridData = [{ v: '', position: 0 }, { v: null, position: 1 }, { v: undefined, position: 2 }, { v: null, position: 3 },];

                dtComp.sortColumn(sortColumn, true);

                expect(dtComp.gridData).toEqual(sortedtridData);
            });
        });


        describe('`toggleColumnVisibility` method >> ', () => {

            it('should toggle column visibility state', () => {
                let targetedCol = dtComp.cols[1];
                targetedCol.metas.visibility.value = true;

                dtComp.toggleColumnVisibility(targetedCol);

                expect(targetedCol.metas.visibility.value).toBe(false);
            });

            it('should call `storeMetasMap` method if saveSettings is enabled', () => {
                let targetedCol = dtComp.cols[1];

                dtComp.saveSettings = true;

                spyOn(dtComp, 'storeMetasMap');

                dtComp.toggleColumnVisibility(targetedCol);

                expect(dtComp.storeMetasMap).toHaveBeenCalledWith(true);
            });
        });

        describe('`getStoredMetasMap` method >> ', () => {

            it('should return `null` if saveSettings Input parameter is falsy', () => {
                dtComp.saveSettings = false;

                expect(dtComp.getStoredMetasMap(true)).toBe(null);
            });

            it('should return `null` if settingsStorageKey Input parameter is falsy', () => {
                dtComp.settingsStorageKey = '';

                expect(dtComp.getStoredMetasMap(true)).toBe(null);
            });

            it('should call `_storageService.getAsync`', () => {
                spyOn(dtComp._storageService, 'getAsync');

                dtComp.getStoredMetasMap(true);

                expect(dtComp._storageService.getAsync).toHaveBeenCalledWith(dtComp.settingsStorageKey);
            });

            it('should call `_storageService.get`', () => {
                spyOn(dtComp._storageService, 'get');

                dtComp.getStoredMetasMap(false);

                expect(dtComp._storageService.get).toHaveBeenCalledWith(dtComp.settingsStorageKey);
            });
        });

        describe('`removeStoredMetasMap` method >> ', () => {

            it('should call `_storageService.removeAsync`', () => {
                spyOn(dtComp._storageService, 'removeAsync');

                dtComp.removeStoredMetasMap(true);

                expect(dtComp._storageService.removeAsync).toHaveBeenCalledWith(dtComp.settingsStorageKey);
            });

            it('should call `_storageService.remove`', () => {
                spyOn(dtComp._storageService, 'remove');

                dtComp.removeStoredMetasMap(false);

                expect(dtComp._storageService.remove).toHaveBeenCalledWith(dtComp.settingsStorageKey);
            });
        });

        describe('`storeMetasMap` method >> ', () => {

            it('should call `_storageService.setAsync` with constructed metasMapToStore object', () => {
                spyOn(dtComp._storageService, 'setAsync');

                dtComp.storeMetasMap(true);

                expect(dtComp._storageService.setAsync).toHaveBeenCalledWith(dtComp.settingsStorageKey, jasmine.any(Object));
            });

            it('should call `_storageService.set` with constructed metasMapToStore object', () => {
                spyOn(dtComp._storageService, 'set');

                dtComp.storeMetasMap(false);

                expect(dtComp._storageService.set).toHaveBeenCalledWith(dtComp.settingsStorageKey, jasmine.any(Object));
            });
        });


        describe('`handleColDragging` method >> ', () => {

            let dragColIdx = 2;
            let headCellNodeList;
            let dragCol, dragCellElem, draggedCellElemViewportOffset;

            let mousedownEvent, mousemoveEvent, mouseupEvent;

            beforeEach(() => {
                dragCol = dtComp.cols[dragColIdx];

                headCellNodeList = dtComp.dtHeadRef.nativeElement.querySelectorAll('.dt-cell');
                dragCellElem = headCellNodeList[dragColIdx];
                draggedCellElemViewportOffset = dragCellElem.getBoundingClientRect();

                mousedownEvent = document.createEvent("HTMLEvents");
                mousedownEvent.initEvent("mousedown", false, true);

                mousemoveEvent = document.createEvent("HTMLEvents");
                mousemoveEvent.initEvent("mousemove", false, true);

                mouseupEvent = document.createEvent("HTMLEvents");
                mouseupEvent.initEvent("mouseup", false, true);

                mousedownEvent.clientX = draggedCellElemViewportOffset.left + (parseFloat(getComputedStyle(dragCellElem).width) / 2);

                dtComp._changeDetectorRef.detectChanges = () => {};
            });


            it('`dragCol.dragged` should be set to true', async(() => {
                dragCellElem.dispatchEvent(mousedownEvent);

                expect(dragCol.dragged).toBe(true);
            }));


            it('should clone dragged cell elem', async(() => {
                dragCellElem.dispatchEvent(mousedownEvent);

                let newHeadCellNodeList = dtComp.dtHeadRef.nativeElement.querySelectorAll('.dt-cell');

                expect(newHeadCellNodeList.length).toBe(headCellNodeList.length  + 1);
                expect(newHeadCellNodeList[newHeadCellNodeList.length - 1].textContent).toBe(dragCellElem.textContent);
            }));


            it('should swap dragged col with the last one in order', async(() => {
                let swapColIdx = dtComp.cols.length - 1;
                let swapCol = dtComp.cols[swapColIdx];
                let swapCellElem = headCellNodeList[swapColIdx];
                let swapCellElemViewportOffset = swapCellElem.getBoundingClientRect();

                mousemoveEvent.clientX = swapCellElemViewportOffset.left + (parseFloat(getComputedStyle(swapCellElem).width) / 2) + 10; // add 10px so it can pass half of the cell elem's computed width

                dragCellElem.dispatchEvent(mousedownEvent);

                document.documentElement.dispatchEvent(mousemoveEvent);
                document.documentElement.dispatchEvent(mouseupEvent);

                hostCompFixture.whenStable().then(() => {
                    expect(dtComp.cols.indexOf(dragCol)).not.toBe(dragColIdx); // not as initial
                    expect(dtComp.cols.indexOf(dragCol)).toBe(swapColIdx); // should take index of the column next to it
                });

            }));

            it('should swap dragged col with the prior one in order', async(() => {
                let swapColIdx = dragColIdx - 1;
                let swapCol = dtComp.cols[swapColIdx];
                let swapCellElem = headCellNodeList[swapColIdx];
                let swapCellElemViewportOffset = swapCellElem.getBoundingClientRect();

                mousemoveEvent.clientX = (swapCellElemViewportOffset.left + (parseFloat(getComputedStyle(swapCellElem).width) / 2)) - 10; // subtract 10px so it can pass half of the cell elem's computed width

                dragCellElem.dispatchEvent(mousedownEvent);

                document.documentElement.dispatchEvent(mousemoveEvent);
                document.documentElement.dispatchEvent(mouseupEvent);

                hostCompFixture.whenStable().then(() => {
                    expect(dtComp.cols.indexOf(dragCol)).not.toBe(dragColIdx); // not as initial
                    expect(dtComp.cols.indexOf(dragCol)).toBe(swapColIdx); // should take index of the column Prior to it
                });

            }));

            it('expander col should not be swappable, instead, swap the dragged col with the first swappable one ', async(() => {
                let expanderColIdx = dtComp.cols.indexOf(dtComp.expanderCol);
                let expanderCol = dtComp.cols[expanderColIdx];
                let expanderCellElem = headCellNodeList[expanderColIdx];
                let expanderCellElemViewportOffset = expanderCellElem.getBoundingClientRect();

                mousemoveEvent.clientX = (expanderCellElemViewportOffset.left + (parseFloat(getComputedStyle(expanderCellElem).width) / 2)) - 10; // subtract 10px so it can pass half of the cell elem's computed width

                dragCellElem.dispatchEvent(mousedownEvent);

                document.documentElement.dispatchEvent(mousemoveEvent);
                document.documentElement.dispatchEvent(mouseupEvent);

                hostCompFixture.whenStable().then(() => {
                    expect(dtComp.cols.indexOf(dragCol)).toBe(expanderColIdx + 1); // not the expander itself
                });

            }));
        });


        describe('`resolveFieldValue` method >> ', () => {

            let srcObject = {
                a: {
                    prop1: 'a-prop1-value',
                    prop2: null,
                    prop3: false
                },
                b: [
                    {
                        prop1: 'b-prop1-value',
                        prop2: '',
                        prop3: {
                            'prop3_1': NaN,
                            'prop3_2': 0
                        }
                    }
                ]
            };

            let srcArray = [
                {
                    prop1: 'a-prop1-value',
                    prop2: null,
                    prop3: [
                        null,
                        'prop3-value'
                    ]
                }
            ];

            describe('invalid params >> ', () => {

                it('invalid params - case 1', () => {
                    let field = 'a.prop1';
                    let expectedValue = '';

                    expect(dtComp.resolveFieldValue(null, field)).toBe(expectedValue);
                });

                it('invalid params - case 2', () => {
                    let field = 'a.prop1';
                    let expectedValue = '';

                    expect(dtComp.resolveFieldValue(true, field)).toBe(expectedValue);
                });

                it('invalid params - case 3', () => {
                    let field = null;
                    let expectedValue = '';

                    expect(dtComp.resolveFieldValue(srcObject, field)).toBe(expectedValue);
                });

                it('invalid params - case 4', () => {
                    let field = 0;
                    let expectedValue = '';

                    expect(dtComp.resolveFieldValue(srcObject, field)).toBe(expectedValue);
                });

                it('invalid params - case 5', () => {
                    let field = '';
                    let expectedValue = '';

                    expect(dtComp.resolveFieldValue(srcObject, field)).toBe(expectedValue);
                });

                it('invalid params - case 6', () => {
                    let field = NaN;
                    let expectedValue = '';

                    expect(dtComp.resolveFieldValue(srcObject, field)).toBe(expectedValue);
                });

                it('invalid params - case 7', () => {
                    let field = {};
                    let expectedValue = '';

                    expect(dtComp.resolveFieldValue(srcObject, field)).toBe(expectedValue);
                });

                it('invalid params - case 8', () => {
                    let field = true;
                    let expectedValue = '';

                    expect(dtComp.resolveFieldValue(srcObject, field)).toBe(expectedValue);
                });
            });


            describe('invalid path >> ', () => {

                it('invalid path - case 1', () => {
                    let field = '.a.prop1';
                    let expectedValue = 'a-prop1-value';

                    expect(dtComp.resolveFieldValue(srcObject, field)).toBe(expectedValue);
                });

                it('invalid path - case 2', () => {
                    let field = 'a.prop1.';
                    let expectedValue = '';

                    expect(dtComp.resolveFieldValue(srcObject, field)).toBe(expectedValue);
                });

                it('invalid path - case 3', () => {
                    let field = 'a..prop1.';
                    let expectedValue = '';

                    expect(dtComp.resolveFieldValue(srcObject, field)).toBe(expectedValue);
                });

                it('invalid path - case 4', () => {
                    let field = 'a.prop1.';
                    let expectedValue = '';

                    expect(dtComp.resolveFieldValue(srcObject, field)).toBe(expectedValue);
                });

                it('invalid path - case 5', () => {
                    let field = 'b[].prop1';
                    let expectedValue = '';

                    expect(dtComp.resolveFieldValue(srcObject, field)).toBe(expectedValue);
                });

                it('invalid path - case 6', () => {
                    let field = 'b[.prop1';
                    let expectedValue = '';

                    expect(dtComp.resolveFieldValue(srcObject, field)).toBe(expectedValue);
                });

                it('invalid path - case 7', () => {
                    let field = 'b[0]prop1';
                    let expectedValue = '';

                    expect(dtComp.resolveFieldValue(srcObject, field)).toBe(expectedValue);
                });

                it('invalid path - case 8', () => {
                    let field = 'b[99].prop1';
                    let expectedValue = '';

                    expect(dtComp.resolveFieldValue(srcObject, field)).toBe(expectedValue);
                });

                it('invalid path - case 9 (array as src)', () => {
                    let field = '[0]prop1';
                    let expectedValue = '';

                    expect(dtComp.resolveFieldValue(srcArray, field)).toBe(expectedValue);
                });

                it('invalid path - case 10 (array as src)', () => {
                    let field = '[]prop1';
                    let expectedValue = '';

                    expect(dtComp.resolveFieldValue(srcArray, field)).toBe(expectedValue);
                });
            });


            describe('non existing props >> ', () => {

                it('non existing props - case 1', () => {
                    let field = 'a.prop2.nonExistingProp';
                    let expectedValue = '';

                    expect(dtComp.resolveFieldValue(srcObject, field)).toBe(expectedValue);
                });

                it('non existing props - case 2', () => {
                    let field = 'b[0].prop3.prop3_1.nonExistingProp1.nonExistingProp2';
                    let expectedValue = '';

                    expect(dtComp.resolveFieldValue(srcObject, field)).toBe(expectedValue);
                });
            });


            describe('existing props >> ', () => {

                it('existing props - case 1', () => {
                    let field = 'a.prop1';
                    let expectedValue = 'a-prop1-value';

                    expect(dtComp.resolveFieldValue(srcObject, field)).toBe(expectedValue);
                });

                it('existing props - case 2', () => {
                    let field = 'a.prop2';
                    let expectedValue = '';

                    expect(dtComp.resolveFieldValue(srcObject, field)).toBe(expectedValue);
                });

                it('existing props - case 3', () => {
                    let field = 'a.prop3';
                    let expectedValue = 'false';

                    expect(dtComp.resolveFieldValue(srcObject, field)).toBe(expectedValue);
                });

                it('existing props - case 4', () => {
                    let field = 'b[0].prop3.prop3_1';
                    let expectedValue = '';

                    expect(dtComp.resolveFieldValue(srcObject, field)).toBe(expectedValue);
                });

                it('existing props - case 5', () => {
                    let field = 'b[0].prop3.prop3_2';
                    let expectedValue = '0';

                    expect(dtComp.resolveFieldValue(srcObject, field)).toBe(expectedValue);
                });

                it('existing props - case 6', () => {
                    let field = 'b[0].prop1.length';
                    let expectedValue = '13';

                    expect(dtComp.resolveFieldValue(srcObject, field)).toBe(expectedValue);
                });

                it('existing props - case 7 (array as src)', () => {
                    let field = '[0].prop3[1]';
                    let expectedValue = 'prop3-value';

                    expect(dtComp.resolveFieldValue(srcArray, field)).toBe(expectedValue);
                });

                it('existing props - case 8 (array as src)', () => {
                    let field = '[0].prop3.length';
                    let expectedValue = '2';

                    expect(dtComp.resolveFieldValue(srcArray, field)).toBe(expectedValue);
                });


            });


        });
    });
});