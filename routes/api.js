/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const shortid = require('shortid');

const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
    //let query = {title:String,_id:String,commentcount:Array}
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db){
    let collection = db.collection("library");
    collection.find({title:String,_id:String,commentcount:Number}).toArray(function(err,docs){res.json(docs)})

    })
    })
    
    .post(function (req, res){
    var title = req.body.title;
      //response will contain new book object including atleast _id and title
    if(!title){res.send('Please insert a Title');}
     else{
    let tempId = shortid.generate();
    let userData={ 
    title:title.toString(),
    commentcount:0,
    comments:[],
    _id:tempId
    };
    MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db){
    let collection = db.collection("library");
    collection.insertOne(userData, function(err, doc){
    if(err){res.send(`Error ${err}`)}
      else{
    res.json({title:userData.title, _id:userData._id});
      }
    })
    })
    }
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    MongoClient.connect(MONGODB_CONNECTION_STRING,(err, db)=>{
    if(err){res.send(`Error ${err}`);}
      else{
      let collection = db.collection("library");
          collection.deleteMany({_id:String},(err,doc)=>{
      if(err){res.send(`Error ${err}`);}
        else{
        res.send('complete delete successful');
        }
      })
      }
    })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
     //I can get /api/books/{_id} to retrieve a single object of a book containing title, _id, & an array of comments (empty array if no comments present).
    MongoClient.connect(MONGODB_CONNECTION_STRING,(err, db)=>{
    if(err){res.send(`Error ${err}`);}
      else{
      const collection = db.collection('library');
      collection.findOne({_id:bookid},(err,doc)=>{
      if(err){res.send(`Error ${err}`)}
        else{
          if(doc!==null){
        res.json(doc);
          }else{res.send('no book exists');}
        }
      });
      };
    });
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
     let formToLookUp = `form${bookid}`;
      var comment = req.body.comment;
    if(comment){
      //json res format same as .get
        MongoClient.connect(MONGODB_CONNECTION_STRING,(err, db)=>{
    if(err){res.send(`Error ${err}`);}
      else{
      const collection = db.collection('library');
      collection.findAndModify({_id:bookid},[['_id',1]],{$push:{comments:comment},$inc:{commentcount:1}},{new: true},function(err,doc){
        if(err){res.send(`Error ${err}`);}
        else{
          // console.log(doc)
        res.json(doc.value)
        }
      });
      };
    });
    }
    else{
    res.send('no input')
    }
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    console.log(`Book id to be found and removed: ${bookid}`);
    MongoClient.connect(MONGODB_CONNECTION_STRING,(err,db)=>{
    if(err){res.send(`Error ${err}`);}
      else{
      let collection = db.collection("library");
        //here we will check if we find a book by the provided Id
      collection.findOne({_id:bookid},(err,doc)=>{
      if(err){res.send(`Error ${err}`)}
        else{
          if(doc!==null){
        // console.log('book FOUND',doc);
        collection.remove({_id:doc._id},(err,docs)=>{
        res.send('delete successful')
        })
          }else{console.log('book NOT Found');}
        }
      });
      }
    })
    });
  
};
