var User = require('../models/user');
var File = require('../models/file');
var Topic = require('../models/topic').Topic;

module.exports.controller = function(app) {
  app.post('/api/topics', LoadUser, SaveTopic);
}

var LoadUser = function (req, res, next) {
    User.findOne({email:'admin@nodejs.org'}, function (err, user) {
        req.user = user;
        next();
    });
};

var SaveTopic = function (req, res) {
    var title = req.param('title');
    var logo = req.param('logo');
    var content = req.param('content');
    var source = req.param('url');
    var summary = req.param('summary');
    var topic = new Topic({title:title, content:content, author:req.user.id, source:source, summary:summary});
    if (logo) {
        File.findOne({remoteurl:logo}, function(err, file) {
            if (file) {
                topic.thumb = file.id;
                topic.save(function (err) {
                    if (!err) {
                        res.send('Done! '+title);
                    }else{
                        console.log(err);
                        res.send('Error! '+title);
                    }
                });
            }else{
                var pos = logo.lastIndexOf('/')+1;
                file = new File({filename:logo.substr(pos, logo.length-pos), remoteurl:logo, nolocal:true, user:req.user.id});
                file.save(function(err) {
                    if (!err) {
                        topic.thumb = file.id;
                        topic.save(function (err) {
                            if (!err) {
                                res.send('Done! '+title);
                            }else{
                                console.log(err);
                                res.send('Error! '+title);
                            }
                        });
                    }else{
                        console.log(err);
                        res.send('Error! '+title);
                    }
                });
            }
        });
    }else{
        topic.save(function (err) {
            if (!err) {
                res.send('Done! '+title);
            }else{
                console.log(err);
                res.send('Error! '+title);
            }
        });
    }
}