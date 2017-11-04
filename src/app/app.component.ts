import { Component, ViewChild } from '@angular/core';
import { Platform,  NavController, MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { WelcomePage } from '../pages/welcome/welcome';
import { HomePage } from '../pages/home/home';
import { Walmart } from '../providers/walmart/walmart';


@Component({
  template: `
    <ion-menu [content]="content" #nav class="app-menu">
      <ion-content class="menu-content">
        <header class="menu-header">
          <div class="app-icon">
            <img src="assets/images/icon.png" alt="Walmart Spark Logo">
          </div>
          <div class="version-display">
            <p class="version-title">Walmart #{{Data?.savedStore?.storeid}}</p>
            <p class="version-subtitle">{{Data?.savedStore?.city}} {{Data?.savedStore?.state}}, {{Data?.savedStore?.zipcode}}</p>
          </div>
        </header>

        <ion-list no-lines>
          <div class="menu-item"
                menuClose
                ion-item
                detail-none
                *ngFor="let item of pages"
                (click)="openPage(item.component)">
            <div class="menu-flex-container">
              <span class="menu-item-title">
                {{ item.title }}
              </span>
            </div>
          </div>
        </ion-list>
      </ion-content>
    </ion-menu>
  <ion-nav #content [root]="rootPage"></ion-nav>`
})
export class MyApp {
  @ViewChild('nav') nav: NavController;
  local;
  pages = [
    { title: 'Home', component: HomePage },
    { title: 'About', component: WelcomePage}
  ];
  rootPage: any;
  menu;
  constructor(public platform: Platform, menu: MenuController, private storage: Storage, public Data: Walmart, private splashScreen: SplashScreen, private statusBar: StatusBar) {
  this.menu = menu;
  storage.get('tutcomplete3').then((val)=>{
    console.log('d');
    if(val === true){
      this.rootPage = HomePage;
    }
    else{
      this.rootPage = WelcomePage;
    }
  })
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      setTimeout(()=>{
           splashScreen.hide();
      }, 2000)

    });
  }
  openPage(page) {
    this.rootPage = page;
    console.log(this.nav);
    this.menu.close();
  }
}
