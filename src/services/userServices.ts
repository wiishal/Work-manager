import { JWTPayload } from "hono/utils/jwt/types";
import { getPrisma } from "../config/prismaClient";
import { sign, verify } from "hono/jwt";

export const checkUser = async (c: any,user_name:string)=>{
  try {
    const prisma = getPrisma(c.env.PRISMA_ACCELERATE_URL);

    const user = await prisma.user.findUnique({
      where: {
        username: user_name,
      },
    });
    console.log(user,"check uer")
     if(user){
      return {status:true,user}
     }
     return {status:false}

  } catch (error) {
    return false
  }
    
}

export const createUser = async (c: any, userCredentials: userCredentials) => {
  try {
    const prisma = getPrisma(c.env.PRISMA_ACCELERATE_URL);

    const user = await prisma.user.create({
      data: {
        username: userCredentials.username,
        password: userCredentials.password,
        lists:[],
        tags:[]
      },
      
    });

  return user || false

  } catch (error) {

    return false
  }
};

  export const signJWT = async (c:any,username:string,userId:number)=>{
    const payload = {
      role:"user",
      user:username,
      userId:userId
    }
    try {
      const token = await sign(payload,c.env.JWT_SECRET)
      return token || false
    } catch (error) {
      return false
    }
  }

export const verifyJWT = async (
  c: any,
  userToken: string
): Promise<JWTPayload | boolean> => {
  try {
    const decode = await verify(userToken, c.env.JWT_SECRET);
    return decode || false;
  } catch (error) {
    return false;
  }
};


