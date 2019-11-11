import { Component, OnInit, ViewChild, AfterContentInit } from '@angular/core';
import { NativeGeocoder, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

declare var google;

@Component({
  templateUrl: 'map.page.html',
  styleUrls: ['map.page.scss']
})
export class MapPage implements OnInit, AfterContentInit {

  @ViewChild('mapElement', {static: true}) mapElement;
  map: any;
  address: string;

  constructor(private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder) {
  }

  ngOnInit() {
  }

  ngAfterContentInit() {
    this.loadMap();
    this.map = new google.maps.Map(
      this.mapElement.nativeElement,
      {
        center: {lat: 39.950384, lng: -76.728977},
        zoom: 18
      }
    );
  }

  loadMap() {
    this.geolocation.getCurrentPosition({maximumAge: 5000, timeout: 5000, enableHighAccuracy: false}).then((resp) => {
      const latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      const mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.map.addListener('tilesloaded', () => {
        console.log('accuracy', this.map);
        this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng());
      });
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  getAddressFromCoords(lattitude, longitude) {
    console.log('getAddressFromCoords ' + lattitude + ' ' + longitude);
    const options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
      .then((result: NativeGeocoderReverseResult[]) => {
        this.address = '';
        const responseAddress = [];
        for (let [key, value] of Object.entries(result[0])) {
          if (value.length > 0) {
          responseAddress.push(value);
          }
        }
        responseAddress.reverse();
        for (const value of responseAddress) {
          this.address += value + ', ';
        }
        this.address = this.address.slice(0, -2);
      })
      .catch((error: any) => {
        this.address = 'Address Not Available!';
      });
  }
}
