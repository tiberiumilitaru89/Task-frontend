import { useState, useEffect } from "react";

const API_URL = "http://localhost:5000";

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");

  // Ia task-urile de la backend
  useEffect(() => {
    fetch(API_URL + "/tasks")
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  // Adaugă task
  const addTask = async () => {
    if (!text.trim()) return;

    const res = await fetch(API_URL + "/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    const newTask = await res.json();
    setTasks([...tasks, newTask]);
    setText("");
  };

  // Marchează ca făcut
  const toggleTask = async (id) => {
    const res = await fetch(API_URL + "/tasks/" + id, {
      method: "PUT"
    });

    const updated = await res.json();
    setTasks(tasks.map(t => t.id === id ? updated : t));
  };

  // Șterge task
  const deleteTask = async (id) => {
    await fetch(API_URL + "/tasks/" + id, {
      method: "DELETE"
    });

    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", fontFamily: "Arial" }}>
      <h1>Task Manager</h1>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Scrie un task..."
      />
      <button onClick={addTask}>Adaugă</button>

      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <span
              onClick={() => toggleTask(task.id)}
              style={{
                cursor: "pointer",
                textDecoration: task.done ? "line-through" : "none"
              }}
            >
              {task.text}
            </span>

            <button onClick={() => deleteTask(task.id)}>Șterge</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
