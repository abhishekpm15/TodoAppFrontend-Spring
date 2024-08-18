import axios from "axios";
import "./App.css";
import { useEffect, useState } from "react";

const GetTodo = () => {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);
  const [task, setTask] = useState("");
  const [update, setUpdate] = useState(false);
  const [updateTodoId, setUpdateTodoID] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    axios
      .get("http://localhost:8082/todos")
      .then((res) => {
        setTodos(res.data);
        console.log("response", res);
      })
      .catch((err) => {
        setError(err);
        console.log("error ", err);
      });
  };

  const addTodo = (todo) => {
    console.log("update ", update);
    if (update) {
      console.log("update todo id", updateTodoId);
      axios
        .put(`http://localhost:8082/updateTodo/${updateTodoId}`, {
          todoID: updateTodoId,
          todoDescription: todo,
          todoCompleted: false,
        })
        .then((res) => {
          console.log("updated todo", updateTodoId, res);
          fetchTodos();
          setTask("");
        })
        .catch((err) => {
          console.log("error", err);
        });
    } else {
      console.log("task ", task);
      if (todo.length > 0) {
        axios
          .post("http://localhost:8082/addTodo", {
            todoDescription: todo,
            todoCompleted: false,
          })
          .then((res) => {
            console.log("response to add", res);
            setTodos([...todos, task]);
            setTask("");
            fetchTodos();
          })
          .catch((err) => {
            console.log("response to error", err);
          });
      }
    }
  };

  const deleteTodo = (todoID) => {
    axios
      .delete(`http://localhost:8082/deleteTodo/${todoID}`)
      .then((res) => {
        console.log("deleted todo", todoID, res);
        fetchTodos();
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  const updateTodo = (todoID, todoDescription) => {
    setTask(todoDescription);
    setUpdate(true);
    setUpdateTodoID(todoID);
  };

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col justify-center mt-[2%] text-2xl">
      {todos.length === 0 ? (
        <div className="text-gray-400">No todos available</div>
      ) : null}
      <div className="flex justify-center space-x-5 mt-10">
        <input
          className="border border-1 border-black/40 px-2 rounded-lg"
          type="text"
          placeholder="Enter task"
          onChange={(e) => {
            setTask(e.target.value);
          }}
          value={task}
        />
        <button
          className="bg-blue-500 text-white px-3 rounded-xl"
          onClick={() => {
            addTodo(task);
          }}
        >
          Add
        </button>
      </div>
      <div className="flex flex-col items-center justify-center mt-10">
        {todos.map((todo) => (
          <div
            key={todo.todoID}
            className="flex space-x-10 mt-3 items-center w-full justify-center "
          >
            <div className="mt-1 w-7">📌</div>
            <div className="w-10">{todo.todoID}</div>
            <div className="w-48 text-left">{todo.todoDescription}</div>
            <div className="text-red-400">
              {`${todo.todoCompleted}` === "false"
                ? "Not Completed"
                : "Completed"}
            </div>
            <button
              className="bg-red-500 text-white px-3 p-1 rounded-xl"
              onClick={() => {
                deleteTodo(todo.todoID);
              }}
            >
              Delete
            </button>
            <button
              className="bg-blue-500 text-white px-3 p-1 rounded-xl"
              onClick={() => {
                updateTodo(todo.todoID, todo.todoDescription);
              }}
            >
              Update
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  return (
    <>
      <div className="text-3xl font-semibold ">Todo App</div>
      <div>
        <GetTodo />
      </div>
    </>
  );
}

export default App;
