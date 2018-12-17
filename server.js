var express = require('express')
var fs = require('fs')
var json = require('json5')
var chalk = require('chalk')
const chokidar = require('chokidar');
var proxy = require('http-proxy-middleware')
var { choosePort, prepareUrls } = require('react-dev-utils/WebpackDevServerUtils')
var socketIO = require('socket.io');
var http = require('http')



var config = json.parse(fs.readFileSync('./config.json'))
var host = '0.0.0.0'
var protocol = config.protocol || "http"
var port = config.port || 4567
var sockets = []
var livereload = config.watch

var app = express()

if (typeof config.siteDirectory === 'string')
    app.use(express.static(config.siteDirectory))
else {
    config.siteDirectory.forEach(ee => {
        app.use(express.static(ee))
    });
}

for (const key in config.proxy) {
    app.use(proxy(key, config.proxy[key]))
}

choosePort(host, port).then(port => {
    var server = http.Server(app)
    var io = socketIO.listen(server)
    server.listen(port)
    const urls = prepareUrls(protocol, host, port)
    if (urls.lanUrlForTerminal) {
        console.log(`  ${chalk.green('Local:')}            ${urls.localUrlForTerminal}`);
        console.log(`  ${chalk.green('On Your Network:')}  ${urls.lanUrlForTerminal}`);
    } else {
        console.log(`  ${chalk.green('Local:')}            ${urls.localUrlForTerminal}`);
    }

    io.sockets.on('connection', function (socket) {
        sockets.push(socket)
    })

    livereload && chokidar.watch(config.siteDirectory).on('change', refresh).on('add', refresh)
})

function refresh(params) {
    sockets.map(n => n.emit('refresh'))
}

