const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

const routes = require('./routes/routes');
const authRoutes = require('./routes/authRoutes');

app.use(bodyParser.json());
app.use('/api', routes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.render("index.ejs")
});

app.get('/login', (req, res) => {
  res.render("login.ejs")
});

app.get('/register', (req, res) => {
  res.render("register.ejs")
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
