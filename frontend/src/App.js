import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Task from './component/Task';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [name, setName] = useState("");
  console.log(process.env.REACT_APP_API_URL);
  const API_URL = `${process.env.REACT_APP_API_URL}/tasks`;
  console.log(API_URL);

  // useCallbackでfetchTasksをメモ化
  const fetchTasks = useCallback(async () => {
    const res = await axios.get(API_URL);
    setTasks(res.data);
  }, [API_URL]);

  const createTask = async () => {
    await axios.post(API_URL, {
      name: name,
      is_done: false,
    });
    setName("");
    fetchTasks();  // タスクの更新
  };

  const destroyTask = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchTasks();
  };

  const toggleIsDone = async (id, index) => {
    const isDone = tasks[index].is_done;
    await axios.put(`${API_URL}/${id}`, {
      is_done: !isDone,
    });
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();  // 初回のタスク取得
  }, [fetchTasks]);  // fetchTasksを依存関係に追加

  return (
    <div className='app'>
      <h1 className='app-text'>タスク一覧a</h1>
      <div className='app-container'>
        <input
          className='app-form'
          placeholder="タスク名を入力"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className='app-button' onClick={createTask}>
          タスクを作成
        </button>
      </div>
      <div>
        {tasks.map((task, index) => (
          <Task
            key={task.id}  // keyにはtask.idを使用
            id={task.id}
            index={index}
            name={task.name}
            isDone={task.is_done}
            toggleIsDone={toggleIsDone}
            destroyTask={destroyTask}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
