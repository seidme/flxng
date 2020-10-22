import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-overview-b',
  templateUrl: './overview-b.component.html',
  styleUrls: ['./overview-b.component.scss'],
})
export class OverviewBComponent implements OnInit {
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
