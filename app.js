var http = require('http');
var url = require('url');
var fs = require('fs');
var server = http.createServer(function (req, res) {
  var reqData = url.parse(req.url, true);
  if (reqData.path.match(/\/.+/)) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    var input = reqData.path.match(/\/(.+)/)[1];
    var date = new Date(decodeURIComponent(input));
    if (date.getTime() == NaN) {
      res.write(JSON.stringify({
        unix: null,
        natural: null,
      }));
    } else {
      var parseTime = date.toDateString().split(' ');
      parseTime.shift();
      parseTime[0] = {
        Jan: 'January',
        Feb: 'February',
        Mar: 'March',
        Apr: 'April',
        May: 'May',
        Jun: 'June',
        Jul: 'July',
        Aug: 'August',
        Sep: 'September',
        Oct: 'October',
        Nov: 'November',
        Dec: 'December',
      }[parseTime[0]];
      if (parseTime[1].length === '2' && parseTime[1].indexOf('0') === 0) {
        parseTime[1] = parseTime[1].substring(1);
      }

      parseTime[1] = parseTime[1] + ',';

      res.write(JSON.stringify({
        unix: date.getTime(),
        natural: parseTime.join(' '),
      }));
    }

    res.end();
  } else {
    fs.createReadStream('./index.html').pipe(res);
  }
});

server.listen(8000);
