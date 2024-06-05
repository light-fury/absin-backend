import express, { Request, Response } from 'express';

import bodyParser from 'body-parser';
import cors from 'cors';
import PointsSDK from 'absin-points-sdk';
import { poolConfig } from './db';
import { extractApiKey } from './authMiddleware';

interface PointsData {
  points: number;
  address: string;
  event_name: string;
}

interface EventData {
  api_key?: string;
  timestamp: number;
  metadata: string;
  event_name: string;
}

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pointsSDK = new PointsSDK(poolConfig);

// Endpoint to register for an API key
app.post('/register', async (req: Request, res: Response) => {
  try {
    const result = await pointsSDK.registerApiKey();
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Endpoint to initialize the project
app.post('/initialize', extractApiKey, async (req: Request, res: Response) => {
  try {
    const result = await pointsSDK.registerProject(req.apiKey!);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Distribute points
app.post('/distribute', extractApiKey, async (req: Request, res: Response) => {
  const { eventName, pointsData } = req.body;
  try {
    await pointsSDK.distribute(req.apiKey!, eventName, pointsData);
    res.json({ message: 'Points distributed successfully' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Update Event Metadata
app.post('/update_event', extractApiKey, async (req: Request, res: Response) => {
  const { eventName, eventData } = req.body;
  try {
    await pointsSDK.updateEventMetadata(req.apiKey!, eventName, eventData);
    res.json({ message: 'Event updated successfully' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Get Event Metadata
app.get('/event/:event_name', async (req: Request, res: Response) => {
  const { event_name } = req.params;
  try {
    const eventData = await pointsSDK.getEventMetadata(event_name);
    const eventRes = eventData.map((event: EventData) => {
      const safeEvent = { ...event };
      delete safeEvent.api_key;
      return safeEvent;
    })
    res.json(eventRes.pop());
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Get points for an address
app.get('/points/:address', async (req: Request, res: Response) => {
  const { address } = req.params;
  try {
    const points = await pointsSDK.getPoints(address);
    let totalPoint = 0;
    points.forEach((pointData: PointsData) => {
      totalPoint += pointData.points;
    });
    res.json(totalPoint);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Get points for an address filtered by event name
app.get('/points/:address/:eventName', async (req: Request, res: Response) => {
  const { address, eventName } = req.params;
  try {
    const points = await pointsSDK.getPointsByEvent(address, eventName);
    let totalPoint = 0;
    points.forEach((pointData: PointsData) => {
      totalPoint += pointData.points;
    });
    res.json(totalPoint);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
