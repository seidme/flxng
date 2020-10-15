import { Injectable } from '@angular/core';
import { NgZone } from '@angular/core';


@Injectable()
export class StorageService {

    constructor(
        private _ngZone: NgZone
    ) { }



    get(key: string): any {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch (e) {
            console.error('Unable to get localStorage item: ', e);
            return undefined;
        }
    }

    set(key: string, value: any): void {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Unable to set localStorage item: ', e);
        }
    }

    remove(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Unable to remove localStorage item!');
        }
    }


    getAsync(key: string): Promise<any> {
        let promise = new Promise((resolve: Function, reject: Function) => {
            this._ngZone.runOutsideAngular(() => {
                setTimeout(() => {
                    try {
                        resolve(JSON.parse(localStorage.getItem(key)));
                    } catch (e) {
                        console.error('Unable to get localStorage item: ', e);
                        reject(e);
                    }
                });
            });
        });

        return promise;
    }

    setAsync(key: string, value: any): Promise<any> {
        let promise = new Promise((resolve: Function, reject: Function) => {
            this._ngZone.runOutsideAngular(() => {
                setTimeout(() => {
                    try {
                        localStorage.setItem(key, JSON.stringify(value));
                        resolve();
                    } catch (e) {
                        console.error('Unable to set localStorage item: ', e);
                        reject(e);
                    }
                });
            });
        });

        return promise;
    }

    removeAsync(key: string): Promise<any> {
        let promise = new Promise((resolve: Function, reject: Function) => {
            this._ngZone.runOutsideAngular(() => {
                setTimeout(() => {
                    try {
                        localStorage.removeItem(key);
                        resolve();
                    } catch (e) {
                        console.error('Unable to remove localStorage item!');
                        reject(e);
                    }
                });
            });
        });

        return promise;
    }
}
