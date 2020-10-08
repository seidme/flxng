import { Component, Input, OnInit } from '@angular/core';

export enum Icon {
  Github = 'github',
}

@Component({
  selector: 'app-svg',
  templateUrl: './svg.component.html',
  styleUrls: ['./svg.component.scss'],
})
export class SvgComponent implements OnInit {
  @Input() icon: Icon;
  Icon = Icon;

  constructor() {}

  ngOnInit() {}
}
