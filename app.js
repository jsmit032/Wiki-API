//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();
const db = mongoose.connection;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model('Article', articleSchema);

/////////////////////////// Requests for All Articles ////////////////////////////////

app.route('/articles')
  .get(function(req, res){
    Article.find({}, function(err, foundArticles){
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function(req, res){
    const newArticle = new Article ({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err){
      if (!err) {
        res.redirect('/articles');
      } else {
        res.send(err);
      }
    })
  })
  .delete(function(req, res){
    Article.deleteMany({}, function(err){
      if (!err) {
        res.redirect('/articles');
      } else {
        res.send(err);
      }
    });
  });

/////////////////////////// Requests for a Specific Article ////////////////////////////////

  app.route('/articles/:articleTitle')
    .get(function(req, res){
      const requestedTitle = req.params.articleTitle;
      Article.findOne({ title: requestedTitle }, function(err, foundArticle){
        if (!err) {
          res.json(foundArticle);
        } else {
          res.send(err);
        }
      });
    }); // end GET & chain

app.listen(3000, function(){
  console.log("Server started on port 3000");
});
