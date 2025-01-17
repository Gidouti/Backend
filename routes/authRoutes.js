const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../database');

// Register route
router.post('/register', (req, res) => {
  const { UserFirstName, UserLastName, UserEmail, UserType, UserPassword } = req.body;

  // Hash the password
  bcrypt.hash(UserPassword, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Insert the new user into the database
    const query = 'INSERT INTO user_credentials(   UserLastName, UserEmail, UserType, UserPassword) VALUES (?, ?, ?)';
    db.query(query, [UserFirstName, UserLastName, UserEmail, UserType, hashedPassword], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: 'User registered successfully!' });
    });
  });
});

// Login route
router.post('/login', (req, res) => {
  const { UserEmail, UserPassword } = req.body;

  // Find the user in the database
  const query = 'SELECT * FROM user_credentials WHERE UserEmail = ?';
  db.query(query, [UserEmail], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = results[0];

    // Compare the password
    bcrypt.compare(UserPassword, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Generate a JWT token
      const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
      res.json({ token });
    });
  });
});

module.exports = router;
