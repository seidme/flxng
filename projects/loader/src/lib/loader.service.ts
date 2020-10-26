import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  constructor() {
    this.appendLoaderStyles();
  }

  appendLoaderStyles(): void {
    const styleElem = document.createElement('style');
    styleElem.innerHTML = this.getStylesAsString();
    document.head.appendChild(styleElem);
  }

  appendLoader(hostElem: HTMLElement): HTMLElement {
    const loaderElem = document.createElement('div');
    loaderElem.className = 'flx-loader';

    loaderElem.style['display'] = 'none';

    // TODO: if appending to button add min-height?

    const hostBorderRadius = getComputedStyle(hostElem)['border-radius'];
    if (parseInt(hostBorderRadius, 10)) {
      loaderElem.style['border-radius'] = hostBorderRadius;
    }

    loaderElem.innerHTML = `
      <span class="flx-spinner"></span>
    `;

    hostElem.appendChild(loaderElem);

    return loaderElem;
  }

  getStylesAsString(): string {
    return `
      [flxLoader] {
        position: relative;
      }

      .flx-loader {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.2);
        z-index: 999;

        display: flex;
        justify-content: center;
        align-items: center;
      }

      .flx-spinner {
        display: inline-block;
        width: 25px;
        height: 25px;
        border: 3px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: #fff;
        animation: flx-spin 1s ease-in-out infinite;
      }

      @-webkit-keyframes flx-spin {
        to {
          -webkit-transform: rotate(360deg);
        }
      }
    `;
  }
}
