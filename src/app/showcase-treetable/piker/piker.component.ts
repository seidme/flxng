import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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

import { Item, PikerService } from './piker.service';
import { ModalService } from '../../shared/components/modal/modal.service';
import { ItemEditComponent } from './modals/item-edit/item-edit.component';
import { AnalyticsComponent } from './modals/analytics/analytics.component';
import { ActivatedRoute } from '@angular/router';

declare var window: any;

@Component({
  selector: '',
  templateUrl: './piker.component.html',
  styleUrls: ['./piker.component.scss'],
})
export class PikerComponent implements OnInit {
  items: Item[] = [];

  filters: Array<{ [key: string]: any }> = [];

  totalItemsCount = 0;
  suggestionsInput = '';
  emailsInput = '';
  triggerNameINput = '';
  isLocalhost = false;
  updatingTrigger: any;
  queryParams: any = {};
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
      placeholder: 'Number, date (YYYY-MM-DD), or keyword "AVERAGE" (search results considered)',
    },
    {
      id: 'LOWER_THAN',
      name: 'Lower than',
      placeholder: 'Number, date (YYYY-MM-DD), or keyword "AVERAGE (search results considered)"',
    },
  ];

  constructor(
    private _http: HttpClient,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private _service: PikerService,
    private modal: ModalService
  ) {}

  async ngOnInit() {
    this.isLocalhost = window.location.hostname === 'localhost';

    this.source = await this._service.getSource(1);

    this.getTotalItemsCount();

    this.route.queryParams.subscribe(async (params) => {
      // The `queryParams` observable provides the parameter object.
      // This is the ideal way to get params because it reacts to changes.
      Object.keys(params).forEach((key) => {
        this.queryParams[key] = params[key];
      });

      console.log('this.queryParams:', this.queryParams);

      if (this.queryParams['editItemId']) {
        const item = await this._service.getItem(this.queryParams['editItemId']);
        if (item) {
          this.editItem(item);
        }
      }
    });
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
    // if (!this.filters.length) {
    //   console.error('No filters provided!');
    //   return;
    // }

    try {
      this.searchResponse = await this._service.searchItems(this.filters);
      console.log('searchResponse: ', this.searchResponse);

      // just so it's easier for table to consume, should not bue used outside the table...
      this.items = this.searchResponse.items.map((item) => Object.assign(item, item.parsedDetails));
      // this.items = this.searchResponse.items;

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
        value:
          'stup && Stup && tibra && Tibra && Istocno && istocno && kuca && kuci && izdav && izdaj && iznajm && kupujem && trazim && na dan && duzi period',
        caseSensitive: true,
      },
    ];
  }

  async addEmailTrigger(updateExisting = false): Promise<void> {
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

    if (updateExisting && this.updatingTrigger) {
      // holds the same reference, so just mutate object
      this.updatingTrigger.name = this.triggerNameINput;
      this.updatingTrigger.filters = this.filters;
      this.updatingTrigger.emailsToNotify = emails;
    } else {
      const emailTrigger = {
        name: this.triggerNameINput,
        filters: this.filters,
        emailsToNotify: emails,
      };
      this.source.parsedItemFilters.push(emailTrigger);
    }

    const updatedSource = await this._service.updateSource(this.source);
    console.log('updated source: ', updatedSource);
    this.updatingTrigger = undefined;
  }

  removeFilter(filter) {
    this.filters = this.filters.filter((f) => f !== filter);
  }

  applyFiltersFromTrigger(trigger) {
    this.updatingTrigger = trigger;
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

  getGradingColor(value, average): string {
    if (value > average) {
      return '';
    }

    // The color will reach its darkest shade when the difference is 40% of the average.
    // Increase this value for a more gradual transition, or decrease it for a more aggressive one.
    const aggressiveness = 0.33;

    const difference = average - value;

    const subtleGreen = [245, 255, 230];
    const darkGreen = [34, 139, 34];

    const maxDifferencePercentage = aggressiveness;
    const maxDifference = average * maxDifferencePercentage;

    const normalizedDiff = Math.min(1, Math.max(0, difference / maxDifference));

    // The square function makes the color change very subtle for small differences
    // and then increases more noticeably as the difference grows.
    const scaledDiff = normalizedDiff * normalizedDiff;

    const r = subtleGreen[0] + (darkGreen[0] - subtleGreen[0]) * scaledDiff;
    const g = subtleGreen[1] + (darkGreen[1] - subtleGreen[1]) * scaledDiff;
    const b = subtleGreen[2] + (darkGreen[2] - subtleGreen[2]) * scaledDiff;

    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
  }

  async editItem(item: Item): Promise<void> {
    const updatedItem = await this.modal.open(ItemEditComponent, { item: item, source: this.source });
    if (updatedItem && !this.queryParams['editItemId']) {
      this.items = [];
      this.searchItems(); // refresh list, could be optimized to just update the item in place
    }
  }

  async openAnalytics(): Promise<void> {
    const result = await this.modal.open(AnalyticsComponent, { source: this.source, filters: this.filters });
    if (result) {
      // this.items = [];
      // this.searchItems();
    }
  }
}
