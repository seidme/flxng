import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FlxTabsComponent } from './flx-tabs.component';

// import { routes } from './flx-tabs-routes.const';

@NgModule({
  imports: [
    HttpClientModule,
    BrowserModule,
    RouterModule,
    
  ],
  declarations: [
    FlxTabsComponent
  ],
  exports: [
    FlxTabsComponent
  ]
})
export class TabsModule { }
