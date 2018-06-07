import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LandingPage } from '../pages/landing/landing';
import { LitesqlProvider } from '../providers/litesql/litesql';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
   //rootPage:any = HomePage;
  rootPage:any = LandingPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public sqlite: LitesqlProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.sqlite.create_tbldb();//execute db
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

