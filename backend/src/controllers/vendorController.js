const db = require('../config/db');

exports.getVendorProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const query = `
      SELECT v.*, u.email, p.first_name, p.last_name, p.phone_number, p.city, p.state
      FROM vendors v
      JOIN users u ON v.user_id = u.id
      LEFT JOIN user_profiles p ON u.id = p.user_id
      WHERE v.user_id = $1
    `;
    const result = await db.query(query, [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vendor profile not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('getVendorProfile error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateVendorProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { businessName, businessType, licenseNumber, firstName, lastName, phone } = req.body;

    await db.query(
      `UPDATE vendors 
       SET business_name = COALESCE($1, business_name),
           business_type = COALESCE($2, business_type),
           license_number = COALESCE($3, license_number)
       WHERE user_id = $4`,
      [businessName, businessType, licenseNumber, userId]
    );

    await db.query(
      `UPDATE user_profiles
       SET first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           phone_number = COALESCE($3, phone_number)
       WHERE user_id = $4`,
      [firstName, lastName, phone, userId]
    );

    res.json({ message: 'Vendor profile updated successfully' });
  } catch (err) {
    console.error('updateVendorProfile error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
