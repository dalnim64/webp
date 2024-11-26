document.addEventListener('DOMContentLoaded', () => {
  const taskList = document.getElementById('task-list');
  const addTaskBtn = document.getElementById('add-task-btn');
  const taskTitleInput = document.getElementById('task-title');
  const taskDescInput = document.getElementById('task-desc');

  // Fetch tasks from the server
  const fetchTasks = async () => {
      try {
          const response = await fetch('http://localhost:3000/tasks');
          const tasks = await response.json();
          renderTasks(tasks);
      } catch (error) {
          console.error('Error fetching tasks:', error);
      }
  };

  // Render the list of tasks
  const renderTasks = (tasks) => {
      taskList.innerHTML = tasks.map(task => `

        
          <li class="task-item" data-id="${task.id}">
              <span><strong>${task.title}</strong>: ${task.description}</span>
              <div class="task-actions">
                  <button class="edit">Edit</button>
                  <button class="delete">Delete</button>
              </div>
          </li>
      `).join('');
  };

  // Add a new task
  addTaskBtn.addEventListener('click', async () => {
      const title = taskTitleInput.value;
      const description = taskDescInput.value;

      if (!title || !description) {
          alert('Please enter both a title and a description.');
          return;
      }

      try {
          await fetch('http://localhost:3000/tasks', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ title, description })
          });
          taskTitleInput.value = '';
          taskDescInput.value = '';
          await fetchTasks(); // Refresh the task list
      } catch (error) {
          console.error('Error adding task:', error);
      }
  });

  // Handle edit and delete actions
  taskList.addEventListener('click', async (e) => {
      const taskItem = e.target.closest('.task-item');
      const taskId = taskItem?.dataset.id;

      if (e.target.classList.contains('delete')) {
          if (confirm('Are you sure you want to delete this task?')) {
              try {
                  await fetch(`http://localhost:3000/tasks/${taskId}`, { method: 'DELETE' });
                  await fetchTasks(); // Refresh the task list
              } catch (error) {
                  console.error('Error deleting task:', error);
              }
          }
      } else if (e.target.classList.contains('edit')) {
          const newTitle = prompt('Enter new title:');
          const newDesc = prompt('Enter new description:');

          if (newTitle && newDesc) {
              try {
                  await fetch(`http://localhost:3000/tasks/${taskId}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ title: newTitle, description: newDesc })
                  });
                  await fetchTasks(); // Refresh the task list
              } catch (error) {
                  console.error('Error editing task:', error);
              }
          }
      }
  });

  // Initialize the task list on page load
  fetchTasks();
});
