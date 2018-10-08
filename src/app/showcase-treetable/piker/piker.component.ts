import { Component, OnInit } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpRequest,
  HttpParams,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { map, catchError, retry, tap } from 'rxjs/operators';

import { ShowcaseTreetableService, Log } from '../showcase-treetable.service';

@Component({
  selector: '',
  templateUrl: './piker.component.html',
  styleUrls: ['./piker.component.scss']
})
export class PikerComponent implements OnInit {
  logs: Log[];

  items: any[];
  apiFilterValue: string = '';

  content: any;

  constructor(
    private _http: HttpClient,
    private _service: ShowcaseTreetableService
  ) {}

  ngOnInit(): void {}

  //   geeet() {
  //     return this._service.getGhFileContent("https://raw.githubusercontent.com/primefaces/primeng/master/src/app/showcase/components/treetable/datatablesortdemo.ts").subscribe(
  //       c => {
  //         console.log(c);
  //         this.content = c;
  //       },
  //       error => {
  //         console.log('error: ', error);
  //       });
  //   }

  getFilterItems(filter: string): void {
    const url = 'http://localhost:50056/api/items';

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');

    const opts: any = {
      responseType: 'json',
      observe: 'response',
      headers: headers,
      params: {
        filter: filter
      }
    };

    this._http
      .get(url, opts)
      .pipe(
        map((response: any) => {
          //   return response.body.map(item =>
          //     Object.assign(item, item.parsedDetails)
          //   );

          return response.body;
        }),
        catchError(error => throwError(error))
      )
      .toPromise()
      .then(
        (items: any[]) => {
          //console.log("items: ", items);
          this.items = items;
        },
        error => {
          console.error('Error getting items:', error);
        }
      );
  }
}
