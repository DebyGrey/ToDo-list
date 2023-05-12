export default class Store {
  static getTasks = () => {
    let tasks;
    if (localStorage.getItem('tasks') === null) {
      tasks = [];
    } else {
      tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    return tasks;
  };

  static setTasks = (task) => {
    const tasks = Store.getTasks();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  static updateTasks = (task) => {
    localStorage.setItem('tasks', JSON.stringify(task));
  };

  static removeTask = (e, taskID) => {
    e.preventDefault();
    let tasks = Store.getTasks();
    tasks = tasks.filter((task) => task.index !== taskID);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  static clearCompletedTasks = (completedTask) => {
    const tasks = Store.getTasks();
    const newTaskList = tasks.map((task) => {
      if (task.index === completedTask.index) {
        return completedTask;
      }
      return task;
    });
    const newTasks = newTaskList.filter((task) => task.completed === false);
    Store.updateTasks(newTasks);
  };
}