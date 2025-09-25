import { Component, Input, OnInit } from '@angular/core';

import { Item, PikerService, Source } from '../../piker.service';
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

  apiKey = 'AIzaSyBzZ-dfeaSbZZ7HbJ2KT7cTkm5VN_QarUw';
  locations = [];
  map: any;

  constructor(private _service: PikerService, private modalService: ModalService) {}

  async ngOnInit() {
    // console.log('item:', this.item);
    // console.log('source:', this.source);

    const result = await this._service.getCoords(this.source, this.item);
    console.log('Geocoding result:', result);
    this.locations.push({ title: result.address, ...result });

    this.loadGoogleMapsScript();
  }

  loadGoogleMapsScript(): void {
    if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => this.initMap();
      document.head.appendChild(script);
    } else {
      // If the script is already loaded, initialize the map directly.
      this.initMap();
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
      const position = { lat: location.lat, lng: location.lng };
      const marker = new google.maps.Marker({
        position: position,
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
}
