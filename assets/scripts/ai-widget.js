/**
 * AI Widget for NurseCare Dashboard
 * Provides a floating chat interface for users to ask questions
 */

class AIWidget {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.isLoading = false;
        this.init();
    }

    init() {
        console.log('Initializing AI Widget...');
        
        // Create widget HTML
        this.createWidgetHTML();
        
        // Get DOM elements
        this.widgetContainer = document.getElementById('ai-widget-container');
        this.toggleButton = document.getElementById('ai-widget-toggle');
        this.closeButton = document.getElementById('ai-minimize-btn');
        this.clearButton = document.getElementById('ai-clear-btn');
        this.sendButton = document.getElementById('ai-widget-send');
        this.inputField = document.getElementById('ai-widget-input');
        this.messagesContainer = document.getElementById('ai-widget-messages');
        
        // Check if all elements were found
        if (!this.widgetContainer || !this.toggleButton || !this.closeButton || 
            !this.clearButton || !this.sendButton || !this.inputField || !this.messagesContainer) {
            console.error('AI Widget: Some DOM elements were not found. Widget may not function correctly.');
            this.showToast('Error', 'AI Widget failed to initialize properly', 'error');
            return;
        }
        
        // Add event listeners
        this.toggleButton.addEventListener('click', () => this.toggleWidget());
        this.closeButton.addEventListener('click', () => this.toggleWidget());
        this.clearButton.addEventListener('click', () => this.clearMessages());
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.inputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Auto-resize textarea
        this.inputField.addEventListener('input', () => {
            this.inputField.style.height = 'auto';
            this.inputField.style.height = (this.inputField.scrollHeight) + 'px';
            this.updateSendButtonState();
        });
        
        // Add welcome message
        this.addMessage('assistant', 'Hello! I\'m your NurseCare AI assistant. How can I help you today?');
        
        console.log('AI Widget initialized successfully');
    }
    
    createWidgetHTML() {
        const widgetHTML = `
            <div class="ai-widget">
                <div class="ai-widget-container" id="ai-widget-container">
                    <div class="ai-widget-header">
                        <div class="ai-widget-title">
                            <i class="fas fa-robot"></i>
                            <span>NurseCare AI Assistant</span>
                        </div>
                        <div class="ai-widget-actions">
                            <button class="ai-widget-button" id="ai-minimize-btn" aria-label="Minimize">
                                <i class="fas fa-minus"></i>
                            </button>
                            <button class="ai-widget-button" id="ai-clear-btn" aria-label="Clear chat">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="ai-widget-messages" id="ai-widget-messages" aria-live="polite">
                        <!-- Messages will be added here -->
                    </div>
                    <div class="ai-widget-input-container">
                        <div class="ai-widget-input-wrapper">
                            <textarea 
                                class="ai-widget-input" 
                                id="ai-widget-input" 
                                placeholder="Ask me anything about the nursing home..." 
                                rows="1"
                                aria-label="Chat message"
                            ></textarea>
                            <button class="ai-widget-send" id="ai-widget-send" aria-label="Send message" disabled>
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <button class="ai-widget-button" id="ai-widget-toggle" aria-label="Toggle AI assistant">
                    <i class="fas fa-robot"></i>
                </button>
            </div>
            <div class="toast-container" id="toast-container"></div>
        `;
        
        // Insert widget into the DOM
        document.body.insertAdjacentHTML('beforeend', widgetHTML);
    }
    
    toggleWidget() {
        this.isOpen = !this.isOpen;
        this.widgetContainer.classList.toggle('active', this.isOpen);
        
        if (this.isOpen) {
            this.inputField.focus();
            this.scrollToBottom();
        }
    }
    
    clearMessages() {
        this.messages = [];
        this.messagesContainer.innerHTML = '';
        this.addMessage('assistant', 'Hello! I\'m your NurseCare AI assistant. How can I help you today?');
        this.showToast('Chat Cleared', 'All messages have been cleared', 'info');
    }
    
    updateSendButtonState() {
        const hasText = this.inputField.value.trim().length > 0;
        this.sendButton.disabled = !hasText || this.isLoading;
    }
    
    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    addMessage(sender, text) {
        const messageElement = document.createElement('div');
        messageElement.className = `ai-widget-message ${sender}-message`;
        
        // Create avatar
        const avatar = document.createElement('div');
        avatar.className = 'ai-widget-avatar';
        avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        
        // Create message content
        const content = document.createElement('div');
        content.className = 'ai-widget-message-content';
        content.textContent = text;
        
        // Assemble message
        messageElement.appendChild(avatar);
        messageElement.appendChild(content);
        
        this.messagesContainer.appendChild(messageElement);
        this.messages.push({ sender, text });
        
        this.scrollToBottom();
    }
    
    updateLoadingState(isLoading) {
        this.isLoading = isLoading;
        
        // Remove existing loading indicator if present
        const existingLoading = this.messagesContainer.querySelector('.ai-widget-typing');
        if (existingLoading) {
            existingLoading.remove();
        }
        
        // Add loading indicator if loading
        if (isLoading) {
            const loadingElement = document.createElement('div');
            loadingElement.className = 'ai-widget-typing';
            loadingElement.innerHTML = `
                <span></span>
                <span></span>
                <span></span>
            `;
            this.messagesContainer.appendChild(loadingElement);
            this.scrollToBottom();
        }
        
        this.updateSendButtonState();
    }
    
    async sendMessage() {
        const message = this.inputField.value.trim();
        if (!message || this.isLoading) return;
        
        console.log('Sending message to AI:', message);
        
        // Add user message to chat
        this.addMessage('user', message);
        
        // Clear input field and reset height
        this.inputField.value = '';
        this.inputField.style.height = 'auto';
        this.updateSendButtonState();
        
        // Show loading state
        this.updateLoadingState(true);
        
        try {
            // Send message to API - CHANGED API ENDPOINT
            console.log('Fetching response from /api/generate...');
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: message }),
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('API error:', response.status, errorData);
                throw new Error(`Failed to get response from AI: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Received response from AI:', data);
            
            // Add AI response to chat - CHANGED to match the legacy API response format
            this.addMessage('assistant', data.result);
        } catch (error) {
            console.error('Error sending message to AI:', error);
            // Fallback to local response if API is not available
            const fallbackResponse = this.generateFallbackResponse(message);
            this.addMessage('assistant', fallbackResponse);
            this.showToast('Offline Mode', 'Using local AI responses', 'info');
        } finally {
            // Hide loading state
            this.updateLoadingState(false);
        }
    }
    
    // Add fallback response function
    generateFallbackResponse(message) {
        // Simple rule-based responses
        const userMessage = message.toLowerCase();
        
        if (userMessage.includes('hello') || userMessage.includes('hi') || userMessage.includes('hey')) {
            return 'Hello! How can I assist you with the nursing home system today?';
        } else if (userMessage.includes('patient') || userMessage.includes('patients')) {
            return 'The patient system shows we currently have 18 patients in care. You can view detailed information on the patients page.';
        } else if (userMessage.includes('staff') || userMessage.includes('nurse')) {
            return 'We currently have 22 staff members, including 8 nurses, 5 doctors, and 9 support staff. Is there specific staff information you need?';
        } else if (userMessage.includes('help') || userMessage.includes('how')) {
            return 'I can help with information about patients, staff, schedules, or inventory. What would you like to know?';
        } else {
            return 'I understand your question. To provide better assistance, could you specify whether you need information about patients, staff, schedules, or inventory?';
        }
    }
    
    showToast(title, message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        // Get icon based on type
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        if (type === 'warning') icon = 'exclamation-triangle';
        
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${icon}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" aria-label="Close notification">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add close button functionality
        const closeButton = toast.querySelector('.toast-close');
        closeButton.addEventListener('click', () => {
            toast.classList.add('toast-hide');
            setTimeout(() => {
                toast.remove();
            }, 300);
        });
        
        // Add to container
        toastContainer.appendChild(toast);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.classList.add('toast-hide');
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
}

// Initialize AI Widget when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing AI Widget...');
    new AIWidget();
}); 