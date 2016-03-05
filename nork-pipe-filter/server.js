/**
 * Created by lit_phansiri on 3/1/16.
 */

var dnode = require('dnode');
var net = require('net');

//var server = net.createServer(function (c) {
//    var d = dnode({
//        transform : function (s, cb) {
//            cb(s.replace(/[aeiou]{2,}/, 'oo').toUpperCase())
//        }
//    });
//    c.pipe(d).pipe(c);
//});
//
//var d = dnode();
//d.on('remote', function (remote) {
//    remote.transform('beep', function (s) {
//        console.log('beep => ' + s);
//        d.end();
//    });
//});
//
//var c = server.listen(5004);
//c.pipe(d).pipe(c);

//readStream

