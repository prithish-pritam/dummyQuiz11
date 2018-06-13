import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Slides, Platform } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { ScorePage} from '../score/score';
import { LandingPage} from '../landing/landing';
import { LitesqlProvider } from '../../providers/litesql/litesql';

/**
 * Generated class for the QuestionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-question',
  templateUrl: 'question.html',
})
export class QuestionPage {
  @ViewChild(Slides) slides: Slides;

  timeInSeconds: number;
 
  time: number;
  remainingTime: number;
  runTimer: boolean;
  hasStarted: boolean;
  hasFinished: boolean;
  displayTime: string;
  totalques: any;
  //ques_arr=[{ques : '', opts: [],questionId: '',questionAnswer: ''}];
  ques_arr=[];
  tmduration: any;
  ques_setname: any;
  correctans: number=0;
  wrongans: number=0;
  answer_stack=[];
  button_color=[];
  prev_togg: boolean= false;
  next_togg: boolean= true;
  qus_submit_togg: boolean= true;
  bullet_arr=['a','b','c','d','e'];
  btn_slid_navindex: any;

  // Property used to store the callback of the event handler to unsubscribe to it when leaving this page
  public unregisterBackButtonAction: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public alrtCtrl: AlertController,public rest : RestProvider,
  public sqlite: LitesqlProvider,public platform : Platform) {
      this.tmduration= this.navParams.get('examtime');
         
    ///access question from db
    this.sqlite.accessQuestion().then(data=>{      
      this.totalques=data;
      this.ques_setname= this.totalques[0].qus_setname;
      //this.tmduration= this.totalques[0].qus_totalduration;
      for(let i=0;i<this.totalques.length;i++){
        this.ques_arr.push({
          ques : this.totalques[i].qus_questionname,
          opts : this.totalques[i].qus_questionoptions.split('|||'),
          questionAnswer : this.totalques[i].qus_questionanswer,
          questionId : this.totalques[i].qus_questionid
        });
      }
      console.log("Access question from DB",this.ques_arr);
      for(let i=0;i<this.ques_arr.length;i++){
        this.button_color[i]='#8A2BE2';
      }
      this.presentConfirm();
    }).catch(err=>{console.log("Generated Error",err);});
  }

  ionViewDidEnter() {
    this.initializeBackButtonCustomHandler();
}

ionViewWillLeave() {
    // Unregister the custom back button action for this page
    this.unregisterBackButtonAction && this.unregisterBackButtonAction();
}

public initializeBackButtonCustomHandler(): void {
    this.unregisterBackButtonAction = this.platform.registerBackButtonAction(() => {
      console.log("Prevent hardware back button");
        //this.customHandleBackButton();
    }, 101);
}

  
  ngOnInit() {
    this.initTimer(this.tmduration);
    this.changeBtnColor();
  }
  
  initTimer(duration) {
     // Pomodoro is usually for 25 minutes
    if (!this.timeInSeconds) { this.timeInSeconds = duration; }
  
    this.time = this.timeInSeconds;
     this.runTimer = false;
     this.hasStarted = false;
     this.hasFinished = false;
     this.remainingTime = this.timeInSeconds;    
     this.displayTime = this.getSecondsAsDigitalClock(this.remainingTime);
  }
  
  startTimer() {
     this.runTimer = true;
    this.hasStarted = true;
    this.timerTick();
  }
  
  pauseTimer() {
    this.runTimer = false;
  }
  
  resumeTimer() {
    this.startTimer();
  }
  
  timerTick() {
    setTimeout(() => {
  
      if (!this.runTimer) { return; }
      this.remainingTime--;
      this.displayTime = this.getSecondsAsDigitalClock(this.remainingTime);
      if (this.remainingTime > 0) {
        this.timerTick();
      }
      else {
        this.hasFinished = true;
        this.submitresult();
        this.timesupAlrt();
      }
    }, 1000);
  }
  
  getSecondsAsDigitalClock(inputSeconds: number) {
    let sec_num = parseInt(inputSeconds.toString(), 10); // don't forget the second param
    let hours = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds = sec_num - (hours * 3600) - (minutes * 60);
    let hoursString = '';
    let minutesString = '';
    let secondsString = '';
    hoursString = (hours < 10) ? "0" + hours : hours.toString();
    minutesString = (minutes < 10) ? "0" + minutes : minutes.toString();
    secondsString = (seconds < 10) ? "0" + seconds : seconds.toString();
    return hoursString + ' hr :' + minutesString + ' min :' + secondsString+ ' sec';
  }

///Alertcontroller///
presentConfirm() {
  let alert = this.alrtCtrl.create({
    title: 'Test Set',
    message: 'Are you ready for test?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
          this.navCtrl.setRoot(LandingPage);
        }
      },
      {
        text: 'Confirm',
        handler: () => {
          console.log('timer start');
          this.startTimer();
        }
      }
    ]
  });
  alert.present();
}

timesupAlrt(){
  this.storeAnstoDB();//insert answer into db
  let alert = this.alrtCtrl.create({
    title: "Time's Up",
    message: 'OK, everyone, time’s up – hand in your tests.',
    buttons: [
      {
        text: 'Ok',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
          this.navCtrl.setRoot(ScorePage,{
            ques_ans: this.ques_arr,
            aswer_arr: this.answer_stack
          });
        }
      }
    ]
  });
  alert.present();
}

//collect answer//
setans(option,index){
  console.log(option,index);
  let set_togg: boolean= false;
  let set_index: number;
  if(this.answer_stack.length == 0){
    this.answer_stack.push({setid: this.rest.dbAnswersetInfo.setid,
      setname: this.rest.dbAnswersetInfo.setname,
      userid: this.rest.dbAnswersetInfo.userid,
      marksperquestion: this.rest.dbAnswersetInfo.marksperquestion,
      questionid: this.ques_arr[index].questionId,
      answerval: option,
      answertype: 'N'});
  }
  else{
    for(let j=0;j<this.answer_stack.length;j++){
      if(this.answer_stack[j].questionid == this.ques_arr[index].questionId){
        set_togg=true;
        set_index=j;
        break;
      }
    }
    if(set_togg){
      this.answer_stack[set_index].answerval= option;
    }else{
      this.answer_stack.push({setid: this.rest.dbAnswersetInfo.setid,
        setname: this.rest.dbAnswersetInfo.setname,
        userid: this.rest.dbAnswersetInfo.userid,
        marksperquestion: this.rest.dbAnswersetInfo.marksperquestion,
        questionid: this.ques_arr[index].questionId,
        answerval: option,
        answertype: 'N'});
    }
    console.log("Answer set:",this.answer_stack);
    
  }
  
  
   
}

////////////////////////////answer checked method///////////////////////



///marks submitted///
submitresult(){
  for(let k=0;k<this.answer_stack.length;k++){
    for(let a=0;a<this.ques_arr.length;a++){
      if(this.answer_stack[k].questionid == this.ques_arr[a].questionId){
        if(this.answer_stack[k].answerval == this.ques_arr[a].questionAnswer){
          this.answer_stack[k].answertype='Y';
          this.correctans++;
          }
          else{
            this.wrongans++;
          }
      }
    }
 }
 console.log("Correct Answer: "+this.correctans+"Wrongans: "+this.wrongans);
  this.pauseTimer();
  this.rest.totalcorrectans=this.correctans;
  this.rest.totalwrongans=this.wrongans;
  this.rest.noofsetattempt+=1;
  this.rest.totalmarks= this.correctans*this.totalques[0].qus_marksperques;
  // setTimeout(()=>{
  //   this.navCtrl.setRoot(ScorePage,{
  //     ques_ans: this.ques_arr,
  //     aswer_arr: this.answer_stack
  //   });
  // },250);
}

goTopreslide(){
  this.next_togg=true;
  let slideindex : any;
  if(this.btn_slid_navindex){//for button press
    slideindex=this.btn_slid_navindex-1;
    if(slideindex==0){
      this.prev_togg=false;
    }
    else{
      this.slides.slideTo(slideindex, 500);
    }
    this.btn_slid_navindex=null;
  }
  else{//for previous button
    let currentIndex = this.slides.getActiveIndex();
    console.log("CurrentIndex:", currentIndex);
    slideindex= currentIndex-1;
    if(slideindex ==0){
      this.prev_togg=false;
    }
    this.slides.slideTo(slideindex, 500);
  }
  
}

goTonextslide(){
  this.prev_togg=true;
  let totlen= this.ques_arr.length;
  let setlen= totlen-2;
  let slideindex : any;
  if(this.btn_slid_navindex){
    let ansstrLen= totlen-1;
    if(this.btn_slid_navindex==ansstrLen){
      this.next_togg=false;
      this.qus_submit_togg=false;
    }else{
      slideindex=this.btn_slid_navindex+1;
      this.slides.slideTo(slideindex, 500);
    }
    this.btn_slid_navindex=null;
  }else{
    let currentIndex = this.slides.getActiveIndex();
    console.log("CurrentIndex:", currentIndex);
    if(currentIndex == setlen){
    this.next_togg=false;
    this.qus_submit_togg=false;
    }
    slideindex= currentIndex+1;
    this.slides.slideTo(slideindex, 500);
  }
  
}

selectedSlide(index){
  this.prev_togg=true;
  this.next_togg=true;
  this.btn_slid_navindex=index;  
  console.log("button current index",this.btn_slid_navindex);
  if(this.btn_slid_navindex==0){
    this.prev_togg=false;
  }else if(this.btn_slid_navindex == (this.ques_arr.length-1)){
    this.next_togg=false;
    this.qus_submit_togg=false;
  }
  this.slides.slideTo(index, 500);
}

changeBtnColor(){
  for(let j=0;j<this.ques_arr.length;j++){
    for(let k=0;k<this.answer_stack.length;k++){
      if(this.ques_arr[j].questionId == this.answer_stack[k].questionid){
        if(this.answer_stack[k].answertype=='Y'){
          this.button_color[j]='#FF00FF';
        }
      }
    }
  }
}

storeAnstoDB(){
  for(let i=0;i<this.answer_stack.length;i++){
    this.sqlite.insertAnswer(this.answer_stack[i]);
  }
}

ansSubmit(){
  this.pauseTimer();
  this.submitresult();
  setTimeout(()=>{
    this.storeAnstoDB();
  },500);
  setTimeout(()=>{
    this.navCtrl.setRoot(ScorePage,{
      ques_ans: this.ques_arr,
      aswer_arr: this.answer_stack
    });
  },1000);
}

}
