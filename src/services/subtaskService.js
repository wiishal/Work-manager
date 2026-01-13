import axiosInstance from "../lib/axiosInstance";
const url = import.meta.env.VITE_API_URL;

export async function getSubTasks(taskId) {
  const res = await axiosInstance.post(`${url}/subtask`, { taskId });

  return res.data;

  // res.data.subtasks
}
export async function addSubTask(detail, taskId) {
  const res = await axiosInstance.post(`${url}/subtask/addSubTask`, {
    subTask: { detail, taskId },
  });

  return res.data;
}

export async function deleteSubTask(id) {
  const res = await axiosInstance.delete(`${url}/subtask/deleteSubTask/${id}`);

  return res.data;
}
export async function toggleSubtask(id) {
  const res = await axiosInstance.post(`${url}/subtask/toggleSubtask`, { id });

  return res.data;
}
export async function subTaskAssistance(taskDetails) {
  const res = await axiosInstance.post(`${url}/subtask/assistance`, {
    taskDetails,
  });
  return res.data.subtasks;
}
