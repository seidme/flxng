import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
    Http,
    Response,
    RequestOptions,
    Headers
} from '@angular/http';

export interface Log {
    id: number,
    createdDate: string,
    status: number,
    message: string
}


@Injectable()
export class ShowcaseDatatableService {

    constructor(
        //private _ngZone: NgZone
        private _http: Http
    ) { }


    getGhFileContent(url: string): any {
        return this._http.get(url)
        .map((response: Response) => response.text())
        .catch((error: any) => Observable.throw(error.json()));
    }


    getGenerateLogs(qty: number): any {
        let logs: Log[] = [];

        for(let i = 1; i <= qty; ++i) {
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
