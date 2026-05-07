var express = require('express');
var router = express.Router();
const { getConnection } = require('../db'); 
const oracledb = require('oracledb');

/* 1. 교수 관리 목록 페이지 이동 */
router.get('/pro', function (req, res, next) {
    res.render('index', { title: '교수관리', pageName: 'haksa/professors.ejs' });
});

/* 2. 교수 데이터 */
router.get('/pro/list.json', async function (req, res) {
    let con;
    try {
        con = await getConnection();
        const sql = "select p.*, to_char(hiredate, 'YYYY-MM-DD') fdate, to_char(salary, '99,999,999') fsalary from professors p";
        const result = await con.execute(sql, {}, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        res.send(result.rows);
    } catch (err) {
        console.log("에러 발생:", err);
        res.status(500).send(err.message);
    } finally {
        if (con) await con.close();
    }
});

/* 3. 교수 등록 페이지 이동 (🚨 이게 빠져있어서 404가 뜬 겁니다!) */
router.get('/pro/insert', async function(req, res){
    let con;
    let code;
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

//교수 데이터 삭제
router.post('/pro/delete', function(req, res){
  const pcode=req.body.pcode;
  let con;
  try{
    con = await getConnection();
    const sql='delete from professors where pcode=pcode';
    await con.execute(sql, {pcode}, {autoCommit:true});
    res.sendStatus(200);
  }catch(err){
    res.sendStatus(500);
  }finally{
    if(con) await con.close();
  }
});

/* 4. 교수 등록 처리 (DB 저장) */
router.post('/pro/insert', async function(req, res){
    const pcode=req.body.pcode;
    const pname=req.body.pname;
    const dept=req.body.dept;
    const title=req.body.title;
    const hiredate=req.body.hiredate;
    const salary=req.body.salary;

    let con;
    try{
        con = await getConnection();
        let sql = `insert into professors(pcode, pname, dept, hiredate, title, salary) `;
        sql += `values('${pcode}', '${pname}', '${dept}', TO_DATE('${hiredate}','YYYY-MM-DD'), '${title}', ${salary})`;
        await con.execute(sql, {}, {autoCommit:true});
        res.sendStatus(200);
    }catch(err){
        console.log(err);
        res.status(500).send(err.message);
    }finally{
        if(con) await con.close();
    }
});

module.exports = router;