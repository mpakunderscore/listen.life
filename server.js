let express = require('express');

let app = express();

let port = process.env.PORT || 7070;

//STATIC WEB
app.use('/', express.static(__dirname));

app.listen(port);

console.log('Server listening on: ' + port);