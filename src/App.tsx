import { useState, useEffect } from "react";
import { databases, ID } from "./appwrite";

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const DATABASE_ID = "686c490200239f344043";
const COLLECTION_ID = "686c493f00289490b4e6";

function App() {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
      const loadedTasks = res.documents.map((doc: any) => ({
        id: doc.$id,
        title: doc.title,
        description: doc.description,
        completed: doc.completed,
        createdAt: doc.$createdAt,
        updatedAt: doc.$updatedAt,
      }));
      setTasks(loadedTasks);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const addTask = async () => {
    if (!taskTitle.trim()) return;

    try {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          title: taskTitle,
          description: taskDescription,
          completed: false,
        }
      );

      setTaskTitle("");
      setTaskDescription("");
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComplete = async (id: string, currentCompleted: boolean) => {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        id,
        { completed: !currentCompleted }
      );

      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "incomplete") return !task.completed;
    return true;
  });

  return (
    <div className='flex h-screen relative'>
      <div className="absolute h-screen w-screen bg-[url(/images/starry-sky.png)] bg-[length:100%_100%] bg-no-repeat overflow-hidden" />

      <div className="flex justify-center items-center h-screen w-screen z-10">
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 w-full max-w-md">
          
          {/* Inputs */}
          <div className="space-y-3 mb-4">
            <input
              className="p-2 rounded bg-white/20 text-white placeholder-white/70 w-full focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="Title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
            />
            <input
              className="p-2 rounded bg-white/20 text-white placeholder-white/70 w-full focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="Description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
            />
            <button
              onClick={addTask}
              className="p-2 px-4 rounded-2xl text-white bg-white/10 hover:bg-white/20 border border-white/30 shadow-md hover:shadow-lg transition w-full">
              Add
            </button>
          </div>

          {/* Tasks */}
          <div className="space-y-2 mb-4">
            {loading && (
              <p className="text-white text-center text-sm opacity-60">
                Loading...
              </p>
            )}
            {!loading && filteredTasks.length === 0 && (
              <p className="text-white text-center text-sm opacity-60">
                No tasks found.
              </p>
            )}
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`flex justify-between items-center p-2 rounded-md bg-white/20 text-white`}
              >
                <div className="flex flex-col space-y-1 w-full">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleComplete(task.id, task.completed)}
                      className="h-5 w-5 rounded border border-white/30 bg-white/10 accent-green-300 cursor-pointer transition outline-none"
                    />
                    <span className={`${task.completed ? "text-green-300 line-through" : ""}`}>
                      {task.title}
                    </span>
                  </div>
                  {task.description && (
                    <span className="text-xs text-white/80 ml-7">
                      {task.description}
                    </span>
                  )}
                  <div className="flex ml-7 gap-4 text-[10px] text-white/50 mt-1">
                    <span>Created: {new Date(task.createdAt!).toLocaleString()}</span>
                    <span>Updated: {new Date(task.updatedAt!).toLocaleString()}</span>
                  </div>
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-sm px-3 py-1 rounded bg-white/10 hover:bg-white/20 border border-white/20 text-red-200 hover:text-red-300 shadow-md hover:shadow-lg transition">
                  Delete
                </button>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex justify-around pt-2 border-t border-white/20 text-white text-sm">
            {["all", "completed", "incomplete"].map((type) => (
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
