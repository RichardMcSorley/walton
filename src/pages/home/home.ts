import { Component } from '@angular/core';
import { NavController} from 'ionic-angular';
import {Walmart} from '../../providers/walmart/walmart';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ItemDetailsPage } from '../item-details/item-details';
import { Keyboard } from '@ionic-native/keyboard';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';


@Component({
  templateUrl: 'home.html'
})
export class HomePage {
  walmartblog: Array<any> = [];
  dotcomitems: Array<any> = [];
  storeitems: Array<any> = [];
  loading: boolean = false;
  searchset;
  Data;
  searchInput: string = '';
  querySearch: string = '';
  error: string = '';
  storecount: number = 0;
  dotcomcount: number = 0;
  storetotalcount: number = 0;
  dotcomtotalcount: number = 0;
  seeauto = null;
  autocomplete: Array<any> = [];
  showAuto: boolean = false;
  finalblog: Array<any> = [];
  blogview: boolean = true;
  testUPC = '044000044695';

  public constructor(private nav: NavController, public Walmart: Walmart, private barcodeScanner: BarcodeScanner, private keyboard: Keyboard, private socialSharing: SocialSharing) {

    this.querySearch = '';
    this.Data = Walmart;
    this.loading = true;
    this.error = '';
    this.Data.reloadData();
    this.Data.getWalmartBlog().subscribe(data => {
      data.items.forEach((item) => {
        item.blogname = 'Walmart Today';
        var aimage = 'assets/images/walmarttoday.png';
        item.aimage = aimage;
      });
      this.walmartblog = this.walmartblog.concat(data.items);
      //this.shuffle(this.walmartblog);
      this.loading = false;
    },
      err => this.logError(err),
      () => {
        console.log('Loaded Walmart Today Blog')
        this.loadBlog();
      });
  }
  loadBlog() {
    if (this.walmartblog.length !== 0) {
      for (var i = 0; i < 8; i++) {
        if (this.walmartblog.length <= 8) {
          console.log('loaded all blog posts');
          this.walmartblog.forEach(item => {
            this.finalblog = this.finalblog.concat(item);
            this.walmartblog.splice(i, 1);
          });
          this.walmartblog = [];
        } else {
          console.log('loaded some blog posts');
          this.finalblog = this.finalblog.concat(this.walmartblog[i]);
          this.walmartblog.splice(i, 1);
        }
      }
    }
  }
  dontShowAuto() {
    setTimeout(() => {
      this.showAuto = false;
      this.autocomplete = [];
      this.keyboard.close();
    }, 250);

  }
  doShowAuto() {
      this.showAuto = true;
  }
  getItems(event) {

    this.searchInput = event.target.value;
    this.autocomplete = [];
    this.blogview = false;
    this.error = '';
    this.keyboard.close();
    //this.searchInput = query.target.value;
    this.dontShowAuto();
    this.error = '';
    if (this.searchset == null) {
      this.searchset = 'store';
    }
    let query = event.target.value;
    if (query === '' || query == null) {
      this.error = 'Type what you are looking for above, Then choose Walmart.com or My Store';
    } else {
      console.log(query);
      this.loading = true;
      if (this.searchset === 'store') {
        this.storeitems = [];
        this.storecount = 0;
        this.Data.getWalmartStoreQuery(query, this.storecount, this.Data.storeid).subscribe(data => {
          this.storeitems = data.results;
          this.storetotalcount = data.totalCount;
          console.log(data);
          this.loading = false;

        },
          err => this.logError(err),
          () => console.log('Loaded Store Search'));
      }
      if (this.searchset === 'dotcom') {
        this.dotcomitems = [];
        this.dotcomcount = 0;
        this.Data.getWalmartDotcomQuery(query, this.dotcomcount).subscribe(data => {
          this.dotcomitems = data.item;
          this.dotcomtotalcount = data.totalCount;
          console.log(data);
          this.loading = false;
        },
          err => this.logError(err),
          () => console.log('Loaded dotcom Search'));
      }
    }

  };

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
  doInfiniteBlog(infiniteScroll) {
    this.loadBlog();
    infiniteScroll.complete();

  }
  doInfinite(infiniteScroll) {
    var query = this.searchInput;
    this.storecount += 21;
    if (this.storecount <= this.storetotalcount) {
      this.Data.getWalmartStoreQuery(query, this.storecount, this.Data.storeid).subscribe(data => {
        if (data.results.length > 0) {
          this.storeitems = this.storeitems.concat(data.results);
        }
        this.loading = false;
        infiniteScroll.complete();
      },
        err => this.logError(err),
        () => console.log('infiniteScroll Complete'));
    } else {
      infiniteScroll.complete();
    }
  }
  doInfiniteDotcom(infiniteScroll) {
    var query = this.searchInput;
    this.dotcomcount += 50;
    if (this.dotcomcount <= this.dotcomtotalcount) {
        this.Data.getWalmartDotcomQuery(query, this.dotcomcount).subscribe(data => {
          this.dotcomitems = this.dotcomitems.concat(data.item);
          this.dotcomtotalcount = data.totalCount;
          console.log(data);
          this.loading = false;
          infiniteScroll.complete();
        },
          err => this.logError(err),
          () => console.log('Loaded dotcom Search'));
    } else {
      infiniteScroll.complete();
    }
  }
  autoComplete(event) {
    this.doShowAuto();
    //this.autocomplete = [];

    if (this.seeauto !== null) {
      this.seeauto.unsubscribe();
    }
    if (event.target.value && event.target.value.length >= 1) {
      this.seeauto = this.Data.autoComplete(event.target.value).subscribe(data => {
        this.autocomplete = this.Data.fixautoComplete(data);
      },
        err => console.log(err),
        () => console.log('Auto complete Loaded'));
    }
  };

  openDetailsPageStore(itemNbr, upc, store, name, image ) {
    this.nav.push(ItemDetailsPage, {
      itemNbr: itemNbr,
      upc: upc,
      type: 'store',
      storeData: store,
      name: name,
      image: image
    })
  }
openDetailsPageDotcom(id, upc, name, image ) {
    this.nav.push(ItemDetailsPage, {
      itemNbr: id,
      upc: upc,
      type: 'id',
      name: name,
      image: image
    })
  }
  logError(err) {
    this.loading = false;
    this.error = err;
  };

  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
  scanBarcode() {
    var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
    if (app) {
      this.barcodeScanner.scan().then((data) => {
        if (data.text !== "") {
          this.nav.push(ItemDetailsPage, {
            upc: data.text,
            type: 'upc'
          })
        }

      })
    } else {
      this.nav.push(ItemDetailsPage, {
        upc: this.testUPC,
        type: 'upc'
      })
    }

  }
  selectSide(query, set){
      var aquery = {
          target: {
              value: query
          }
      }
      if(set === 'store'){
          this.getItems(aquery);
      }

      if(set === 'dotcom'){
          this.getItems(aquery);
      }
  }
}
