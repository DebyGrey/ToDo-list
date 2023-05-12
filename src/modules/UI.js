import TasksToDo from './todoList.js';
import Store from './storeLocal.js';

export default class UI {
  static toDoList = Store.getTasks();

  static completedTasks = [];

  static displayToDoList = () => {
    const toDoListContainer = document.querySelector(
      '.to-do-list-item-container',
    );
    const clearBtn = document.querySelector('.clear-all-tasks-completed-btn');
    if (UI.toDoList.length === 0) {
      clearBtn.classList.add('hide');
      toDoListContainer.innerHTML = '';
      toDoListContainer.innerHTML = 'No Task added yet!';
      toDoListContainer.classList.add('task-list-error-msg');
    } else {
      toDoListContainer.innerHTML = '';
      clearBtn.classList.remove('hide');
      // sort the tasksToDo array by index
      UI.toDoList.sort((a, b) => a.index - b.index);
      UI.toDoList.forEach((task) => {
        const taskIndex = task.index;
        const taskDescription = task.description;
        const listItem = document.createElement('div');
        listItem.className = 'to-do-list-item';
        listItem.innerHTML = `
  <input type="checkbox" class="checkbox" id="${taskIndex}" name="${taskDescription}" value="${taskDescription}"><i class="fa fa-check hide blue-tick" aria-hidden="true"></i><div class='task-description'>${taskDescription}</div>
  <input type="text" class="edit-input hide" id="${taskIndex}" name="${taskDescription}" value="${taskDescription}">
  <button type="button" class="option-btn" ><i class="fa fa-ellipsis-v menu" id="${taskIndex}" aria-hidden="true"></i></button>
   <button type="button" class="trash-task-btn hide" ><i class="fa fa-trash trash-bin" aria-hidden="true"></i></button>
  `;
        toDoListContainer.appendChild(listItem);
      });
      // add event listener to each ellipses
      const optionBtn = document.querySelectorAll('.option-btn');
      optionBtn.forEach((btn) => {
        btn.addEventListener('click', (event) => {
          UI.editTask(event.target);
        });
      });

      // add event listener to each checkbox
      const checkboxes = document.querySelectorAll('.checkbox');
      checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', (event) => {
          UI.strikeOutTask(event.target);
        });
      });
    }
  };

  // add task to list
  static addTaskToList = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const title = document.querySelector('#title').value;
      if (title === '') {
        UI.showAlert('Please fill all empty fields!', 'danger');
      } else {
        const index = UI.toDoList.length;
        const task = new TasksToDo(title, false, index + 1);
        Store.setTasks(task);
        UI.toDoList = Store.getTasks();
        UI.displayToDoList();
        UI.clearFields();
      }
    }
  };

  /// clear fields
  static clearFields = () => {
    document.querySelector('#title').value = '';
  };

  // clear all completed tasks
  static clearAllCompletedTasks = (e) => {
    // Store.clearAllTasks();
    e.preventDefault();
    if (UI.completedTasks.length === 0) {
      UI.showAlert('No task selected!', 'danger');
    } else {
      const i = 0;
      while (i < UI.completedTasks.length) {
        const completedTask = UI.completedTasks[i];
        Store.clearCompletedTasks(completedTask);
        UI.toDoList = Store.getTasks();
        UI.completedTasks.splice(i, 1); // Remove the completed task from the array
      }
      UI.reOrderList();
      UI.displayToDoList();
    }
  };

  // reorder list
  static reOrderList = () => {
    const newTasks = UI.toDoList;
    let currentIndex = 1;
    newTasks.forEach((task) => {
      task.index = currentIndex;
      currentIndex += 1;
    });
    Store.updateTasks(newTasks);
  };

  // strike through list if checked
  static strikeOutTask = (checkbox) => {
    const checkboxID = parseInt(checkbox.id, 10);
    const checkboxValue = checkbox.value;
    const listItem = checkbox.parentNode;
    const checkboxItself = listItem.querySelector('.checkbox');
    const taskDescription = listItem.querySelector('.task-description');
    const blueTick = listItem.querySelector('.blue-tick');

    if (taskDescription) {
      if (checkbox.checked) {
        const completedTask = {
          description: checkboxValue,
          completed: true,
          index: checkboxID,
        };
        UI.completedTasks.push(completedTask);
        taskDescription.classList.add('completed');
        checkboxItself.classList.add('hide');
        blueTick.classList.remove('hide');
        checkbox.dataset.completedTask = JSON.stringify(completedTask);
      } else { taskDescription.classList.remove('completed'); }
    }
  };

  // edit task
  static editTask = (taskOption) => {
    const taskID = parseInt(taskOption.id, 10);
    const listItem = taskOption.closest('.to-do-list-item');
    const editInput = listItem.querySelector('.edit-input');
    const checkbox = listItem.querySelector('.checkbox');
    const taskDescription = listItem.querySelector('.task-description');
    const menuIcon = listItem.querySelector('.menu');
    const trashBin = listItem.querySelector('.trash-task-btn');

    if (listItem) {
      const task = UI.toDoList.findIndex((t) => t.index === taskID);
      if (task !== -1) {
        // Check if task exists
        listItem.classList.add('edit-bg-color');
        editInput.classList.remove('hide');
        trashBin.classList.remove('hide');
        checkbox.classList.add('hide');
        menuIcon.classList.add('hide');
        taskDescription.classList.add('hide');
        trashBin.disabled = true;
        editInput.addEventListener('input', (e) => UI.deleteTask(e, taskID, editInput, trashBin));
        editInput.addEventListener('keypress', (e) => UI.updateTask(e, taskID, editInput));
      }
    }
  };

  // enable delete if fields are empty
  static updateTask(e, taskID, editInput) {
    const inputValue = editInput.value;
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue !== '') {
        const taskIndex = UI.toDoList.findIndex(
          (task) => task.index === taskID,
        );
        if (taskIndex !== -1) {
          UI.toDoList[taskIndex].description = inputValue;
          Store.updateTasks(UI.toDoList);
          UI.toDoList = Store.getTasks();
          UI.displayToDoList();
        }
      }
    }
  }

  // enable delete if fields are empty
  static deleteTask(e, taskID, editInput, trashBin) {
    e.preventDefault();
    const inputValue = editInput.value;
    if (inputValue === '') {
      trashBin.disabled = false;
      trashBin.addEventListener('click', (e) => {
        Store.removeTask(e, taskID);
        UI.toDoList = Store.getTasks();
        UI.reOrderList();
        UI.displayToDoList();
      });
    }
  }

  // show alert
  static showAlert = (message, className) => {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${className}`;
    alertDiv.appendChild(document.createTextNode(message));
    const listContainer = document.querySelector('.to-do-list-container');
    listContainer.insertAdjacentElement('afterend', alertDiv);

    setTimeout(() => alertDiv.remove(), 1000);
  };
}
