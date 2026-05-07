var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// [추가] DB 설정 파일 불러오기 (db.js인지 connect.js인지 확인!)
var db = require('./db'); 

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var haksaRouter = require('./routes/haksa'); // 하단 require를 위로 올렸습니다.

var app = express();

// [추가] 서버 시작 시 DB 연결 테스트
async function checkDatabase() {
  try {
    const conn = await db.getConnection();
    if (conn) {
      console.log("✅ DB 접속 테스트 완료.");
      await conn.close();
    }
  } catch (err) {
    console.log("❌ DB 접속 실패:", err.message);
  }
}
checkDatabase();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// --- [라우터 연결 구간] ---
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/haksa', haksaRouter); // /haksa 요청은 여기서 먼저 처리됩니다.
// -----------------------

// catch 404 (위의 라우터들에 해당 없으면 에러 페이지로)
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;