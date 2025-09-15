import {
  Component,
  Type,
  Injectable,
  TemplateRef,
  ViewChild,
  ChangeDetectionStrategy,
  OnDestroy,
  inject,
} from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

// --- Modal Service ---
// This service manages the state of the modal using RxJS Subjects.
@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private _isOpen = new Subject<boolean>();
  isOpen$ = this._isOpen.asObservable();

  // Use a BehaviorSubject so it always has a current value.
  private _content = new Subject<Type<any> | TemplateRef<any>>();
  content$ = this._content.asObservable();

  // New subject to hold data for the dynamic component
  _data = new BehaviorSubject<any>(null);
  data$ = this._data.asObservable();

  promiseResolve: any;

  open(content: Type<any> | TemplateRef<any>, data: any = null): Promise<any> {
    this._content.next(content);
    this._data.next(data);
    this._isOpen.next(true);

    return new Promise<any>((resolve, reject) => {
      this.promiseResolve = resolve;
    });
  }

  close(result: any): void {
    this._isOpen.next(false);
    this._content.next(null);
    this._data.next(null);
    this.promiseResolve(result);
  }
}
