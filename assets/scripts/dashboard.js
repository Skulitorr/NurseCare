/**
 * NurseCare AI Dashboard - Enhanced JavaScript
 * Includes AI Assistant, Chart Improvements, and New Widgets
 */

// Global state to track initialization state
const dashboardState = {
    aiAssistantInitialized: false,
    chartsInitialized: false,
    notificationsInitialized: false,
    tasksInitialized: false,
    darkMode: false
};

// Mock data for the dashboard
const mockData = {
    inventory: {
        total: 1250,
        lowStock: 15,
        categories: {
            'Medical Supplies': 450,
            'Medications': 350,
            'Equipment': 250,
            'Personal Care': 200
        }
    },
    shifts: {
        total: 48,
        current: 12,
        distribution: {
            'Morning': 16,
            'Afternoon': 16,
            'Night': 16
        }
    },
    patients: {
        total: 85,
        status: {
            'Stable': 45,
            'Recovering': 25,
            'Critical': 15
        }
    }
};

// Document ready function
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing NurseCare AI Dashboard...');
    
    // Initialize all components
    initializeThemeToggle();
    initializeSidebar();
    initializeCharts();
    initializeAIChat();
    initializeNotifications();
    initializeTaskChecklist();
    initializeShiftPerformance();
    initializeSmartInventory();
    initializeMiniCalendar();
    initializeLanguageSelector();
    initializeAIShiftSummary();
    
    // Add the floating AI assistant button if it doesn't exist yet
    addFloatingAIButton();
    
    console.log('Dashboard initialization complete');
});

// Initialize theme toggle
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        // Check for user preference in localStorage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            dashboardState.darkMode = true;
            updateThemeIcon(true);
        }
        
        themeToggle.addEventListener('click', function() {
            const isDarkMode = document.body.classList.toggle('dark-mode');
            dashboardState.darkMode = isDarkMode;
            updateThemeIcon(isDarkMode);
            
            // Save preference
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
            
            // Update charts if they exist
            updateChartsTheme();
            
            showToast('Þema', isDarkMode ? 'Dökkt þema virkt' : 'Bjart þema virkt', 'info');
        });
    }
}

// Update theme icon
function updateThemeIcon(isDarkMode) {
    const themeIcon = document.querySelector('#theme-toggle i');
    if (themeIcon) {
        if (isDarkMode) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }
}

// Initialize sidebar toggle
function initializeSidebar() {
    const toggleButtons = document.querySelectorAll('#sidebar-toggle, #toggle-sidebar, #toggle-sidebar-mobile');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    toggleButtons.forEach(button => {
        if (button) {
            button.addEventListener('click', function() {
                sidebar.classList.toggle('collapsed');
                if (mainContent) {
                    mainContent.classList.toggle('expanded');
                }
            });
        }
    });
}

// Initialize improved Charts
export function initializeCharts() {
    if (dashboardState.chartsInitialized) return;
    
    // Add a small delay to ensure DOM is fully loaded
    setTimeout(() => {
        createInventoryChart();
        createShiftDistributionChart();
        createPatientStatusChart();
        
        dashboardState.chartsInitialized = true;
    }, 100);
}

// Create inventory distribution chart
function createInventoryChart() {
    const ctx = document.getElementById('inventoryChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(mockData.inventory.categories),
            datasets: [{
                data: Object.values(mockData.inventory.categories),
                backgroundColor: [
                    '#4a90e2',
                    '#50c878',
                    '#f39c12',
                    '#e74c3c'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Create shift distribution chart
function createShiftDistributionChart() {
    const ctx = document.getElementById('shiftChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(mockData.shifts.distribution),
            datasets: [{
                label: 'Staff Count',
                data: Object.values(mockData.shifts.distribution),
                backgroundColor: '#4a90e2'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Create patient status chart
function createPatientStatusChart() {
    const ctx = document.getElementById('patientChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(mockData.patients.status),
            datasets: [{
                data: Object.values(mockData.patients.status),
                backgroundColor: [
                    '#50c878',
                    '#f39c12',
                    '#e74c3c'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Update charts for dark/light mode
function updateChartsTheme() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#e2e8f0' : '#333333';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    const updateOptions = (chart) => {
        if (!chart) return;
        
        if (chart.options.scales) {
            // For charts with scales (line, bar)
            if (chart.options.scales.y) {
                chart.options.scales.y.ticks.color = textColor;
                chart.options.scales.y.grid.color = gridColor;
            }
            
            if (chart.options.scales.x) {
                chart.options.scales.x.ticks.color = textColor;
                chart.options.scales.x.grid.color = gridColor;
            }
        }
        
        if (chart.options.plugins && chart.options.plugins.legend) {
            chart.options.plugins.legend.labels.color = textColor;
        }
        
        // Update doughnut chart inactive color
        if (chart.config.type === 'doughnut') {
            chart.data.datasets[0].backgroundColor[1] = isDarkMode ? '#4b5563' : '#e5e7eb';
            
            // Update center text color if plugin exists
            if (chart.options.plugins.doughnutCenterText) {
                chart.options.plugins.doughnutCenterText.color = textColor;
            }
        }
        
        chart.update();
    };
    
    // Update all charts
    if (window.attendanceChart) updateOptions(window.attendanceChart);
    if (window.medicationChart) updateOptions(window.medicationChart);
    if (window.staffChart) updateOptions(window.staffChart);
    if (window.inventoryChart) updateOptions(window.inventoryChart);
    if (window.shiftPerformanceChart) updateOptions(window.shiftPerformanceChart);
}

// Initialize language selector
function initializeLanguageSelector() {
    const languageButtons = document.querySelectorAll('.language-btn');
    
    languageButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            languageButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get selected language from data attribute or use emoji to determine
            const lang = this.getAttribute('data-lang') || (this.textContent.includes('🇮🇸') ? 'is' : 'en');
            
            // Show notification
            const langName = lang === 'is' ? 'Íslenska' : 'English';
            showToast('Tungumál', `Tungumál valið: ${langName}`, 'info');
            
            // In a real app, you would update UI text here
            // For demo purposes, we'll store the language preference
            localStorage.setItem('language', lang);
        });
    });
}

// ====== AI CHAT ASSISTANT ======
// Initialize AI Chat
export function initializeAIChat() {
    if (dashboardState.aiAssistantInitialized) return;
    
    const chatToggle = document.getElementById('chat-toggle');
    const aiChat = document.getElementById('ai-chat');
    
    if (!aiChat) {
        // Create chat HTML if it doesn't exist
        createAIChatHTML();
    }
    
    // Once chat is created, add event listeners
    setupAIChatEventListeners();
    
    dashboardState.aiAssistantInitialized = true;
}

// Create AI Chat HTML
function createAIChatHTML() {
    const chatHtml = `
        <div class="ai-chat" id="ai-chat">
            <div class="chat-header">
                <div class="chat-title">
                    <i class="fas fa-robot"></i>
                    <span>NurseCare AI Aðstoðarmaður</span>
                </div>
                <div class="chat-actions">
                    <button class="minimize-chat" id="minimize-chat">
                        <i class="fas fa-minus"></i>
                    </button>
                    <button class="close-chat" id="close-chat">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <div class="chat-messages" id="chat-messages">
                <!-- Chat messages will be added dynamically -->
            </div>
            <div class="chat-input-container">
                <form id="chat-form">
                    <input 
                        type="text" 
                        id="chat-input" 
                        placeholder="Spyrðu mig um hvað sem er..." 
                        class="chat-input"
                    >
                    <button type="submit" class="chat-send">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', chatHtml);
}

// Setup AI Chat event listeners
function setupAIChatEventListeners() {
    const chatToggle = document.getElementById('chat-toggle');
    const floatingChatBtn = document.getElementById('floating-chat-btn');
    const aiChat = document.getElementById('ai-chat');
    const closeChat = document.getElementById('close-chat');
    const minimizeChat = document.getElementById('minimize-chat');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    
    // Toggle chat open/closed
    const toggleChatButtons = [chatToggle, floatingChatBtn];
    toggleChatButtons.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', function() {
                if (aiChat.classList.contains('minimized')) {
                    // If minimized, restore it first
                    aiChat.classList.remove('minimized');
                    if (minimizeChat) {
                        minimizeChat.innerHTML = '<i class="fas fa-minus"></i>';
                    }
                }
                
                aiChat.classList.toggle('open');
                
                // Focus input when opening
                if (aiChat.classList.contains('open') && chatInput) {
                    setTimeout(() => {
                        chatInput.focus();
                    }, 300);
                }
            });
        }
    });
    
    // Close chat
    if (closeChat && aiChat) {
        closeChat.addEventListener('click', function() {
            aiChat.classList.remove('open');
        });
    }
    
    // Minimize chat
    if (minimizeChat && aiChat) {
        minimizeChat.addEventListener('click', function() {
            aiChat.classList.toggle('minimized');
            
            // Update button icon
            if (aiChat.classList.contains('minimized')) {
                this.innerHTML = '<i class="fas fa-expand-alt"></i>';
            } else {
                this.innerHTML = '<i class="fas fa-minus"></i>';
            }
        });
    }
    
    // Handle chat form submission
    if (chatForm && chatInput && chatMessages) {
        chatForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const message = chatInput.value.trim();
            if (!message) return;
            
            // Add user message
            addMessageToChat('user', message);
            
            // Clear input
            chatInput.value = '';
            
            // Add typing indicator
            addTypingIndicator();
            
            // Send to AI API
            processUserMessage(message);
        });
    }
    
    // Load chat history if available
    loadChatHistory();
}

// Add floating AI button if it doesn't exist
function addFloatingAIButton() {
    if (document.getElementById('floating-chat-btn')) return;
    
    const buttonHtml = `
        <button id="floating-chat-btn" class="floating-chat-btn" aria-label="Open AI Assistant">
            <i class="fas fa-comment-medical"></i>
        </button>
    `;
    
    document.body.insertAdjacentHTML('beforeend', buttonHtml);
    
    // Add event listener once it's created
    const floatingChatBtn = document.getElementById('floating-chat-btn');
    if (floatingChatBtn) {
        floatingChatBtn.addEventListener('click', function() {
            const aiChat = document.getElementById('ai-chat');
            
            if (aiChat) {
                if (aiChat.classList.contains('minimized')) {
                    aiChat.classList.remove('minimized');
                    const minimizeChat = document.getElementById('minimize-chat');
                    if (minimizeChat) {
                        minimizeChat.innerHTML = '<i class="fas fa-minus"></i>';
                    }
                }
                
                aiChat.classList.add('open');
                
                // Focus input
                const chatInput = document.getElementById('chat-input');
                if (chatInput) {
                    setTimeout(() => {
                        chatInput.focus();
                    }, 300);
                }
            } else {
                // If chat doesn't exist yet, create it
                createAIChatHTML();
                setupAIChatEventListeners();
                
                // Then open it
                const aiChat = document.getElementById('ai-chat');
                if (aiChat) {
                    aiChat.classList.add('open');
                    
                    // Focus input
                    const chatInput = document.getElementById('chat-input');
                    if (chatInput) {
                        setTimeout(() => {
                            chatInput.focus();
                        }, 300);
                    }
                }
            }
        });
    }
}

// Add chat message
export function addMessageToChat(sender, message, isHistory = false) {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    // Determine message class and avatar content
    let className = 'message';
    let avatarHtml = '';
    
    switch (sender) {
        case 'system':
        case 'assistant':
            className += ' assistant';
            avatarHtml = '<i class="fas fa-robot"></i>';
            break;
        case 'user':
            className += ' user';
            avatarHtml = '<i class="fas fa-user"></i>';
            break;
    }
    
    // Create timestamp
    const timestamp = new Date().toLocaleTimeString('is-IS', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = className;
    
    messageElement.innerHTML = `
        <div class="message-avatar">
            ${avatarHtml}
        </div>
        <div class="message-content">
            <p>${message}</p>
            <div class="message-timestamp">${timestamp}</div>
        </div>
    `;
    
    chatMessages.appendChild(messageElement);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Save to history if not already from history
    if (!isHistory) {
        saveChatHistory(sender, message, timestamp);
    }
}

// Add typing indicator
function addTypingIndicator() {
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.innerHTML = '<span></span><span></span><span></span>';
    document.querySelector('.chat-messages').appendChild(typingIndicator);
    scrollToBottom();
}

// Remove typing indicator
function removeTypingIndicator() {
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Get quick responses (for common questions without needing AI call)
function getQuickResponse(message) {
    // No pre-defined responses, all messages will be sent to AI
    return null;
}

// Send message to AI
async function sendToAI(message) {
    try {
        const messages = Array.from(document.querySelectorAll('.message')).map(msg => ({
            role: msg.classList.contains('user-message') ? 'user' : 'assistant',
            content: msg.querySelector('.message-content').textContent
        }));

        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error);
        }

        return data.response;
    } catch (error) {
        console.error('Error sending message to AI:', error);
        throw error;
    }
}

// Format AI response for better Icelandic display
function formatAIResponse(response) {
    // Fix potential Icelandic character issues if needed
    return response
        .replace(/th/g, 'þ')
        .replace(/ae/g, 'æ')
        .replace(/oe/g, 'ö');
}

// Save chat message to history
function saveChatHistory(sender, message, timestamp) {
    // Get existing history or create new
    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    
    // Add new message
    history.push({
        sender,
        message,
        timestamp,
        date: new Date().toISOString()
    });
    
    // Limit history to last 50 messages
    if (history.length > 50) {
        history.splice(0, history.length - 50);
    }
    
    // Save to localStorage
    localStorage.setItem('chatHistory', JSON.stringify(history));
}

// Load chat history from localStorage
function loadChatHistory() {
    const chatMessages = document.getElementById('chat-messages');
    if (!chatMessages) return;
    
    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    
    // Skip if no history
    if (history.length === 0) return;
    
    // Clear all existing messages
    chatMessages.innerHTML = '';
    
    // Add history messages
    history.forEach(item => {
        addMessageToChat(item.sender, item.message, true);
    });
}

// ====== NOTIFICATIONS PANEL ======
function initializeNotifications() {
    if (dashboardState.notificationsInitialized) return;
    
    // Add notification count if it exists
    updateNotificationCount();
    
    // Add event listener to notification button
    const notificationBtn = document.getElementById('notification-btn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', toggleNotificationsPanel);
    }
    
    dashboardState.notificationsInitialized = true;
}

// Update notification badge count
function updateNotificationCount() {
    const notificationCount = document.querySelector('.notification-count');
    if (notificationCount) {
        // Get unread notifications count from localStorage or set default
        const unreadCount = localStorage.getItem('unreadNotifications') || '3';
        notificationCount.textContent = unreadCount;
        
        // Hide badge if no unread notifications
        if (unreadCount === '0') {
            notificationCount.style.display = 'none';
        } else {
            notificationCount.style.display = 'flex';
        }
    }
}

// Toggle notifications panel
function toggleNotificationsPanel() {
    let notificationsPanel = document.getElementById('notifications-panel-overlay');
    
    if (!notificationsPanel) {
        // Create panel if it doesn't exist
        createNotificationsPanel();
        notificationsPanel = document.getElementById('notifications-panel-overlay');
    }
    
    // Toggle panel visibility
    if (notificationsPanel) {
        notificationsPanel.classList.toggle('active');
        
        // If opening panel, mark as read
        if (notificationsPanel.classList.contains('active')) {
            // Update unread count in localStorage
            localStorage.setItem('unreadNotifications', '0');
            updateNotificationCount();
        }
    }
}

// Create notifications panel
function createNotificationsPanel() {
    const notifications = getNotifications();
    let notificationsHtml = '';
    
    notifications.forEach(notification => {
        notificationsHtml += `
            <div class="notification-item ${notification.unread ? 'unread' : ''}">
                <div class="notification-icon ${notification.type}">
                    <i class="fas ${notification.icon}"></i>
                </div>
                <div class="notification-content">
                    <p class="notification-text">${notification.text}</p>
                    <p class="notification-time">${notification.time}</p>
                </div>
            </div>
        `;
    });
    
    const panelHtml = `
        <div id="notifications-panel-overlay" class="notifications-panel-overlay">
            <div class="notifications-panel">
                <div class="notifications-header">
                    <h3><i class="fas fa-bell"></i> Tilkynningar</h3>
                    <div class="notifications-actions">
                        <button id="mark-all-read" class="btn btn-sm btn-secondary">
                            <i class="fas fa-check-double"></i> Merkja allt sem lesið
                        </button>
                        <button id="close-notifications" class="btn btn-sm btn-secondary">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="notifications-content">
                    ${notificationsHtml}
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', panelHtml);
    
    // Add event listeners
    const closeBtn = document.getElementById('close-notifications');
    const markAllReadBtn = document.getElementById('mark-all-read');
    const overlay = document.getElementById('notifications-panel-overlay');
    
    if (closeBtn && overlay) {
        closeBtn.addEventListener('click', () => {
            overlay.classList.remove('active');
        });
    }
    
    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', () => {
            const unreadItems = document.querySelectorAll('.notification-item.unread');
            unreadItems.forEach(item => {
                item.classList.remove('unread');
            });
            
            // Update unread count in localStorage
            localStorage.setItem('unreadNotifications', '0');
            updateNotificationCount();
            
            showToast('Tilkynningar', 'Allar tilkynningar merktar sem lesnar', 'success');
        });
    }
    
    // Close when clicking outside the panel
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
        });
    }
}

// Get notifications data
function getNotifications() {
    return [
        {
            type: 'ai',
            icon: 'fa-robot',
            text: 'Gervigreind hefur greint aukna fallhættu hjá sjúklingi í herbergi 204',
            time: 'Fyrir 15 mínútum',
            unread: true
        },
        {
            type: 'inventory',
            icon: 'fa-boxes',
            text: 'Birgðir af skurðgrímum eru að verða búnar (20%)',
            time: 'Fyrir 45 mínútum',
            unread: true
        },
        {
            type: 'reminder',
            icon: 'fa-clock',
            text: 'Áminning: Teymisfundur kl. 16:00',
            time: 'Fyrir 2 klukkustundum',
            unread: true
        },
        {
            type: 'staff',
            icon: 'fa-user-md',
            text: 'Guðrún Þorsteinsdóttir hefur tilkynnt veikindi',
            time: 'Fyrir 5 klukkustundum',
            unread: false
        },
        {
            type: 'medication',
            icon: 'fa-pills',
            text: 'Lyfjagjöf fyrir Jón Gunnarsson var skráð af Sigríði',
            time: 'Fyrir 6 klukkustundum',
            unread: false
        }
    ];
}

// ====== TASK CHECKLIST ======
function initializeTaskChecklist() {
    if (dashboardState.tasksInitialized) return;
    
    // Find task list container if it exists
    const taskContainer = document.getElementById('task-checklist');
    
    if (taskContainer) {
        // Load existing tasks from localStorage
        loadTasks(taskContainer);
        
        // Add event listeners for checkboxes
        addTaskEventListeners(taskContainer);
        
        // Add event listener to add new task button if it exists
        const addTaskBtn = document.getElementById('add-task-btn');
        if (addTaskBtn) {
            addTaskBtn.addEventListener('click', () => {
                showAddTaskModal();
            });
        }
    }
    
    dashboardState.tasksInitialized = true;
}

// Load tasks from localStorage
function loadTasks(container) {
    // Get tasks from localStorage or use default tasks
    const tasks = JSON.parse(localStorage.getItem('nurseCareTaskList')) || getDefaultTasks();
    
    // Clear container
    container.innerHTML = '';
    
    // Add tasks to container
    tasks.forEach((task, index) => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        taskItem.dataset.id = index;
        
        taskItem.innerHTML = `
            <div class="task-checkbox">
                <input type="checkbox" id="task-${index}" ${task.completed ? 'checked' : ''}>
                <label for="task-${index}"></label>
            </div>
            <div class="task-content">
                <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
                <span class="task-time">${task.time || 'Í dag'}</span>
            </div>
            <div class="task-actions">
                <button class="task-delete" data-id="${index}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        container.appendChild(taskItem);
    });
    
    // Update task completion percentage
    updateTaskCompletion(tasks);
}

// Add event listeners to task items
function addTaskEventListeners(container) {
    // Checkbox change event
    container.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox' && e.target.id.startsWith('task-')) {
            const taskId = parseInt(e.target.id.replace('task-', ''));
            const taskText = e.target.parentNode.nextElementSibling.querySelector('.task-text');
            
            // Get tasks from localStorage
            const tasks = JSON.parse(localStorage.getItem('nurseCareTaskList')) || getDefaultTasks();
            
            // Update task completion status
            if (taskId >= 0 && taskId < tasks.length) {
                tasks[taskId].completed = e.target.checked;
                
                // Update text styling
                if (e.target.checked) {
                    taskText.classList.add('completed');
                } else {
                    taskText.classList.remove('completed');
                }
                
                // Save to localStorage
                localStorage.setItem('nurseCareTaskList', JSON.stringify(tasks));
                
                // Update completion percentage
                updateTaskCompletion(tasks);
            }
        }
    });
    
    // Delete button click event
    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('task-delete') || e.target.parentNode.classList.contains('task-delete')) {
            const deleteBtn = e.target.classList.contains('task-delete') ? e.target : e.target.parentNode;
            const taskId = parseInt(deleteBtn.dataset.id);
            
            // Get tasks from localStorage
            const tasks = JSON.parse(localStorage.getItem('nurseCareTaskList')) || getDefaultTasks();
            
            // Remove task
            if (taskId >= 0 && taskId < tasks.length) {
                tasks.splice(taskId, 1);
                
                // Save to localStorage
                localStorage.setItem('nurseCareTaskList', JSON.stringify(tasks));
                
                // Reload tasks
                loadTasks(container);
                
                // Show toast
                showToast('Verkefni', 'Verkefni eytt', 'info');
            }
        }
    });
}

// Get default tasks
function getDefaultTasks() {
    return [
        { text: 'Skrá lífsmörk sjúklinga', completed: true, time: '8:00' },
        { text: 'Gefa morgunlyf', completed: true, time: '9:00' },
        { text: 'Aðstoða við morgunverð', completed: false, time: '10:00' },
        { text: 'Fylla á birgðir á deild 2', completed: false, time: '11:30' },
        { text: 'Gefa hádegislyf', completed: false, time: '12:00' },
        { text: 'Útbúa vaktaskipulag', completed: false, time: '14:00' }
    ];
}

// Update task completion percentage
function updateTaskCompletion(tasks) {
    const progressContainer = document.getElementById('task-progress');
    if (!progressContainer) return;
    
    // Calculate completion percentage
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Update progress bar
    const progressBar = progressContainer.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
        progressBar.setAttribute('aria-valuenow', percentage);
    }
    
    // Update text
    const progressText = progressContainer.querySelector('.progress-text');
    if (progressText) {
        progressText.textContent = `${completed}/${total} verkefni lokið (${percentage}%)`;
    }
    
    // Update shift performance chart if it exists
    updateShiftPerformance(percentage);
}

// Show modal to add new task
function showAddTaskModal() {
    // Create modal if it doesn't exist
    if (!document.getElementById('add-task-modal')) {
        const modalHtml = `
            <div id="add-task-modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-tasks"></i> Bæta við verkefni</h3>
                        <button id="close-task-modal" class="close-btn">&times;</button>
                    </div>
                    <div class="modal-body">
                        <form id="add-task-form">
                            <div class="form-group">
                                <label for="task-text">Verkefni</label>
                                <input type="text" id="task-text" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label for="task-time">Tími</label>
                                <input type="time" id="task-time" class="form-control">
                            </div>
                            <div class="form-actions">
                                <button type="button" id="cancel-add-task" class="btn btn-secondary">Hætta við</button>
                                <button type="submit" class="btn btn-primary">Bæta við</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Add event listeners
        const closeBtn = document.getElementById('close-task-modal');
        const cancelBtn = document.getElementById('cancel-add-task');
        const modal = document.getElementById('add-task-modal');
        const form = document.getElementById('add-task-form');
        
        // Close modal events
        [closeBtn, cancelBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => {
                    modal.style.display = 'none';
                });
            }
        });
        
        // Submit form event
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const taskText = document.getElementById('task-text').value.trim();
                const taskTime = document.getElementById('task-time').value;
                
                if (taskText) {
                    // Get tasks from localStorage
                    const tasks = JSON.parse(localStorage.getItem('nurseCareTaskList')) || getDefaultTasks();
                    
                    // Format time for display
                    let formattedTime = 'Í dag';
                    if (taskTime) {
                        formattedTime = taskTime;
                    }
                    
                    // Add new task
                    tasks.push({
                        text: taskText,
                        completed: false,
                        time: formattedTime
                    });
                    
                    // Save to localStorage
                    localStorage.setItem('nurseCareTaskList', JSON.stringify(tasks));
                    
                    // Reload tasks
                    const taskContainer = document.getElementById('task-checklist');
                    if (taskContainer) {
                        loadTasks(taskContainer);
                    }
                    
                    // Close modal
                    modal.style.display = 'none';
                    
                    // Show toast
                    showToast('Verkefni', 'Nýtt verkefni bætt við', 'success');
                }
            });
        }
    }
    
    // Show modal
    const modal = document.getElementById('add-task-modal');
    if (modal) {
        modal.style.display = 'flex';
        
        // Reset form
        const form = document.getElementById('add-task-form');
        if (form) {
            form.reset();
        }
        
        // Focus on task text input
        const taskText = document.getElementById('task-text');
        if (taskText) {
            setTimeout(() => {
                taskText.focus();
            }, 100);
        }
    }
}

// ====== SHIFT PERFORMANCE ======
function initializeShiftPerformance() {
    const shiftPerformanceContainer = document.getElementById('shift-performance-chart');
    
    if (shiftPerformanceContainer) {
        createShiftPerformanceChart(shiftPerformanceContainer);
    }
}

// Create shift performance chart
function createShiftPerformanceChart(container) {
    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#e2e8f0' : '#333333';
    
    // Check if chart instance exists
    if (window.shiftPerformanceChart && typeof window.shiftPerformanceChart.destroy === 'function') {
        window.shiftPerformanceChart.destroy();
    }
    
    // Get task data from localStorage
    const tasks = JSON.parse(localStorage.getItem('nurseCareTaskList')) || getDefaultTasks();
    const completedPercentage = tasks.length > 0 
        ? Math.round((tasks.filter(task => task.completed).length / tasks.length) * 100) 
        : 0;
    
    // Create canvas element if it doesn't exist
    let canvas = container.querySelector('canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        container.appendChild(canvas);
    }
    
    window.shiftPerformanceChart = new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: ['Lokið', 'Ólokið'],
            datasets: [{
                data: [completedPercentage, 100 - completedPercentage],
                backgroundColor: [
                    '#10b981',
                    isDarkMode ? '#4b5563' : '#e5e7eb'
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.5,
            animation: {
                duration: 750
            },
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: textColor,
                        boxWidth: 12,
                        padding: 10,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                },
                // Add center text plugin
                doughnutCenterText: {
                    text: completedPercentage + '%',
                    color: textColor,
                    fontStyle: 'bold',
                    fontSize: 24
                }
            }
        },
        plugins: [{
            id: 'doughnutCenterText',
            beforeDraw: function(chart) {
                if (chart.config.options.plugins.doughnutCenterText) {
                    // Get ctx and config
                    const ctx = chart.ctx;
                    const options = chart.config.options.plugins.doughnutCenterText;
                    
                    // Get chart data
                    const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
                    const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
                    
                    // Draw center text
                    ctx.save();
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.font = options.fontStyle + ' ' + options.fontSize + 'px sans-serif';
                    ctx.fillStyle = options.color;
                    ctx.fillText(options.text, centerX, centerY);
                    ctx.restore();
                }
            }
        }]
    });
}

// Update shift performance chart
function updateShiftPerformance(completionPercentage) {
    if (window.shiftPerformanceChart && typeof window.shiftPerformanceChart.update === 'function') {
        window.shiftPerformanceChart.data.datasets[0].data = [completionPercentage, 100 - completionPercentage];
        window.shiftPerformanceChart.options.plugins.doughnutCenterText.text = completionPercentage + '%';
        window.shiftPerformanceChart.update();
    }
}

// ====== AI SHIFT SUMMARY ======
function initializeAIShiftSummary() {
    const generateSummaryBtn = document.getElementById('generate-summary-btn');
    
    if (generateSummaryBtn) {
        generateSummaryBtn.addEventListener('click', generateAIShiftSummary);
    }
}

// Generate AI shift summary
async function generateAIShiftSummary() {
    const summaryContainer = document.getElementById('shift-summary');
    const generateBtn = document.getElementById('generate-summary-btn');
    
    if (!summaryContainer || !generateBtn) return;
    
    // Show loading state
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Genererar...';
    
    // Set loading content
    summaryContainer.innerHTML = `
        <div class="summary-loading">
            <div class="spinner"></div>
            <p>Gervigreind er að útbúa vaktalýsingu...</p>
        </div>
    `;
    
    try {
        // Get tasks and other relevant data
        const tasks = JSON.parse(localStorage.getItem('nurseCareTaskList')) || getDefaultTasks();
        const completedTasks = tasks.filter(task => task.completed);
        const incompleteTasksNames = tasks.filter(task => !task.completed).map(task => task.text);
        const completionPercentage = tasks.length > 0 
            ? Math.round((completedTasks.length / tasks.length) * 100) 
            : 0;
        
        // Create prompt for AI
        const prompt = `
            Sem hjúkrunarfræðingur á deild, búðu til stutta vaktalýsingu (á íslensku) sem lýsir eftirfarandi:
            
            Lokið verkefnum: ${completedTasks.map(task => task.text).join(', ')}
            
            Óloknum verkefnum: ${incompleteTasksNames.join(', ')}
            
            Heildarárangur vaktar: ${completionPercentage}%
            
            Gerðu þetta í þriðju persónu um hjúkrunarfræðing að nafni Anna. Nefndu 1-2 sjúklinga sem fengu sérstaka athygli og búðu til einfaldar athugasemdir um ástand þeirra.
            
            Eyddu ekki meiru en þremur setningum í að lýsa vaktatímabilinu, einbeittu þér að mikilvægustu atriðunum fyrir næstu vakt.
        `;
        
        // Call API to generate summary
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: prompt })
        });
        
        if (!response.ok) {
            throw new Error('Tengingarvilla við gervigreind');
        }
        
        const data = await response.json();
        console.log('AI summary response:', data);
        
        // Display summary
        summaryContainer.innerHTML = `
            <div class="summary-content">
                <p>${data.result}</p>
            </div>
            <div class="summary-stats">
                <div class="summary-stat">
                    <div class="stat-value">${completedTasks.length}/${tasks.length}</div>
                    <div class="stat-label">Verkefni lokið</div>
                </div>
                <div class="summary-stat">
                    <div class="stat-value">${completionPercentage}%</div>
                    <div class="stat-label">Árangur</div>
                </div>
                <div class="summary-stat">
                    <div class="stat-value">${getCurrentShift()}</div>
                    <div class="stat-label">Vakt</div>
                </div>
            </div>
            <button class="btn btn-primary btn-full" id="save-summary-btn">
                <i class="fas fa-save"></i> Vista vaktalýsingu
            </button>
        `;
        
        // Add event listener to save button
        const saveBtn = document.getElementById('save-summary-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                // Save summary to localStorage
                const summaries = JSON.parse(localStorage.getItem('shiftSummaries') || '[]');
                summaries.push({
                    date: new Date().toISOString(),
                    text: data.result,
                    stats: {
                        completed: completedTasks.length,
                        total: tasks.length,
                        percentage: completionPercentage,
                        shift: getCurrentShift()
                    }
                });
                
                localStorage.setItem('shiftSummaries', JSON.stringify(summaries));
                
                // Show toast
                showToast('Vaktalýsing', 'Vaktalýsing vistuð', 'success');
            });
        }
        
    } catch (error) {
        console.error('Error generating summary:', error);
        
        // Show error
        summaryContainer.innerHTML = `
            <div class="summary-error">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Villa kom upp við að búa til vaktalýsingu. Vinsamlegast reyndu aftur síðar.</p>
            </div>
        `;
        
        // Show toast
        showToast('Villa', 'Ekki tókst að búa til vaktalýsingu', 'error');
    } finally {
        // Reset button
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Búa til vaktalýsingu';
    }
}

// Get current shift name based on time
function getCurrentShift() {
    const hour = new Date().getHours();
    
    if (hour >= 8 && hour < 16) {
        return 'Morgunvakt';
    } else if (hour >= 16 && hour < 0) {
        return 'Kvöldvakt';
    } else {
        return 'Næturvakt';
    }
}

// ====== SMART INVENTORY ======
function initializeSmartInventory() {
    const inventoryContainer = document.getElementById('smart-inventory');
    
    if (inventoryContainer) {
        // Load inventory items (mocked)
        loadInventoryItems();
        
        // Add event listener to reorder button
        inventoryContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('reorder-btn') || e.target.parentElement.classList.contains('reorder-btn')) {
                // Get item name from closest inventory item
                const button = e.target.classList.contains('reorder-btn') ? e.target : e.target.parentElement;
                const itemContainer = button.closest('.inventory-item');
                
                if (itemContainer) {
                    const itemName = itemContainer.querySelector('.inventory-name').textContent;
                    
                    // Show toast for reorder
                    showToast('Birgðir', `Pöntun send fyrir: ${itemName}`, 'success');
                    
                    // Change button state
                    button.disabled = true;
                    button.innerHTML = '<i class="fas fa-check"></i> Pantað';
                    button.classList.remove('btn-warning');
                    button.classList.add('btn-secondary');
                }
            }
        });
    }
}

// Load inventory items
function loadInventoryItems() {
    const inventoryContainer = document.getElementById('smart-inventory');
    if (!inventoryContainer) return;

    // Sample inventory data
    const items = [
        { name: 'Skurðgrímur', current: 200, minimum: 1000, percentage: 20 },
        { name: 'Hanskar (S)', current: 1200, minimum: 500, percentage: 240 },
        { name: 'Hanskar (M)', current: 1500, minimum: 500, percentage: 300 },
        { name: 'Sprautur', current: 800, minimum: 1000, percentage: 80 },
        { name: 'Sáraumbúðir', current: 400, minimum: 1000, percentage: 40 }
    ];

    // Create items HTML
    let itemsHtml = '';
    items.forEach(item => {
        const statusClass = item.percentage < 30 ? 'critical' : (item.percentage < 60 ? 'warning' : 'ok');
        const needsReorder = item.percentage < 40;
        
        itemsHtml += `
            <div class="inventory-item">
                <div class="inventory-info">
                    <div class="inventory-name">${item.name}</div>
                    <div class="inventory-status ${statusClass}">
                        <div class="inventory-progress-bar">
                            <div class="inventory-progress-fill" style="width: ${item.percentage}%"></div>
                        </div>
                        <div class="inventory-status-text">
                            ${item.current} af ${item.minimum} (${item.percentage}%)
                        </div>
                    </div>
                </div>
                <div class="inventory-actions">
                    <button class="btn ${needsReorder ? 'btn-warning' : 'btn-secondary'} btn-sm reorder-btn" ${needsReorder ? '' : 'disabled'}>
                        ${needsReorder ? '<i class="fas fa-shopping-cart"></i> Panta' : '<i class="fas fa-check"></i> Nóg til'}
                    </button>
                </div>
            </div>
        `;
    });

    // Set container HTML
    inventoryContainer.innerHTML = itemsHtml;
}

// ====== MINI CALENDAR ======
function initializeMiniCalendar() {
    const calendarContainer = document.getElementById('mini-calendar');
    
    if (calendarContainer) {
        // Render calendar
        renderCalendar(calendarContainer);
    }
}

// Render mini calendar
function renderCalendar(container) {
    // Get current date
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDate = now.getDate();
    const currentDay = now.getDay();
    
    // Get days in month
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Get first day of month
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    
    // Create month name
    const monthNames = [
        'Janúar', 'Febrúar', 'Mars', 'Apríl', 'Maí', 'Júní',
        'Júlí', 'Ágúst', 'September', 'Október', 'Nóvember', 'Desember'
    ];
    
    const monthName = monthNames[currentMonth];
    
    // Create day names
    const dayNames = ['Sun', 'Mán', 'Þri', 'Mið', 'Fim', 'Fös', 'Lau'];
    
    // Create HTML
    let calendarHtml = `
        <div class="calendar-header">
            <div class="calendar-month">${monthName} ${currentYear}</div>
        </div>
        <div class="calendar-body">
            <div class="calendar-days">
    `;
    
    // Add day names
    dayNames.forEach(day => {
        calendarHtml += `<div class="calendar-day-name">${day}</div>`;
    });
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarHtml += `<div class="calendar-day empty"></div>`;
    }
    
    // Add days
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === currentDate;
        const hasEvent = getEventsForDay(day);
        
        calendarHtml += `
            <div class="calendar-day ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''}">
                <div class="calendar-date">${day}</div>
                ${hasEvent ? `<div class="calendar-event-indicator"></div>` : ''}
            </div>
        `;
    }
    
    calendarHtml += `
            </div>
        </div>
        <div class="calendar-events">
            <div class="calendar-events-header">Viðburðir í dag</div>
            <div class="calendar-events-list">
    `;
    
    // Add today's events
    const todayEvents = getEventsForDate(currentDate);
    
    if (todayEvents.length > 0) {
        todayEvents.forEach(event => {
            calendarHtml += `
                <div class="calendar-event">
                    <div class="event-time">${event.time}</div>
                    <div class="event-title">${event.title}</div>
                </div>
            `;
        });
    } else {
        calendarHtml += `
            <div class="calendar-no-events">
                Engir viðburðir í dag
            </div>
        `;
    }
    
    calendarHtml += `
            </div>
        </div>
    `;
    
    // Set container HTML
    container.innerHTML = calendarHtml;
}

// Get events for a specific day (mocked)
function getEventsForDay(day) {
    // Mock event days (current month)
    const eventDays = [3, 8, 12, 15, 18, 22, 25, 28];
    return eventDays.includes(day);
}

// Get events for specific date (mocked)
function getEventsForDate(date) {
    // Current date events
    const currentDate = new Date().getDate();
    
    if (date === currentDate) {
        return [
            { time: '9:00', title: 'Morgun teymisfundur' },
            { time: '12:00', title: 'Lyfjaskipti' },
            { time: '15:00', title: 'Læknisheimsókn' },
            { time: '16:00', title: 'Vaktaskipti' }
        ];
    }
    
    return [];
}

// ====== UTILITY FUNCTIONS ======

// Show toast notification
export function showToast(title, message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Get icon based on type
    let icon;
    switch (type) {
        case 'success':
            icon = 'fa-check-circle';
            break;
        case 'error':
            icon = 'fa-times-circle';
            break;
        case 'warning':
            icon = 'fa-exclamation-triangle';
            break;
        default:
            icon = 'fa-info-circle';
    }
    
    // Set content
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas ${icon}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Add close event
    const closeBtn = toast.querySelector('.toast-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            toast.classList.add('toast-hiding');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        });
    }
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.classList.add('toast-hiding');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }
    }, 5000);
}

async function processUserMessage(message) {
    try {
        // Add user message to chat immediately
        addMessageToChat('user', message);
        
        // Show typing indicator
        addTypingIndicator();
        
        // Get AI response
        const aiResponse = await sendToAI(message);
        
        // Remove typing indicator
        removeTypingIndicator();
        
        // Add AI response with typing animation
        await addMessageToChatWithTypingAnimation('assistant', aiResponse);
        
        // Scroll to bottom
        scrollToBottom();
    } catch (error) {
        console.error('Error processing message:', error);
        removeTypingIndicator();
        addMessageToChat('assistant', 'Því miður kom upp villa. Vinsamlegast reyndu aftur.');
    }
}

async function addMessageToChatWithTypingAnimation(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${sender}-message`;
    
    const textElement = document.createElement('div');
    textElement.className = 'message-text';
    messageElement.appendChild(textElement);
    
    document.querySelector('.chat-messages').appendChild(messageElement);
    
    // Animate the message character by character
    for (let i = 0; i < message.length; i++) {
        textElement.textContent = message.substring(0, i + 1);
        await new Promise(resolve => setTimeout(resolve, 20));
        scrollToBottom();
    }
}

function scrollToBottom() {
    const chatMessages = document.querySelector('.chat-messages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Initialize scroll to top button
function initializeScrollToTop() {
    const scrollButton = document.getElementById('scroll-to-top');
    if (!scrollButton) return;
    
    // Show button when user scrolls down
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    });
    
    // Scroll to top when button is clicked
    scrollButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Update charts theme based on current theme
function updateChartsForTheme() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    // Update chart options based on theme
    const updateOptions = (chart) => {
        if (!chart) return;
        
        const textColor = isDarkMode ? '#e2e8f0' : '#333333';
        const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        
        chart.options.plugins.legend.labels.color = textColor;
        chart.options.scales.x.grid.color = gridColor;
        chart.options.scales.y.grid.color = gridColor;
        chart.options.scales.x.ticks.color = textColor;
        chart.options.scales.y.ticks.color = textColor;
        
        chart.update();
    };
    
    // Update all charts
    const charts = [
        window.attendanceChart,
        window.medicationChart,
        window.staffChart,
        window.inventoryChart
    ];
    
    charts.forEach(updateOptions);
}

// Update overview cards with mock data
function updateOverviewCards() {
    document.getElementById('totalInventory').textContent = mockData.inventory.total;
    document.getElementById('lowStock').textContent = mockData.inventory.lowStock;
    document.getElementById('totalShifts').textContent = mockData.shifts.total;
    document.getElementById('currentShift').textContent = mockData.shifts.current;
}

// Setup event listeners for UI interactions
function setupEventListeners() {
    // Menu toggle for mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Dark mode toggle
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.body.setAttribute('data-theme', 
                document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
            );
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            !e.target.closest('.sidebar') && 
            !e.target.closest('.menu-toggle') &&
            sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    });
}

// Handle window resize
window.addEventListener('resize', () => {
    const sidebar = document.querySelector('.sidebar');
    if (window.innerWidth > 768 && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    }
});