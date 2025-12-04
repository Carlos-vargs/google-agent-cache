import express from 'express';
import dotenv from 'dotenv';
import chatRouter from './routes/chat.js';
import cacheRouter from './routes/cache.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/cache', cacheRouter);
app.use('/api/chat', chatRouter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
