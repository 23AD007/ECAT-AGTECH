-- Seed Data for ECAT (Earth Craft AgTech) Database

-- Clean existing data
TRUNCATE TABLE ml_predictions, gps_data, market_data, reviews, transactions, orders, uploaded_images, crop_listings, crops, vendors, farmers, user_profiles, users CASCADE;

-- Insert Master Crops
INSERT INTO crops (id, name, category, description, default_unit) VALUES
('11111111-1111-1111-1111-111111111111', 'Wheat', 'Grains', 'High-quality durum hard wheat suitable for milling.', 'ton'),
('22222222-2222-2222-2222-222222222222', 'Corn / Maize', 'Grains', 'Fresh yellow sweet corn for food processing and fodder.', 'ton'),
('33333333-3333-3333-3333-333333333333', 'Organic Tomatoes', 'Vegetables', 'Vine-ripened organic tomatoes rich in flavor.', 'kg'),
('44444444-4444-4444-4444-444444444444', 'Potatoes', 'Vegetables', 'Grade A russet potatoes, ideal for wholesale distribution.', 'kg'),
('55555555-5555-5555-5555-555555555555', 'Soybeans', 'Legumes', 'Non-GMO soybeans ready for oil processing or food use.', 'ton');

-- Insert Users (Password is 'password123' bcrypt hashed or raw string placeholder)
INSERT INTO users (id, email, password_hash, role) VALUES
('a1111111-1111-1111-1111-111111111111', 'farmer.john@earthcraft.com', '$2b$10$wT.qXm2fM2vT6zW3e1/4n.vH/NqX5f4O2R.E6g2O.wX1', 'farmer'),
('a2222222-2222-2222-2222-222222222222', 'vendor.sarah@agrimart.com', '$2b$10$wT.qXm2fM2vT6zW3e1/4n.vH/NqX5f4O2R.E6g2O.wX1', 'vendor');

-- Insert User Profiles
INSERT INTO user_profiles (id, user_id, first_name, last_name, phone_number, city, state, country, latitude, longitude) VALUES
('p1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'John', 'Green', '+1-555-0192', 'Des Moines', 'Iowa', 'USA', 41.5868, -93.6250),
('p2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 'Sarah', 'Miller', '+1-555-0834', 'Chicago', 'Illinois', 'USA', 41.8781, -87.6298);

-- Insert Farmers
INSERT INTO farmers (id, user_id, farm_name, farm_size_acres, organic_certified, rating) VALUES
('f1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'Green Valley Organic Acres', 250.00, true, 4.95);

-- Insert Vendors
INSERT INTO vendors (id, user_id, business_name, business_type, license_number, rating) VALUES
('v1111111-1111-1111-1111-111111111111', 'a2222222-2222-2222-2222-222222222222', 'AgriMart Wholesale Distro', 'Wholesale', 'AGRI-IL-984321', 4.88);

-- Insert Crop Listings
INSERT INTO crop_listings (id, farmer_id, crop_id, title, description, quantity, unit, price_per_unit, is_available, harvest_date, quality_grade, latitude, longitude) VALUES
('c1111111-1111-1111-1111-111111111111', 'f1111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'Premium Harvest Organic Tomatoes', 'Freshly picked red tomatoes with excellent firmness and sweetness.', 5000.00, 'kg', 2.80, true, CURRENT_DATE - 2, 'Fresh', 41.5868, -93.6250),
('c2222222-2222-2222-2222-222222222222', 'f1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Golden Iowa Durum Wheat', 'Cleaned and dried hard winter wheat stored in dry silos.', 120.00, 'ton', 290.00, true, CURRENT_DATE - 10, 'Fresh', 41.5868, -93.6250);

-- Insert Market Data (Historical pricing & trends)
INSERT INTO market_data (crop_id, region, average_price, demand_index, recorded_date) VALUES
('33333333-3333-3333-3333-333333333333', 'Midwest', 2.50, 8.2, CURRENT_DATE - INTERVAL '30 days'),
('33333333-3333-3333-3333-333333333333', 'Midwest', 2.65, 8.5, CURRENT_DATE - INTERVAL '15 days'),
('33333333-3333-3333-3333-333333333333', 'Midwest', 2.80, 9.1, CURRENT_DATE),
('11111111-1111-1111-1111-111111111111', 'Midwest', 275.00, 7.5, CURRENT_DATE - INTERVAL '30 days'),
('11111111-1111-1111-1111-111111111111', 'Midwest', 285.00, 8.0, CURRENT_DATE - INTERVAL '15 days'),
('11111111-1111-1111-1111-111111111111', 'Midwest', 290.00, 8.4, CURRENT_DATE);
