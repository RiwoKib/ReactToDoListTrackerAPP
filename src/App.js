//import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
//import Footer from "./components/Footer";
import {useState , useEffect}  from 'react';
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
//import About from "./components/About";

function App() {
  const [showAddTask, setShowAddTask] = useState(false)

  const [tasks, setTasks] = useState([])
  
  useEffect(() => {
      const getTasks = async () => {
        const  tasksFromServer = await fetchTasks()
        setTasks(tasksFromServer)
      }

    getTasks();
  }, [])

  //Fetch Tasks
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()

    return data
  }

   //Fetch a Task
   const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()

    return data
  }

 

  //ADD TASK
  const addTask = async (task) => {
    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {'Content-type': 'application/json'},
      body: JSON.stringify(task)
    })

    const data = await res.json()
    setTasks([...tasks, data])

    /*const id = Math.floor(Math.random() * 10000) + 1;
    const newTask = {id, ...task}

    setTasks([...tasks, newTask])*/
  }

  //DELETE TASK
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE',
    })

    setTasks(tasks.filter((task) => task.id !== id))
  }

  //Toggle Reminder 

  const toggleReminder = async(id) => {
    const taskToToggle = await fetchTask(id)
    const updateTask = {...taskToToggle, reminder: !taskToToggle.reminder}

    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {'Content-type': 'application/json'},
      body: JSON.stringify(updateTask),
    })

    const data = await res.json()

      setTasks(
        tasks.map((task) => 
          task.id === id ? {...task, reminder: data.reminder} : task))
  }

  return (
    <div className="container">
       <Header showAdd={showAddTask} onAdd={() => setShowAddTask(!showAddTask)} title="Task Tracker"/>
      {showAddTask && <AddTask onAdd={addTask}/>}
         {tasks.length > 0 ? <Tasks tasks={tasks} onToggle={toggleReminder} onDelete={deleteTask}/> : 'No Tasks To Show  '}
    
  </div>
    
  );
}

export default App;
