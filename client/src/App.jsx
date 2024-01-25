import { useEffect, useState } from "react";
import "./App.css";

const api_base = "http://localhost:4321";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    fetch(api_base + "/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Error: ", err));
  };

  const handleCheckboxChange = async (id) => {
    const data = await fetch(api_base + "/task/complete/" + id).then((res) =>
      res.json()
    );

    setTasks((tasks) =>
      tasks.map((task) => {
        if (task._id === data._id) {
          task.complete = data.complete;
        }

        return task;
      })
    );
  };

  const handleEditStart = (task) => {
    setEditingTask(task);
    setEditedText(task.text);
    setModalOpen(true);
  };

  const handleEditSave = async () => {
    const data = await fetch(api_base + `/task/update/${editingTask._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: editedText,
      }),
    }).then((res) => res.json());

    setTasks((tasks) =>
      tasks.map((task) => (task._id === data._id ? data : task))
    );

    setEditingTask(null);
    setEditedText("");
    setModalOpen(false);
  };

  const handleAddTask = async () => {
    const data = await fetch(api_base + "/task/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: newTask,
      }),
    }).then((res) => res.json());

    setTasks([...tasks, data]);
    setNewTask("");
  };

  const deleteTask = async (id) => {
    const data = await fetch(api_base + "/task/delete/" + id, {
      method: "DELETE",
    }).then((res) => res.json());

    setTasks((tasks) => tasks.filter((task) => task._id !== data.result._id));
  };

  return (
    <div className="App">
      <h1>To Do App</h1>
      <h2>You have following tasks:</h2>
      <div className="task-list">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              className={"task" + (task.complete ? " is-complete" : "")}
              key={task._id}
            >
              {task.complete ? (
                <span
                  className="checkmark"
                  role="img"
                  aria-label="completed"
                  onClick={() => handleCheckboxChange(task._id)}
                >
                  ✔️
                </span>
              ) : (
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={task.complete}
                  onChange={() => handleCheckboxChange(task._id)}
                />
              )}

              <div className="text">{task.text}</div>

              <button
                className="button-small"
                onClick={() => handleEditStart(task)}
              >
                Edit
              </button>
              <button
                className="button-small"
                onClick={() => deleteTask(task._id)}
              >
                ❌
              </button>
            </div>
          ))
        ) : (
          <h3>You have no tasks to show</h3>
        )}
      </div>
      {isModalOpen ? (
        <div className="modal">
          <input
            className="modal-add-task-input"
            type="text"
            id="editedText"
            name="editedText"
            onChange={(e) => setEditedText(e.target.value)}
            value={editedText}
          />

          <div className="button-container">
            <button className="button-large" onClick={handleEditSave}>
              Save
            </button>

            <button
              className="button-large"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
      <div className="add-task">
        <input
          className="add-task-input"
          type="text"
          id="newTask"
          name="newTask"
          placeholder="Add a new task"
          onChange={(e) => setNewTask(e.target.value)}
          value={newTask}
        />
        <button className="button-large" onClick={handleAddTask}>
          Add task
        </button>
      </div>
    </div>
  );
}

export default App;
