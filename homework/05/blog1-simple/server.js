const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  db.all('SELECT * FROM posts ORDER BY created_at DESC', (err, posts) => {
    if (err) return res.status(500).send('Database error');
    res.render('index', { posts });
  });
});

app.get('/post/:id', (req, res) => {
  db.get('SELECT * FROM posts WHERE id = ?', [req.params.id], (err, post) => {
    if (err || !post) return res.status(404).send('Post not found');
    res.render('post', { post });
  });
});

app.get('/new', (req, res) => {
  res.render('new');
});

app.post('/posts', (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).send('Title and content required');

  db.run('INSERT INTO posts (title, content) VALUES (?, ?)', [title, content], (err) => {
    if (err) return res.status(500).send('Database error');
    res.redirect('/');
  });
});

app.post('/post/:id/delete', (req, res) => {
  db.run('DELETE FROM posts WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).send('Database error');
    res.redirect('/');
  });
});

app.listen(PORT, () => {
  console.log(`Blog running at http://localhost:${PORT}`);
});