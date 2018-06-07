import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule} from '@angular/common/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LandingPage} from '../pages/landing/landing';
import { ScorePage} from '../pages/score/score';
import { QuestionPage} from '../pages/question/question';

import { RestProvider } from '../providers/rest/rest';
import { LitesqlProvider } from '../providers/litesql/litesql';

import { SQLite } from '@ionic-native/sqlite';
import { Network } from '@ionic-native/network';


@NgModule({
  declarations: [
    MyApp,
    HomePage,LandingPage,ScorePage,QuestionPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,LandingPage,ScorePage,QuestionPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RestProvider,
    LitesqlProvider,
    SQLite,
    Network
  ]
})
export class AppModule {}
