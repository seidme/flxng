import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface ItemDetailsSchemaField {
  id: string; // e.g., '0', '1', ...
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date';
  xPath: string; // "//*[contains(@class, 'main-title-listing')]/text()"
  pattern: string | null;
  selector: string;
}

export enum ItemField {
  Title = '0',
  Price = '1',
  Location = '2',
  Address = '3',
  M2 = '4',
  M2Balcony = '5',
  Floor = '6',
  ConstructionPeriod = '7',
  ShortDescription = '8',
  LongDescription = '9',
  M2Price = '10',
  FormattedAddress = '11',
  M2PriceStreetMedianAverage = '12',
  M2PriceStreetMeanAverage = '13',
  StreetGroupingCount = '14',
}

export type ItemDetails = {
  [value in ItemField]: any;
};

export interface Item {
  id: number;
  identifier: string;
  detailsUrl: string;
  // details: ItemDetails; // exists but should not be used
  parsedDetails: ItemDetails;
  dateCreated: string;
  sourceId: number;

  // // scraped fields are assgined to the item itself (only connsumerd by table, should not be used)
  // [value in ItemField]: any;
}

export interface Source {
  id: number;
  name: string;
  Url: string;
  Description: string;
  // itemDetailsSchema: ItemDetailsSchemaField[]; // exists but should not be used
  parsedItemDetailsSchema: ItemDetailsSchemaField[];
  active: boolean;
  dateCreated: string;
  dateChecked: string;
  itemFilters: any[]; // triggers
}

export interface SearchResponse {
  items: Item[];
  totalCount: number;
  m2PriceAverage: { median: number; mean: number };
}

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

  getSource(sourceId: number): Promise<Source> {
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

  getItem(itemId: number): Promise<Item> {
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

  getPageDetail(detailsUrl: string, xPath: string): Promise<any> {
    let reqUrl = `${this.apiEndpoint}/api/parse-tem-detial`;
    let headers = new HttpHeaders();
    //headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');

    const reqOpts: any = {
      responseType: 'json',
      observe: 'response',
      headers: headers,
      params: {
        itemDetailsUrl: detailsUrl,
        selector: xPath,
      },
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

  searchItems(filters: any[]): Promise<SearchResponse> {
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
          return response.body as any;
        }),
        catchError((error) => throwError(error))
      )
      .toPromise();
  }

  getReport(filters: any[]): Promise<any> {
    let reqUrl = `${this.apiEndpoint}/api/items/report/month`;
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
          return response.body as any;
        }),
        catchError((error) => throwError(error))
      )
      .toPromise();
  }

  updateSource(source: any): Promise<Source> {
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

  updateItem(item: Item): Promise<Item> {
    let reqUrl = `${this.apiEndpoint}/api/items/${item.id}`;

    let headers = new HttpHeaders();
    //headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Accept', 'application/json');

    const reqOpts: any = {
      responseType: 'json',
      observe: 'response',
      headers: headers,
      params: {},
    };

    for (var i = 0; i < Object.keys(item.parsedDetails).length; i++) {
      // remove parsedDetails properties from the item itself, since only table consumes them
      delete item[Object.keys(item.parsedDetails)[i]];
    }

    return this._http
      .put(reqUrl, item, reqOpts)
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
