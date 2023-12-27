import UserModel from "../shemas/user.shema";
import bcrypt from "bcrypt";
import tokenService from "./auth.service";
import ApiError from "../exceptions/api-error";

class UserService {
  async registration(email: string, password: string) {
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(
        `Пользователь с почтовым адресом ${email} уже существует`
      );
    }
    const hashPassword = await bcrypt.hash(password, 3);

    const user = await UserModel.create({ email, password: hashPassword });

    const tokens = tokenService.generateToken(user);
    await tokenService.save(user._id, tokens.refresh);

    return { ...tokens, user: user };
  }

  async login(email: string, password: string) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw ApiError.BadRequest("Пользователь с таким email не найден");
    }
    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest("Неверный пароль");
    }
    const tokens = tokenService.generateToken(user);

    await tokenService.save(user._id, tokens.refresh);
    return { ...tokens, user: user };
  }

  async logout(refreshToken: string) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken: string | undefined) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);

    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb || typeof userData === "string") {
      throw ApiError.UnauthorizedError();
    }
    const user = await UserModel.findById(userData.userId);
    const tokens = tokenService.generateToken(user?._id);

    await tokenService.save(user?._id, tokens.refresh);
    return { ...tokens, user: user };
  }
}

export default new UserService();
