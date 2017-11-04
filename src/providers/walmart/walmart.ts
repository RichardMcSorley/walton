import { Injectable, NgZone } from '@angular/core';
import { Platform, PopoverController } from 'ionic-angular';
import { Storage } from '@ionic/storage'
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { PopoverPage } from '../../pages/home/quicksettings';
import { CallNumber } from '@ionic-native/call-number';

@Injectable()
export class Walmart {
  zipcode: number;
  storeid: number;
  testUPC = '8884620985';
  walmart;
  platform;
  savedStore;

  constructor(
    private http: Http,
    zone: NgZone,
    platform: Platform,
    private storage: Storage,
    public popoverCtrl: PopoverController,
    private callnumber: CallNumber,
    private iab: InAppBrowser) {

    this.walmart = {
      rss2json: 'https://rss2json.com/api.json?rss_url=',
      blog: 'http://corporate.walmart.com/rss?feedName=blog-posts',
      dotcom: {
        query: [
          'http://mobile.walmart.com/m/j?e=1&version=2&service=Browse&method=searchByDepartmentFiltered&p1=',
          '&p2=ENTIRESITE&p3=All&p4=RELEVANCE&p5=',
          '&p6=50&p7=%5B%5D'
        ],
        upcq: 'https://www.walmart.com/product/mobile/api/upc/',
        item: 'https://www.walmart.com/product/mobile/api/'
      },
      store: {
        query: [
          'http://search.mobile.walmart.com/search?query=',
          '&store=',
          '&size=20&offset='
        ],
        items: 'https://search.mobile.walmart.com/items'
      },
      storebyzip: [
        'https://www.walmart.com/store/ajax/finder?location=',
        '&distance=50&is_search=true'
      ],
      storebygps: [
        'https://mobile.walmart.com/m/j?e=1&service=StoreLocator&method=locate&version=2&p1=',
        'p2=',
        '&p3=500&p4=0&p5=50'
      ]
    };
    this.reloadData();
  }
  presentPopover(event) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({ ev: event });
    popover.onDidDismiss(() => {
      this.reloadData();
    })
  }
  textToBase64Barcode(text) {
      return this.startConvert(text)
  }
  startConvert(text){
      try {
          return this.convertStringToCanvas(text, 'UPC')
      }
      catch (e) {

        try{
            return this.convertStringToCanvas(text, 'EAN')
        }
        catch(e){

            try{
                return this.convertStringToCanvas(text, 'EAN8')
            }
            catch(e){

                try{
                    return this.convertStringToCanvas(text, 'EAN5')
                }
                catch(e){

                    try{
                        return this.convertStringToCanvas(text, 'EAN5')
                    }
                    catch(e){

                        return this.removeCharacter(text)
                    }
                }
            }
        }
      }
  }
  removeCharacter(text){
      if(text.length < 5){
          return this.convertStringToCanvasError()
      }
      text = text.substr(1);
      try {
          return this.convertStringToCanvas(text, 'UPC')
      }
      catch (e) {

        try{
            return this.convertStringToCanvas(text, 'EAN')
        }
        catch(e){

            try{
                return this.convertStringToCanvas(text, 'EAN8')
            }
            catch(e){

                try{
                    return this.convertStringToCanvas(text, 'EAN5')
                }
                catch(e){

                    try{
                        return this.convertStringToCanvas(text, 'ITF14')
                    }
                    catch(e){
                        console.log(e)
                        return this.removeCharacter(text)
                    }
                }
            }
        }
      }
  }
  convertStringToCanvas(text, type){
      var canvas = document.createElement('canvas');
      JsBarcode(canvas, text, { format: type, lineColor: '#000', background: 'transparent', displayValue: false, height: 50, width: 150 });
      return canvas.toDataURL('image/png');
  }
  convertStringToCanvasError(){
      return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVQAAABVCAYAAAAWuRykAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAACedJREFUeNrsnYGRozYUhtlMGnA6iK8EroHMeEtgO4hdwroEu4R1OlhKWM+kgaOEdUpwCRue75EjPoyehMDAft8Mc8kaY0DSr/ekp6eHj4+PBAAAuvMLrwAAAEEFAEBQAQAQVAAAQFABABBUAAAEFQAAQQUAAAQVAABBBQBAUAEAAEEFAEBQAQAQVAAABBUAABBUAICB+JVXALf4/Y+/nNnH//n7zweeBwBBheGEbFX+sy6PTP9UlEdeiteetwMIKtYA2OuBCOnL1Z9TOcrPRGAfy3pwxsK/z/W1s1uUx7JWNovaKcvaZ3VOegjH8pAyLMrfK+7QWae1+76+/6S6t9q/ct/HPuodFir0WdmlYu9aTknVcsVSvR9vgd+rC+2qVuYiVnl5HErBOvUoopkeC8NXFrV7zGrXydVTymPdG5NS0CeWCr/mNc0KEdnn8ngvBWunnWo0b6c83rUTWBvF1FU/05gPj6BCnyyMDRDmiQjrt1IEO4mWfL88viXfh45i15cjggpTwTJGdeI1zd5ifSsFMUgIy+9dRDm2JVlRuvsIKkyG3CCqB17Tp/BUXgPEVCzSXY/3dYx9QQQVekNnUbctpxQI6qS8jWPt8J0hT9Xa9BHTvsfXowsqs/zQt6gedOaXONTp8ltTiJG68VKmz4ltvFzOc5a5Cm+ImJ60bjWFbq2Sn0PAood4IagwhKge+7AGYFBPo+nvImD7UgDFy5CZd9c450Jij9vClDQkysfNP6uXkztiYPe1TuCy0CT2+CmCCgBRBLcUqsfyP98NlqqIbn5DTOW7Lx4/LdfZ+AToaydwSHoaamIMFQBiWbGWIZw2K3ad2MOiREifxrbKDkEFgFhYVhytWqxT66TVVsbmx/gCRuvy61hK27K4fflStw2FstZecFnrDWWspFq/mxt+WwbaX40Fuzc+j1wvc5wma6G/Oq6zrD3fqtbr112t/9ZW6zMXdyzHXtaza7D4So+m568mvooEhrJST2W5hH7duvJp1JOZUx5DTRuEdOfoFdc647xtE1b5rDzvbCjgLLGvQ18Zzjm0iOi6Jh7W38r0+yftgCYfoqRCunO8z0pon8vzj1reCOu4yYznbcf8EGN2+QtjA1uoJWudGRRxejXExFnEJ7WsVa5l9PF2mWQ9dPJ9sP85CV8tIs/8Ul7rLeba6juIabVqZuXxtYuno2UA/ZaPZfzz3OJ1OQ2OvhKuzF5QDYPNSxWH0GVpO00tZxa3Dj2rtbL0PcBeictigo21y6qZoJU6EFS/Qgwla2c3eg9rypNSS20kXZIlvNzqVdVFtPSGFrG0iO7R8+9dhkomJS5qpXddNbNIoG8sZVQEls15CsM2U5/lj+HGPXfsETPDkERqqCz5DWEPWebnfG8O63xMYpol9tlfuF85WYekThEtWwR1jL1qiwtscfsXjvRkFuvUJdz5VcWSgfmn5Hu2+4fqKP9fIgQ2xso3FZHaUUUn4UFYyul8o01ZLNRJCOqcVkpVKyCK5EeGbqsVljWJmoaBHA09aNZS4JZeOzd8fnm+tnFWdYkuCUdkAspx3zIGnY7ZjVKrxzqkc9D3U1xZt+tInsxnFszl9WSQTvJVmfOtZZTfqL+WNjKJbXLmIqjSkDbXhVcWujQuy1K21CFmrga5Cvzs0vO6RC1wLfzBeN9j7vnXxob21LQuW4dR8oEyF82Z9w7xpfVymn0ynDkIatEgplWDOqiV4hKWpUNQdw63JL3Ri6eG3rvTfja137jeZM26185YrSLLuxO2riQXUj9qSTHgPmzHHvKEoP6wxFyC5WpIaUtjPOtmXi4LZ9VwL6sI998kNtUGZdb41hDL/N6YJio8FiscEgT1nh5k15CnSURpzGFSymXhHSMU1jFQAFwNOPeJPZUxRd2krFrGOudQIFPsrvViMXe2BC82tzzIGrHCExHUrrgEKYaboY3RdZ0gQbW6v7pJ2S75PJvazWbm95MiRshXo2WKoH5CXOK3qC9vVLe8jbMxUYtUpLepVKghXf4JBHoXhvIN8jKM3xv6/VTJniWc79GjfCznLbrunjoEJJj2E9RngwgcjT3qwdBoliqmrPKZJpbhnDQJWw03ZKjRqcEzOulRZTUrOmTAt3qR2di9EgTV7vYXGoaVGq2qGO7+i4frm19XakvqPOgVqysbIkTLSL9vqftfBhgesCCLcPZjSyqNy9+f21/PPtUmvM7Y01q+TxcSjiJjVfs+9sgZMxNwAfscG0wj/f4YjJWT1e1PRr5yDkGNK6gXy9SQKs5yHcuS1e2Mdw4NjawYk/haRCLzHUfV87NI73BKbauyUke7SANB9e9JXQVvye1oyrVqOGfOe9pbrCufhrW6Q30xu7Kel7Zktz9PLKm21GWrK/8yVlFFUONbTq6s+tbYU8ss93nC7nAM625pSBTuu1/RPSyvnTUBdm3HglgW31iMFd+lqSKqu7Hl9kVQwxrI2WFZpkNUdEeG9KmnvLNad7s2UR1BpIS1vF9doXb6+ZuHxTc1DonfuK+U+7sueFka24yEX2Wa3yE6zPIH9KSOpaht6+jPHit2LHtaSYXaNFQa+Xs28fd80vdseY5q94VDzbKtMo7ddUWZ7k/WFHbUVG9eNZIkv7LQU30Oq9dxmOIeWtq2Nh6dRvXedloHqsmtW7sC/C83sUYMRJ24Q1DDrY6QMRwfq+FoEJO19szVSi7fhjcFi8XaMSyT8c4AS/5a6y4Jacfym3RWJxl3VlENsSCrJEGZx7uOKqi4/IGFHlgQPu6+1eVdaeWrNipMZ/ae9zN4jnxAF3zyWZ10ueoQu5tGX8aNoHazUn0ofNwwrVQnXvNFUIuI17qnldq3Gz6LrcK1/ktZbXr+meiRHwhqN3e0TwEWnpJuyweLGTQsef7HCM8i44rbGTxHm2W6nVMD087ha4/vLLo3h6CGF/bJs6DzgN8otJcOEdWNwW1aTuRdV2IUGqh+MKSQG+Q5ZFVbZHdW6uHjXBd4SBvQd7bpwWNbxA67QlCHcfvz0HEtHX/zEZN62jSXEC8n1LBEjB5VjKwdjLzzpysxbS2HIeJ3Vfy+JH7B7E3lLLlGv3yGJcdSnzWnwCaJE3p4TnoY12aWv7vbvzNW/k69tIiqNvZqFr/a6qTK+nPZd6o+TqsJXRKHgCzGnGzihhjtNUwqTX6eFa8mDI83QtRcIUyLgZ7jpOKw0fjS+hYtq4Z7rjyi6tk+5fi6GgqH2vbs9baQ3ii/qv0VKqTHvsLKHj4+SEgEAIDLDwCAoAIAIKgAAICgAgAgqAAACCoAAIIKAAAIKgAAggoAgKACAACCCgCAoAIAIKgAAAgqAAAgqAAACCoAAIIKAICgAgAAggoAgKACACCoAACAoAIAIKgAAAgqAMDc+VeAAQC5DcaHBZz9gQAAAABJRU5ErkJggg=='
  }

  reloadData() {
    this.storage.get('zipcode').then((val) => {
      this.zipcode = val;
    });
    this.storage.get('storeid').then((val) => {
      this.storeid = val;
    });
    this.storage.get('savedStore').then((val) => {
      this.savedStore = JSON.parse(val);
      console.log('Store', this.savedStore);
    });
  }
  getWalmartBlog() {
    return this.http.get(this.walmart.rss2json + this.walmart.blog).map(res => res.json());
  }
  getWalmartDotcomQuery(query, offset) {
    return this.http.get(this.walmart.dotcom.query[0] + query + this.walmart.dotcom.query[1] + offset + this.walmart.dotcom.query[2]).map(res => res.json());
  }
  getWalmartDotcomUPC(upc) {
    return this.http.get(this.walmart.dotcom.upcq + upc).map(res => res.json());
  }
  getWalmartDotcomID(id) {
    return this.http.get(this.walmart.dotcom.item + id).map(res => res.json());
  }
  getWalmartStoreQuery(query, offset, store) {
    return this.http.get(this.walmart.store.query[0] + query + this.walmart.store.query[1] + store + this.walmart.store.query[2] + offset).map(res => res.json());
  }
  autoComplete(query) {
    return this.http.get('https://www.walmart.com/search/autocomplete/v1/0/' + query).map(res => res.text());
  }
  getStoresByZip(query) {
    return this.http.get(this.walmart.storebyzip[0] + query + this.walmart.storebyzip[1]).map(res => res.json());
  }
  cleanText(text) {
    return text.replace(/<\/?[^>]+(>|$)/g, '');
  };

  fixautoComplete(data) {
    var str;
    if (data.length >= 330000) {
      console.log('autocomplete returning null');
      return null;
    } else if (data.length > 50) {
      str = data.slice(0, -2);
      str = str.substring(61);
      try {
        console.log('autocomplete', str);
        str = JSON.parse(str);
        console.log('autoComplete', str);
        var str = [].slice.call(str.R);
        str.shift();
        return str;
      } catch (e) {
        console.log('autocomplete', e);
      }
    } else {
      console.log('autocomplete returning null');
      return str;
    }
  }

  openBarcodeScanner() {
    this.platform.ready().then(() => {
      var app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
      if (app) {
        if (cordova.plugins.barcodeScanner) {
          cordova.plugins.barcodeScanner.scan(
            (result) => {
              return result.text;
            },
            (error) => {
              alert('Scanning failed: ' + error);
            },
            {
              'preferFrontCamera': false,
              'showFlipCameraButton': true,
              'prompt': 'To scan, center the code and hold steady' // supported on Android only
            }
          );
        };
      } else {
        return this.testUPC;
      }
    });
  };

  callPhone(number) {
    this.callnumber.callNumber(number, true)
      .then(() => console.log('Launched dialer!'))
      .catch(() => console.log('Error launching dialer'));
  }

  launch(url) {
    let app = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
    if (app){
      if (InAppBrowser){
        this.iab.create(url, '_system', 'location=true');
      }
    }
    else{
      console.log('URL', url)
      window.open(url);
    }
  }
}
