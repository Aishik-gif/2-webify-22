const listContainer = document.querySelector("ul.task-list");
const newListForm = document.querySelector("form.new-list-form");
const newListInput = document.querySelector(".new-list");
const deleteListBtn = document.querySelector(".delete-list");
const taskContainer = document.querySelector(".todo-list");
const taskTitle = document.querySelector(".list-title");
const taskCount = document.querySelector(".task-count");
const tasks = document.querySelector("ul.tasks");
const taskTemplate = document.getElementById("task-template");
const newTaskForm = document.querySelector(".new-form");
const newTaskInput = document.querySelector(".new-task");
const sortBtn = document.querySelector(".sort");
const taskContents = document.querySelectorAll("div");
const delChecked = document.querySelector(".delete-checked");

const LOCAL_STORAGE_LIST_KEY = "task.lists";
const LOCAL_STORAGE_SELECTED_LIST_KEY = "task.selectedListId";

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedList = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_KEY);

listContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "li") {
    selectedList = e.target.dataset.ListId;
    saveAndRender();
  }
});

tasks.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "input") {
    const selectedListName = lists.find((list) => list.id === selectedList);
    const selectedTaskName = selectedListName.task.find(
      (task) => task.id === e.target.id
    );
    selectedTaskName.complete = e.target.checked;
    save();
    renderTaskCount(selectedListName);
  }
});

tasks.addEventListener("click", (e) => {
  if (e.target.parentNode.matches("button")) {
    const selectedListName = lists.find((list) => list.id == selectedList);
    const selectedTask = selectedListName.task.find(
      (task) =>
        task.id == e.target.parentNode.previousElementSibling.classList.value
    );
    deleteTask(selectedListName, selectedTask);
    saveAndRender();
  }
});

function deleteTask(selectedListName, selectedTask) {
  selectedListName.task = selectedListName.task.filter(
    (task) => task.id !== selectedTask.id
  );
}

taskTitle.addEventListener("input", (e) => {
  const selectedListName = lists.find((list) => list.id === selectedList);
  selectedListName.content = e.target.innerText;
  save();
  renderLists();
});

taskContents.forEach((taskContent) => {
  taskContent.addEventListener("input", (e) => {
    const selectedListName = lists.find((list) => list.id == selectedList);
    const selectedTask = selectedListName.task.find(
      (task) => task.id == e.target.classList.value
    );
    if (e.target.innerText == "") {
      deleteTask(selectedListName, selectedTask);
      saveAndRender();
    }
    selectedTask.content = e.target.innerText;
    save();
  });
});

newListForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const listName = newListInput.value;
  if (listName == null || listName === "") return;
  const list = createList(listName);
  newListInput.value = null;
  lists.push(list);
  selectedList = list.id;
  saveAndRender();
});

newTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskName = newTaskInput.value;
  if (taskName == null || taskName === "") return;
  const task = createtask(taskName);
  newTaskInput.value = null;
  const selectedListName = lists.find((list) => list.id == selectedList);
  selectedListName.task.push(task);
  saveAndRender();
});

sortBtn.addEventListener("click", (e) => {
  const task = lists.find((list) => list.id === selectedList);
  task.task.sort((a, b) => a.content.localeCompare(b.content));
  saveAndRender();
});

deleteListBtn.addEventListener("click", (e) => {
  lists = lists.filter((list) => list.id !== selectedList);
  selectedList = null;
  saveAndRender();
});

delChecked.addEventListener("click", (e) => {
  const selectedListName = lists.find((list) => list.id === selectedList);
  selectedListName.task = selectedListName.task.filter(
    (task) => !task.complete
  );
  saveAndRender();
});

function createList(name) {
  return { id: Date.now().toString(), content: name, task: [] };
}

function createtask(name) {
  return { id: Date.now().toString(), content: name, complete: false };
}

function saveAndRender() {
  save();
  render();
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_KEY, selectedList);
}

function render() {
  renderLists();

  const selectedListName = lists.find((list) => list.id === selectedList);

  if (selectedList == null || selectedList == "null") {
    taskContainer.style.display = "none";
  } else {
    taskContainer.style.display = "";
    taskTitle.innerText = selectedListName.content;
    renderTaskCount(selectedListName);
  }
  clearElement(tasks);
  renderTasks(selectedListName);
}

function renderLists() {
  clearElement(listContainer);
  lists.forEach((list) => {
    const listElement = document.createElement("li");
    listElement.dataset.ListId = list.id;
    listElement.classList.add("list-name");
    listElement.innerText = list.content;
    if (list.id === selectedList) listElement.classList.add("active-list");
    listContainer.appendChild(listElement);
  });
}

function renderTasks(selectedListName) {
  selectedListName.task.forEach((task) => {
    const taskElement = document.importNode(taskTemplate.content, true);
    const checkbox = taskElement.querySelector("input");
    checkbox.id = task.id;
    checkbox.checked = task.complete;
    const label = taskElement.querySelector("div");
    label.classList.add(task.id);
    label.append(task.content);
    tasks.appendChild(taskElement);
    const btn = taskElement.querySelector("button");
  });
}

function renderTaskCount(listName) {
  const incompleteTasks = listName.task.filter((task) => !task.complete).length;
  const taskString = incompleteTasks === 1 ? "task" : "tasks";
  taskCount.innerText = `${incompleteTasks} ${taskString} remaining`;
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function afocus() {
  newListInput.focus();
}

window.onload = render;
