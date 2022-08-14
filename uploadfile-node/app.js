var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var usersRouter = require('./routes/users')
var app = express()

// 设置跨域
app.all('*',  function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*') //设置允许跨域的域名，*代表允许任意域名跨域
  res.header('Access-Control-Allow-Headers', 'content-type') //允许的header类型
  res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS') //跨域允许的请求方式
  if (req.method.toLowerCase() == 'options')
    res.send(200) //让options尝试请求快速结束
  else {
     next()
  }
})

// view engine setup

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/users', usersRouter)
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})
let fs = require('fs')
app.get("./views/file.html", (request, response) => {
  console.log(1)
  fs.readFile("./" + request.path.substr(1), (err, data) => {
    // body
    if (err) {
      console.log(err);
      //404：NOT FOUND
      response.writeHead(404, { "Content-Type": "text/html" });
    }
    else {
      //200：OK
      response.writeHead(200, { "Content-Type": "text/html" });
      response.write(data.toString());
    }
    response.end();
  });

})
module.exports = app
