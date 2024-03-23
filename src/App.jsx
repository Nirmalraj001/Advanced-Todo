import { useEffect, useRef, useState } from "react";
import { BsPencil } from "react-icons/bs";
import Logo from "./assets/logo.png";
import Alert from "./components/Alert";
import DeleteModal from "./components/DeleteModal";
import Filter from "./components/Filter";
import TodoList from "./components/TodoList";
import { useGlobalContext } from "./context/appContext";

function App() {
  const [text, setText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditId] = useState(null);
  const editRef = useRef();

  const {
    isModalOpen,
    tasks,
    setTasks,
    filterdTasks,
    showAlert,
    alert,
    setAlert,
  } = useGlobalContext();

  const submitHandler = (e) => {
    e.preventDefault();

    if (!text) {
      showAlert(true, "Field is required!", "danger");
    } else if (text && isEditing) {
      const updatedTasks = tasks.map((item) => {
        if (item.id === editID) {
          return {
            ...item,
            title: text,
            createdAt: new Date(),
            complete: false,
          };
        } else {
          return item;
        }
      });
      setTasks(updatedTasks);
      setText("");
      setEditId(null);
      setIsEditing(false);

      setAlert({ show: true, msg: "Updated Successfully!", type: "success" });
    } else {
      const newTask = {
        id: tasks.length + 1,
        createdAt: new Date(),
        complete: false,
        title: text,
      };
      setTasks([newTask, ...tasks]);
      setText("");

      showAlert(true, "Added successfully!", "success");
    }
  };

  const editHandler = (id) => {
    const specificItem = tasks.find((item) => item.id === id);
    setIsEditing(true);
    setEditId(id);
    setText(specificItem.title);
  };

  useEffect(() => {
    if (editRef.current) {
      const end = editRef.current.value.length;
      editRef.current.setSelectionRange(end, end);
      editRef.current.focus();
    }
  }, [isEditing]);

  return (
    <section className="wa__todo-list">
      {isModalOpen && <DeleteModal />}
      <div className="wa__wrapper">
        <div className="wa__header">
          <div className="wa__logo-area">
            <span>Smart Todo</span>
          </div>
          {alert.show && (
            <Alert {...alert} list={tasks} removeAlert={showAlert} />
          )}
          <Filter />
        </div>
        <div className="wa__body">
          {filterdTasks.length > 0 ? (
            <TodoList editHandler={editHandler} filterdTasks={filterdTasks} />
          ) : (
            <p className="wa__empty">No item found!</p>
          )}
        </div>
        <div className="wa__footer">
          <form onSubmit={submitHandler}>
            <div className="wa__form-group">
              <span>
                <BsPencil fill="#fff" />
              </span>
              <input
                className="wa__form-control"
                placeholder="Enter task"
                ref={editRef}
                type="text"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                }}
              />
              <button className="wa__btn">
                {isEditing ? "Update" : "Add Item"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default App;
