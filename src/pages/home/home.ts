import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {LandingPage} from '../landing/landing';
import { LandingPageModule } from '../landing/landing.module';
import { ScorePage } from '../score/score';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  ////////////////////navigation control method///////////////////////////

  gotoSetlanding(data){
    if(data=='landing'){
      this.navCtrl.push(LandingPage); //for getting exam set
    }
    else{
      this.navCtrl.push(ScorePage);//for user result set
    }
    
  }



}
