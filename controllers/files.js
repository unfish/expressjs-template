var File = require('../models/file');
var multer  = require('multer');
var storage = multer.memoryStorage()
var upload = multer({ storage: storage })

module.exports.controller = function(app) {
	app.post('/file', User.NeedLoginPOST, upload.single('file'), File.UploadFile);
	app.post('/file/ueditor', upload.single('upfile'), User.NeedLoginPOST, File.UEditorUploadFile);
	app.get('/file/ueditor', User.NeedLoginGET, function(req, res) {
		res.send(req.param('fetch')?'updateSavePath(["默认路径"])':'');
	});
	app.post('/file/ueditor/fetch', User.NeedLoginPOST, function(req, res) {
		res.send('');
	});
	app.get('/file/:id/:filename', File.GetFile);
}