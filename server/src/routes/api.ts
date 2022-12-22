import { Router } from 'express';

import authRouter from './auth-router';
import eventRouter from './event-router';
import connectToMongoDB from '@configurations/MongoConfig';


// **** Init **** //
connectToMongoDB()

const apiRouter = Router();
apiRouter.get('/', (req, res) => {
  res.json({
    data: "Hello world"
  })
});

apiRouter.use('/events', eventRouter);
apiRouter.use('/users', authRouter);


// **** Export default **** //

export default apiRouter;
