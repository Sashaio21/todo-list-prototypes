/* =========================
   DOM ELEMENTS
========================= */

const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const noteInput = document.getElementById("noteInput");
const addNoteBtn = document.getElementById("addNoteBtn");
const noteList = document.getElementById("noteList");

const themeToggle = document.getElementById("themeToggle");

const dateInput = document.getElementById("taskDate");
const priorityInput = document.getElementById("taskPriority");

const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".tab-content");

const aiInput = document.getElementById("aiInput");
const aiGenerateBtn = document.getElementById("aiGenerateBtn");


/* =========================
   DATA (STATE)
========================= */

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let notes = JSON.parse(localStorage.getItem("notes")) || [];

let currentNote = null;

/* =========================
   STORAGE
========================= */

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

/* =========================
   THEME
========================= */

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  themeToggle.textContent = isDark ? "☀️" : "🌙";

  localStorage.setItem("theme", isDark ? "dark" : "light");
});


/* =========================
   AI
========================= */

aiGenerateBtn.addEventListener("click", generateTasksFromAI);

function generateTasksFromAI() {
  console.log("test")
  const text = aiInput.value.trim();
  if (!text) return;
  try {

    const aiTasks = JSON.parse(text);

    aiTasks.forEach(task => {

      tasks.push({
        text: task.text,
        date: task.date || "",
        priority: task.priority || "medium",
        completed: task.completed ?? false
      });

    });

    saveTasks();
    renderTasks();

    aiInput.value = "";

  } catch (error) {

    alert("Неверный JSON");

  }

}





/* =========================
   TASKS
========================= */

addBtn.addEventListener("click", addTask);

input.addEventListener("keydown", e => {
  if (e.key === "Enter") addTask();
});

function addTask() {

  const text = input.value.trim();
  const date = dateInput.value;
  const priority = priorityInput.value;

  if (!text) return;

  const task = {
    text: text,
    date: date,
    priority: priority,
    completed: false
  };

  tasks.push(task);

  saveTasks();
  renderTasks();

  input.value = "";
  dateInput.value = "";
  priorityInput.value = "medium";
}

function renderTasks() {

  taskList.innerHTML = "";

  tasks.forEach((task, index) => {

    const li = document.createElement("li");
    li.classList.add(task.priority);

    if (task.completed) li.classList.add("completed");
    if (task.date && isOverdue(task.date)) li.classList.add("overdue");

    const span = document.createElement("span");
    span.textContent = task.text;
    span.className = "task-text";

    span.addEventListener("click", () => {
      tasks[index].completed = !tasks[index].completed;

      saveTasks();
      renderTasks();
    });

    const deadline = document.createElement("small");

    if (task.date) {
      deadline.textContent = "📅 " + task.date;
      deadline.style.marginLeft = "8px";
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✕";
    deleteBtn.className = "delete-btn";

    deleteBtn.addEventListener("click", () => {
      tasks.splice(index, 1);

      saveTasks();
      renderTasks();
    });

    li.appendChild(span);
    li.appendChild(deadline);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);

  });
}

/* =========================
   NOTES
========================= */

addNoteBtn.addEventListener("click", addNote);

noteInput.addEventListener("keydown", e => {
  if (e.key === "Enter") addNote();
});

function addNote() {

  const text = noteInput.value.trim();

  if (!text) return;

  const note = {
    text: text,
    detail: text
  };

  notes.push(note);

  saveNotes();
  renderNotes();

  noteInput.value = "";
}

function renderNotes() {

  noteList.innerHTML = "";

  notes.forEach((note, index) => {

    const li = document.createElement("li");

    li.textContent = note.text;
    li.dataset.detail = note.detail;

    li.addEventListener("click", () => openNoteModal(index));

    noteList.appendChild(li);

  });

}

/* =========================
   NOTE MODAL
========================= */

const noteModal = document.getElementById("noteModal");
const noteDetail = document.getElementById("noteDetail");
const closeModal = document.getElementById("closeModal");
const saveNoteBtn = document.getElementById("saveNote");

function openNoteModal(index) {

  currentNote = index;

  noteDetail.value = notes[index].detail;

  noteModal.style.display = "block";
}

closeModal.addEventListener("click", () => {

  noteModal.style.display = "none";
  currentNote = null;

});

saveNoteBtn.addEventListener("click", () => {

  if (currentNote !== null) {

    notes[currentNote].text = noteDetail.value;
    notes[currentNote].detail = noteDetail.value;

    saveNotes();
    renderNotes();

  }

  noteModal.style.display = "none";
  currentNote = null;

});

window.addEventListener("click", (e) => {

  if (e.target == noteModal) {

    noteModal.style.display = "none";
    currentNote = null;

  }

});

/* =========================
   TABS
========================= */

tabs.forEach(tab => {

  tab.addEventListener("click", () => {

    tabs.forEach(t => t.classList.remove("active"));
    contents.forEach(c => c.classList.remove("active"));

    tab.classList.add("active");

    document
      .getElementById(tab.dataset.tab)
      .classList.add("active");

  });

});

/* =========================
   UTILS
========================= */

function isOverdue(date) {

  const today = new Date().toISOString().split("T")[0];

  return date < today;

}

/* =========================
   INIT
========================= */

renderTasks();
renderNotes();