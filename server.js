// server.js

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 3000;

// CORS 설정
app.use(cors());
app.use(express.json()); // JSON 데이터를 받기 위한 설정

// MySQL 연결 설정
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      // MySQL 사용자명
  password: '12345678',      // MySQL 비밀번호
  database: 'todo_app' // MySQL 데이터베이스 이름
});

// MySQL 연결 확인
db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
  } else {
    console.log('MySQL connected');
  }
});

// 1. 할 일 목록 가져오기
app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks ORDER BY created_at DESC', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Database query failed' });
    } else {
      res.json(results);
    }
  });
});

// 2. 할 일 추가
app.post('/tasks', (req, res) => {
  const { title, description } = req.body;
  const query = 'INSERT INTO tasks (title, description) VALUES (?, ?)';
  db.query(query, [title, description], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Failed to add task' });
    } else {
      res.status(201).json({ id: results.insertId, title, description });
    }
  });
});

// 3. 할 일 삭제
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM tasks WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Failed to delete task' });
    } else {
      res.json({ message: 'Task deleted' });
    }
  });
});

// 4. 할 일 수정
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const query = 'UPDATE tasks SET title = ?, description = ? WHERE id = ?';
  db.query(query, [title, description, id], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Failed to update task' });
    } else {
      res.json({ message: 'Task updated' });
    }
  });
});

// 서버 실행
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
