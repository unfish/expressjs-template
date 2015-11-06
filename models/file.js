var mongoose = require('mongoose')
      ,Schema = mongoose.Schema
      ,fs = require('fs')
      ,request = require('request')
      ,async = require('async')
      ,Grid = require('gridfs-stream');
var config = require('../libs/config');

var gfs;
var conn = mongoose.createConnection(config.DB.FileDB);
conn.once('open', function () {
    gfs = Grid(conn.db, mongoose.mongo);
});

fileSchema = new Schema( {
    filename: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required:true, index: true },
    filesize: {type:Number, default:0 },
    filemime: String,
    refCount: {type:Number, default:0 },
    created_at: { type: Date, default: Date.now },
    remoteurl: String,
    nolocal: {type:Boolean, default:false}
});

function GetMimeType(name) {
    var pos = name.lastIndexOf('.')+1;
    var ext = name.substr(pos, name.length-pos).toLowerCase();
    switch (ext) {
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'png':
            return 'image/png';
        case 'gif':
            return 'image/gif';
        case 'bmp':
            return 'image/bmp';
        default:
            return 'application/octet-stream';
    }
}

var SaveFile = function (req, res, success) {
	if(req.file){
		var file = new File({filename:req.file.originalname, user:req.user.id, filesize:req.file.size, filemime:req.file.mimetype});
		file.save(function(err) {
		    if (err) {
		        res.send(err.message);
		    }else{
		        var writestream = gfs.createWriteStream({_id:file.id, chunk_size: 1024*4, content_type: file.filemime});
                writestream.on('close', function (result) {
                    success(file);
                });
		        writestream.write(req.file.buffer);
		        writestream.end();
		    }
		});
	}else{
		res.send('no file found!');
	}
}
fileSchema.statics.UploadFile = function (req, res, next) {
    SaveFile(req, res, function (file) {
    	res.send(file.id);
    });
};

fileSchema.statics.UEditorUploadFile = function (req, res, next) {
	SaveFile(req, res, function (file) {
		res.send({url:'/file/' + file.id+'/'+file.filename, title:file.filename, original:file.filename, state:'SUCCESS'});
	});
};

fileSchema.statics.GetFile = function (req, res) {
    var id=req.params.id;
    File.findById(id, function(err, file) {
        if (err) {
            res.send('Oops.'+err.message);
        }else{
            try{
                var readstream = gfs.createReadStream({_id:file.id});
                readstream.on('error', function (err) {
                  res.send('文件不存在');
                });
                var pos = file.filename.lastIndexOf('.');
                res.type(file.filename.substr(pos, file.filename.length-pos));
                res.header('Cache-Control','max-age='+60*60*24*30+', must-revalidate');
                readstream.pipe(res);
            }catch(err){
                res.send(err.message);
            }
        }
    });
};

fileSchema.statics.DownloadRemoteFile = function (cb) {
    var files = File.find({nolocal:true}, function (err, files) {
        if (files) {
            async.eachSeries(files, function (file, callback) {
                var writestream = gfs.createWriteStream({_id:file.id, chunk_size: 1024*4});
                request(file.remoteurl).pipe(writestream);
                writestream.on('close', function (result) {
                    file.nolocal = false;
                    file.save(function(err) {
                        if (err) {
                            console.log(err);
                        }else{
                            console.log('Done! '+file.remoteurl);
                        }
                        callback();
                    });
                });
            },function (err) {
                cb();
            });
        }else{
            console.log('没有找到文件');
            cb();
        }
    });
};

fileSchema.statics.DeleteById = function (id) {
    File.remove({ _id: id });
    gfs.remove({_id:id});
};

File = mongoose.model('File', fileSchema);

module.exports = File;