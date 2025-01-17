const express = require('express');
const router = express.Router();
const db = require('../database');

// Route to get all users from the database
router.get('/user_credentials', (req, res) => {
  db.query('SELECT * FROM user_credentials', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Route to get a specific user by ID
router.get('/user_credentials/:USERID', (req, res) => {
  const userId = req.params.id;

  const query = 'SELECT * FROM  user_credentials WHERE USERID = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(results[0]);
  });
});

module.exports = router;
// Route to create a new user
router.post('/user_credentials', (req, res) => {
  const { UserFirstName, UserLastName, UserEmail, UserType, UserPassword } = req.body;

  // Hash the password
  bcrypt.hash(UserPassword, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Insert the new user into the database
    const query = 'INSERT INTO user_credentials (UserFirstName, UserLastName, UserEmail, UserType, UserPassword) VALUES (?, ?, ?)';
    db.query(query, [UserFirstName, UserLastName, UserEmail, UserType, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: 'User created successfully!', userId: result.insertId });
    });
  });
});

// Route to update a user by ID
router.put('/user_credentials/:USERID', (req, res) => {
  const userId = req.params.id;
  const { UserFirstName, UserLastName, UserEmail, UserType, hashedPassword } = req.body;

  // Hash the new password if provided
  if (password) {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const query = 'UPDATE user_credentials SET UserFirstName = ?,UserLastName = ?, UserEmail= ?,  UserType= ?, WHERE USERID = ?';
      db.query(query, [UserFirstName, UserLastName, UserEmail, UserType, hashedPassword, userId], (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'User updated successfully!' });
      });
    });
  } else {
    const query = 'UPDATE  user_credentials SET UserFirstName = ?,UserLastName = ?, UserEmail= ?,  UserType= ?, WHERE USERID = ?';
    db.query(query, [UserFirstName, UserLastName, UserEmail, UserType, hashedPassword, userId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'User updated successfully!' });
    });
  }
});

// Route to delete a user by ID
router.delete('/user_credentials/:USERID', (req, res) => {
  const userId = req.params.id;

  const query = 'DELETE FROM user_credentials WHERE USERID = ?';
  db.query(query, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'User deleted successfully!' });
  });
});

module.exports = router;
