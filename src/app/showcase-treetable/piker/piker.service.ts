import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class PikerService {
  isLocalhost = false;
  apiEndpoint = 'https://scout.codeeve.com';

  constructor(
    //private _ngZone: NgZone
    private _http: HttpClient
  ) {
    // const origin = window.location.protocol + '//' + window.location.host;
    this.isLocalhost = window.location.hostname === 'localhost';
    this.apiEndpoint = this.isLocalhost ? 'https://localhost:44315' : 'https://scout.codeeve.com';
  }

  getSource(sourceId: number): any {
    let reqUrl = `${this.apiEndpoint}/api/sources/${sourceId}`;
    let headers = new HttpHeaders();
    //headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');

    const reqOpts: any = {
      responseType: 'json',
      observe: 'response',
      headers: headers,
      params: {},
    };

    return this._http
      .get(reqUrl, reqOpts)
      .pipe(
        map((response: any) => {
          return response.body;
        }),
        catchError((error) => throwError(error))
      )
      .toPromise();
  }

  getTotalItemsCount(sourceId: number): Promise<any> {
    let reqUrl = `${this.apiEndpoint}/api/sources/${sourceId}/items/count`;
    let headers = new HttpHeaders();
    //headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');

    const reqOpts: any = {
      responseType: 'json',
      observe: 'response',
      headers: headers,
      params: {},
    };

    return this._http
      .get(reqUrl, reqOpts)
      .pipe(
        map((response: any) => {
          return response.body.count;
        }),
        catchError((error) => throwError(error))
      )
      .toPromise();
  }

  searchItems(filters: any[]): Promise<any[]> {
    let reqUrl = `${this.apiEndpoint}/api/items`;
    const reqBody = filters;
    let headers = new HttpHeaders();
    //headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');

    const reqOpts: any = {
      responseType: 'json',
      observe: 'response',
      headers: headers,
      params: {},
    };

    return this._http
      .post(reqUrl, reqBody, reqOpts)
      .pipe(
        map((response: any) => {
          return response.body as any[];
        }),
        catchError((error) => throwError(error))
      )
      .toPromise();
  }

  updateSource(source: any): Promise<any> {
    let reqUrl = `${this.apiEndpoint}/api/sources/${source.id}`;

    let headers = new HttpHeaders();
    //headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');

    const reqOpts: any = {
      responseType: 'json',
      observe: 'response',
      headers: headers,
      params: {},
    };

    return this._http
      .put(reqUrl, source, reqOpts)
      .pipe(
        map((response: any) => {
          return response.body;
        }),
        catchError((error) => throwError(error))
      )
      .toPromise();
  }

  iteratePages(sourceId: number, limit: number = 0): Promise<null> {
    let reqUrl = `${this.apiEndpoint}/api/sources/${sourceId}/iterate-pages`;
    let headers = new HttpHeaders();
    //headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');

    const reqOpts: any = {
      responseType: 'json',
      observe: 'response',
      headers: headers,
      params: {
        limit: limit,
      },
    };

    return this._http
      .get(reqUrl, reqOpts)
      .pipe(
        map((response: any) => null), // no content
        catchError((error) => throwError(error))
      )
      .toPromise();
  }

  testPredictions(suggestionsInput: string): Promise<any[]> {
    let reqUrl = `${this.apiEndpoint}/api/items/test/` + suggestionsInput;
    let headers = new HttpHeaders();
    //headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');

    const reqOpts: any = {
      responseType: 'json',
      observe: 'response',
      headers: headers,
      params: {},
    };

    return this._http
      .get(reqUrl, reqOpts)
      .pipe(
        map((response: any) => {
          return response.body.predictions;
        }),
        catchError((error) => throwError(error))
      )
      .toPromise();
  }

  deleteItem(itemId: number): Promise<void> {
    let reqUrl = `${this.apiEndpoint}/api/items/${itemId}`;

    let headers = new HttpHeaders();
    //headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');

    const reqOpts: any = {
      responseType: 'json',
      observe: 'response',
      headers: headers,
      params: {},
    };

    return this._http
      .delete(reqUrl, reqOpts)
      .pipe(
        map((response: any) => {
          return response.body;
        }),
        catchError((error) => throwError(error))
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
  //       key: '<GOOGLE API KEY HERE>'
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
