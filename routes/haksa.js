var express = require('express');
var router = express.Router();
const { getConnection } = require('../db'); 
const oracledb = require('oracledb');

// ================= [ 1. 교수 관리 (Professor) ] =================

/* 교수 관리 목록 페이지 이동 */
router.get('/pro', function (req, res, next) {
    res.render('index', { title: '교수관리', pageName: 'haksa/professors.ejs' });
});

/* 교수 데이터 목록 (JSON) */
router.get('/pro/list.json', async function (req, res) {
    let con;
    try {
        con = await getConnection();
        const sql = `SELECT 
                pcode AS PCODE, 
                pname AS PNAME, 
                dept AS DEPT, 
                title AS TITLE, 
                salary AS FSALARY, 
                TO_CHAR(hiredate, 'YYYY-MM-DD') AS FDATE 
            FROM professors 
            WHERE pcode IN (221, 228, 311, 509) 
            ORDER BY pcode ASC`;
        const result = await con.execute(sql, {}, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        res.send(result.rows);
    } catch (err) {
        console.log("교수 목록 에러:", err);
        res.status(500).send(err.message);
    } finally {
        if (con) await con.close();
    }
});

/* 교수 등록 페이지 이동 */
router.get('/pro/insert', async function(req, res){
    let con;
    let newcode; 
    try {
        con = await getConnection();
        const sql = "select max(pcode)+1 code from professors";
        const result = await con.execute(sql);
        newcode = result.rows[0][0]; 
    } catch(err) {
        console.log(err);
    } finally {
        res.render('index', { 
            title: '교수등록', 
            pageName: 'haksa/professors_insert.ejs', 
            code: newcode 
        });
        if(con) await con.close();
    }
});

/* 교수 등록 처리 */
router.post('/pro/insert', async function(req, res){
    const { pcode, pname, dept, title, hiredate, salary } = req.body;
    let con;
    try{
        con = await getConnection();
        const sql = `insert into professors(pcode, pname, dept, hiredate, title, salary) 
                     values(:pcode, :pname, :dept, TO_DATE(:hiredate,'YYYY-MM-DD'), :title, :salary)`;
        await con.execute(sql, {pcode, pname, dept, hiredate, title, salary}, {autoCommit:true});
        res.sendStatus(200);
    } catch(err){
        console.log(err);
        res.status(500).send(err.message);
    } finally{
        if(con) await con.close();
    }
});

/* 교수 데이터 삭제 */
router.post('/pro/delete', async function(req, res){ 
    const pcode = req.body.pcode;
    let con;
    try {
        con = await getConnection();
        const sql = 'delete from professors where pcode = :pcode';
        await con.execute(sql, [pcode], {autoCommit:true});
        res.sendStatus(200);
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    } finally {
        if(con) await con.close();
    }
});


// ================= [ 2. 학생 관리 (Student) ] =================

/* 학생 관리 목록 페이지 이동 (stud -> stu 수정 완료) */
router.get('/stu', function (req, res) {
    res.render('index', { title: '학생관리', pageName: 'haksa/students.ejs' });
});

//학생 데이터 출력//
router.get('/stu/list.json', async function(req, res){
    let con;
    try{
        con = await getConnection();
        let sql= `SELECT 
                s.scode, 
                s.sname, 
                s.dept, 
                s.year, 
                s.advisor, 
                p.pname, 
                TO_CHAR(s.birthday, 'YYYY-MM-DD') AS fdate
            FROM students s, professors p
            WHERE s.advisor = p.pcode
            ORDER BY s.scode DESC
        `;
        const result = await con.execute(sql, {}, {outFormat: oracledb.OUT_FORMAT_OBJECT});
        res.send(result.rows);
    }catch(err){
        console.log(err);
        res.status(500).send(err.message);
    }finally{
        if(con) await con.close();
    }
});

//학생 입력 페이지로 이동
router.get('/stu/insert', async function(req, res){
    let con;
    let code;
    try{
        con = await getConnection();
        let sql="select max(scode)+1 from students";
        let result=await con.execute(sql, {});
        code = result.rows[0][0];
    }catch(err){
        console.log(err);
        res.status(500).send(err.message);
    }finally{
        if(con) await con.close();
        res.render('index', {
            title: '학생등록',
            pageName: 'haksa/students_insert.ejs',
            code: code
        });
    }

});

router.post('/stu/insert', async function(req, res){
    const {scode, sname, dept, birthday, year, pcode} = req.body;
    let con;
    try{
        con = await getConnection();
        const sql = `insert into students(scode, sname, dept, birthday, year, advisor) 
                     values(:scode, :sname, :dept, TO_DATE(:birthday, 'YYYY-MM-DD'), :year, :pcode)`;
        await con.execute(sql, {scode, sname, dept, birthday, year, pcode}, {autoCommit:true});
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.status(500).send(err.message);
    }finally{
        if(con) await con.close();
    }
});

//학생 삭제 페이지
router.post('/stu/delete', async function(req, res){
    let con;
    const scode=req.body.scode;
    try{
        con = await getConnection();
        const sql = `DELETE FROM students WHERE scode = :scode`;
        console.log("삭제 시도 학번", scode);
        await con.execute(sql, {scode : scode}, {autoCommit:true});
        res.sendStatus(200);
    }catch(err){
        res.sendStatus(500);
        console.log(err);
    }finally{
        if(con) await con.close();
    }
});

//강좌 페이지 이동
router.get('/cou', function (req, res) {
    res.render('index', { title: '강좌관리', pageName: 'haksa/courses.ejs' });
});

module.exports = router;