import { async, TestBed, ComponentFixture, inject, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, QueryList, Component, ViewChild, OnInit, TemplateRef } from '@angular/core';

import { TreetableComponent } from '../treetable.component';
import { ColumnComponent } from './column.component';
import { TemplateDirective } from '../../../../shared/directives/template.directive';

import { ColumnTemplates } from '../shared/constants';


class TreetableComponentMock {
    toggleColumnVisibility(col: ColumnComponent) { };
    sortColumn(col: ColumnComponent, autoSorting: boolean = false) { }
}



describe('ColumnComponent >> ', () => {

    let compileAndCreateComponents = (): ComponentFixture<ColumnComponent> => {
        TestBed.configureTestingModule({
            declarations: [
                ColumnComponent
            ],
            providers: [
                { provide: TreetableComponent, useClass: TreetableComponentMock }
            ]
        }).compileComponents();  // compile template and css

        return TestBed.createComponent(ColumnComponent);
    };


    describe('Without detecting changes >> ', () => {
        let fixture: ComponentFixture<ColumnComponent>;
        let comp: any;

        beforeEach(async(() => {
            fixture = compileAndCreateComponents();
        }));

        beforeEach(() => {
            comp = <ColumnComponent>fixture.debugElement.componentInstance;
        });


        describe('Component Input members declarations >> ', () => {

            it('@Input() String member `header` should be declared', () => {
                expect(comp.hasOwnProperty('header')).toBe(true);
            });

            it('@Input() Boolean member `expander` should be declared', () => {
                expect(comp.hasOwnProperty('expander')).toBe(true);
            });

            it('@Input() Boolean member `sortable` should be declared', () => {
                expect(comp.hasOwnProperty('sortable')).toBe(true);
            });

            it('@Input() Object member `templateRefs` should be declared', () => {
                expect(comp.hasOwnProperty('templateRefs')).toBe(true);
            });

            it('@Input() String member `rowExpandableIndicatorProperty` should be declared', () => {
                expect(comp.hasOwnProperty('rowExpandableIndicatorProperty')).toBe(true);
            });

        });


        describe('Component members default initializations >> ', () => {

            it('@Input() String | Array member `field` should not be initialized', () => {
                expect(comp.field).toBe(undefined);
            });

            it('@Input() String member `header` should be initialized with empty string', () => {
                expect(comp.header).toBe('');
            });

            it('@Input() Boolean member `expander` should be initialized with `false`', () => {
                expect(comp.expander).toBe(false);
            });

            it('@Input() Boolean member `sortable` should be initialized with `true`', () => {
                expect(comp.sortable).toBe(true);
            });

            it('@Input() Function member `sortComparator` should not be initialized', () => {
                expect(comp.sortComparator).toBe(undefined);
            });

            it('@Input() String member `rowExpandableIndicatorProperty` should be initialized as empty string', () => {
                expect(comp.rowExpandableIndicatorProperty).toEqual('');
            });

            it('`metas` member should be initialized', () => {
                expect(comp.metas).toEqual(jasmine.any(Object));
            });

            it('`metas.width` String property should be initialized as object containing the `value` property initialized as empty string', () => {
                expect(typeof comp.metas.width === 'object').toBe(true);
                expect(comp.metas.width.value).toBe('');
            });

            it('`metas.visibility` Boolean property should be initialized as object containing the `value` property initialized with `true`', () => {
                expect(typeof comp.metas.visibility === 'object').toBe(true);
                expect(comp.metas.visibility.value).toBe(true);
            });

            it('`metas.sortOrder` member should be initialized as object containing the `value` property initialized with `0`', () => {
                expect(typeof comp.metas.sortOrder === 'object').toBe(true);
                expect(comp.metas.sortOrder.value).toEqual(0);
            });
        });


    });

});