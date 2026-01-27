import { JWTPayload } from "hono/utils/jwt/types";
import { getPrisma } from "../config/prismaClient";
import { sign, verify } from "hono/jwt";
import { userCredentials } from "../constants/type";
import bcrypt from "bcryptjs";
import { Context } from "hono";

export const checkUser = async (c: Context, user_name: string) => {
  try {
    const prisma = getPrisma(c.env.PRISMA_ACCELERATE_URL);

    const user = await prisma.user.findUnique({
      where: {
        username: user_name,
      },
    });
    if (user) {
      return { status: true, user };
    }
    return { status: false };
  } catch (error) {
    return false;
  }
};

export const createUser = async (c: Context, userCredentials: userCredentials) => {
  try {
    const prisma = getPrisma(c.env.PRISMA_ACCELERATE_URL);
    const hash = bcrypt.hashSync(userCredentials.password, 10);
    const user = await prisma.user.create({
      data: {
        username: userCredentials.username,
        password: hash,
        lists: [],
        tags: [],
      },
    });

    return user || false;
  } catch (error) {
    return false;
  }
};

export const signJWT = async (c: Context, username: string, userId: number) => {
  const payload = {
    role: "user",
    user: username,
    userId: userId,
  };
  try {
    const token = await sign(payload, c.env.JWT_SECRET,'HS256')
    return token || false;
  } catch (error) {
    return false;
  }
};

export const verifyJWT = async (
  c: Context,
  userToken: string
): Promise<JWTPayload | boolean> => {
  try {
    const decode = await verify(userToken, c.env.JWT_SECRET);
    return decode || false;
  } catch (error) {
    return false;
  }
};
