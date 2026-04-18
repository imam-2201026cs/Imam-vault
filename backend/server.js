import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import './jobs/reminderJob.js';

import authRoutes         from './routes/auth.js';
import problemRoutes      from './routes/problems.js';
import revisionRoutes     from './routes/revisions.js';
import notificationRoutes from './routes/notifications.js';

const app = express();
connectDB();
app.use(cors());
app.use(express.json());

app.use('/api/auth',          authRoutes);
app.use('/api/problems',      problemRoutes);
app.use('/api/revisions',     revisionRoutes);
app.use('/api/notifications', notificationRoutes);

app.listen(process.env.PORT || 1000, () =>
  console.log(`Server running on port ${process.env.PORT || 1000}`)
);
