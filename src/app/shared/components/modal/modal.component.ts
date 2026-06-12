import {
  Component,
  Type,
  Injectable,
  TemplateRef,
  ViewChild,
  ChangeDetectionStrategy,
  OnDestroy,
  inject,
  ComponentFactoryResolver,
  ViewContainerRef,
  ChangeDetectorRef,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { ModalService } from './modal.service';

// --- Modal Component ---
// This component listens to the ModalService to display content.
@Component({
  selector: 'flxng-modal',
  template: `
    <div *ngIf="isOpen$ | async" class="modal-overlay" (click)="modalService.close()">
      <div class="modal-content-container" (click)="$event.stopPropagation()">
        <!-- Close Button -->
        <button (click)="modalService.close()" class="modal-close-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="icon-close"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Dynamic Content Container -->
        <div class="dynamic-content-wrapper">
          <ng-template #dynamicContentHost></ng-template>
          <ng-template #templateContent>
            <ng-container [ngTemplateOutlet]="templateContentRef"></ng-container>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }
      .modal-content-container {
        background-color: white;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        position: relative;
        max-width: 90%;
        max-height: 90%;
      }
      .modal-close-button {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: transparent;
        border: none;
        cursor: pointer;
        color: #6b7280;
        padding: 0;
      }
      .icon-close {
        width: 1.5rem;
        height: 1.5rem;
      }
    `,
  ],
})
export class ModalComponent implements OnDestroy {
  isOpen$ = this.modalService.isOpen$;

  @ViewChild('dynamicContentHost', { read: ViewContainerRef, static: false }) dynamicContentHost!: ViewContainerRef;

  templateContentRef!: TemplateRef<any>;
  private subscription: Subscription;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private modalService: ModalService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.subscription = this.modalService.content$.subscribe((content) => {
      // this.cdr.detectChanges();
      setTimeout(() => {
        if (this.dynamicContentHost) {
          this.dynamicContentHost.clear();
        }

        if (content instanceof Type) {
          // Handle dynamic component
          const factory = this.componentFactoryResolver.resolveComponentFactory(content);
          const componentRef = this.dynamicContentHost.createComponent(factory);

          const data = this.modalService._data.getValue();
          if (data) {
            Object.keys(data).forEach((key) => {
              componentRef.instance[key] = data[key];
            });
          }
        } else if (content instanceof TemplateRef) {
          // Handle template reference
          this.templateContentRef = content;
          this.dynamicContentHost.createEmbeddedView(content);
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
