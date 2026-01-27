import { Hono } from "hono";
import { checkUser, createUser, signJWT, verifyJWT } from "../services/userServices";
import bcrypt from 'bcryptjs'
import { ErrorCodes, errorMessages } from "../constants/errorCodes";


const authRoute = new Hono<{
  Bindings: {
    PRISMA_ACCELERATE_URL: string;
    JWT_SECRET: string;
  };
}>();

authRoute.post("/login", async (c) => {
  const body = await c.req.json();
  const existing = await checkUser(c, body.username);
  if (!existing || !existing.user) {
    c.status(403);
    return c.json({code:ErrorCodes.USER_NOT_FOUND, message: errorMessages.USER_NOT_FOUND });
  }
  const isMatch = bcrypt.compareSync(body.password, existing.user.password); 

  if (!isMatch) {
    c.status(403);
    return c.json({code:ErrorCodes.INVALID_CREDENTIALS, message: errorMessages.INVALID_CREDENTIALS });
  }

  const token = await signJWT(
    c,
    existing.user.username,
    existing.user.id
  );

  return c.json({
    message: "login successful",
    user: existing.user.username,
    token,
  });
});

authRoute.post("/signup", async (c) => {
  const body = await c.req.json();


  const existing = await checkUser(c, body.username);

  if (existing && existing.status === true) {
    c.status(403);
    return c.json({code:ErrorCodes.USER_ALREADY_EXISTS, message: errorMessages.USER_ALREADY_EXISTS });
  }

  const createdUser = await createUser(c, body);

  if (!createdUser) {
    c.status(500);
    return c.json({ message: "error while signup" });
  }

  const token = await signJWT(
    c,
    createdUser.username,
    createdUser.id
  );

  return c.json({
    message: "signup successful",
    user: createdUser.username,
    token,
  });
});

authRoute.post("/validate", async (c)=>{
  const body = await c.req.json()
  const decode = await verifyJWT(c, body.token);

  if (typeof decode === "boolean" || !decode || !("user" in decode)) {
    c.status(403)
    return c.json({code:ErrorCodes.SESSION_EXPIRED, message: errorMessages.SESSION_EXPIRED})
  }
  c.status(200);
  return c.json({ message: "token verified", user: decode.user });
});


export default authRoute

