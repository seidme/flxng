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

import { PikerService } from './piker.service';

declare var window: any;

@Component({
  selector: '',
  templateUrl: './piker.component.html',
  styleUrls: ['./piker.component.scss']
})
export class PikerComponent implements OnInit {
  items: Array<{ [key: string]: any }> = [];

  filters: Array<{ [key: string]: any }> = [];

  totalItemsCount = 0;
  suggestionsInput = '';
  isLocalhost = false;

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
    private _service: PikerService
  ) { }

  async ngOnInit() {
    this.isLocalhost = window.location.hostname === 'localhost';

    this.totalItemsCount = await this._service.getTotalItemsCount(1);
  }

  async searchItems() {
    try {
      const items = await this._service.searchItems(this.filters);
      console.log('response items: ', items);

      this.items = items.map(item => Object.assign(item, item.parsedDetails));

    } catch (e) {
      console.error('Error getting items:', e);
    }
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


  async testPredictions() {
    try {
      const predictions = await this._service.testPredictions(this.suggestionsInput);
      console.log('PREDICTIONS::::::::::::::::');
      predictions.forEach(p => {
        console.log(p.description);
      });
    } catch (e) {
      console.error('Error:', e);
    }
  }
}
