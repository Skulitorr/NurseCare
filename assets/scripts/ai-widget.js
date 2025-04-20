class AIWidget {
    constructor() {
        this.messages = [];
        this.isOpen = false;
        this.isLoading = false;
        this.init();
    }

    init() {
        // Create widget HTML
        const widgetHTML = `
            <div class="ai-widget">
                <button class="ai-widget-button" id="ai-widget-toggle">
                    <i class="fas fa-robot"></i>
                </button>
                <div class="ai-widget-container" id="ai-widget-container">
                    <div class="ai-widget-header">
                        <h3>AI Assistant</h3>
                        <button class="ai-widget-close" id="ai-widget-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="ai-widget-messages" id="ai-widget-messages"></div>
                    <div class="ai-widget-input">
                        <input type="text" id="ai-widget-input" placeholder="Ask a question...">
                        <button id="ai-widget-send">Send</button>
                    </div>
                </div>
            </div>
        `;

        // Add widget to body
        document.body.insertAdjacentHTML('beforeend', widgetHTML);

        // Get elements
        this.container = document.getElementById('ai-widget-container');
        this.toggleButton = document.getElementById('ai-widget-toggle');
        this.closeButton = document.getElementById('ai-widget-close');
        this.messagesContainer = document.getElementById('ai-widget-messages');
        this.input = document.getElementById('ai-widget-input');
        this.sendButton = document.getElementById('ai-widget-send');

        // Add event listeners
        this.toggleButton.addEventListener('click', () => this.toggle());
        this.closeButton.addEventListener('click', () => this.close());
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    toggle() {
        this.isOpen = !this.isOpen;
        this.container.classList.toggle('active', this.isOpen);
        if (this.isOpen) {
            this.input.focus();
        }
    }

    close() {
        this.isOpen = false;
        this.container.classList.remove('active');
    }

    async sendMessage() {
        const message = this.input.value.trim();
        if (!message || this.isLoading) return;

        // Add user message
        this.addMessage(message, 'user');
        this.input.value = '';
        this.isLoading = true;
        this.updateLoadingState();

        try {
            // Send to API
            const response = await fetch('/api/openai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            const data = await response.json();
            
            // Add AI response
            this.addMessage(data.result, 'assistant');
        } catch (error) {
            console.error('Error sending message:', error);
            this.addMessage('Sorry, I encountered an error. Please try again.', 'assistant');
        }

        this.isLoading = false;
        this.updateLoadingState();
    }

    addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${type}`;
        messageDiv.textContent = text;
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    updateLoadingState() {
        this.sendButton.disabled = this.isLoading;
        this.input.disabled = this.isLoading;

        if (this.isLoading) {
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'ai-loading';
            loadingDiv.innerHTML = `
                Thinking
                <div class="ai-loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            `;
            this.messagesContainer.appendChild(loadingDiv);
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        } else {
            const loadingDiv = this.messagesContainer.querySelector('.ai-loading');
            if (loadingDiv) loadingDiv.remove();
        }
    }
}

// Initialize widget when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.aiWidget = new AIWidget();
}); 