import { Injectable } from '@angular/core';

import { LoaderService } from '.';

@Injectable({
  providedIn: 'root',
})
export class GlobalLoaderService {
  private loaderElem: HTMLElement;
  private visible = false;

  constructor(protected loaderService: LoaderService) {
    this.loaderElem = this.loaderService.appendLoader(document.body, true);
  }

  show(): void {
    this.loaderElem.style['display'] = 'flex';
    this.visible = true;
  }

  hide(): void {
    this.loaderElem.style['display'] = 'none';
    this.visible = false;
  }

  isVisible(): boolean {
    return this.visible;
  }
}
