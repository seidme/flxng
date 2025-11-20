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

import { Filter, Item, ItemField, PikerService, Source, SourceQuery, operators } from './piker.service';
import { ModalService } from '../../shared/components/modal/modal.service';
import { ItemEditComponent } from './modals/item-edit/item-edit.component';
import { AnalyticsComponent } from './modals/analytics/analytics.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MapsComponent } from './modals/maps/maps.component';
import { GroupItemsComponent } from './modals/group-items/group-items.component';
import { AddressMatchingComponent } from './modals/address-matching/address-matching.component';

declare var window: any;
const notVisibleFilterFields = [
  'Id',
  'Identifier',
  'DetailsUrl',
  'M2Balcony',
  'ConstructionPeriod',
  'ShortDescription',
  'M2PriceStreetMeanAverage',
];

@Component({
  selector: '',
  templateUrl: './piker.component.html',
  styleUrls: ['./piker.component.scss'],
})
export class PikerComponent implements OnInit {
  items: Item[] = [];

  filters: Filter[] = [];

  totalItemsCount = 0;
  suggestionsInput = '';
  emailsInput = '';
  triggerNameINput = '';
  isLocalhost = false;
  isProdApi = false;
  updatingTrigger: any;
  queryParams: any = {};
  source: Source;
  sources: Source[] = [];
  searchResponse: any;
  commonFilters: Array<{ name: string; filters: Filter[] }> = this.getCommonFilters();
  ItemField = ItemField;
  itemFieldIterable: Array<{ [key: string]: string }> = Object.keys(ItemField)
    .filter((f) => notVisibleFilterFields.indexOf(f) === -1)
    .map((key) => ({ name: key, id: ItemField[key] }));

  loading = false;
  isAdmin = true;

  currentPage = 1;
  itemsPerPage = 100;

  readonly operatorsIterable: Array<{ [key: string]: any }> = Object.values(operators);

  constructor(
    private _http: HttpClient,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private _service: PikerService,
    private modal: ModalService
  ) {}

  async ngOnInit() {
    this.isLocalhost = window.location.hostname === 'localhost';
    this.isProdApi = this._service.apiEndpoint.indexOf('localhost') === -1;

    this.sources = await this._service.getSources();

    this.route.queryParams.subscribe(async (params) => {
      // The `queryParams` observable provides the parameter object.
      // This is the ideal way to get params because it reacts to changes.
      Object.keys(params).forEach((key) => {
        this.queryParams[key] = params[key];
      });

      console.log('this.queryParams:', this.queryParams);

      this.source = this.queryParams['sourceId']
        ? this.sources.find((s) => s.id === +this.queryParams['sourceId'])
        : this.sources[0];
      this.items = [];
      this.currentPage = 1;
      this.searchResponse = undefined;

      this.getTotalItemsCount();

      if (this.queryParams['editItemId']) {
        const item = await this._service.getItem(this.queryParams['editItemId']);
        if (item) {
          this.editItem(item);
        }
      }

      if (this.queryParams['matchAddressItemId']) {
        const item = await this._service.getItem(this.queryParams['matchAddressItemId']);
        if (item) {
          this.addressMatching(item);
        }
      }
    });
  }

  getItemFieldName(fieldId: string): string {
    const field = this.itemFieldIterable.find((f) => f.id === fieldId);
    return field ? field.name : 'field';
  }

  selectSource(source: Source) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { sourceId: source.id },
      queryParamsHandling: 'merge', // This option merges with any existing query params
    });
  }

  async getTotalItemsCount() {
    this.totalItemsCount = await this._service.getTotalItemsCount(this.source.id);
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

  onItemsPerPageValueChange(output: any) {
    console.log('Items per page changed to: ', output);
    this.itemsPerPage = output;
    this.currentPage = 1;
    this.searchItems();
  }

  onPageChange(output: any) {
    console.log('Page changed to: ', output.currentPage);
    this.currentPage = output.currentPage;
    this.searchItems();
  }

  async searchItems(countOnly = false): Promise<void> {
    if (this.loading) {
      console.log('Already loading, please wait...');
      return;
    }
    if (!this.filters.length && countOnly) {
      console.error('No filters provided!');
      return;
    }

    let skip = 0;
    let take = 0;

    if (!countOnly) {
      skip = (this.currentPage - 1) * this.itemsPerPage;
      take = this.itemsPerPage;
    }

    this.loading = true;
    try {
      this.searchResponse = await this._service.searchItems(this.source, this.filters, skip, take, countOnly);
      console.log('searchResponse: ', this.searchResponse);

      if (!countOnly) {
        // just so it's easier for table to consume, should not bue used outside the table...
        this.items = this.searchResponse.items.map((item) => Object.assign(item, item.parsedDetails));
        // this.items = this.searchResponse.items;

        // this.items = this.items.filter(i => {
        //   var address = i.parsedDetails['11']; // formatted address
        //   var threeCharWord = address.split(' ').find(w => w.length === 3);
        //   return !!threeCharWord;
        // });
      }
    } catch (e) {
      console.error('Error getting items:', e);
    }
    this.loading = false;
  }

  getOperator(operatorId: string): { [key: string]: any } {
    const operator = this.operatorsIterable.find((o) => o.id === operatorId);
    return operator;
  }

  getCommonFilters(): Array<{ name: string; filters: any[] }> {
    return [
      {
        name: 'Yesterday',
        filters: [
          {
            fieldId: ItemField.DateCreated,
            operatorId: operators.GREATER_THAN.id,
            value: this.getFormattedDateMinusDays(1),
          },
        ],
      },
      {
        name: 'Last Week',
        filters: [
          {
            fieldId: ItemField.DateCreated,
            operatorId: operators.GREATER_THAN.id,
            value: this.getFormattedDateMinusDays(7),
          },
        ],
      },
      {
        name: 'Last Month',
        filters: [
          {
            fieldId: ItemField.DateCreated,
            operatorId: operators.GREATER_THAN.id,
            value: this.getFormattedDateMinusDays(30),
          },
        ],
      },
      {
        name: 'Last Year',
        filters: [
          {
            fieldId: ItemField.DateCreated,
            operatorId: operators.GREATER_THAN.id,
            value: this.getFormattedDateMinusDays(365),
          },
        ],
      },
      {
        name: 'Since 2024-08-01',
        filters: [
          {
            fieldId: ItemField.DateCreated,
            operatorId: operators.GREATER_THAN.id,
            value: '2024-08-01',
          },
        ],
      },
      {
        name: 'Floor 0 - 4',
        filters: [
          {
            fieldId: ItemField.Floor,
            operatorId: operators.GREATER_THAN.id,
            value: '0',
          },
          {
            fieldId: ItemField.Floor,
            operatorId: operators.LOWER_THAN.id,
            value: '4',
          },
        ],
      },
      {
        name: 'm2Price < SEARCH average',
        filters: [
          {
            fieldId: ItemField.M2Price,
            operatorId: operators.LOWER_THAN.id,
            value: 'SEARCH AVERAGE',
          },
        ],
      },
      {
        name: 'm2Price < STREET average',
        filters: [
          {
            fieldId: ItemField.M2Price,
            operatorId: operators.LOWER_THAN.id,
            value: 'STREET AVERAGE',
          },
        ],
      },
      {
        name: '3 main locations',
        filters: [
          {
            fieldId: ItemField.Locality,
            operatorId: operators.EQUALS.id,
            value: 'Ilidza || Sarajevo - Novo Sarajevo || Sarajevo - Centar',
            caseSensitive: true,
          },
        ],
      },
      {
        name: 'Address contains',
        filters: [
          {
            fieldId: ItemField.FormattedAddress,
            operatorId: operators.CONTAINS.id,
            value: '',
          },
        ],
      },
      {
        name: 'Invalid items',
        filters: [
          {
            fieldId: ItemField.Invalid,
            operatorId: operators.EQUALS.id,
            value: true,
          },
        ],
      },
      {
        name: 'AutoSanitized items',
        filters: [
          {
            fieldId: ItemField.AutoSanitized,
            operatorId: operators.EQUALS.id,
            value: true,
          },
        ],
      },
      {
        name: 'Deleted items',
        filters: [
          {
            fieldId: ItemField.Deleted,
            operatorId: operators.EQUALS.id,
            value: true,
          },
        ],
      },
    ];
  }

  addNewFilter(): void {
    this.filters.push({
      fieldId: '',
      operatorId: operators.CONTAINS.id,
      value: '',
      caseSensitive: false,
    });
    this.currentPage = 1;
  }

  selectCommonFilter(commonFIlter: { name: string; filters: any[] }) {
    this.filters = [...this.filters, ...JSON.parse(JSON.stringify(commonFIlter.filters))];
    this.currentPage = 1;
  }

  removeFilter(filter) {
    this.filters = this.filters.filter((f) => f !== filter);
    this.currentPage = 1;
  }

  applyFiltersFromTrigger(trigger) {
    this.updatingTrigger = trigger;
    this.filters = JSON.parse(JSON.stringify(trigger.filters));
    this.emailsInput = trigger.emailsToNotify.join(', ');
    this.triggerNameINput = trigger.name;
    this.currentPage = 1;
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

  getFormattedDateMinusDays(daysToSubtract) {
    const date = new Date();
    date.setDate(date.getDate() - daysToSubtract);
    const year = date.getFullYear();
    // Months are 0-indexed, so add 1 to get the correct month number
    // Use padStart to ensure a two-digit format (e.g., '01' instead of '1')
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    // Return the date in YYYY-MM-DD format
    return `${year}-${month}-${day}`;
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

  async mapsItem(item: Item): Promise<void> {
    const result = await this.modal.open(MapsComponent, { source: this.source, item: item });
    if (result) {
      // this.items = [];
      // this.searchItems();
    }
  }

  async mapsItems(item: Item): Promise<void> {
    const result = await this.modal.open(MapsComponent, { source: this.source, items: this.items });
    if (result) {
      // this.items = [];
      // this.searchItems();
    }
  }

  async groupItems(): Promise<void> {
    const result = await this.modal.open(GroupItemsComponent, { source: this.source });
    if (result) {
      // this.items = [];
      // this.searchItems();
    }
  }

  async bulkAction(action: string): Promise<void> {
    if (this.loading) {
      console.log('Already loading, please wait...');
      return;
    }
    if (!this.filters.length) {
      console.error('No filters provided!');
      return;
    }
    if (!this.items.length) {
      console.error('Please perform a search first!');
      return;
    }

    const skip = (this.currentPage - 1) * this.itemsPerPage;
    const take = 1000000; // TODO: remove once bulk updates done....

    this.loading = true;
    try {
      const updatedItemsCount = await this._service.bulkItemsUpdate(action, this.source, this.filters, skip, take);
      console.log('Updated items count: ', updatedItemsCount);
    } catch (e) {
      console.error('Error bulk updating items:', e);
    }
    this.loading = false;
  }

  async geminiItem(item: Item): Promise<void> {
    const response = await this._service.geminiItem(this.source, item);
    console.log('Gemini response: ', response);
  }

  async addressMatching(item: Item): Promise<void> {
    const result = await this.modal.open(AddressMatchingComponent, { source: this.source, item: item });
    if (result) {
      // this.items = [];
      // this.searchItems();
    }
  }
}
