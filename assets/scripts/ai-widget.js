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
                            <button class="ai-widget-action" id="ai-minimize-btn" aria-label="Minimize">
                                <i class="fas fa-minus"></i>
                            </button>
                            <button class="ai-widget-action" id="ai-clear-btn" aria-label="Clear chat">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="ai-widget-body" id="ai-widget-messages" aria-live="polite">
                        <!-- Messages will be added here -->
                    </div>
                    <div class="ai-widget-footer">
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
                <button class="ai-widget-button" id="ai-widget-toggle" aria-label="Toggle AI assistant">
                    <i class="fas fa-robot"></i>
                </button>
            </div>
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
        messageElement.className = `ai-message ${sender}`;
        messageElement.textContent = text;
        
        this.messagesContainer.appendChild(messageElement);
        this.messages.push({ sender, text });
        
        this.scrollToBottom();
    }
    
    updateLoadingState(isLoading) {
        this.isLoading = isLoading;
        
        // Remove existing loading indicator if present
        const existingLoading = this.messagesContainer.querySelector('.ai-loading');
        if (existingLoading) {
            existingLoading.remove();
        }
        
        // Add loading indicator if loading
        if (isLoading) {
            const loadingElement = document.createElement('div');
            loadingElement.className = 'ai-loading';
            loadingElement.innerHTML = `
                <div class="ai-loading-dot"></div>
                <div class="ai-loading-dot"></div>
                <div class="ai-loading-dot"></div>
            `;
            this.messagesContainer.appendChild(loadingElement);
            this.scrollToBottom();
        }
        
        this.updateSendButtonState();
    }
    
    async sendMessage() {
        const message = this.inputField.value.trim();
        if (!message || this.isLoading) return;
        
        // Add user message to chat
        this.addMessage('user', message);
        
        // Clear input field and reset height
        this.inputField.value = '';
        this.inputField.style.height = 'auto';
        this.updateSendButtonState();
        
        // Show loading state
        this.updateLoadingState(true);
        
        try {
            // Send message to API
            const response = await fetch('/api/openai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to get response from AI');
            }
            
            const data = await response.json();
            
            // Add AI response to chat
            this.addMessage('assistant', data.response);
        } catch (error) {
            console.error('Error sending message to AI:', error);
            this.addMessage('assistant', 'Sorry, I encountered an error. Please try again later.');
        } finally {
            // Hide loading state
            this.updateLoadingState(false);
        }
    }
}

// Initialize AI Widget when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AIWidget();
}); 