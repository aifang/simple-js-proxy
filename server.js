var express = require('express')
var fs = require('fs')
var json = require('json5')
var chalk = require('chalk')
var proxy = require('http-proxy-middleware')
var { choosePort, prepareUrls } = require('react-dev-utils/WebpackDevServerUtils')

var config = json.parse(fs.readFileSync('./config.json'))
var host = '0.0.0.0'
var protocol = config.protocol || "http"
var port = config.port || 4000

var app = express()

for (const key in config.proxy) {
    app.use(proxy(key, config.proxy[key]))
}

choosePort(host, port).then(port => {
    app.listen(port)
    const urls = prepareUrls(protocol, host, port)
    if (urls.lanUrlForTerminal) {
        console.log(`  ${chalk.green('Local:')}            ${urls.localUrlForTerminal}`);
        console.log(`  ${chalk.green('On Your Network:')}  ${urls.lanUrlForTerminal}`);
    } else {
        console.log(`  ${urls.localUrlForTerminal}`);
    }
})

