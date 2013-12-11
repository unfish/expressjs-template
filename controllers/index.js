module.exports.controller = function(app) {
  app.get('/', function(req, res) {
      res.render('index', { title: 'Express' });
  });
}
