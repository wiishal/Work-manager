import { useState, useEffect } from "react";
import {
  getAllTasks,
  toggleStatus,
  deleteTask,
} from "../../services/taskService";
import { checkBoxChecked, checkBoxEmpty } from "../../assets/assets";
export default function RenderTask({
  render,
  setAddTask,
  seteditTaskDiv,
  addTask,
  setRender,
}) {
  const [Task, setTask] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetchTasks();
  }, [render]);

  const fetchTasks = async () => {
    const alltasks = await getAllTasks();

    if (alltasks.tasks) {
      setTask(alltasks.tasks);
      setIsLoading(false);
      return;
    }
    setTask([]);
    setIsLoading(false);
  };

  async function deletetask(id) {
    console.log(id, "delete task req");
    if (!id) return false;
    const res = await deleteTask(id);
    if (!res) {
      alert("failed to delete task");
      return;
    }
    alert("task deleted!!");
    setRender((prev) => !prev);
  }
  function handleEditTask(Id) {
    seteditTaskDiv(null);
    seteditTaskDiv(Id);
    if (addTask) {
      setAddTask(false);
    }
  }

  if (isLoading) return <div className="spinner" />;
  return (
    <>
      {Task.map((task, i) => (
        <div key={task.id} className="render-main">
          <div className="render-taskDetails">
            <BoxImage i={i} setTask={setTask} task={task} />
            <p>{task.title}</p>
          </div>

          <div className="render-taskdescription">
            <p>{task.taskDescription}</p>
          </div>
          <div className="render-taskstatus">
            <img
              src="https://res.cloudinary.com/ddg85vpnk/image/upload/v1739965624/calendar_s9wgbg.png"
              width={15}
              alt="calenderpng"
            />
            <p>{task.date}</p>
          </div>
          <div className="render-Btn">
            <button onClick={() => deletetask(task.id)} className="render-btn">
              delete
            </button>
            <button
              onClick={() => handleEditTask(task.id)}
              className="render-btn"
            >
              edit
            </button>
          </div>
        </div>
      ))}
    </>
  );
}

function BoxImage({ task, setTask, i }) {
  const [processing, setProcessing] = useState(false);
  async function checkTask(id, i) {
    setProcessing(true);
    if (!id) return;
    try {
      const res = await toggleStatus(id);
      setTask((prev) =>
        prev.map((item) =>
          item.id == task.id ? { ...item, complete: res.data.taskStatus } : item
        )
      );
      setProcessing(false);
    } catch (error) {
      alert("error");
    } finally {
      setProcessing(false);
    }
  }
  if (processing) return <div className="spinner"></div>;
  return (
    <img
      style={{ cursor: "pointer" }}
      onClick={() => checkTask(task.id, i)}
      src={task.complete ? `${checkBoxChecked}` : `${checkBoxEmpty}`}
      width={15}
      height={15}
      alt="checkboxpng"
    />
  );
}
