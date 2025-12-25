// Backend API Example (Node.js/Express)

const express = require('express');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(require('./firebase-service-account.json'))
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { firebase_token, uid, email, name, photo } = req.body;
    
    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(firebase_token);
    
    if (decodedToken.uid !== uid) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    // Save user to database
    const user = await saveUserToDatabase({
      uid,
      email,
      name,
      photo,
      last_login: new Date()
    });
    
    // Generate your own JWT token
    const access_token = jwt.sign(
      { uid, email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      user,
      access_token
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

async function saveUserToDatabase(userData) {
  // Your database logic here
  // Example with MongoDB/Mongoose:
  /*
  const User = require('./models/User');
  
  const user = await User.findOneAndUpdate(
    { uid: userData.uid },
    userData,
    { upsert: true, new: true }
  );
  
  return user;
  */
  
  console.log('Saving user:', userData);
  return userData;
}

app.listen(3000, () => {
  console.log('Server running on port 3000');
});