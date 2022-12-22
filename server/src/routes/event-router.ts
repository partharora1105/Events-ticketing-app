import { Router, NextFunction, Request, Response } from 'express';
import Event, { EventAttributes } from '@models/Event';
import Location, { LocationAttributes } from '@models/Location';
import { EventRequestBody, EventRSVPBody, EventInviteBody } from "@declarations/types";
import { body, validationResult } from 'express-validator';
import HttpStatusCodes from '@configurations/HttpStatusCodes';
import verifyToken from './middlware/auth';
import { Types } from 'mongoose';

// **** Init **** //

const eventRouter = Router();

// List events
eventRouter.get('/', async (_, res) => {
  const events = await Event.listAllDetailedEvents();
  return res.json({
    data: events
  })
});

// Single events
eventRouter.get('/:eventId', async (req, res) => {
  const event = await Event.getEventById(req.params.eventId);
  if (!event) {
    return res.status(HttpStatusCodes.NOT_FOUND).json({error: "Event not found"});
  }
  return res.json({
    data: event
  })
});

// Create an event
eventRouter.post('/', 
  verifyToken,
  body('data').isObject(),
  body('data.description').not().isEmpty(),
  body('data.street_address').not().isEmpty(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()})
    }

    const requestBody: EventRequestBody = req.body?.data;

    const invitesString = requestBody?.invites_string;
    const inviteList = invitesString?.split(' ');
    
    const eventAndLocationAttributes = {
      ...requestBody,
      creator: req.user?.user_id,
      invites: inviteList
    };

    try {
      const createdEvent = await Event.createEvent(eventAndLocationAttributes);
      return res.json({
        data: createdEvent
      })
    } catch (e) {
      return next(e)
    }
    
});

// Updating an event
eventRouter.put('/:eventId', 
  verifyToken,
  body('data').isObject(),
  body('data.description').not().isEmpty(),
  body('data.street_address').not().isEmpty(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()})
    }

    const requestBody: EventRequestBody = req.body?.data;

    const invitesString = requestBody?.invites_string;
    const inviteList = invitesString?.split(' ');
    
    const oldEvent = await Event.getEventById(req.params.eventId)
    if (!oldEvent) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({error: "Event not found"});
    }
    if (!oldEvent.hasPermissions(req.user.user_id, req.user.role)) {
      return res.status(HttpStatusCodes.UNAUTHORIZED).json({error: "Unauthorized to edit this event"});
    }

    const eventAndLocationAttributes = {
      ...requestBody,
      creator: oldEvent.creator._id.toString(),
      invites: inviteList ?? []
    };

    try {
      await oldEvent.updateEvent(eventAndLocationAttributes);
      
      return res.json({
        data: "Event successfully updated"
      })
    } catch (e) {
      return next(e)
    }
    
});

//635df2c09785e51caefe6539
//635c5631e86e84a2154c19af

// RSVP
eventRouter.put('/:eventId/rsvp/', 
  verifyToken,
  body('data').isObject(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()})
    }

    const requestBody: EventRSVPBody = req.body?.data;
    
    const oldEvent = await Event.getEventById(req.params.eventId)
    if (!oldEvent) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({error: "Event not found"});
    }
    if (!oldEvent.hasPermissions(req.user.user_id, req.user.role) && requestBody.user_id != req.user.user_id) {
      return res.status(HttpStatusCodes.UNAUTHORIZED).json({error: "Unauthorized to rsvp this event"});
    }

    if (!oldEvent.canRSVP(requestBody.user_id) && requestBody.rsvp == "will_attend") {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({error: "Event is full"});
    }

    try {
      const rsvp_list_name = requestBody?.rsvp;
      await oldEvent.updateRSVP(requestBody.user_id, rsvp_list_name);
      return res.json({
        data: "RSVP Added"
      })
    } catch (e) {
      return next(e)
    }
});

// Delete an event
eventRouter.delete('/:eventId', 
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {    
    try {
      const oldEvent = await Event.getEventById(req.params.eventId)
      if (!oldEvent) {
        return res.status(HttpStatusCodes.NOT_FOUND).json({data: "Event not found"});
      }
      if (req.user.user_id != oldEvent?.creator?._id && req.user.role != 'teacher') {
        return res.status(HttpStatusCodes.UNAUTHORIZED).json({data: "Unauthorized to delete this event"});
      }

      await oldEvent.deleteEvent();
      return res.json({
        data: "Delete successful"
      })
    } catch (e) {
      return next(e)
    }
});
// **** Export default **** //

export default eventRouter;
