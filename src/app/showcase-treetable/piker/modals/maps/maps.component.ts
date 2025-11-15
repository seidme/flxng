import { Component, Input, OnInit } from '@angular/core';

import { Item, ItemField, operators, PikerService, Source } from '../../piker.service';
import { ModalService } from '../../../../shared/components/modal/modal.service';

declare const google: any;

@Component({
  selector: 'flx-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss'],
})
export class MapsComponent implements OnInit {
  @Input() source: Source;
  @Input() item: Item;
  @Input() items: Item[] = [];

  apiKey = 'AIzaSyBzZ-dfeaSbZZ7HbJ2KT7cTkm5VN_QarUw';
  map: any;
  locations = [];
  searchResponse: any;
  ItemField = ItemField;

  constructor(private _service: PikerService, private modalService: ModalService) {}

  async ngOnInit() {
    // console.log('item:', this.item);
    // console.log('source:', this.source);

    if (this.item) {
      console.log('Item:', this.item);
      const result = await this._service.getCoords(this.source, this.item);
      console.log('Geocoding result:', result);
      console.log('partial match:', result.allResults[0].partial_match);
      console.log('types:', result.allResults[0].types);
      this.locations.push({ title: result.address, ...result });
    } else if (this.items && this.items.length > 0) {
      this.mapItemsToLocations(this.items);
    } else {
      throw new Error('No item or items provided for maps!');
    }

    this.loadGoogleMapsScript();
  }

  loadGoogleMapsScript(): void {
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      this.initMap();
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => this.initMap();
      document.head.appendChild(script);
    }
  }

  initMap(): void {
    const defaultCenter = { lat: 0, lng: 0 };

    // Create a new map instance.
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: defaultCenter,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    });

    // Add a marker for each location.
    this.locations.forEach((location) => {
      const marker = new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: this.map,
        title: location.title,
      });

      // Add a simple InfoWindow to display the title on click.
      const infoWindow = new google.maps.InfoWindow({
        content: `<h3>${location.title}</h3>`,
      });

      marker.addListener('click', () => {
        infoWindow.open(this.map, marker);
      });
    });

    console.log('Locations:', this.locations);

    // Provjerite broj lokacija kako biste odlučili o zumiranju.
    if (this.locations.length > 1) {
      // Ako postoji više od jedne lokacije, koristite fitBounds().
      const bounds = new google.maps.LatLngBounds();
      this.locations.forEach((location) => {
        bounds.extend({ lat: location.lat, lng: location.lng });
      });
      this.map.fitBounds(bounds);
    } else if (this.locations.length === 1) {
      // Ako postoji samo jedna lokacija, centrirajte kartu na nju i postavite maksimalnu razinu zumiranja.
      this.map.setCenter({ lat: this.locations[0].lat, lng: this.locations[0].lng });
      this.map.setZoom(15); // Razina 15 je dobra za prikaz uličnog nivoa.
    }
  }

  async geohashSearch(item: Item) {
    // first add the selected item to include in search results
    let geohashesFilterValue = item.parsedDetails[ItemField.AddressGeohash].substring(0, 7); // 6 = city block, 7 = street level

    // now add geohashes of neighboring geo blocks (8 neighbors) - this will result in 1-2 streets away from the original address
    this.locations[0].geohashNeighbors.forEach((neighbor) => {
      geohashesFilterValue += ' || ' + neighbor;
    });

    console.log('geohashesFilterValue:', geohashesFilterValue);

    const filters = [
      {
        fieldId: ItemField.AddressGeohash,
        operatorId: operators.CONTAINS.id,
        value: geohashesFilterValue,
      },
      {
        fieldId: ItemField.DateCreated,
        operatorId: operators.GREATER_THAN.id,
        value: '2024-08-01',
      },
      {
        fieldId: ItemField.FormattedAddress,
        operatorId: operators.NOT_CONTAINS.id,
        value: '14 maja', // put here addresses to exclude - for which google maps can't get lat/lng correctly! TODO: check into flags that google returns indicating if it's not sure???
      },
    ];
    const skip = 0;
    const take = 1000;

    this.searchResponse = await this._service.searchItems(this.source, filters, skip, take);
    console.log('searchResponse: ', this.searchResponse);
    this.mapItemsToLocations(this.searchResponse.items);

    this.initMap();
  }

  mapItemsToLocations(items: Item[]) {
    items.forEach((item) => {
      const coords = item.parsedDetails[ItemField.AddressLatLng].split(',');
      const lat = parseFloat(coords[0]);
      const lng = parseFloat(coords[1]);
      const title = `${item.parsedDetails[ItemField.FormattedAddress]}, ${item.parsedDetails[ItemField.Locality]}`;

      this.locations.push({ title, lat, lng });
    });
  }
}
