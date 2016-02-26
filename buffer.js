
var x = new Buffer("this is a tést", 'utf8');

console.log(x.toString('utf8'));

const buf2 = new Buffer('7468697320697320612074c3a97374', 'hex');
console.log(buf2.toString());