import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';
import './index.css';
import UI from './modules/UI.js';

// Display list on page load
document.addEventListener('DOMContentLoaded', UI.displayToDoList);
// Event: Add a task
document
  .querySelector('#title')
  .addEventListener('keypress', (e) => UI.addTaskToList(e));
// Event: clear all tasks completed
document
  .querySelector('.clear-all-tasks-completed-btn')
  .addEventListener('click', (e) => UI.clearAllCompletedTasks(e));
