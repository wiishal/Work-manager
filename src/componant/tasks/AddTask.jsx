import SelectTags from "../tags/SelectTags";
import { useState } from "react";
import { addTask } from "../../services/taskService";
import List from "../list/List";
import { useFormatDate } from "../../hooks/useFormateDate";

export default function AddTask({ setRender }) {
  const {formatDate} = useFormatDate();
  const [tagStack, setTagStack] = useState([]);
  const [listSelect, setListSelect] = useState([]);
  const [taskDetails, setTaskDetails] = useState({
    title: "",
    taskDescription: "",
    date: "",
    list: [],
    tags: [],
  });

  function inputHandler(e, field) {
    setTaskDetails((prev) => ({ ...prev, [field]: e.target.value }));
  }
  function checkInputs(data) {
    const isempty = Object.values(data).some((detail) => detail === "");
    return isempty;
  }
  async function addtask() {
    const data = { title: taskDetails.title, date: taskDetails.date };
    const isInputEmpty = checkInputs(data);
    if (isInputEmpty) {
      alert("Check title and Date");
      return;
    }
    const res = await addTask({
      ...data,
      taskDescription: taskDetails.taskDescription,
      tags: tagStack,
      list: listSelect,
    });
    if (res) {
      alert("task added successfully");
      setRender(prev => !prev);
      return;
    }
  }

  return (
    <div className="addtask-main">
      <div className="addtask-title">
        <label htmlFor="">Title</label>
        <input
          onChange={(e) => inputHandler(e, "title")}
          value={taskDetails.title}
          className="addtask-titleInput"
        ></input>
      </div>
      <div className="addtask-des">
        <label htmlFor="">Description</label>
        <textarea
          onChange={(e) => inputHandler(e, "taskDescription")}
          value={taskDetails.taskDescription}
          className="addtask-desInput"
        ></textarea>
      </div>
      <div className="addtask-date">
        <label htmlFor="">Date</label>
        <input
          onChange={(e) => inputHandler(e, "date")}
          value={taskDetails.date || formatDate}
          className="addtask-dateInput"
          type="date"
        ></input>
      </div>
      <List listSelect={listSelect} setListSelect={setListSelect} />
      <SelectTags tagStack={tagStack} setTagStack={setTagStack} />
      <button className="styled-button addtask-addBtn " onClick={addtask}>
        {" "}
        Add
      </button>
    </div>
  );
}