var async = require('async');
var fs = require('fs');
var config = require('../libs/config');
// database connection
var mongoose = require('mongoose');
mongoose.connect(config.DB.DataDB);

var File = require('../models/file');

async.series([
    function(cb) {
        var files = fs.readdirSync('./tools/spiders');
        async.each(files, function (file, callback) {
          if(file == 'cnbeta_com.js') {
              route = require('./spiders/' + file);
              route.RunCatch(callback);
          }else{
              callback();
          }
        }, function(err){
            cb();
        });
    }, function(cb){
        File.DownloadRemoteFile(cb);
    }]
    ,function(err, results){
        console.log('All Done!');
        process.exit(0);
});