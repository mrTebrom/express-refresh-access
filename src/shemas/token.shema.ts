import { Document, Schema, Model, model, Types } from "mongoose";

// Интерфейс для представления структуры Token
interface IToken {
  user: Types.ObjectId;
  token: string;
}

// Интерфейс для представления документа Token в MongoDB
export interface ITokenDocument extends IToken, Document {
  // Дополнительные методы или свойства могут быть добавлены здесь
}

// Схема Token
const TokenSchema: Schema<ITokenDocument> = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true, unique: true },
});

// Методы или хуки могут быть добавлены здесь

// Создание модели Token
const Token: Model<ITokenDocument> = model<ITokenDocument>(
  "Token",
  TokenSchema
);

export default Token;
