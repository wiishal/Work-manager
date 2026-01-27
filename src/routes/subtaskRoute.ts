import { Hono } from "hono";
import {
  addSubTask,
  deleteSubTask,
  getSubtasks,
  tooggleSubTask,
} from "../services/subtaskServices";
import {
  subtaskAssistanceAiResponse,
  subtaskInputs,
  taskDetailsInputs,
} from "../validation/subtasks";
import { subTaskAssistance } from "../services/aiService";
import { ErrorCodes, errorMessages } from "../constants/errorCodes";

const subtaskRoute = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

subtaskRoute.post("/", async (c) => {
  const body = await c.req.json();
  const subtasks = await getSubtasks(c, body.taskId);
  if (!subtasks) {
    c.status(404);
    return c.json({code: ErrorCodes.FAILED_FETCHING_SUBTASKS, message: errorMessages.FAILED_FETCHING_SUBTASKS });
  }
  c.status(200);
  return c.json({ message: "get subtask successfully", subtasks: subtasks });
});

subtaskRoute.post("/addSubTask", async (c) => {
  const body = await c.req.json();
  const { success } = subtaskInputs.safeParse(body.subTask);

  if (!success) {
    c.status(403);
    return c.json({code: ErrorCodes.INVALID_INPUTS, message: errorMessages.INVALID_INPUTS });
  }
  const createdSubtask = await addSubTask(c, body.subTask);
  if (!createdSubtask) {
    c.status(501);
    return c.json({code: ErrorCodes.FAILED_DURING_PROCESS, message: errorMessages.FAILED_DURING_PROCESS });
  }
  c.status(200);
  return c.json({
    message: "subtask added successfully",
    subtask: createdSubtask,
  });
});

subtaskRoute.post("/toggleSubtask", async (c) => {
  console.log('toogle task req')
  const body = await c.req.json();
  console.log(body)
  const updatedsubTask = await tooggleSubTask(c, body.id);
  if (!updatedsubTask) {
    c.status(404);
    return c.json({code: ErrorCodes.SUBTASK_NOT_FOUND, message: errorMessages.SUBTASK_NOT_FOUND });
  }
  c.status(200);
  return c.json({
    message: "status change successfully",
    completeStatus: updatedsubTask.complete,
  });
});

subtaskRoute.delete("/deleteSubTask/:id", async (c) => {
  console.log("id");
  const id = c.req.param("id");
  const currId = Number(id);
  console.log(currId);
  const res = await deleteSubTask(c, currId);
  if (!res) {
    c.status(403);
    return c.json({code: ErrorCodes.FAILED_DURING_PROCESS, message: errorMessages.FAILED_DURING_PROCESS });
  }

  c.status(200);
  return c.json({ message: "subtask deleted successfully" });
});

subtaskRoute.post("/assistance", async (c) => {
  const body = await c.req.json();
  console.log(body);
  const { success } = taskDetailsInputs.safeParse(body);

  if (!success) {
    c.status(403);
    return c.json({code: ErrorCodes.INVALID_INPUTS, message: errorMessages.INVALID_INPUTS });
  }
  const response = await subTaskAssistance(c, body.taskDetails);
  if (!response) {
    c.status(403);
    return c.json({code: ErrorCodes.FAILED_DURING_ASSISTANCE, message: errorMessages.FAILED_DURING_ASSISTANCE });
  }
  const { success: isSafeParsed } =
    subtaskAssistanceAiResponse.safeParse(response);

  if (!isSafeParsed) {
    c.status(403);
    return c.json({code: ErrorCodes.FAILED_DURING_ASSISTANCE, message: errorMessages.FAILED_DURING_ASSISTANCE });
  }
  c.status(200);
  return c.json({ subtasks: response });
});
export default subtaskRoute;
