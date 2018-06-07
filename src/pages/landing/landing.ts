import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,LoadingController} from 'ionic-angular';
import { RestProvider} from '../../providers/rest/rest';
import { LitesqlProvider } from '../../providers/litesql/litesql';
import { QuestionPage } from '../question/question';


/**
 * Generated class for the LandingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html',
})
export class LandingPage {

  setarr=[]; 
  restsetdata: any;
  ques_setURL="https://api.myjson.com/bins/1dw646";
  ques_URL= "https://api.myjson.com/bins/lwsom";
  loading : any;
  persetques: any;
  insQuesSet=[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public rest : RestProvider,private loadCtrl: LoadingController,public alrtCtrl : AlertController,
  public sqlite : LitesqlProvider) {
    this.addquesSet();
    this.presentLoadingDefault();
  }

  ionViewDidLoad(){
    this.sqlite.checkAnswer().then(data=>{
      console.log("total no of rows count:",data);
    if(data>0){
      this.sqlite.del_questset();
      this.sqlite.del_userans();
    }else{
      console.log("No more data in DB");
    }
    }).catch(err=>{console.log("Generated error",err);});
  }

 ////access question set/////
 addquesSet(){
  this.rest.get_userdata(this.ques_setURL).then(data =>{
    this.restsetdata=data;
    console.log(this.restsetdata);
    //this.restsetdata=JSON.parse(this.restsetdata);
    for(let i=0;i<this.restsetdata.length;i++){
      this.setarr.push({
        setname : this.restsetdata[i].setName,
        noofques: this.restsetdata[i].totalQuestions,
        permarks: this.restsetdata[i].markPerQuestion,
        duration: this.restsetdata[i].totalDuration
      });
    }
    setTimeout(() => {
      this.loading.dismiss();
    }, 2000);
  }).catch(err =>{
    console.log("Error generated",err);
  });
 }

 jumptoQues(data){
  let setId : any,
     setName : any,
     totalQuestions : any,
     markPerQuestion: any,
     totalDuration: any;
  for(let i=0;i< this.setarr.length;i++){
    if(data == this.setarr[i].setname){
      console.log("data match");
      if(data == 'Set-A'){
        this.rest.totalnoques=this.setarr[i].noofques;
        this.rest.get_userdata(this.ques_URL).then(res =>{
         this.persetques=res;
         console.log("Question set:",this.persetques);
         //setup question///////////
       setId= this.persetques.setId;
       this.rest.dbAnswersetInfo.setid=this.persetques.setId;
       setName=this.persetques.setName;
       this.rest.dbAnswersetInfo.setname=this.persetques.setName;
       totalQuestions =this.persetques.totalQuestions;
       markPerQuestion= this.persetques.markPerQuestion;
       this.rest.dbAnswersetInfo.marksperquestion=this.persetques.markPerQuestion;
       totalDuration=this.persetques.totalDuration;
       for(let i=0;i<this.persetques.questions.length;i++){  
         let qusoptset: any;
         let questoptarr=[];
         for(let k=0;k<this.persetques.questions[i].questionOptions.length;k++){
           questoptarr[k]=this.persetques.questions[i].questionOptions[k].optionValue;
         }        
         qusoptset= questoptarr.join('|||');
         console.log("Question option set:", qusoptset);
         this.insQuesSet.push({
           setid:setId,
           setname:setName,
           marksperques:markPerQuestion,
           totalduration:totalDuration,
           questionid:this.persetques.questions[i].questionId,
           questionname:this.persetques.questions[i].questionName,
           questionanswer:this.persetques.questions[i].questionAnswer,
           questionoptions:qusoptset
         });
       }
        console.log("Answer set:", this.insQuesSet); 
        for(let j=0;j<this.insQuesSet.length;j++){
          this.sqlite.insertQues(this.insQuesSet[j]);
        }
         this.navCtrl.push(QuestionPage,{
           examtime : totalDuration
         });
        }).catch(err =>{
         console.log("Generated error", err);
        });        
      }
    }
  }
  
}

 /////loader//
 presentLoadingDefault() {
  this.loading = this.loadCtrl.create({
    content: 'Please wait...'
  });

  this.loading.present();

  }

}
