// DOM Elements
const addTaskBtn = document.getElementById("add-task-btn");
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
const filterBtns = document.querySelectorAll(".filter-btn");
const addTaskModal = document.getElementById("add-task-modal");
const taskDetailModal = document.getElementById("task-detail-modal");
const closeBtns = document.querySelectorAll(".close-btn");

// Stats elements
const totalTasksElement = document.getElementById("total-tasks");
const pendingTasksElement = document.getElementById("pending-tasks");
const completedTasksElement = document.getElementById("completed-tasks");

// Task detail elements
const detailTitle = document.getElementById("detail-title");
const detailDescription = document.getElementById("detail-description");
const detailPriority = document.getElementById("detail-priority");
const detailDueDate = document.getElementById("detail-duedate");
const detailStatus = document.getElementById("detail-status");
const completeBtn = document.getElementById("complete-btn");
const deleteBtn = document.getElementById("delete-btn");

// State
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
let selectedTaskId = null;

// Initialize the app
function init() {
  renderTasks();
  updateStats();
  setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
  // Add task button
  addTaskBtn.addEventListener("click", () => {
    addTaskModal.style.display = "flex";
  });

  // Task form submission
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addNewTask();
  });

  // Filter buttons
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      renderTasks();
    });
  });

  // Close modals
  closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      addTaskModal.style.display = "none";
      taskDetailModal.style.display = "none";
    });
  });

  // Complete task button
  completeBtn.addEventListener("click", toggleTaskCompletion);

  // Delete task button
  deleteBtn.addEventListener("click", deleteSelectedTask);

  // Close modals when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === addTaskModal) {
      addTaskModal.style.display = "none";
    }
    if (e.target === taskDetailModal) {
      taskDetailModal.style.display = "none";
    }
  });
}

// Add a new task
function addNewTask() {
  const title = document.getElementById("task-title").value;
  const description = document.getElementById("task-description").value;
  const dueDate = document.getElementById("task-due-date").value;
  const priority = document.getElementById("task-priority").value;

  const newTask = {
    id: Date.now(),
    title,
    description,
    dueDate,
    priority,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  updateStats();

  // Reset form and close modal
  taskForm.reset();
  addTaskModal.style.display = "none";
}

// Render tasks based on current filter
function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;
  if (currentFilter === "pending") {
    filteredTasks = tasks.filter((task) => !task.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter((task) => task.completed);
  }

  if (filteredTasks.length === 0) {
    taskList.innerHTML =
      '<p class="no-tasks">No tasks found. Add a new task to get started!</p>';
    return;
  }

  filteredTasks.forEach((task) => {
    const taskElement = document.createElement("div");
    taskElement.className = `task-card ${task.completed ? "completed" : ""}`;
    taskElement.dataset.id = task.id;

    const dueDate = task.dueDate
      ? new Date(task.dueDate).toLocaleDateString()
      : "No due date";

    taskElement.innerHTML = `
            <h3 class="task-title">${task.title}</h3>
            <p>${task.description || "No description"}</p>
            <div class="task-meta">
                <span class="priority-tag priority-${task.priority}">${
      task.priority
    }</span>
                <span>Due: ${dueDate}</span>
            </div>
        `;

    taskElement.addEventListener("click", () => showTaskDetails(task.id));
    taskList.appendChild(taskElement);
  });
}

// Show task details in modal
function showTaskDetails(taskId) {
  selectedTaskId = taskId;
  const task = tasks.find((t) => t.id == taskId);

  if (!task) return;

  detailTitle.textContent = task.title;
  detailDescription.textContent = task.description || "No description provided";
  detailPriority.textContent = task.priority;
  detailPriority.className = `priority-tag priority-${task.priority}`;

  const dueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : "Not set";
  detailDueDate.textContent = `Due: ${dueDate}`;

  const statusText = task.completed ? "Completed" : "Pending";
  detailStatus.textContent = `Status: ${statusText}`;

  completeBtn.textContent = task.completed ? "Mark Pending" : "Mark Complete";

  taskDetailModal.style.display = "flex";
}

// Toggle task completion status
function toggleTaskCompletion() {
  const taskIndex = tasks.findIndex((t) => t.id == selectedTaskId);
  if (taskIndex === -1) return;

  tasks[taskIndex].completed = !tasks[taskIndex].completed;
  saveTasks();
  renderTasks();
  updateStats();
  showTaskDetails(selectedTaskId); // Refresh the details view
}

// Delete selected task
function deleteSelectedTask() {
  tasks = tasks.filter((t) => t.id != selectedTaskId);
  saveTasks();
  renderTasks();
  updateStats();
  taskDetailModal.style.display = "none";
}

// Update statistics
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;

  totalTasksElement.textContent = total;
  completedTasksElement.textContent = completed;
  pendingTasksElement.textContent = pending;
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Initialize the app
init();
