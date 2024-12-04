import express from 'express';
import userRoutes from './routes/user';


const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
app.use(express.json());

import {sequelize} from './config/database';
import User from './models/User';

// Connect to the database
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await User.sync(); // Create tables if they don't exist
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// Routes
app.use('/users', userRoutes);


app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
