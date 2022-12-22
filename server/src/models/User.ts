import { Model, Schema, Types, model, HydratedDocument, Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import EnvVars from '@configurations/EnvVars';

type UserDocument = Document<unknown, any, UserAttributes> & UserAttributes & {
  _id: Types.ObjectId;
} & UserMethods;

interface UserAttributes {
  email: string;
  password: string;
  role: string;
}

interface UserAttributesWithJWT extends UserAttributes {
  token: string;
}

interface UserMethods {
  correctPassword(this: UserDocument, password: string): boolean
}

interface UserModel extends Model<UserAttributes, {}, UserMethods> {
  emailAlreadyTaken(email: string): boolean,
  registerUser(userAttributes: UserAttributes): Promise<UserAttributesWithJWT>,
  getUserByEmail(email: string): Promise<UserDocument | null>,
  loginUser(user: UserDocument): UserDocument | null
}

let User = new Schema<UserAttributes, UserModel, UserMethods>({
  email: { type: String, required: true },
  password: { type: String, required: true},
  role: { type: String, enum: ['student', 'teacher', 'organizer'], required: true },
});

User.method("correctPassword", async function correctPassword(this: UserDocument, password: string) {
  return await bcrypt.compare(password, this.password);
})

User.static("emailAlreadyTaken", async function emailAlreadyTaken(email: string) {
  const oldUser: UserDocument | null = await this.findOne({ email });
  return oldUser != null;
})

User.static("registerUser", async function registerUser(userAttributes: UserAttributes) {
  const { email, password, role } = userAttributes;

  const encryptedPassword = await bcrypt.hash(password, 10);

  // Create user in our database
  const newUser: UserDocument = new this({
    email: email.toLowerCase(), // sanitize
    password: encryptedPassword,
    role: role
  })
  await newUser.save();

  // Create token
  const token = jwt.sign(
    { user_id: newUser._id, email, role },
    EnvVars.jwt.secret,
    {
      expiresIn: "20d",
    }
  );

  return {...newUser.toObject(), token}
})

User.static("loginUser", function loginUser(user: UserDocument) {
  // Create token
  const token = jwt.sign(
    { user_id: user._id, email: user.email, role: user.role },
    EnvVars.jwt.secret,
    {
      expiresIn: "20d",
    }
  );

  return { ...user.toObject(), token}
})

User.static("getUserByEmail", async function getUserByEmail(email: string) {
  return await this.findOne({email})
})

export default model<UserAttributes, UserModel>("user", User);

export { UserAttributes }