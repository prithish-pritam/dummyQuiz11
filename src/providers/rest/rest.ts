import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the RestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestProvider {

  basicurl : any;
  getallseturl: any;
  getonesetqus: any;
  totalcorrectans: number;
  totalwrongans: number;
  totalnoques: number;
  noofsetattempt: number=0;
  totalmarks: number;
  public dbAnswersetInfo={setid: '',setname: '',userid: '',marksperquestion: '',questionid: '',answertype:''};

  constructor(public http: HttpClient) {
    console.log('Hello RestProvider Provider');
  }

   //get method
   get_userdata(url){
    return new Promise ( resolve =>{
       this.http.get(url).subscribe(res =>{
         resolve(res);
       }, err =>{
         console.log("Error generate", err);
       });
     });
 }

 //post method
 post_userdata(url,data){
   //console.log(JSON.stringify(data));
   return new Promise((resolve, reject) =>{
     this.http.post(url, JSON.stringify(data)).subscribe(res =>{
       //console.log("postdata", JSON.stringify(res));
       resolve(JSON.stringify(res));
     }, (err) =>{
       reject(err);
     })
   })
 }

}
