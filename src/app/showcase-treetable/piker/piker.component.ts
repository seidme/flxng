import { Component, OnInit } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpRequest,
  HttpParams,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { map, catchError, retry, tap } from 'rxjs/operators';

import { PikerService } from './piker.service';

declare var window: any;

@Component({
  selector: '',
  templateUrl: './piker.component.html',
  styleUrls: ['./piker.component.scss'],
})
export class PikerComponent implements OnInit {
  items: Array<{ [key: string]: any }> = [];

  filters: Array<{ [key: string]: any }> = [];

  totalItemsCount = 0;
  suggestionsInput = '';
  emailsInput = '';
  triggerNameINput = '';
  isLocalhost = false;

  source: any;
  searchResponse: any;

  readonly operators: Array<{ [key: string]: any }> = [
    {
      id: 'EQUALS',
      name: 'Equals to', // combos: or
      placeholder: 'E.g: Sarajevo - Centar || Ilidza',
    },
    {
      id: 'NOT_EQUALS',
      name: 'Not equals to', // combos: and
      placeholder: 'E.g: Vogosca && Hadzici',
    },
    {
      id: 'CONTAINS',
      name: 'Contains', // combos: or
      placeholder: 'E.g: Tit || Hamze || Vraz',
    },
    {
      id: 'NOT_CONTAINS',
      name: 'Not contains', // combos: and
      placeholder: 'E.g: IZDAVANJE && najam',
    },
    {
      id: 'GREATER_THAN',
      name: 'Greater than',
      placeholder: 'E.g: 2',
    },
    {
      id: 'LOWER_THAN',
      name: 'Lower than',
      placeholder: 'E.g: 4',
    },
  ];

  constructor(private _http: HttpClient, private _service: PikerService) {}

  ngOnInit() {
    this.isLocalhost = window.location.hostname === 'localhost';

    this._service.getSource(1).then((s) => {
      this.source = s;
    });

    this.getTotalItemsCount();
  }

  async getTotalItemsCount() {
    this.totalItemsCount = await this._service.getTotalItemsCount(1);
  }

  async iteratePages() {
    try {
      const response = await this._service.iteratePages(1, 0);
      console.log('Iterating started..');
    } catch (e) {
      console.error('Error:', e);
    }
  }

  async testPredictions() {
    try {
      const predictions = await this._service.testPredictions(this.suggestionsInput);
      console.log('PREDICTIONS::::::::::::::::');
      predictions.forEach((p) => {
        console.log(p.description);
      });
    } catch (e) {
      console.error('Error:', e);
    }
  }

  async searchItems() {
    if (!this.filters.length) {
      console.error('No filters provided!');
      return;
    }

    try {
      this.searchResponse = await this._service.searchItems(this.filters);
      console.log('searchResponse: ', this.searchResponse);

      this.items = this.searchResponse.items.map((item) => Object.assign(item, item.parsedDetails));

      // this.items = this.items.filter(i => {
      //   var address = i.parsedDetails['11']; // formatted address
      //   var threeCharWord = address.split(' ').find(w => w.length === 3);
      //   return !!threeCharWord;
      // });
    } catch (e) {
      console.error('Error getting items:', e);
    }
  }

  getOperator(operatorId: string): { [key: string]: any } {
    const operator = this.operators.find((o) => o.id === operatorId);
    return operator;
  }

  addNewFilter(): void {
    this.filters.push({
      fieldId: '',
      operatorId: 0,
      value: '',
      caseSensitive: false,
    });
  }

  applyPredefinedFilters(): void {
    this.filters = [
      {
        fieldId: '2', // location
        operatorId: 'EQUALS',
        value: 'Sarajevo - Centar || Sarajevo - Centar',
        caseSensitive: true,
      },
      // {
      //   fieldId: '2', // location
      //   operatorId: 'NOT_EQUALS',
      //   value: 'Dobrinja && Hadzici',
      //   caseSensitive: true
      // },
      {
        fieldId: '11', // formattedAddress
        operatorId: 'CONTAINS',
        value: 'Tit || Hamze || Vraz',
        caseSensitive: false,
      },
      {
        fieldId: '0', // title
        operatorId: 'NOT_CONTAINS',
        value: 'stup && Stup && tibra && Tibra && Istocno && istocno && kuca && kuci && izdav && izdaj && iznajm && kupujem && trazim && na dan && duzi period',
        caseSensitive: true,
      },
    ];
  }

  async addEmailTrigger(): Promise<void> {
    if (!this.triggerNameINput) {
      console.error('No trigger name provided!');
      return;
    }
    if (!this.filters.length) {
      console.error('No filters provided!');
      return;
    }

    const emails = this.emailsInput
      .split(',')
      .map((email) => email.trim())
      .filter((email) => this.isValidEmail(email));

    if (!emails.length) {
      console.error('No emails provided, or the email is invalid!');
      return;
    }

    const emailTrigger = {
      name: this.triggerNameINput,
      filters: this.filters,
      emailsToNotify: emails,
    };
    this.source.parsedItemFilters.push(emailTrigger);

    const updatedSource = await this._service.updateSource(this.source);
    console.log('updated source: ', updatedSource);
  }

  removeFilter(filter) {
    this.filters = this.filters.filter((f) => f !== filter);
  }

  applyFiltersFromTrigger(trigger) {
    this.filters = JSON.parse(JSON.stringify(trigger.filters));
    this.emailsInput = trigger.emailsToNotify.join(', ');
    this.triggerNameINput = trigger.name;
  }

  async removeTrigger(trigger) {
    this.source.parsedItemFilters = this.source.parsedItemFilters.filter((t) => t !== trigger);
    const updatedSource = await this._service.updateSource(this.source);
    console.log('updated source: ', updatedSource);
  }

  isValidEmail(email): boolean {
    // A regular expression to validate an email address.
    // This regex is a common and reasonably robust pattern.
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // The test() method executes a search for a match between a regular expression and a specified string.
    // Returns true if it finds a match, otherwise false.
    return regex.test(email);
  }

  removeItem(item) {
    this._service
      .deleteItem(item.id)
      .then(() => {
        console.log('Item removed successfully.');
        this.items = this.items.filter((i) => i !== item);
        this.totalItemsCount--;
      })
      .catch((error) => {
        console.error('Error removing item:', error);
      });
  }
}
