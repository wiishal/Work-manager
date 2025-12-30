import { Context } from "hono";
import { getPrisma } from "../config/prismaClient";


let taskCount:number = 0;
export async function getAllTask(
  c: Context,
  user: number
): Promise<tasksDBConstant[] | boolean> {
 
  const prisma = getPrisma(c.env.PRISMA_ACCELERATE_URL);
  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId: user,
      },
    });

    taskCount = tasks.length
    return tasks || false;
  } catch (error) {
    return false;
  }
}

export async function addTask(c:Context,task:tasksConstant):Promise<tasksDBConstant | boolean>{
   if (taskCount > 15) return false;
  const prisma = getPrisma(c.env.PRISMA_ACCELERATE_URL)
 
  try {
    if(!task) return false
    const currTask = await prisma.task.create({
      data:task
    })

    if(!currTask){
      return false
    }
    return currTask 
  } catch (error) {
    return false
  }
}

export async function getTask(c:Context,id:number) {
  const prisma = getPrisma(c.env.PRISMA_ACCELERATE_URL)
  try {
    const task = await prisma.task.findUnique({
      where:{
        id:id
      }
    })

    if(!task){
      return false
    }
    return task
  } catch (error) {
    return false    
  }
}

export async function toggleTask(c:Context,id:number,user:number){
  const prisma = getPrisma(c.env.PRISMA_ACCELERATE_URL)
  try {
    const existingTask = await prisma.task.findUnique({
      where: {
        id: id,
        userId:user
      },
    });
     if (!existingTask) {
       return false
     }
    const updatedTask = await prisma.task.update({
      where: { id: id },
      data: { complete: !existingTask.complete },
    });
    return updatedTask;

  } catch (error) {
    console.log("error while toggling task",error)
    return false
  }
}

export async function updateTask(c:Context,task:tasksDBConstant) {
  const prisma = getPrisma(c.env.PRISMA_ACCELERATE_URL)
  try {
    const updatedTask = await prisma.task.update({
      where: { id: task.id },
      data: task
    });
    if (!updatedTask) {
      return false
    }
    return updatedTask;
  } catch (error) {
    console.log("erro while updating task")
    return false
  }
}

export async function deleteTask(c: Context, currid: number) {
  
  const prisma = getPrisma(c.env.PRISMA_ACCELERATE_URL);
  try {
    const task = await prisma.task.delete({
      where: {
        id: currid,
      },
    });
   
    return task;
  } catch (error) {
    console.log("error while getting task from DB");
    return false;
  }
}
