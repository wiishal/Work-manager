import { useEffect, useState } from "react";
import axios from "axios";
import "../style/Upcoming.css";
import { Await } from "react-router";
import { getAllTasks } from "../services/taskService";
import { useFormatDate } from "../hooks/useFormateDate";

function Upcoming() {
 const { formatDate, formatDateTomorrow } = useFormatDate();
  const [groupedTasks, setGroupedTasks] = useState({
    today: [],
    tomorrow: [],
    other: [],
  });

  useEffect(() => {
    if (formatDate && formatDateTomorrow) {
      fetchTask();
    }
  }, [formatDateTomorrow]);

  const fetchTask = async () => {
      const response = await getAllTasks();
      if(response.tasks){
        grouped(response.tasks);
      }
       
  };
  function grouped(data){
    const groupedObj = {
      today: [],
      tomorrow: [],
      other: [],
    };
    data.forEach(task => {
      if (task.date == formatDate) {
        groupedObj.today.push(task);
      } else if (task.date == formatDateTomorrow) {
        groupedObj.tomorrow.push(task);
      } else {
        groupedObj.other.push(task);
      }
    });
    setGroupedTasks(groupedObj);
  }

  return (
    <div className="Upcoming-main">
      <div className="Upcoming-main-title">
        <h1>Upcoming </h1>
        <h1>{groupedTasks.tomorrow.length}</h1>
      </div>
      <div className="Upcoming-top">
        <p className="Upcoming-titles">Today</p>
        <div className="Upcoming-task-div">
          {groupedTasks.today.map((task) => (
            // <h4>{task.taskDescription}</h4>
            <TaskTemplate task={task} />
          ))}
        </div>
      </div>
      <div className="Upcoming-bottom">
        <div className="Upcoming-bottom-left">
          <p className="Upcoming-titles">Tommorrow</p>
          <div className="Upcoming-task-div">
            {groupedTasks.tomorrow.map((task) => (
              // <h4>{task.taskDescription}</h4>
              <TaskTemplate task={task} />
            ))}
          </div>
        </div>
        <div className="Upcoming-bottom-right">
          <p className="Upcoming-titles">Week</p>
          <div className="Upcoming-task-div">
            {groupedTasks.other.map((task) => (
              // <h4>{task.taskDescription}</h4>
              <TaskTemplate task={task} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskTemplate({ task }) {
  return (
    <div className="Upcoming-task" key={task.taskId}>
      {task.complete === false ? (
        <img src="/assets/dry-clean.png" alt="" width={13} height={13} />
      ) : (
        <img src="/assets/check-mark.png" alt="" width={13} height={13} />
      )}

      <div className="Upcoming-task-subdiv">
        {task.complete === false ? (
          <p className="Upcoming-task-title">{task.title}</p>
        ) : (
          <p
            className="Upcoming-task-title"
            style={{ color: "rgb(217, 217, 217)" }}
          >
            {task.title}
          </p>
        )}

        <img src="/assets/right-arrow.png" alt="" width={13} height={13} />
      </div>
    </div>
  );
}

export default Upcoming;
