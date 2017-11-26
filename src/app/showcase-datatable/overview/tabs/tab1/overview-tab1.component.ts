import { Component, OnInit, Input } from "@angular/core";

@Component({
    templateUrl: "./overview-tab1.component.html",
    styleUrls: ["./overview-tab1.component.scss"]
})
    
export class OverviewTab1Component {

    public content: any;

    @Input() data: Array<any>;
    

    constructor() {

        console.log("Tab 1 loaded", this.data);
    }



}
