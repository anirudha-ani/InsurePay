import express from 'express';
import userRoutes from './routes/user';
import insurancePlanRoutes from './routes/insurancePlan';
import insurancePolicyRoutes from './routes/insurancePolicy';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
app.use(express.json());

import {sequelize} from './config/database';
import User from './models/User';
import InsurancePlan from './models/InsurancePlan';
import InsurancePolicy from './models/InsurancePolicy';

// Connect to the database
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await User.sync(); 
    await InsurancePlan.sync();
    await InsurancePolicy.sync();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// Routes
app.use('/users', userRoutes);
app.use('/insurance-plans', insurancePlanRoutes);
app.use('/insurance-policies', insurancePolicyRoutes);


app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
