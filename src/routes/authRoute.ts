import { Hono } from "hono";
import { checkUser, createUser, signJWT, verifyJWT } from "../services/userServices";


const authRoute = new Hono<{
  Bindings: {
    PRISMA_ACCELERATE_URL: string;
    JWT_SECRET: string;
  };
}>();

authRoute.post("/login", async (c) => {
  const body = await c.req.json();
  const existing = await checkUser(c, body.username);
  console.log(existing)
  if (!existing || !existing.user) {
    c.status(403);
    return c.json({ message: "login failed" });
  }

  const isMatch = body.password === existing.user.password;
  if (!isMatch) {
    c.status(403);
    return c.json({ message: "login failed" });
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
    return c.json({ message: "username already exists" });
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
    return c.json({message:"token expired"})
  }
  c.status(200);
  return c.json({ message: "token verified", user: decode.user });
});


export default authRoute

