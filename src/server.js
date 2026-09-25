require('dotenv').config();
const app = require('./app');
const db = require('./models'); // We will create this next

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Database connected successfully.');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
