class TaskManager {
    constructor() {
        this.tasks = [];
        this.currentUser = null;
        this.apiUrl = 'https://dapper-klepon-099019.netlify.app';
        this.initEventListeners();
    }

    initEventListeners() {
        document.getElementById('addTaskBtn').addEventListener('click', () => this.addTask());
        document.getElementById('taskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        document.getElementById('loginBtn').addEventListener('click', () => this.showLogin());
        document.getElementById('signupBtn').addEventListener('click', () => this.showSignup());
    }

    async addTask() {
        const taskInput = document.getElementById('taskInput');
        const taskText = taskInput.value.trim();

        if (!taskText) {
            alert('Please enter a task!');
            return;
        }

        try {
            const response = await fetch(`${this.apiUrl}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ text: taskText })
            });

            if (response.ok) {
                const task = await response.json();
                this.renderTask(task);
                taskInput.value = '';
            } else {
                throw new Error('Failed to add task');
            }
        } catch (error) {
            console.error('Error adding task:', error);
            // Fallback for development without backend
            this.renderTask({ id: Date.now(), text: taskText, completed: false });
            taskInput.value = '';
        }
    }

    renderTask(task) {
        const taskList = document.getElementById('taskList');
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        taskItem.innerHTML = `
            <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
            <div class="task-actions">
                <button onclick="taskManager.toggleTask(${task.id})" class="toggle-btn">
                    ${task.completed ? 'Undo' : 'Complete'}
                </button>
                <button onclick="taskManager.deleteTask(${task.id})" class="delete-btn">Delete</button>
            </div>
        `;
        taskList.appendChild(taskItem);
    }

    showLogin() {
        // Simple modal simulation - in production, use proper modal
        const email = prompt('Email:');
        const password = prompt('Password:');
        if (email && password) {
            this.login(email, password);
        }
    }

    showSignup() {
        const email = prompt('Email:');
        const password = prompt('Password:');
        if (email && password) {
            this.signup(email, password);
        }
    }

    async login(email, password) {
        try {
            const response = await fetch(`${this.apiUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                this.currentUser = data.user;
                this.showTaskSection();
                this.loadTasks();
            } else {
                alert('Login failed!');
            }
        } catch (error) {
            console.error('Login error:', error);
            // Fallback for development
            this.showTaskSection();
        }
    }

    showTaskSection() {
        document.getElementById('taskSection').classList.remove('hidden');
        document.getElementById('loginBtn').textContent = 'Logout';
        document.getElementById('signupBtn').style.display = 'none';
    }
}

// Initialize the app
const taskManager = new TaskManager();