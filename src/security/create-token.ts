import jwt from "jsonwebtoken";

export const createToken = function (
  user_id: string,
  phone?: string,
  email?: string
): string {
  return jwt.sign(
    {
      userId: user_id.toString(),
      phone,
      email,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};
