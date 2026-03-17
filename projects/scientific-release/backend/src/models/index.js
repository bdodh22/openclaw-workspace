// backend/src/models/index.js
const { Sequelize } = require('sequelize');
const config = require('../../config/config');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    pool: dbConfig.pool,
    logging: dbConfig.logging
  }
);

// Import models
const Species = require('./Species')(sequelize);
const User = require('./User')(sequelize);
const Certificate = require('./Certificate')(sequelize);
const Achievement = require('./Achievement')(sequelize);

// Define associations
Species.hasMany(Certificate, { foreignKey: 'speciesId', as: 'certificates' });
Certificate.belongsTo(Species, { foreignKey: 'speciesId', as: 'species' });
User.hasMany(Certificate, { foreignKey: 'userId', as: 'certificates' });
Certificate.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Achievement, { foreignKey: 'userId', as: 'achievements' });
Achievement.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  Sequelize,
  Species,
  User,
  Certificate,
  Achievement
};
