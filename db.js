const oracledb = require('oracledb');

// 1. Thick 모드 활성화 (압축 푼 경로 정확히 입력!)
try {
  oracledb.initOracleClient({ libDir: 'C:\\data\\oracle\\instantclient_23_0' }); 
} catch (err) {
  console.log('오라클 클라이언트 초기화 실패!', err); 
  process.exit(1);
}

// 2. 연결 함수
async function getConnection() {
  let connection;
  try {
    connection = await oracledb.getConnection({ 
      user: 'user04',           // 본인 DB 아이디
      password: '1234',         // 본인 DB 비밀번호
      connectionString: 'localhost:1521/xe' // 본인 DB 주소
    });
    console.log('✅ Oracle DB 연결 성공!');
    return connection;
  } catch (err) {
    console.log('❌ Oracle DB 연결 오류!:', err); 
  }
}

module.exports = { getConnection };