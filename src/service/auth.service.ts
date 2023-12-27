import jwt, { Secret } from "jsonwebtoken";
import { UserDocument } from "../shemas/user.shema";
import Token from "../shemas/token.shema";

class AuthService {
  // Генерация access и refresh токенов
  generateToken(payload: UserDocument): { access: string; refresh: string } {
    // Генерация access токена с коротким сроком жизни
    const access = jwt.sign(
      { userId: payload._id, email: payload.email },
      process.env.ACCESS as Secret,
      { expiresIn: "10m" }
    );

    // Генерация refresh токена с долгим сроком жизни
    const refresh = jwt.sign(
      { userId: payload._id, email: payload.email },
      process.env.REFRESH as Secret, // Обратите внимание, что тут может быть ошибка, возможно, вы хотели использовать REFRESH
      { expiresIn: "180d" }
    );

    return { access, refresh };
  }

  // Сохранение токена в базе данных
  async save(userId: string, refresh: string) {
    const tokenData = await Token.findOne({ user: userId });

    // Если токен уже существует, обновляем его значение
    if (tokenData) {
      tokenData.token = refresh;
      return tokenData.save();
    }

    // Если токен не существует, создаем новый
    const token = await Token.create({ user: userId, token: refresh });
    return token;
  }

  // Валидация access токена
  validateAccessToken(token: string) {
    try {
      const userData = jwt.verify(token, process.env.ACCESS as Secret);
      return userData;
    } catch (e) {
      console.log("ddd", process.env.ACCESS);
      return null;
    }
  }

  // Валидация refresh токена
  validateRefreshToken(token: string) {
    try {
      const userData = jwt.verify(token, process.env.REFRESH as Secret);

      return userData;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  // Удаление токена из базы данных по значению refreshToken
  async removeToken(refreshToken: string) {
    const tokenData = await Token.deleteOne({ refreshToken });
    return tokenData;
  }

  // Поиск токена в базе данных по значению refreshToken
  async findToken(refreshToken: string) {
    const tokenData = await Token.findOne({ token: refreshToken });
    return tokenData;
  }
}

export default new AuthService();
