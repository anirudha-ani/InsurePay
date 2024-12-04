const env = process.env.NODE_ENV || 'development';

const configData = {
  "development": {
    "username": "anirudhapaul",
    "password": null,
    "database": "insurepay_db",
    "host": "localhost",
    "dialect": "postgres"
  },
  "test": {
    "dialect": "sqlite",
    "storage": ":memory:"
  }
};

import { Sequelize } from 'sequelize';

const config = configData[env];

export const sequelize = new Sequelize(
  config.database || '',
  config.username || '',
  config.password || '',
  {
    host: config.host,
    dialect: config.dialect,
    storage: config.storage,
    logging: false, 
  }
);