import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Walmart } from '../../providers/walmart/walmart';
import { ItemLocationPage } from '../item-location/item-location';
import { Storage } from '@ionic/storage'
import { SocialSharing } from '@ionic-native/social-sharing';

@Component({
  selector: 'page-item-details',
  templateUrl: 'item-details.html'
})
export class ItemDetailsPage {
  itemNbr;
  upc;
  storeid;
  ItemData;
  type;
  store;
  loading = true;
  error = false;
  name;
  image;
  constructor(public navCtrl: NavController, public navParams: NavParams, public Data: Walmart, public storage: Storage, private socialSharing: SocialSharing) {

    this.itemNbr = navParams.get('itemNbr');
    this.upc = navParams.get('upc');
    this.type = navParams.get('type');
    this.name = navParams.get('name');
    this.image = navParams.get('image');
    this.store = navParams.get('storeData');
    console.log('store', this.store);
    this.getData(this.itemNbr, this.upc, this.type);
    storage.get('storeid').then((val) => {
      this.storeid = val;
      // this.getData('upc');

    })
  }

  getData(itemNbr,upc, type) {
    if(type == 'upc'){
      //alert(upc);
      this.Data.getWalmartDotcomUPC(upc).subscribe((data) => {
        console.log(data);
        this.ItemData = data;
        this.loading = false;
        this.upc = data.product.upc;
        this.image = data.product.imageAssets[0].versions.thumbnail;
        this.name = data.product.productName;
        this.itemNbr = data.product.buyingOptions.usItemId;
      }, (err) => {
        this.loading = false;
        this.error = true;
      })
    }else{
      this.Data.getWalmartDotcomID(itemNbr).subscribe((data) => {
        console.log(data);
        this.ItemData = data;
        this.loading = false;
      }, (err) => {
        this.loading = false;
        this.error = true;
      })
    }

  }
  shareItem(message, subject, url) {
    this.socialSharing.shareWithOptions({
      message: message, // not supported on some apps (Facebook, Instagram)
      subject: subject, // fi. for email
      url: url,
      chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
    }).then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }
  itemLookup() {
    if (this.ItemData.product.productName) {
      this.navCtrl.push(ItemLocationPage, {
        upc: this.upc,
        name: this.name,
        id: this.itemNbr,
        item: {
            name: this.name,
            image: this.image
        }
      })
    }
  }
}
