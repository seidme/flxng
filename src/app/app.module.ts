import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

 import { ShowcaseDatatableModule } from './showcase-datatable/showcase-datatable.module';

import { AppComponent } from './app.component';

import { routes } from './app-routes.const';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    RouterModule.forRoot(routes, {useHash: true}),
    ShowcaseDatatableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
