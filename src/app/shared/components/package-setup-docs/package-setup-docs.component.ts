import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-package-setup-docs',
  templateUrl: './package-setup-docs.component.html',
  styleUrls: ['./package-setup-docs.component.scss'],
})
export class PackageSetupDocsComponent implements OnInit {
  @Input() package = 'circle-timer';
  @Input() packageName = 'CircleTimer';

  importingModuleDemoCode = ``;

  constructor() {}

  ngOnInit() {
    this.importingModuleDemoCode = `
    import { ${this.packageName}Module } from '@flxng/${this.package}';

    @NgModule({
      imports: [${this.packageName}Module],
      declarations: [],
    })
    export class DemoModule {}
    `;
  }
}
