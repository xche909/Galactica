import 'newrelic';
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running in port ${process.env.PORT} 🚀`);
});
