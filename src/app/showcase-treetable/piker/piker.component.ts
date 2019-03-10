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

declare var window: any;

@Component({
  selector: '',
  templateUrl: './piker.component.html',
  styleUrls: ['./piker.component.scss']
})
export class PikerComponent implements OnInit {
  items: Array<{ [key: string]: any }> = [];

  filters: Array<{ [key: string]: any }> = [];

  suggestionsInput = '';

  readonly operators: Array<{ [key: string]: any }> = [
    {
      id: 'EQUALS',
      name: 'equals to', // combos: or
      placeholder: 'E.g: Sarajevo - Centar || Ilidza'
    },
    {
      id: 'NOT_EQUALS',
      name: 'not equals to', // combos: and
      placeholder: 'E.g: Vogosca && Hadzici'
    },
    {
      id: 'CONTAINS',
      name: 'contains', // combos: or
      placeholder: 'E.g: Tit || Hamze || Vraz'
    },
    {
      id: 'NOT_CONTAINS',
      name: 'not contains', // combos: and
      placeholder: 'E.g: IZDAVANJE && najam'
    }
    // {
    //   id: 5,
    //   name: 'starts with'
    // },
    // {
    //   id: 6,
    //   name: 'ends with'
    // },
    // {
    //   id: 7,
    //   name: 'greater than'
    // },
    // {
    //   id: 8,
    //   name: 'lower than'
    // }
  ];

  constructor(
    private _http: HttpClient,
    private _service: ShowcaseTreetableService
  ) {}

  ngOnInit(): void {}

  searchItems(): void {
    // console.log('search items..:', this.filters);
    const origin = window.location.protocol + '//' + window.location.host;

    let reqUrl: string;
    if (window.location.hostname === 'localhost') {
      reqUrl = 'https://localhost:5001' + '/api/items';
    } else {
      reqUrl = '/api/items';
    }

    const reqBody = this.filters;

    let headers = new HttpHeaders();
    //headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');

    const reqOpts: any = {
      responseType: 'json',
      observe: 'response',
      headers: headers,
      params: {}
    };

    this._http
      .post(reqUrl, reqBody, reqOpts)
      .pipe(
        map((response: any) => {
          return response.body.map(item =>
            Object.assign(item, item.parsedDetails)
          );

          //return response.body;
        }),
        catchError(error => throwError(error))
      )
      .toPromise()
      .then(
        (items: any[]) => {
          console.log('response items: ', items);
          this.items = items;
        },
        error => {
          console.error('Error getting items:', error);
        }
      );
  }

  getOperator(operatorId: string): { [key: string]: any } {
    const operator = this.operators.find(o => o.id === operatorId);
    return operator;
  }

  addNewFilter(): void {
    this.filters.push({
      fieldId: '',
      operatorId: 0,
      value: '',
      caseSensitive: false
    });
  }

  applyPredefinedFilters(): void {
    this.filters = [
      {
        fieldId: '2', // location
        operatorId: 'EQUALS',
        value: 'Sarajevo - Centar || Sarajevo - Centar',
        caseSensitive: true
      },
      // {
      //   fieldId: '2', // location
      //   operatorId: 'NOT_EQUALS',
      //   value: 'Dobrinja && Hadzici',
      //   caseSensitive: true
      // },
      {
        fieldId: '3', // address
        operatorId: 'CONTAINS',
        value: 'Tit || Hamze || Vraz',
        caseSensitive: false
      },
      {
        fieldId: '0', // title
        operatorId: 'NOT_CONTAINS',
        value: 'IZDAVANJE && najam',
        caseSensitive: true
      }
    ];
  }

  // test(): void {
  //   let reqUrl = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json';

  //   let headers = new HttpHeaders();
  //   //headers = headers.append('Content-Type', 'application/json');
  //   headers = headers.append('Accept', 'application/json');

  //   const reqOpts: any = {
  //     responseType: 'json',
  //     observe: 'response',
  //     headers: headers,
  //     params: {
  //       input: 'vrazova',
  //       inputype: 'textquery',
  //       fields: 'formatted_address,id,name,place_id',
  //       key: 'AIzaSyBzZ-dfeaSbZZ7HbJ2KT7cTkm5VN_QarUw'
  //     }
  //   };

  //   this._http
  //     .get(reqUrl, reqOpts)
  //     .pipe(
  //       map((response: any) => {
  //         return response;
  //       }),
  //       catchError(error => throwError(error))
  //     )
  //     .toPromise()
  //     .then(
  //       (response: any) => {
  //         console.log('response: ', response);
  //       },
  //       error => {
  //         console.error('Error:', error);
  //       }
  //     );
  // }

  test(): void {
    const origin = window.location.protocol + '//' + window.location.host;

    let reqUrl: string;
    if (window.location.hostname === 'localhost') {
      reqUrl = 'https://localhost:5001' + '/api/items/test/' + this.suggestionsInput;
    } else {
      reqUrl = '/api/items/test/' + this.suggestionsInput;
    }

    let headers = new HttpHeaders();
    //headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');

    const reqOpts: any = {
      responseType: 'json',
      observe: 'response',
      headers: headers,
      params: {}
    };

    this._http
      .get(reqUrl, reqOpts)
      .pipe(
        map((response: any) => {
          return response.body;
        }),
        catchError(error => throwError(error))
      )
      .toPromise()
      .then(
        (responseBody: any) => {
          // console.log('predictions: ', responseBody && responseBody.predictions);

          console.log('PREDICTIONS::::::::::::::::');
          responseBody.predictions.forEach(p => {
            console.log(p.description);
          });
        },
        error => {
          console.error('Error:', error);
        }
      );
  }
}
