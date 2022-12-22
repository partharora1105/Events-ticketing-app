import { Role, RSVPStatus } from "@declarations/types";
import { Model, Schema, Types, model, HydratedDocument, Document } from "mongoose";
import Location, { LocationAttributes } from "./Location";
import { UserAttributes } from "./User";

type EventDocument = Document<unknown, any, EventAttributes> & EventAttributes & {
  _id: Types.ObjectId;
} & EventMethods;

interface EventCreationAttributes {
  category?: string,
  name: string,
  start_date: String,
  end_date: String,
  description?: string,
  street_address: string,
  room_number?: number,
  creator?: string,
  invites: string[],
  capacity: number,
  coordinates: [number]
}

interface EventAttributes {
  category?: String,
  name: String,
  start_date: String,
  end_date: String,
  description?: String,
  creator: Types.ObjectId,
  location: Types.ObjectId,
  will_attend?: [Types.ObjectId],
  maybe?: [Types.ObjectId],
  will_not_attend?: [Types.ObjectId],
  invites?: [String],
  capacity: number
}

interface EventMethods {
  updateEvent(this: EventDocument, attributes: EventCreationAttributes): void,
  deleteEvent(this: EventDocument): void,
  hasPermissions(this: EventDocument, user_id: string, user_role: Role): boolean,
  updateRSVP(this: EventDocument, user_id: string, rsvp_status: RSVPStatus): void,
  canRSVP(this: EventDocument, user_id: string): boolean,
}

interface EventModel extends Model<EventAttributes, {}, EventMethods> {
  listAllDetailedEvents(): Promise<EventDocument[]>,
  getEventById(eventId: string): Promise<EventDocument>,
  createEvent(attributes: EventCreationAttributes): Promise<EventDocument>
}

let Event = new Schema<EventAttributes, EventModel, EventMethods>({
  category: { type: String, required: false },
  name: { type: String, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  description: { type: String, required: false },
  creator: { type: Schema.Types.ObjectId, ref: "user", required: true},
  location: { type: Schema.Types.ObjectId, ref: "location", required: true},
  will_attend: [{ type: Schema.Types.ObjectId, ref: "user" }],
  maybe: [{ type: Schema.Types.ObjectId, ref: "user" }],
  will_not_attend: [{ type : Schema.Types.ObjectId, ref: "user" }],
  capacity: {type: Number, required: false, default: 10},
  invites: [String]
});

Event.method('updateEvent', async function updateEvent(this: EventDocument, attributes: EventCreationAttributes) {
  const locationAttributes: LocationAttributes = {street_address: attributes.street_address, room_number: attributes.room_number, coordinates: attributes.coordinates};
  let location = await Location.getLocationByAttributes(locationAttributes);
  if (location == null) {
    location = await Location.createLocation(locationAttributes);
  }
  await this.update({
    ...attributes,
    location: location._id
  })
})

Event.method('deleteEvent', async function deleteEvent(this: EventDocument) {
  await this.delete()
})

Event.method('hasPermissions', function hasPermissions(this: EventDocument, user_id: string, user_role: Role) {
  return user_id == this?.creator?._id?.toString() || user_role == 'teacher';
})

Event.method('updateRSVP', async function updateRSVP(this: EventDocument, user_id: string, rsvp_status: RSVPStatus) {
  await this.update({
    $pullAll: {
      will_attend: [user_id],
      maybe: [user_id],
      will_not_attend: [user_id]
    }
  });
  if (rsvp_status != null) {
    await this.update({
      $push: { [rsvp_status]: user_id } 
    });
  }
})


Event.method('canRSVP', function canRSVP(this: EventDocument, user_email: string) {
  return (this.will_attend?.length ?? 0) < this.capacity;
})

Event.static('listAllDetailedEvents', async function listAllDetailedEvents() {
  return await this.find().populate("creator").populate("location").populate("location").populate("will_attend").populate("maybe").populate("will_not_attend");
})

Event.static('getEventById', async function getEventById(eventId: string) {
  return await this.findById(eventId).populate("creator").populate("location").populate("will_attend").populate("maybe").populate("will_not_attend");
})

Event.static('createEvent', async function createEvent(attributes: EventCreationAttributes) {
  const locationAttributes: LocationAttributes = {street_address: attributes.street_address, room_number: attributes.room_number, coordinates: attributes.coordinates};
  let location = await Location.getLocationByAttributes(locationAttributes);
  if (location == null) {
    location = await Location.createLocation(locationAttributes);
  }

  return (new this({
    ...attributes,
    location: location._id
  })).save()
})

export default model<EventAttributes, EventModel>("event", Event);

export {EventAttributes}