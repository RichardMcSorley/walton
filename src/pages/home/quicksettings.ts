import { Component, ViewChild, ElementRef } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage'
import 'rxjs/add/operator/map';

@Component({
  template: `
      <ion-item>
      <p>Change stores:</p>
      </ion-item>
      <ion-item [ngClass]="{'activated' : store.id == sitenum}" *ngFor="let store of stores" (click)="changeStore(store.id, store.address.city, store.address.state, store.address.postalCode)">
      <h2><ion-icon color="yellow" name="pin"></ion-icon><b color="mediumblue"> #{{store.id}}</b></h2>
    <p>{{store.address.address1}}</p>
    <p><b>
    {{store.address.city}}, {{store.address.state}}
    </b></p>

  </ion-item>
  `
})
export class PopoverPage {
  @ViewChild('popoverContent', { read: ElementRef }) content: ElementRef;
  stores = [];
  getzipcode;
  getsalestax;
  getstoreid;
  storeid;
  sitenum;
  salestax;
  constructor(private navParams: NavParams, private viewCtrl: ViewController, private storage: Storage) {
    storage.get('storeid').then((val) => {
      val = JSON.parse(val);
      this.sitenum = val;
    })
    this.salestax = [
      'https://taxcloud.net/ajax/lite.aspx?address1=&address2=&city=',
      '&state=',
      '&z=',
      '&tic=&country=US&_=1454305022612',
      '&distance=50&is_search=true'
    ];
    storage.get('stores').then((val) => {
      val = JSON.parse(val);
      this.stores = val;
    })
  }
  ngOnInit() {
    if (this.navParams.data) {
      this.storeid = this.navParams.data.storeid;
    }
  }
  changeStore(storeid, scity, sstate, szipcode) {
    this.storage.set('storeid', storeid);
    this.storage.set('zipcode', szipcode);
    this.storage.get('storeid').then((val) => {
      this.getstoreid = val;
    });
    this.storage.get('zipcode').then((val) => {
      this.getzipcode = val;
    });
    this.storage.set('savedStore', JSON.stringify({
      storeid: storeid,
      city: scity,
      state: sstate,
      zipcode: szipcode
    }));
    this.viewCtrl.dismiss();
  }
  logError(err) {
    console.log(err)
  }
  close() {
    this.viewCtrl.dismiss();
  }

}
