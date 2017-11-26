import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ShowcaseDatatableService } from "../../../showcase-datatable.service";

@Component({
    templateUrl: "./overview-tab2.component.html",
    styleUrls: ["./overview-tab2.component.scss"]
})
export class OverviewTab2Component implements OnInit {
    
    content: any;
    
    constructor(private _service: ShowcaseDatatableService) {
        console.log("Tab 2 loaded");
    }

    ngOnInit(): void {
        this.getContent();
     };

    getContent() {        
        return this._service
            .getGhFileContent(
                "https://raw.githubusercontent.com/primefaces/primeng/master/src/app/showcase/components/datatable/datatablesortdemo.ts"
            )
            .subscribe(
                c => {
                    // console.log(c);        
                    this.content = c;
                },
                error => {
                    console.log("error: ", error);
                }
            );
    }
}
