import z from "zod";

export const taskDetailsInputs = z.object({
  taskDetails: z.object({
    title: z.string().min(1).max(20),
    description: z.string().min(1).max(30),
  }),
});

export const subtaskAssistanceAiResponse = z.array(
  z.object({ title: z.string() })
);

export const subtaskInputs = z.object({
  taskId: z.number().min(1),
  detail: z.string(),
});
