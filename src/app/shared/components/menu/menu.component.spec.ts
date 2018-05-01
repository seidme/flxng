import { async, TestBed, ComponentFixture, inject, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, QueryList, Component, ViewChild, OnInit, TemplateRef, EventEmitter } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MenuComponent } from './menu.component';


@Component({
    selector: 'cp-menuHostComponent',
    template: `
        <cp-menu #testMenu [headAlignment]="headAlignmentParam" [bodyAlignment]="bodyAlignmentParam" [header]="'test'" (onToggle)="onMenuToggle($event)" [templateRefs]="" [bodyStyle]="{border: 'none'}">
            <ng-template cpTemplate="menuHead" let-props="props">
                <button (click)="testMenu.toggle();">...</button>
            </ng-template>

            <ul>
                <li>item 1</li>
                <li>item 2</li>
            </ul>
        </cp-menu>
    `,
    styles: [':host { width: 900px; height: 900px; }']
})
class MenuHostComponent {

    @ViewChild(MenuComponent) menuCompRef: MenuComponent;

    menuOpened: boolean = false;

    headAlignmentParam = '';
    bodyAlignmentParam = '';

    constructor() { }

    onMenuToggle(opened: boolean): void {
        this.menuOpened = opened;
    }
}



describe('MenuComponent (MenuHostComponent) >> ', () => {

    let compileAndCreateComponents = (): ComponentFixture<MenuHostComponent> => {
        TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule
            ],
            declarations: [
                MenuHostComponent,
                MenuComponent
            ],
            providers: []
        }).compileComponents();  // compile template and css

        return TestBed.createComponent(MenuHostComponent);
    };


    describe('Without detecting changes >> ', () => {
        let hostCompFixture: ComponentFixture<MenuHostComponent>;
        let menuComp: any;

        beforeEach(async(() => {
            hostCompFixture = compileAndCreateComponents();
        }));

        beforeEach(() => {
            menuComp = <MenuComponent>hostCompFixture.debugElement.children[0].componentInstance;
        });


        describe('Component members default initializations >> ', () => {

            it('@Input() Boolean member `bodyAlignment` should be initialized as empty string', () => {
                expect(menuComp.bodyAlignment).toBe('');
            });

            it('@Input() Boolean member `headAlignment` should be initialized as empty string', () => {
                expect(menuComp.headAlignment).toBe('');
            });

            it('@Input() Boolean member `bodyStyle` should be initialized as empty object', () => {
                expect(menuComp.bodyStyle).toEqual({});
            });

            it('@Input() Boolean member `header` should be initialized as empty string', () => {
                expect(menuComp.header).toBe('');
            });

            it('@Input() Boolean member `templateRefs` should be initialized as empty object', () => {
                expect(menuComp.templateRefs).toEqual({});
            });

            it('@Output() EventEmitter member `onToggle` should be defined', () => {
                expect(menuComp.onToggle instanceof EventEmitter).toBe(true);
            });

            it('`props` member should be initialized as object containing the `opened` property initialized with `false` ', () => {
                expect(typeof menuComp.props === 'object').toBe(true);
                expect(menuComp.props.opened).toBe(false);
            });

        });
    });


    describe('After detecting initial changes >> ', () => {
        let hostCompFixture: ComponentFixture<MenuHostComponent>;
        let hostComp: MenuHostComponent;
        let menuComp: any;

        beforeEach(async(() => {
            hostCompFixture = compileAndCreateComponents();
            hostCompFixture.detectChanges();
        }));

        beforeEach(() => {
            hostComp =  hostCompFixture.componentInstance;
            menuComp = <MenuComponent>hostCompFixture.debugElement.children[0].componentInstance;
        });


        describe('`ngOnInit` Lifecycle Hook >> ', () => {

            it('should call `checkInputParamsValidity` method', () => {
                spyOn(menuComp, 'checkInputParamsValidity');
                menuComp.ngOnInit();

                expect(menuComp.checkInputParamsValidity).toHaveBeenCalled();
            });
        });

        describe('`ngAfterContentInit` Lifecycle Hook >> ', () => {

            it('should call `checkInputParamsValidity` method', () => {
                spyOn(menuComp, 'collectTemplateRefs');
                menuComp.ngAfterContentInit();

                expect(menuComp.collectTemplateRefs).toHaveBeenCalled();
            });

            it('menuComp.templateRefs.menuHead template should be defined and applied (there is ng-template for menu head provided', () => {
                spyOn(menuComp, 'collectTemplateRefs');
                menuComp.ngAfterContentInit();

                expect(menuComp.collectTemplateRefs).toHaveBeenCalled();
            });
        });

        describe('`open` method >> ', () => {
            let headElemComputedStyle

            beforeEach(() => {
                headElemComputedStyle = getComputedStyle(menuComp.headRef.nativeElement);
            });

            it('`open` method should be defined', () => {
                expect(typeof menuComp.open === 'function').toBe(true);
            });

            it('Positioning the body element based on the alignment input params. Case 1 (defaults)', () => {
                hostComp.headAlignmentParam = '';
                hostComp.bodyAlignmentParam = '';
                hostCompFixture.detectChanges();

                menuComp.open();

                expect(menuComp.bodyStyle['top']).toEqual(undefined);
                expect(menuComp.bodyStyle['bottom']).toEqual(undefined);
                expect(menuComp.bodyStyle['left']).toEqual(undefined);
                expect(menuComp.bodyStyle['right']).toEqual(undefined);
            });

            it('Positioning the body element based on the alignment input params. Case 2 (defaults)', () => {
                hostComp.headAlignmentParam = 'bottom left';
                hostComp.bodyAlignmentParam = 'top left';
                hostCompFixture.detectChanges();

                menuComp.open();

                expect(menuComp.bodyStyle['top']).toEqual(undefined);
                expect(menuComp.bodyStyle['bottom']).toEqual(undefined);
                expect(menuComp.bodyStyle['left']).toEqual(undefined);
                expect(menuComp.bodyStyle['right']).toEqual(undefined);
            });

            it('Positioning the body element based on the alignment input params. Horizontal alignment variant 1 (defualt)', () => {
                hostComp.headAlignmentParam = 'left';
                hostComp.bodyAlignmentParam = 'left';
                hostCompFixture.detectChanges();

                menuComp.open();

                expect(menuComp.bodyStyle['top']).toEqual(undefined);
                expect(menuComp.bodyStyle['bottom']).toEqual(undefined);
                expect(menuComp.bodyStyle['left']).toEqual(undefined);
                expect(menuComp.bodyStyle['right']).toEqual(undefined);
            });

            it('Positioning the body element based on the alignment input params. Horizontal alignment variant 2', () => {
                hostComp.headAlignmentParam = 'right';
                hostComp.bodyAlignmentParam = 'right';
                hostCompFixture.detectChanges();

                menuComp.open();

                expect(menuComp.bodyStyle['top']).toEqual(undefined);
                expect(menuComp.bodyStyle['bottom']).toEqual(undefined);
                expect(menuComp.bodyStyle['left']).toEqual(undefined);
                expect(menuComp.bodyStyle['right']).toEqual('0px');
            });

            it('Positioning the body element based on the alignment input params. Horizontal alignment variant 3', () => {
                hostComp.headAlignmentParam = 'right';
                hostComp.bodyAlignmentParam = 'left';
                hostCompFixture.detectChanges();

                menuComp.open();

                expect(menuComp.bodyStyle['top']).toEqual(undefined);
                expect(menuComp.bodyStyle['bottom']).toEqual(undefined);
                expect(menuComp.bodyStyle['left']).toEqual(headElemComputedStyle.width);
                expect(menuComp.bodyStyle['right']).toEqual(undefined);
            });

            it('Positioning the body element based on the alignment input params. Horizontal alignment variant 4', () => {
                hostComp.headAlignmentParam = 'left';
                hostComp.bodyAlignmentParam = 'right';
                hostCompFixture.detectChanges();

                menuComp.open();

                expect(menuComp.bodyStyle['top']).toEqual(undefined);
                expect(menuComp.bodyStyle['bottom']).toEqual(undefined);
                expect(menuComp.bodyStyle['left']).toEqual(undefined);
                expect(menuComp.bodyStyle['right']).toEqual(headElemComputedStyle.width);
            });

            it('Positioning the body element based on the alignment input params. Vertical alignment variant 1 (default)', () => {
                hostComp.headAlignmentParam = 'bottom';
                hostComp.bodyAlignmentParam = 'top';
                hostCompFixture.detectChanges();

                menuComp.open();

                expect(menuComp.bodyStyle['top']).toEqual(undefined);
                expect(menuComp.bodyStyle['bottom']).toEqual(undefined);
                expect(menuComp.bodyStyle['left']).toEqual(undefined);
                expect(menuComp.bodyStyle['right']).toEqual(undefined);
            });

            it('Positioning the body element based on the alignment input params. Vertical alignment variant 2', () => {
                hostComp.headAlignmentParam = 'top';
                hostComp.bodyAlignmentParam = 'top';
                hostCompFixture.detectChanges();

                menuComp.open();

                expect(menuComp.bodyStyle['top']).toEqual('0px');
                expect(menuComp.bodyStyle['bottom']).toEqual(undefined);
                expect(menuComp.bodyStyle['left']).toEqual(undefined);
                expect(menuComp.bodyStyle['right']).toEqual(undefined);
            });

            it('Positioning the body element based on the alignment input params. Vertical alignment variant 3', () => {
                hostComp.headAlignmentParam = 'top';
                hostComp.bodyAlignmentParam = 'bottom';
                hostCompFixture.detectChanges();

                menuComp.open();

                expect(menuComp.bodyStyle['top']).toEqual(undefined);
                expect(menuComp.bodyStyle['bottom']).toEqual(headElemComputedStyle.height);
                expect(menuComp.bodyStyle['left']).toEqual(undefined);
                expect(menuComp.bodyStyle['right']).toEqual(undefined);
            });

            it('Positioning the body element based on the alignment input params. Vertical alignment variant 4', () => {
                hostComp.headAlignmentParam = 'bottom';
                hostComp.bodyAlignmentParam = 'bottom';
                hostCompFixture.detectChanges();

                menuComp.open();

                expect(menuComp.bodyStyle['top']).toEqual(undefined);
                expect(menuComp.bodyStyle['bottom']).toEqual('0px');
                expect(menuComp.bodyStyle['left']).toEqual(undefined);
                expect(menuComp.bodyStyle['right']).toEqual(undefined);
            });


            it('should set props.opened property to true', () => {
                menuComp.open();

                expect(menuComp.props.opened).toEqual(true);
            });

            it('should emit onToggle event (and store the passed boolean value to host component)', () => {
                menuComp.open();

                expect(hostComp.menuOpened).toEqual(true);
            });
        });


        describe('`close` method >> ', () => {

            it('should set props.opened property to true', () => {
                menuComp.props.opened = true;

                menuComp.close();

                expect(menuComp.props.opened).toEqual(false);
            });


            it('should emit onToggle event (and store the passed boolean value to host component)', () => {
                menuComp.props.opened = true;

                menuComp.close();

                expect(hostComp.menuOpened).toEqual(false);
            });
        });

       describe('`toggle` method >> ', () => {

            it('should open menu if closed', () => {
                menuComp.props.opened = false;
                spyOn(menuComp, 'open');

                menuComp.toggle();

                expect(menuComp.open).toHaveBeenCalled();
            });


            it('should close menu if opened', () => {
                menuComp.props.opened = true;
                spyOn(menuComp, 'close');

                menuComp.toggle();

                expect(menuComp.close).toHaveBeenCalled();
            });
        });


    });
});