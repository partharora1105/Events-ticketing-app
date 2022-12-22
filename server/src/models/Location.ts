import { Model, Schema, Types, model, HydratedDocument } from "mongoose";

interface LocationAttributes {
  street_address?: String;
  room_number?: number;
  coordinates: [number];
}

interface LocationMethods {

}

interface LocationModel extends Model<LocationAttributes, {}, LocationMethods> {
  createLocation(attributes: LocationAttributes): Promise<HydratedDocument<LocationAttributes, LocationMethods>>,
  getLocationByAttributes(attributes: LocationAttributes): Promise<HydratedDocument<LocationAttributes, LocationMethods>>
}

let Location = new Schema<LocationAttributes, LocationModel, LocationMethods>({
  street_address: {type: String, required: true},
  room_number: {type: Number, required: false},
  coordinates: { type: [Number], required: true}
});

Location.index({ street_address: 1, room_number: 1}, { unique: true})


Location.static("createLocation", async function createLocation(attributes: LocationAttributes) {
  return await this.create({
    street_address: attributes?.street_address, room_number: attributes?.room_number,
    coordinates: attributes.coordinates
  });
});

Location.static("getLocationByAttributes", async function getLocationByAttributes(attributes: LocationAttributes) {
  return await this.findOne({
    street_address: attributes?.street_address, room_number: attributes?.room_number
  });
})

export default model<LocationAttributes, LocationModel>("location", Location);

export {LocationAttributes};