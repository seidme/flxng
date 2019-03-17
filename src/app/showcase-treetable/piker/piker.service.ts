import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class PikerService {

  isLocalhost = false;

  constructor(
    //private _ngZone: NgZone
    private _http: HttpClient
  ) {
    this.isLocalhost = window.location.hostname === 'localhost';
  }

  getTotalItemsCount(sourceId: number): Promise<any> {
    const origin = window.location.protocol + '//' + window.location.host;

    let reqUrl: string;
    if (this.isLocalhost) {
      reqUrl = 'https://localhost:5001' + `/api/sources/${sourceId}/items/count`;
    } else {
      reqUrl = `/api/sources/${sourceId}/items/count`;
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

    return this._http
      .get(reqUrl, reqOpts)
      .pipe(
        map((response: any) => {
          return response.body.count;
        }),
        catchError(error => throwError(error))
      )
      .toPromise();
  }

  searchItems(filters: any[]): Promise<any[]> {
    // console.log('search items..:', this.filters);
    const origin = window.location.protocol + '//' + window.location.host;

    let reqUrl: string;
    if (this.isLocalhost) {
      reqUrl = 'https://localhost:5001' + '/api/items';
    } else {
      reqUrl = '/api/items';
    }

    const reqBody = filters;

    let headers = new HttpHeaders();
    //headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');

    const reqOpts: any = {
      responseType: 'json',
      observe: 'response',
      headers: headers,
      params: {}
    };

    return this._http
      .post(reqUrl, reqBody, reqOpts)
      .pipe(
        map((response: any) => {
          return response.body as any[];
        }),
        catchError(error => throwError(error))
      )
      .toPromise();
  }

  iteratePages(sourceId: number, limit: number = 0): Promise<null> {
    const origin = window.location.protocol + '//' + window.location.host;

    let reqUrl: string;
    if (this.isLocalhost) {
      reqUrl = 'https://localhost:5001' + `/api/sources/${sourceId}/iterate-pages`;
    } else {
      reqUrl = `/api/sources/${sourceId}/iterate-pages`;
    }

    let headers = new HttpHeaders();
    //headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');

    const reqOpts: any = {
      responseType: 'json',
      observe: 'response',
      headers: headers,
      params: {
        limit: limit
      }
    };

    return this._http
      .get(reqUrl, reqOpts)
      .pipe(
        map((response: any) => null), // no content
        catchError(error => throwError(error))
      )
      .toPromise();
  }

  testPredictions(suggestionsInput: string): Promise<any[]> {
    const origin = window.location.protocol + '//' + window.location.host;

    let reqUrl: string;
    if (this.isLocalhost) {
      reqUrl = 'https://localhost:5001' + '/api/items/test/' + suggestionsInput;
    } else {
      reqUrl = '/api/items/test/' + suggestionsInput;
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

    return this._http
      .get(reqUrl, reqOpts)
      .pipe(
        map((response: any) => {
          return response.body.predictions;
        }),
        catchError(error => throwError(error))
      )
      .toPromise();
  }

  // testPredictions(): void {
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

}
