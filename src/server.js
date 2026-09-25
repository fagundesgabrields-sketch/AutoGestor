require('dotenv').config();
const app = require('./app');
const db = require('./models'); // We will create this next

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Garante que as tabelas sejam criadas no primeiro deploy
    await db.sequelize.sync();
    console.log('Database connected and synced successfully.');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
