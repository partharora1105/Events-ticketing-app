import mongoose from "mongoose";
import env_vars from "./EnvVars";

function connectToMongoDB() {
  mongoose.connect(env_vars.mongodb_uri);
  mongoose.connection.on("error", () => {
    console.error.bind(console, "MongoDB connection error:")
  })
}
export default connectToMongoDB;