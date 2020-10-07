import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { ShowcaseModule } from './showcase/showcase.module';
import { ShowcaseTreetableModule } from './showcase-treetable/showcase-treetable.module';
import { ShowcaseCircleTimerModule } from './showcase-circle-timer/showcase-circle-timer.module';

import { AppComponent } from './app.component';

import { routes } from './app-routes.const';

@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpClientModule,
    BrowserModule,
    RouterModule.forRoot(routes, { useHash: true }),
    ShowcaseModule,
    ShowcaseTreetableModule,
    ShowcaseCircleTimerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
