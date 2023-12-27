import { Document, Schema, Model, model } from "mongoose";

// Интерфейс для представления структуры пользователя
interface IUser {
  email: string;
  password: string;
}

// Интерфейс для представления документа пользователя в MongoDB
export interface UserDocument extends IUser, Document {
  // Дополнительные методы или свойства могут быть добавлены здесь
}

// Схема пользователя
const UserSchema: Schema<UserDocument> = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Методы или хуки могут быть добавлены здесь

// Создание модели пользователя
const User: Model<UserDocument> = model<UserDocument>("User", UserSchema);

export default User;
