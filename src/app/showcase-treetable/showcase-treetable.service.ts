import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Log {
  id: string | number;
  createdDate: string;
  status: number;
  message: string;
  children?: Log[];
}

@Injectable()
export class ShowcaseTreetableService {
  constructor(private _http: HttpClient) {}

  getGhFileContent(url: string): Observable<string> {
    return this._http.get(url, { responseType: 'text' });
  }

  generateLogs(qty: number): Log[] {
    let logs: Log[] = [];

    for (let i = 1; i <= qty; ++i) {
      logs.push({
        id: i,
        createdDate: new Date(new Date().getTime() - i).toISOString(),
        status: i % 2 === 0 ? 200 : 400,
        message: i % 4 === 0 ? 'A' : 'B'
      });
    }

    return logs;
  }
}
