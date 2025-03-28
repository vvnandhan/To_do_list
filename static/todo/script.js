document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const addTaskBtn = document.getElementById('addTask');
  const taskList = document.getElementById('tasks');
  const clearAllBtn = document.getElementById('clearAll');
  const filterBtns = document.querySelectorAll('.filters button');

  let filterMode = 'all';

  function getTasks() {
    fetch('/tasks/')
      .then(res => res.json())
      .then(renderTasks);
  }

  function renderTasks(tasks) {
    taskList.innerHTML = '';
    tasks
      .filter(task => {
        if (filterMode === 'active') return !task.completed;
        if (filterMode === 'completed') return task.completed;
        return true;
      })
      .forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
          <input type="checkbox" ${task.completed ? 'checked' : ''}>
          <span contenteditable="true">${task.title}</span>
          <button data-id="${task.id}">Delete</button>
        `;
        if (task.completed) li.classList.add('completed');

        const checkbox = li.querySelector('input');
        const deleteBtn = li.querySelector('button');
        const titleSpan = li.querySelector('span');

        checkbox.onclick = () => {
          fetch(`/tasks/update/${task.id}/`, {
            method: 'POST',
            headers: {'X-CSRFToken': getCookie('csrftoken')},
            body: JSON.stringify({completed: checkbox.checked})
          }).then(getTasks);
        };

        deleteBtn.onclick = () => {
          fetch(`/tasks/delete/${task.id}/`, {
            method: 'POST',
            headers: {'X-CSRFToken': getCookie('csrftoken')},
          }).then(getTasks);
        };

        titleSpan.onblur = () => {
          fetch(`/tasks/update/${task.id}/`, {
            method: 'POST',
            headers: {'X-CSRFToken': getCookie('csrftoken')},
            body: JSON.stringify({title: titleSpan.textContent})
          }).then(getTasks);
        };

        taskList.appendChild(li);
      });
  }

  addTaskBtn.onclick = () => {
    const title = taskInput.value.trim();
    if (!title) return;
    fetch('/tasks/add/', {
      method: 'POST',
      headers: {'X-CSRFToken': getCookie('csrftoken')},
      body: JSON.stringify({title})
    }).then(() => {
      taskInput.value = '';
      getTasks();
    });
  };

  clearAllBtn.onclick = () => {
    fetch('/tasks/clear/', {
      method: 'POST',
      headers: {'X-CSRFToken': getCookie('csrftoken')},
    }).then(getTasks);
  };

  filterBtns.forEach(btn => {
    btn.onclick = () => {
      // Remove active class from all filter buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');
      filterMode = btn.dataset.filter;
      getTasks();
    };
  });

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  // Initial load of tasks
  getTasks();

  // Add drag-and-drop functionality (optional bonus)
  new Sortable(taskList, {
    animation: 150
  });
});
