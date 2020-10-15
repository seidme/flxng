import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-overview-a',
  templateUrl: './overview-a.component.html',
  styleUrls: ['./overview-a.component.scss'],
})
export class OverviewAComponent implements OnInit {
  newPage: { [key: string]: number };

  constructor() {}

  ngOnInit() {}

  onPageChange(newPage: { [key: string]: number }): void {
    this.newPage = newPage;
  }

  onItemsPerPageValueChange(newItemsPerPageValue): void {
    console.log('newItemsPerPageValue', newItemsPerPageValue);
  }
}
