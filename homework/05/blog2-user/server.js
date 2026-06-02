const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const db = require('./db');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'blog-secret-key',
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

app.get('/', (req, res) => {
  const sql = `SELECT posts.*, users.username FROM posts
               LEFT JOIN users ON posts.user_id = users.id
               ORDER BY posts.created_at DESC`;
  db.all(sql, (err, posts) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Database error: ' + err.message);
    }
    res.render('index', { posts });
  });
});

app.get('/post/:id', (req, res) => {
  const sql = `SELECT posts.*, users.username FROM posts
               LEFT JOIN users ON posts.user_id = users.id
               WHERE posts.id = ?`;
  db.get(sql, [req.params.id], (err, post) => {
    if (err || !post) return res.status(404).send('Post not found');
    res.render('post', { post, canDelete: req.session.user && req.session.user.id === post.user_id });
  });
});

app.get('/new', requireLogin, (req, res) => {
  res.render('new');
});

app.post('/posts', requireLogin, (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).send('Title and content required');

  db.run('INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)', [title, content, req.session.user.id], (err) => {
    if (err) return res.status(500).send('Database error');
    res.redirect('/');
  });
});

app.post('/post/:id/delete', requireLogin, (req, res) => {
  db.run('DELETE FROM posts WHERE id = ? AND user_id = ?', [req.params.id, req.session.user.id], (err) => {
    if (err) return res.status(500).send('Database error');
    res.redirect('/');
  });
});

app.get('/register', (req, res) => {
  res.render('register', { error: null });
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.render('register', { error: '請填寫所有欄位' });

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
    if (err) return res.render('register', { error: '帳號已存在' });
    res.redirect('/login');
  });
});

app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err || !user || !bcrypt.compareSync(password, user.password)) {
      return res.render('login', { error: '帳號或密碼錯誤' });
    }
    req.session.user = { id: user.id, username: user.username };
    res.redirect('/');
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Blog running at http://localhost:${PORT}`);
});