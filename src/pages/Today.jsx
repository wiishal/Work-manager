import { useState } from "react";
import "../style/Today.css";
import "../style/RenderTaskComp.css"
import "../style/EditTaskComp.css"
import "../style/AddTaskComp.css";
import "../style/selectTags.css";
import EditTask from "../componant/tasks/EditTask";
import RenderTask from "../componant/tasks/RenderTask";
import AddTask from "../componant/tasks/AddTask";

function Today() {
  const [render,setRender] = useState(false)
  const [addTask, setAddTask] = useState(false);
  const [editTaskDiv, seteditTaskDiv] = useState(null);

  function handleClick() {
    if (editTaskDiv !== null) {
      seteditTaskDiv(null);
    }
    setAddTask((prev) => !prev);
  }


  return (
    <div className="today-main">
      <div className="today-left">
        <div className="today-title">
          <h1>Today</h1>
        </div>
        <div className="input-div">
          <div id="inpuDiv" className="today-addTask">
            <img
              src="https://res.cloudinary.com/ddg85vpnk/image/upload/v1739965627/plus_ofocwp.png"
              alt=""
              width={15}
              height={15}
            />
            <button className="styled-button" onClick={handleClick}>
              Add task
            </button>
          </div>
        </div>

        <div style={{ overflowY: "scroll", width: "70%" }}>
          <RenderTask
            render={render}
            addTask={addTask}
            setAddTask={setAddTask}
            seteditTaskDiv={seteditTaskDiv}
            setRender={setRender}
          />
        </div>
      </div>

      {addTask === true ? <AddTask setRender={setRender} /> : null}

      {editTaskDiv !== null ? (
        <EditTask
          editTaskDiv={editTaskDiv}
          setRender={setRender}
          seteditTaskDiv={seteditTaskDiv}
        />
      ) : null}
    </div>
  );
}

export default Today;
