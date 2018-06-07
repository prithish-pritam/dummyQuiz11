import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import {LitesqlProvider} from '../../providers/litesql/litesql';
import {LandingPage} from '../landing/landing';
import { Network } from '@ionic-native/network';

@IonicPage()
@Component({
  selector: 'page-score',
  templateUrl: 'score.html',
})
export class ScorePage {

 username: any;
 usermarks: number;
 usercorrectans: number;
 userwrongans: number;
 userattemptset: number;
 usernotattempt: number;
 question_set=[];
 answer_set=[];
 button_color=[];
 sync_togg: boolean= true;

  constructor(public navCtrl: NavController, public navParams: NavParams,public restapi : RestProvider,public sqlite: LitesqlProvider,public network: Network) {
    this.username= "DummyUser";
    this.usermarks= this.restapi.totalmarks;
    this.usercorrectans= this.restapi.totalcorrectans;
    this.userwrongans= this.restapi.totalwrongans;
    this.userattemptset= this.restapi.noofsetattempt;
    this.usernotattempt= (this.restapi.totalnoques-(this.usercorrectans+this.userwrongans));
    this.question_set=this.navParams.get('ques_ans');
    this.answer_set=this.navParams.get('aswer_arr');
    for(let i=0;i<this.question_set.length;i++){
       this.button_color[i]='#8A2BE2';
    }
    for(let j=0;j<this.question_set.length;j++){
      for(let k=0;k<this.answer_set.length;k++){
        if(this.question_set[j].questionId == this.answer_set[k].questionid){
          if(this.answer_set[k].answerStat=='Y'){
            this.button_color[j]='#FF00FF';
          }
        }
      }
    }
  }

  //start life cyclehook
  // ngOnInit(){
  //   if(this.network.type !== 'none'){
  //         this.sqlite.accessAnswer().then(data=>{
  //           console.log("Answer set:", JSON.stringify(data));
  //           if(data){
  //             this.restapi.post_userdata('http://13.127.160.248/tlt-work/Event/Event-Rest/save-result-api.php',data).then(res=>{
  //             console.log("From server",res);
  //           }).catch(err=>{console.log("Generated error in answerpart",err);});
  //           }            
  //         }).catch(err=>{console.log("Generated error in sumbitanswer",err);});
  //       }else{
  //         alert("Please check the internet connection");
  //       }
  // }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScorePage');
    if(this.network.type !== 'none'){
      this.resendData();
    }else{
      this.sync_togg=true;
    }
    
    
  }

  resendData(){
    if(this.network.type !== 'none'){
      this.sqlite.accessAnswer().then(data=>{
        console.log("Answer set:", JSON.stringify(data));
        this.restapi.post_userdata('http://13.127.160.248/tlt-work/Event/Event-Rest/save-result-api.php',data).then(res=>{
          console.log("From server",res);
          // if(res){
          //   this.sqlite.del_questset();
          //   this.sqlite.del_userans();
          // }
        }).catch(err=>{console.log("Generated error in answerpart",err);});
      }).catch(err=>{console.log("Generated error in sumbitanswer",err);});
      this.sqlite.del_questset();//changed
      this.sqlite.del_userans();//changed
    }else{
      alert("Please check the internet connection");
    }
  }

  switchtohome(){
    this.navCtrl.setRoot(LandingPage);
  }

}
