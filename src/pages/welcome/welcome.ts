import { Component, NgZone, ViewChild } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage'
import {Walmart} from '../../providers/walmart/walmart';
import {HomePage} from '../home/home';

/*
  Generated class for the WelcomePage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

@Component({
  templateUrl: 'welcome.html',
})

export class WelcomePage {
  @ViewChild('tutSlider') slider;
  nav:any;
  getzipcode:number;
  getdiscount:number;
  getstoreid:number;
  getstores:Array<any>;
  didtut:boolean;
  showskip:boolean = true;
  showBottom:boolean = false;
  loadingDone:boolean = false;
  showhelp:boolean = false;
  zone:any;
  Data:any;
  error: string = '';
  loading:boolean = false;

  constructor(private navCtrl: NavController, zone: NgZone, private Walmart: Walmart, private alertCtrl: AlertController, private storage: Storage) {
    this.Data = Walmart;
    this.nav = navCtrl;
    zone = zone;
    console.log('started');
    storage.get('tutcomplete3').then((val)=>{
      if(val === true){
        this.didtut = true;
      }
    })

  }
  ngAfterViewInit(){
    if(this.didtut){
      this.slideTo(6);
    }
  }
  nextSlide() {
    this.slider.slideNext();
  }
  prevSlide() {
    this.slider.slidePrev();
  }
  slideTo(id) {
    this.slider.slideTo(id);
  }
  changeStore(storeid, scity, sstate, szipcode) {

    this.storage.set('storeid', storeid);
    this.storage.set('zipcode', szipcode);
    this.storage.set('savedStore', JSON.stringify({
      storeid: storeid,
      city: scity,
      state: sstate,
      zipcode: szipcode
    }));
      this.storage.get('zipcode').then((val) =>{
          console.log(val);
        this.getzipcode = val;
      });
      this.storage.get('storeid').then((val) =>{
          console.log(val);
        this.getstoreid = val;
      }).then(() =>{
        this.alertCtrl.create({
          title: 'Setup Complete!',
          subTitle: 'Everything is setup<br>Your Store is <b>' + storeid + '</b>.<br>The zipcode is <b>' + szipcode + '</b>.',
          buttons: [
          {
            text: 'OK',
            handler: data => {
                setTimeout(() => {
                  this.storage.set('tutcomplete3', true);
                  console.log(this.getstoreid);
                  this.nav.setPages([ {page: HomePage} ]);
                }, 500);
            }
          }
        ]
      }).present();
      });
      this.getstores = [];
    }
loadStores(event) {
if (event.target.value.length < 5 || event.target.value.length > 5) {
  this.getstores = null;
  this.showhelp = false;
}
if (event.target.value.length === 5) {
    this.loading = true;
      this.getstores = null;
      this.Data.getStoresByZip(event.target.value).subscribe( data => {
        this.storage.set('stores', JSON.stringify(data.stores));
        if (typeof data.stores !== undefined) {
          this.getstores = data.stores;
          this.showhelp = true;
          console.log(this.getstores);
        }
        this.loading = false;
        },
      err => this.logError(err),
      () => console.log('Search Complete'));
}

}
logError(err) {
  this.error = err;
}
}
