var config = require('../libs/config');
// database connection
var mongoose = require('mongoose');
mongoose.connect(config.DB.DataDB);

var File = require('../models/file');
File.DownloadRemoteFile(function() {process.exit(0)});