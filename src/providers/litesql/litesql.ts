import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
/*
  Generated class for the LitesqlProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LitesqlProvider {

  dbset: SQLiteObject;
  litedata: {};

  constructor(public http: HttpClient, public sqlite : SQLite) {
    console.log('Hello LitesqlProvider Provider');
  }

  ////////////create database and table///////////////////
  create_tbldb(){
    this.sqlite.create({
      name: 'examquizdb.db',
      location: 'default'
    }).then((db : SQLiteObject) =>{
      this.dbset= db;
      //create Question set table
        db.executeSql('CREATE TABLE IF NOT EXISTS questionset_tbl (id INTEGER PRIMARY KEY AUTOINCREMENT,set_id INT, setname varchar(255), totalnumques INT, marksperques INT, totalduration INT)',{})
        .then(res =>{
          console.log("Create QuestionSet  table successfully", res);
        }).catch(e =>{
          console.log("Error",e);
        });

        //create perSet Question table
        db.executeSql('CREATE TABLE IF NOT EXISTS persetques_tbl(id INTEGER PRIMARY KEY AUTOINCREMENT,setid INT, setname varchar(255),marksperques INT,totalduration INT,questionid INT,questionname varchar(255),questionanswer varchar(255),questionoptions varchar(255))',{})
        .then(res => {
          console.log("Create table Perset_question",res);
        }).catch(e =>{
          console.log("Error", e);
        });

        //create Answer set  table 
        db.executeSql('CREATE TABLE IF NOT EXISTS answerset_tbl(id INTEGER PRIMARY KEY AUTOINCREMENT,setid INT, setname varchar(255), userid INT, marksperquestion INT, questionid INT,answerval varchar(255), answertype varchar(255))',{})
        .then( res => {
          console.log("Create Answer table table successfully", res);
        }).catch(e => {
          console.log("Error",e);
        });

        
    }).catch(e =>{
      console.log("Error",e);
    });

  }
  // method end //

  //insert data into table//
  insertQues(data){
    this.dbset.executeSql('INSERT INTO persetques_tbl(setid,setname,marksperques,totalduration,questionid,questionname,questionanswer,questionoptions) VALUES (?,?,?,?,?,?,?,?)',[
      data.setid,data.setname,data.marksperques,data.totalduration,data.questionid,data.questionname,data.questionanswer,data.questionoptions]).then(res =>{
      console.log("Insert questioset successfully");
    }).catch(err =>{
      console.log("Generated error",err);
    });
  }

  //insert anserset ///
  insertAnswer(data){
    this.dbset.executeSql('INSERT INTO answerset_tbl(setid,setname,userid,marksperquestion,questionid,answerval,answertype) VALUES (?,?,?,?,?,?,?)',[
      data.setid,data.setname,data.userid,data.marksperquestion,data.questionid,data.answerval,data.answertype]).then(res =>{
        console.log("Insert answer successfully");
      }).catch(err =>{
        console.log("Generated Error",err);
      });
  }

  //Get Question from TBL//
  accessQuestion(){
    return this.dbset.executeSql('SELECT setid,setname,marksperques,totalduration,questionid,questionname,questionanswer,questionoptions FROM  persetques_tbl',{}).then(data =>{
      let quest_setarr=[];
      console.log("get data length", data.rows.length);
      if(data.rows.length>0){
        for(let i=0;i< data.rows.length;i++){
          quest_setarr.push({
            qus_setid: data.rows.item(i).setid,
            qus_setname: data.rows.item(i).setname,
            qus_marksperques: data.rows.item(i).marksperques,
            qus_totalduration: data.rows.item(i).totalduration,
            qus_questionid: data.rows.item(i).questionid,
            qus_questionname: data.rows.item(i).questionname,
            qus_questionanswer: data.rows.item(i).questionanswer,
            qus_questionoptions: data.rows.item(i).questionoptions,
          });
        }
      }
      console.log("Total question anser:",quest_setarr);
      return quest_setarr;
    }).catch(err =>{
      console.log("Generated Error",err);
      return err;
    });
  }

  //Get User Answer//
  accessAnswer(){
    return this.dbset.executeSql(' SELECT setid,setname,userid,marksperquestion,questionid,answerval,answertype FROM answerset_tbl',{}).then(data =>{
      let asnwer_set=[];
      console.log("Access answer data length", data.rows.length);
      if(data.rows.length>0){
        for(let i=0;i<data.rows.length;i++){
          asnwer_set.push({
            ans_setid: data.rows.item(i).setid,
            ans_setname: data.rows.item(i).setname,
            ans_userid: data.rows.item(i).userid,
            ans_marksperquestion: data.rows.item(i).marksperquestion,
            ans_questionid: data.rows.item(i).questionid,
            ans_answerval: data.rows.item(i).answerval,
            ans_answertype: data.rows.item(i).answertype
          });
        }
      }
      console.log("Answer set:",asnwer_set);
      return asnwer_set;
    }).catch(err =>{
      console.log("Generated error",err);
    })
  }

  /////////check answertable data length/////////
  checkAnswer(){
    return this.dbset.executeSql('SELECT * FROM persetques_tbl',{}).then(data=>{
      return data.rows.length;
    }).catch(err=>{return err});
  }

  ///Delete methods////
  // Delete entire row from question table
  del_questset(){
    return this.dbset.executeSql('DELETE FROM persetques_tbl',{}).then(res =>{
      console.log("Delete data successfully", res);
      return res;
    }).catch(err =>{
      console.log("Generated Error",err);
      return err;
    });
  }

  //Delete answer from answer table
  del_userans(){
    return this.dbset.executeSql('DELETE FROM answerset_tbl',{}).then( res =>{
      console.log("Delete user answer from db",res);
      return res;
    }).catch(err=>{
      console.log("Generated error",err);
      return err;
    });
  }
  

}
