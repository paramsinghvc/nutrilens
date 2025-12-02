import 'dotenv/config';
import express, { Request, Response } from 'express';
import * as fs from 'fs';
import multer from 'multer';
import cors from 'cors';
import { AIService } from './ai.service';
import rateLimit from 'express-rate-limit';

const app = express();
const port = process.env.PORT || 8083;

app.use(
  cors({
    origin: '*',
  })
);
app.use(express.json());

const upload = multer({ dest: './uploads' });

const rateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 5,
  message: {
    error: 'Only 5 requests are allowed per day. Please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.post(
  '/api/analyse-food',
  rateLimiter,
  upload.single('file'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      const buffer = fs.readFileSync(req.file.path);
      const arrayBuffer = buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength
      );

      const file = new File(
        [arrayBuffer],
        req.file.originalname || 'photo.png',
        {
          type: 'image/png',
        }
      );
      const result = await AIService.analyseFood(file);
      const output = result.output_text;
      res.json(JSON.parse(output));

      fs.unlinkSync(req.file.path);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Failed to analyze image' });
    }
  }
);

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(port, () => {
  console.log('🚀 Server running on port ' + port);
});
