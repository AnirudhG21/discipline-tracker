import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const API = "http://localhost:5000";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    axios.get(`${API}/api/tasks`).then(res => setTasks(res.data));
    axios.get(`${API}/api/analytics/daily`).then(res => setDailyData(res.data));
    axios.get(`${API}/api/analytics/streak`).then(res => setStreak(res.data.streak));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">
        Discipline Dashboard 📊
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow text-center">
          <p className="text-gray-500">Current Streak</p>
          <p className="text-3xl font-bold">{streak} 🔥</p>
        </div>
      </div>

      {/* Line Graph */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl mb-4">Daily Discipline Progress</h2>

        <LineChart width={600} height={300} data={dailyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line dataKey="points" />
        </LineChart>
      </div>

      {/* Tasks */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl mb-4">Tasks</h2>

        <ul>
          {tasks.map(task => (
            <li
              key={task.id}
              className="border-b py-2 flex justify-between items-center"
            >
              <span>{task.name}</span>
              <button
                onClick={() =>
                  axios.post(`${API}/api/progress/done`, { taskId: task.id })
                }
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Done
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
