import { NgModule, ErrorHandler } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { WelcomePage } from '../pages/welcome/welcome';
import { TabsPage } from '../pages/tabs/tabs';
import { Walmart } from '../providers/walmart/walmart';
import { ItemLocationFilter } from '../providers/pipes/item-location';
import { PopoverPage } from '../pages/home/quicksettings'
import { ItemDetailsPage } from '../pages/item-details/item-details'
import { ItemLocationPage } from '../pages/item-location/item-location'
import { MasonryModule } from 'angular2-masonry';
import { Keyboard } from '@ionic-native/keyboard';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { CallNumber } from '@ionic-native/call-number';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SocialSharing } from '@ionic-native/social-sharing';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    WelcomePage,
    PopoverPage,
    ItemDetailsPage,
    ItemLocationPage,
    ItemLocationFilter
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp), MasonryModule, IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    WelcomePage,
    PopoverPage,
    ItemDetailsPage,
    ItemLocationPage
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, Walmart,
    Keyboard,
    BarcodeScanner,
    CallNumber,
    InAppBrowser,
    SplashScreen,
    StatusBar,
    SocialSharing]
})
export class AppModule { }
