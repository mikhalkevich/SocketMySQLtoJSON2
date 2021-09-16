var mysql = require('mysql2');
var io = require('socket.io')(8083,{  cors: {
    origin: '*',
  }});

var db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'password',
    database:'test',
    port:6603
});
db.connect((error)=>{
    if(error){
        console.log('Error: ', error);
    }
});
global.newId = 0;
global.newIdNew = 0;
io.sockets.on('connection',(socket)=>{
    socket.emit('echo','Server send message');
    setInterval(function(){
        db.query('SELECT * FROM content ORDER BY ID DESC LIMIT 1', (err, row)=>{
            if(err){
                console.log(err);
            }
            global.newId = row[0].id;
            if(global.newId!=global.newIdNew){
                global.newId=global.newIdNew;
                db.query('SELECT * FROM content ORDER BY ID DESC LIMIT 100',(err, rows)=>{
                    socket.emit('echo', rows)
                })
            }
            
        })
    },2000)
})

