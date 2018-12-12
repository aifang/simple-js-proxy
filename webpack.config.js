const path = require('path');

module.exports = {
    entry: ['./server.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'server.js'
    },
    mode: 'production',
    target: 'node',
    node: {
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty',
    }
}