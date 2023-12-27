import { Request, Response, NextFunction } from "express";
import ApiError from "../exceptions/api-error";
import tokenService from "../service/auth.service";

export default function authGuard(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError());
    }

    const accessToken = authorizationHeader.split(" ")[1];
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }

    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }

    // Добавляем информацию о пользователе к объекту запроса
    //@ts-ignore
    req!.user = userData;
    next();
  } catch (e) {
    console.log(e);
    return next(ApiError.UnauthorizedError());
  }
}
