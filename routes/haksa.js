var express = require('express');
var router = express.Router();

/* 교수 페이지 */
router.get('/pro', function(req, res, next) {
  res.render('index', { title: '교수관리', pageName:'haksa/professors.ejs' });
});

/* 학생 페이지*/
router.get('/stu', function(req, res, next) {
  res.render('index', { title: '학생관리', pageName:'haksa/students.ejs' });
});

router.get('/cou', function(req, res, next) {
  res.render('index', { title: '강좌관리', pageName:'haksa/courses.ejs' });
});

module.exports = router;
