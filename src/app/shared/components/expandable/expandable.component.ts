import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-expandable',
  templateUrl: './expandable.component.html',
  styleUrls: ['./expandable.component.scss'],
  animations: [
    trigger('expansion', [
      transition('void => expansion', [style({ height: 0 }), animate('120ms ease-out', style({ height: '*' }))]),
      transition('expansion => void', [style({ height: '*' }), animate('120ms ease-out', style({ height: '0' }))]),
    ]),
  ],
})
export class ExpandableComponent implements OnInit {
  @ViewChild('chevron') chevron: ElementRef;

  @Output() onToggle = new EventEmitter<boolean>();

  @Input() expanded = false;
  @Input() expanderVisible = true;

  constructor() {}

  ngOnInit() {}

  toggle(): void {
    this.expanded = !this.expanded;
    this.onToggle.emit(this.expanded);
  }
}
