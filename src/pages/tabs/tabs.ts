import {Component} from '@angular/core'
import {HomePage} from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  public tab1Root: any;

  constructor() {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.tab1Root = HomePage;
  }
}
