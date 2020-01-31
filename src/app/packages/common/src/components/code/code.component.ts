import { Component, OnInit, Input, SimpleChanges, ElementRef, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { animate, style, trigger, transition, AnimationEvent } from '@angular/animations';

declare const hljs: any;

export enum Language {
  Html = 'html',
  Typescript = 'typescript'
}

@Component({
  selector: 'flx-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.scss'],
  animations: [
    trigger('expansion', [
      transition('void => expansion', [style({ height: 0 }), animate('120ms ease-out', style({ height: '*' }))]),
      transition('expansion => void', [style({ height: '*' }), animate('120ms ease-out', style({ height: '0' }))])
    ])
  ]
})
export class CodeComponent implements OnInit {
  @Input() componentName = '';

  htmlCode = '';
  typescriptCode = '';
  expanded = false;
  fetchingCode = false;
  selectedLanguage: Language = Language.Html;
  readonly Language = Language;

  constructor(
    private _http: HttpClient,
    private _elementRef: ElementRef,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {}

  toggle(): void {
    this.expanded = !this.expanded;

    if (this.expanded) {
      const codeForSelectedLanguage = this.selectedLanguage === Language.Html ? this.htmlCode : this.typescriptCode;
      if (!codeForSelectedLanguage) {
        this.fetchCode();
      } else {
        this._changeDetectorRef.detectChanges();
        this.highlightCode();
      }
    }
  }

  switchLanguage(language: Language) {
    if (language === this.selectedLanguage) {
      return;
    }

    this.selectedLanguage = language;

    const codeForSelectedLanguage = this.selectedLanguage === Language.Html ? this.htmlCode : this.typescriptCode;
    if (!codeForSelectedLanguage) {
      this.fetchCode();
    } else {
      this._changeDetectorRef.detectChanges();
      this.highlightCode();
    }
  }

  highlightCode(): void {
    const codeElem = this._elementRef.nativeElement.querySelector(`code.language-${this.selectedLanguage}`);
    hljs.highlightBlock(codeElem);
  }

  async fetchCode(): Promise<void> {
    this.fetchingCode = true;
    try {
      const fileUrl = `https://raw.githubusercontent.com/seidme/flxng/development/src/app/showcase-treetable/${this.composeComponentPath()}`;
      const code = await this._http.get(fileUrl, { responseType: 'text' }).toPromise();
      this.fetchingCode = false;

      this.selectedLanguage === Language.Html ? (this.htmlCode = code) : (this.typescriptCode = code);

      this._changeDetectorRef.detectChanges();
      this.highlightCode();
    } catch (e) {
      this.fetchingCode = false;
      console.log('error: ', e);
    }
  }

  composeComponentPath(): string {
    const fileExtension = this.selectedLanguage === Language.Html ? 'html' : 'ts';

    const componentNameFragments = this.componentName.split('-');
    const componentExampleSuffix = componentNameFragments[componentNameFragments.length - 1];
    const mainComponentName = this.componentName.replace('-' + componentExampleSuffix, '');

    return `${mainComponentName}/${this.componentName}/${this.componentName}.component.${fileExtension}`;
  }

  copyCode(): void {
    // const codeElem = this._elementRef.nativeElement.querySelector(`code.language-${this.selectedLanguage}`);
    // codeElem.focus();
    // codeElem.select();
    // document.execCommand('copy');

    // Page needs to be served over HTTPS in order the following to work!
    const codeForSelectedLanguage = this.selectedLanguage === Language.Html ? this.htmlCode : this.typescriptCode;
    navigator.clipboard.writeText(codeForSelectedLanguage).then(
      () => {},
      e => {
        console.log(e);
        console.error('Works only if page is served over HTTPS!');
      }
    );
  }
}
