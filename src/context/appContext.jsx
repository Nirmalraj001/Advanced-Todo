import { createContext, useContext, useEffect, useState } from 'react';

const appContext = createContext();

const getLocalStorage = () => {
  let task = localStorage.getItem('task');
  if (task) {
    return JSON.parse(task);
  } else {
    return [];
  }
};
const AppProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState(getLocalStorage());
  const [filteredText, setFilteredText] = useState('all');
  const [alert, setAlert] = useState({ show: false, msg: '', type: '' });
  const [deleteId, setDeleteId] = useState(null);
  const [allSelected, setAllSelected] = useState(false);

  const showAlert = (show = false, msg = '', type = '') => {
    setAlert({ show, msg, type });
  };

  const filterdTasks = tasks.filter((task) => {
    if (filteredText === 'completed') {
      return task.complete === true;
    } else if (filteredText === 'uncompleted') {
      return task.complete === false;
    } else {
      return task;
    }
  });

  const completeHandler = (id) => {
    setTasks(
      tasks.map((item) => {
        if (item.id === id) {
          return { ...item, complete: true };
        }

        showAlert(true, 'Task Completed !', 'complete');

        return item;
      })
    );
  };

  const removeItem = () => {
    if (deleteId) {
      showAlert(true, 'Deleted Successfully!', 'warning');
      setTasks(tasks.filter((item) => item.id !== deleteId));
    }
    setIsModalOpen(false);
    setDeleteId(null);
  };

  const removeAllItems = () => {
    if (allSelected) {
      setTasks([]);
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('task', JSON.stringify(tasks));
  }, [tasks]);

  return (
    <appContext.Provider
      value={{
        isModalOpen,
        setIsModalOpen,
        filterdTasks,
        setFilteredText,
        tasks,
        setTasks,
        removeItem,
        alert,
        showAlert,
        setAlert,
        setDeleteId,
        allSelected,
        setAllSelected,
        removeAllItems,
        completeHandler
      }}
    >
      {children}
    </appContext.Provider>
  );
};

const useGlobalContext = () => {
  return useContext(appContext);
};

export { AppProvider, useGlobalContext };
