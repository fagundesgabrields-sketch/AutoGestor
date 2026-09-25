require('dotenv').config();
const app = require('./app');
const db = require('./models'); // We will create this next

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Garante que as tabelas sejam criadas no primeiro deploy
    await db.sequelize.sync();
    console.log('Database connected and synced successfully.');
    
    // Auto-seed no primeiro deploy se o banco estiver vazio
    const { Usuario } = require('./models');
    const count = await Usuario.count();
    if (count === 0) {
      console.log('Banco vazio. Rodando seeders automaticamente...');
      const { execSync } = require('child_process');
      execSync('npx sequelize-cli db:seed:all', { stdio: 'inherit' });
      execSync('node seed_data.js', { stdio: 'inherit' });
      console.log('Seeders executados com sucesso!');
    }
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
