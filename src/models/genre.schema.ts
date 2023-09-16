import { IsDate, IsNotEmpty } from "class-validator";
import * as mongoose from "mongoose";

export const GenreSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

export class Genre {
  @IsNotEmpty()
  name: string;
}
