import { Hono } from "hono";
import { addtag, getListTask, getTagTask, getUserTags, getUserTaskStr } from "../services/userStrService";
import { ErrorCodes, errorMessages } from "../constants/errorCodes";

const userStr = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

userStr.get("/userTaskStr",async(c)=>{
  const user = c.get("userId");
  const userStr = await getUserTaskStr(c,user);
  if(!userStr){
    c.status(404)
    return c.json({code: ErrorCodes.USER_STR_NOT_FOUND, message: errorMessages.USER_STR_NOT_FOUND})
  }
  c.status(200)
  return c.json({userStr:userStr,message:"userStr fetch successfully"})
})
userStr.get("/userTags",async(c)=>{
    const user = c.get("userId");
    const tags =  await getUserTags(c,user);
    console.log("tags in route:", tags);
    if(!tags){
        c.status(404)
        return c.json({code: ErrorCodes.USER_TAGS_NOT_FOUND, message: errorMessages.USER_TAGS_NOT_FOUND})
    }
    c.status(200)
    return c.json({tags:tags,message:"user tags fetched successfully"}) 
})


userStr.post("/addTag",async(c)=>{
    const user = c.get("userId");
    const body = await c.req.json()
    const res = await addtag(c,body.tag,user)
    if(!res){
        c.status(403)
        return c.json({code: ErrorCodes.TAG_ADDING_FAILED, message: errorMessages.TAG_ADDING_FAILED})
    }
    c.status(200)
    return c.json({message:"tag added successfully", isTagAdded:true})
})


userStr.get("/tag/:tag",async(c)=>{
    const tag = c.req.param('tag')
    const userID = c.get("userId")
    const taskArr = await getTagTask(c,userID,tag)
    if (!taskArr) {
      c.status(404);
      return c.json({code:ErrorCodes.TASKS_NOT_FOUND, message: errorMessages.TASKS_NOT_FOUND });
    }
    c.status(200)
    return c.json({
      message: "fetched tagged tasks successfully",
      tasks: taskArr
    });
})

userStr.get("/list/:list", async (c) => {
  const list = c.req.param("list");
  const userID = c.get("userId");
  const taskArr = await getListTask(c, userID, list);
  if (!taskArr) {
    c.status(404);
    return c.json({code:ErrorCodes.LIST_ACCESS_FAILED, message: errorMessages.LIST_ACCESS_FAILED });
  }
  c.status(200);
  return c.json({
    message: "fetched list tasks successfully",
    tasks: taskArr,
  });
});
export default userStr