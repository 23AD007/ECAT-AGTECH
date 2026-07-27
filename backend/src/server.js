require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🌱 ECAT (Earth Craft AgTech) Express Backend Online`);
  console.log(`🚀 Running on port: ${PORT}`);
  console.log(`====================================================`);
});
