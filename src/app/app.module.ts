import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

 import { ShowcaseDatatableModule } from './showcase-datatable/showcase-datatable.module';

import { AppComponent } from './app.component';

import { routes } from './app-routes.const';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpModule,
    BrowserModule,
    RouterModule.forRoot(routes, {useHash: true}),
    ShowcaseDatatableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
