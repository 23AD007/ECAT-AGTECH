const db = require('../config/db');

exports.getFarmerProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const query = `
      SELECT f.*, u.email, p.first_name, p.last_name, p.phone_number, p.city, p.state
      FROM farmers f
      JOIN users u ON f.user_id = u.id
      LEFT JOIN user_profiles p ON u.id = p.user_id
      WHERE f.user_id = $1
    `;
    const result = await db.query(query, [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Farmer profile not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('getFarmerProfile error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateFarmerProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { farmName, farmSizeAcres, organicCertified, firstName, lastName, phone } = req.body;

    await db.query(
      `UPDATE farmers 
       SET farm_name = COALESCE($1, farm_name),
           farm_size_acres = COALESCE($2, farm_size_acres),
           organic_certified = COALESCE($3, organic_certified)
       WHERE user_id = $4`,
      [farmName, farmSizeAcres, organicCertified, userId]
    );

    await db.query(
      `UPDATE user_profiles
       SET first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           phone_number = COALESCE($3, phone_number)
       WHERE user_id = $4`,
      [firstName, lastName, phone, userId]
    );

    res.json({ message: 'Farmer profile updated successfully' });
  } catch (err) {
    console.error('updateFarmerProfile error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
