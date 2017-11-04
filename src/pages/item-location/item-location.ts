import {  Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import {  Walmart } from '../../providers/walmart/walmart';
import {  Storage } from '@ionic/storage'
import { ItemDetailsPage } from '../item-details/item-details';
@Component({
  selector: 'page-item-location',
  templateUrl: 'item-location.html'
})
export class ItemLocationPage {
  selectedname;
  selectedupc;
  items = [];
  final = [];
  itemlength = 0;
  upc = "";
  showLoading = true;
  storelist = [];
  store
  showErrorMessage = false;
  id;
  item;
  constructor(public nav: NavController, public navParams: NavParams, public Data: Walmart, public storage: Storage) {
    this.selectedname = navParams.get('name');
    this.selectedupc = navParams.get('upc');
    this.id = navParams.get('id');
    this.item = navParams.get('item');
    var name = encodeURIComponent(name);
    this.storage.get('stores').then((val) => {
      this.storelist = JSON.parse(val);
      console.log(this.storelist)
      let i = 0;
      let i1 = setInterval(() => {
        let storeid = Number(this.storelist[i].id);
        let phone = this.storelist[i].phone;
        let city = this.storelist[i].address.city;
        let st = this.storelist[i].address.state;
        let address = this.storelist[i].address.address1;
        let distance = this.storelist[i].distance;
        let display = this.storelist[i].storeType.name
        this.Data.getWalmartStoreQuery(encodeURIComponent(this.selectedname), 0, storeid).subscribe((data) => {
          //let storecount = Number(data.results.length) + 1;
          this.addtoItems(data.results, storeid, phone, city, st, address, distance, display);
        },
          (err) => {
          });
        i++;
        if (i === this.storelist.length) {
          clearInterval(i1);
          setTimeout(() => {
            this.items.filter(it => {
              if (it.upc == this.selectedupc) {
                this.final.push(it);
            }else if(it.id == this.id){
                this.final.push(it);
            }else if(it.name == this.selectedname){
                this.final.push(it);
            }
            });
            this.showLoading = false;
            this.selectedupc = navParams.get('upc');
            if (!this.items) {
              this.showErrorMessage = true;
            }
          }, 2000);
        }
      }, 50)
    });
  }

  addtoItems(itemlist, storeid, phone, city, st, address, distance, display) {

    this.itemlength++
    itemlist.forEach((b) => {
      this.items.push({
        distance: distance,
        storeid: storeid,
        phone: phone,
        city: city,
        st: st,
        address: address,
        department: b.department,
        images: b.images,
        isWWWItem: b.isWWWItem,
        location: b.location,
        name: b.name,
        price: b.price,
        productId: b.productId,
        thumbnail: b.images.thumbnailUrl,
        inventory: b.inventory,
        largeImage: b.images.largeUrl,
        uOM: b.price.uOM,
        pPU: b.price.pPU,
        ratings: b.ratings,
        reviews: b.reviews,
        upc: b.productId.upc,
        id: b.productId.WWWItemId,
        store: true,
        display: display
      });
    });
  }
  itemTapped(event, item) {
    this.nav.push(ItemDetailsPage, {
      itemNbr: item.id,
      upc: item.upc,
      storeData: item
    });
  }
}
