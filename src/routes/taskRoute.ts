import { Hono } from "hono";
import {
  addTask,
  deleteTask,
  getAllTask,
  getTask,
  toggleTask,
  updateTask,
} from "../services/taskServices";
import { taskInputs, taskUpdateInputs } from "../validation/tasks";
import { ErrorCodes, errorMessages } from "../constants/errorCodes";

const taskRoute = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

taskRoute.get("/allTasks", async (c) => {
  const user = c.get("userId");
  const response = await getAllTask(c, user);
  if (!response) {
    c.status(403);
    return c.json({code: ErrorCodes.FAILED_FETCHING_TASKS, message: errorMessages.FAILED_FETCHING_TASKS });
  }
  c.status(200);
  return c.json({ tasks: response });
});

taskRoute.post("/addTask", async (c) => {
  const user = c.get("userId");
  const body = await c.req.json();
  const { success } = taskInputs.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({code:ErrorCodes.INVALID_INPUTS, message: errorMessages.INVALID_INPUTS });
  }
  const currTask = await addTask(c, { ...body.task, userId: user });
  if (!currTask) {
    c.status(501);
    return c.json({code: ErrorCodes.FAILED_DURING_PROCESS, message: errorMessages.FAILED_DURING_PROCESS });
  }
  c.status(200);
  return c.json({ message: "task added successfully" });
});

taskRoute.get("/getTask/:id", async (c) => {
  const id = c.req.param("id");

  const currID = Number(id);
  if (typeof currID !== "number") {
    c.status(400);
    return c.json({code: ErrorCodes.INVALID_INPUTS, message: errorMessages.INVALID_INPUTS });
  }
  const task = await getTask(c, currID);
  if (!task) {
    c.status(404);
    return c.json({code: ErrorCodes.TASKS_NOT_FOUND, message: errorMessages.TASKS_NOT_FOUND });
  }
  c.status(200);
  return c.json({ task: task });
});
taskRoute.put("/toggleStatus", async (c) => {
  const user = c.get("userId");
  const body = await c.req.json();
  const updatedTask = await toggleTask(c, body.id, user);
  if (!updatedTask) {
    c.status(404);
    return c.json({code: ErrorCodes.TASKS_NOT_FOUND, message: errorMessages.TASKS_NOT_FOUND });
  }
  c.status(200);
  return c.json({
    message: "status change successfully",
    taskStatus: updatedTask.complete,
  });
});

taskRoute.put("/updateTask", async (c) => {
  const body = await c.req.json();
  console.log(body);
  const { success } = taskUpdateInputs.safeParse(body.updatedTask);
  if (!success) {
    c.status(403);
    return c.json({code: ErrorCodes.INVALID_INPUTS, message: errorMessages.INVALID_INPUTS });
  }

  const updatedTask = await updateTask(c, body.updatedTask);
  if (!updatedTask) {
    c.status(404);
    return c.json({code: ErrorCodes.TASKS_NOT_FOUND, message: errorMessages.TASKS_NOT_FOUND });
  }
  c.status(200);
  return c.json({
    message: "task updated succcesfully",
    task: updatedTask,
  });
});

taskRoute.delete("/deleteTask/:id", async (c) => {
  const id = c.req.param("id");
  const currID = Number(id);
  console.log(currID, "req for del", currID);

  const response = await deleteTask(c, currID);
  if (!response) {
    c.status(404);
    return c.json({code: ErrorCodes.TASKS_NOT_FOUND, message: errorMessages.TASKS_NOT_FOUND });
  }
  return c.json({
    message: "task deleted succcesfully",
  });
});

export default taskRoute;
