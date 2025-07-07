import { useState, useEffect } from "react";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [taskText, setTaskText] = useState("");
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = window.localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">("all");
  
  useEffect(() => {
    window.localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!taskText.trim()) return;
    const newTask: Task = {
      id: Date.now(),
      text: taskText,
      completed: false,
    };
    setTasks([newTask, ...tasks]);
    setTaskText("");
  };

  const toggleComplete = (id: number) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.completed;
    if (filter === "incomplete") return !task.completed;
    return true;
  });

  return (
    <div className='flex h-screen relative'>
      <div className="absolute h-screen w-screen bg-[url(/images/starry-sky.png)] bg-[length:100%_100%] bg-no-repeat overflow-hidden" />

      <div className="flex justify-center items-center h-screen w-screen z-10">
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 w-full max-w-md">
          <div className="space-x-3 mb-4 flex">
            <input
              className="p-2 rounded bg-white/20 text-white placeholder-white/70 w-3/4 focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="Type the task"
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
            />
            <button
              onClick={addTask} 
              className="p-2 px-4 rounded-2xl text-white bg-white/10 hover:bg-white/20 border border-white/30 shadow-md hover:shadow-lg transition">
              Add
            </button>
          </div>

          <div className="space-y-2 mb-4">
            {filteredTasks.length === 0 && (
              <p className="text-white text-center text-sm opacity-60">No tasks found.</p>
            )}
            {filteredTasks.map(task => (
              <div
                key={task.id}
                className={`flex justify-between items-center p-2 rounded-md bg-white/20 text-white`}
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task.id)}
                    className="h-5 w-5 rounded border border-white/30 bg-white/10 accent-green-300 cursor-pointer transition outline-none"
                  />
                  <span className={`${task.completed ? "text-green-300 line-through" : ""}`}>
                    {task.text}
                  </span>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-sm px-3 py-1 rounded bg-white/10 hover:bg-white/20 border border-white/20 text-red-200 hover:text-red-300 shadow-md hover:shadow-lg transition">
                  Delete
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-around pt-2 border-t border-white/20 text-white text-sm">
            {["all", "completed", "incomplete"].map(type => (
              <button
                key={type}
                onClick={() => setFilter(type as any)}
                className={`
                  px-3 py-1 rounded
                  ${filter === type
                    ? "bg-white/20 font-bold shadow-md"
                    : "hover:bg-white/10"
                  }
                  border border-white/20
                  transition
                `}
              >
                {type[0].toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
