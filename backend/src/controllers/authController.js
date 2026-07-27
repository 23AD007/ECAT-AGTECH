const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { JWT_SECRET } = require('../middleware/auth');

exports.register = async (req, res) => {
  const { email, password, role, firstName, lastName, phone, farmName, businessName, businessType } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Email, password, and role are required' });
  }

  if (!['farmer', 'vendor', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role specified' });
  }

  try {
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = uuidv4();

    await db.query(
      'INSERT INTO users (id, email, password_hash, role) VALUES ($1, $2, $3, $4)',
      [userId, email, passwordHash, role]
    );

    // Create user profile
    await db.query(
      `INSERT INTO user_profiles (id, user_id, first_name, last_name, phone_number)
       VALUES ($1, $2, $3, $4, $5)`,
      [uuidv4(), userId, firstName || 'Agri', lastName || 'User', phone || '']
    );

    // Role specific records
    if (role === 'farmer') {
      await db.query(
        'INSERT INTO farmers (id, user_id, farm_name) VALUES ($1, $2, $3)',
        [uuidv4(), userId, farmName || `${firstName || 'Farmer'}'s Farm`]
      );
    } else if (role === 'vendor') {
      await db.query(
        'INSERT INTO vendors (id, user_id, business_name, business_type) VALUES ($1, $2, $3, $4)',
        [uuidv4(), userId, businessName || `${firstName || 'Vendor'} Business`, businessType || 'Wholesale']
      );
    }

    const token = jwt.sign({ id: userId, email, role }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id: userId, email, role, firstName, lastName }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Fetch profile
    const profileRes = await db.query('SELECT * FROM user_profiles WHERE user_id = $1', [user.id]);
    const profile = profileRes.rows[0] || {};

    let roleData = {};
    if (user.role === 'farmer') {
      const fRes = await db.query('SELECT * FROM farmers WHERE user_id = $1', [user.id]);
      roleData = fRes.rows[0] || {};
    } else if (user.role === 'vendor') {
      const vRes = await db.query('SELECT * FROM vendors WHERE user_id = $1', [user.id]);
      roleData = vRes.rows[0] || {};
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        profile,
        roleData
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRes = await db.query('SELECT id, email, role, created_at FROM users WHERE id = $1', [userId]);
    const profileRes = await db.query('SELECT * FROM user_profiles WHERE user_id = $1', [userId]);
    
    let roleData = {};
    if (req.user.role === 'farmer') {
      const fRes = await db.query('SELECT * FROM farmers WHERE user_id = $1', [userId]);
      roleData = fRes.rows[0] || {};
    } else if (req.user.role === 'vendor') {
      const vRes = await db.query('SELECT * FROM vendors WHERE user_id = $1', [userId]);
      roleData = vRes.rows[0] || {};
    }

    res.json({
      user: userRes.rows[0],
      profile: profileRes.rows[0] || {},
      roleData
    });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ error: 'Server error fetching profile' });
  }
};
