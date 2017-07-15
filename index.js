const restify = require('restify')
const md5File = require('md5-file')
const { queryParser, bodyParser, serveStatic } = require('restify-plugins')
const errors = require('restify-errors')
const { directory, hostname, port } = require('config')

const server = restify.createServer();

server.use(queryParser());
server.use(bodyParser());


function respond(req, res, next) {
  md5File(directory + req.params.file + '/' + req.params.file + '.mkv', (err, hash) => {
    if (!err) {
      res.send(hash);
    } else {
      res.send(new errors.NotFoundError('bad filename'))
    }
  })
  return next();
}

server.get('/', serveStatic({
  directory: './public',
  file: 'index.html'
}))
server.get('/md5sum/:file', respond);


server.listen(port, hostname, function() {
  console.log('%s listening at %s', server.name, server.url);
});
