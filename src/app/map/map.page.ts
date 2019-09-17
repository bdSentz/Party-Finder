import { Component, OnInit, ViewChild, AfterContentInit } from '@angular/core';

declare var google;

@Component({
  templateUrl: 'map.page.html',
  styleUrls: ['map.page.scss']
})
export class MapPage implements OnInit, AfterContentInit {
  map;

  @ViewChild('mapElement', {static: true}) mapElement;
  constructor() {}

  ngOnInit() {
  }

  ngAfterContentInit() {
    this.map = new google.maps.Map(
      this.mapElement.nativeElement,
      {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
      }
    );
  }
}
