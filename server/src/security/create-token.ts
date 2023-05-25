import jwt, { Secret } from "jsonwebtoken";

export const createToken = function (userId: string): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET as Secret, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};
