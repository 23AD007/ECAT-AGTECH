const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const exifParser = require('exif-parser');

// Get master catalog of crop types
exports.getMasterCrops = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM crops ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('getMasterCrops error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create a new Crop Listing (Farmer)
exports.createCropListing = async (req, res) => {
  try {
    const userId = req.user.id;
    // Get farmer ID
    const farmerRes = await db.query('SELECT id FROM farmers WHERE user_id = $1', [userId]);
    if (farmerRes.rows.length === 0) {
      return res.status(400).json({ error: 'Farmer record not found for user' });
    }
    const farmerId = farmerRes.rows[0].id;

    const { cropId, title, description, quantity, unit, pricePerUnit, harvestDate, latitude, longitude } = req.body;

    if (!cropId || !title || !quantity || !pricePerUnit) {
      return res.status(400).json({ error: 'cropId, title, quantity, and pricePerUnit are required' });
    }

    const listingId = uuidv4();

    await db.query(
      `INSERT INTO crop_listings 
       (id, farmer_id, crop_id, title, description, quantity, unit, price_per_unit, harvest_date, latitude, longitude)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        listingId,
        farmerId,
        cropId,
        title,
        description || '',
        parseFloat(quantity),
        unit || 'kg',
        parseFloat(pricePerUnit),
        harvestDate || new Date(),
        latitude ? parseFloat(latitude) : null,
        longitude ? parseFloat(longitude) : null
      ]
    );

    res.status(201).json({ message: 'Crop listing created successfully', listingId });
  } catch (err) {
    console.error('createCropListing error:', err);
    res.status(500).json({ error: 'Server error creating crop listing' });
  }
};

// Get all crop listings (with search & filters)
exports.getAllListings = async (req, res) => {
  try {
    const { search, category, maxPrice, minQuantity, farmerId } = req.query;

    let query = `
      SELECT cl.*, c.name as crop_name, c.category as crop_category, f.farm_name, f.rating as farmer_rating,
             p.first_name, p.last_name, p.city, p.state
      FROM crop_listings cl
      JOIN crops c ON cl.crop_id = c.id
      JOIN farmers f ON cl.farmer_id = f.id
      JOIN users u ON f.user_id = u.id
      LEFT JOIN user_profiles p ON u.id = p.user_id
      WHERE cl.is_available = TRUE
    `;
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (cl.title ILIKE $${params.length} OR c.name ILIKE $${params.length} OR cl.description ILIKE $${params.length})`;
    }

    if (category) {
      params.push(category);
      query += ` AND c.category = $${params.length}`;
    }

    if (maxPrice) {
      params.push(parseFloat(maxPrice));
      query += ` AND cl.price_per_unit <= $${params.length}`;
    }

    if (minQuantity) {
      params.push(parseFloat(minQuantity));
      query += ` AND cl.quantity >= $${params.length}`;
    }

    if (farmerId) {
      params.push(farmerId);
      query += ` AND cl.farmer_id = $${params.length}`;
    }

    query += ` ORDER BY cl.created_at DESC`;

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('getAllListings error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get single listing details with associated images
exports.getListingById = async (req, res) => {
  try {
    const { id } = req.params;
    const listingRes = await db.query(
      `SELECT cl.*, c.name as crop_name, c.category as crop_category, f.farm_name, f.rating as farmer_rating,
              p.first_name, p.last_name, p.phone_number, p.city, p.state
       FROM crop_listings cl
       JOIN crops c ON cl.crop_id = c.id
       JOIN farmers f ON cl.farmer_id = f.id
       JOIN users u ON f.user_id = u.id
       LEFT JOIN user_profiles p ON u.id = p.user_id
       WHERE cl.id = $1`,
      [id]
    );

    if (listingRes.rows.length === 0) {
      return res.status(404).json({ error: 'Crop listing not found' });
    }

    const imagesRes = await db.query('SELECT * FROM uploaded_images WHERE crop_listing_id = $1', [id]);

    res.json({
      listing: listingRes.rows[0],
      images: imagesRes.rows
    });
  } catch (err) {
    console.error('getListingById error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Upload produce image with EXIF GPS Metadata extraction
exports.uploadProduceImage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cropListingId, latitude: bodyLat, longitude: bodyLong } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    let lat = bodyLat ? parseFloat(bodyLat) : null;
    let lon = bodyLong ? parseFloat(bodyLong) : null;
    let altitude = null;
    let takenAt = new Date();

    // Parse EXIF metadata if present in buffer
    try {
      const parser = exifParser.create(req.file.buffer);
      const exifResult = parser.parse();
      if (exifResult.tags) {
        if (exifResult.tags.GPSLatitude && exifResult.tags.GPSLongitude) {
          lat = exifResult.tags.GPSLatitude;
          lon = exifResult.tags.GPSLongitude;
        }
        if (exifResult.tags.GPSAltitude) {
          altitude = exifResult.tags.GPSAltitude;
        }
        if (exifResult.tags.CreateDate) {
          takenAt = new Date(exifResult.tags.CreateDate * 1000);
        }
      }
    } catch (exifErr) {
      console.log('EXIF parse notice (non-fatal):', exifErr.message);
    }

    // Convert file buffer to base64 Data URL for easy inline display or AWS S3 URL
    const mimeType = req.file.mimetype || 'image/jpeg';
    const imageUrl = `data:${mimeType};base64,${req.file.buffer.toString('base64')}`;
    const imageId = uuidv4();

    await db.query(
      `INSERT INTO uploaded_images (id, crop_listing_id, user_id, image_url, latitude, longitude, altitude, taken_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [imageId, cropListingId || null, userId, imageUrl, lat, lon, altitude, takenAt]
    );

    res.status(201).json({
      message: 'Image uploaded successfully with GPS metadata',
      image: {
        id: imageId,
        cropListingId,
        latitude: lat,
        longitude: lon,
        altitude,
        takenAt
      }
    });
  } catch (err) {
    console.error('uploadProduceImage error:', err);
    res.status(500).json({ error: 'Server error during image upload' });
  }
};
