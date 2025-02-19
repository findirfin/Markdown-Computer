export class Chat {
    constructor() {
        this.chatInput = document.querySelector('.chat-input');
        this.chatMessages = document.querySelector('.chat-messages');
        this.init();
    }

    init() {
        this.setupToggle();
        this.setupChatInput();
    }

    setupToggle() {
        document.getElementById('aiSidebarToggle').addEventListener('click', () => {
            document.getElementById('aiSidebar').classList.toggle('collapsed');
        });
    }

    setupChatInput() {
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleUserMessage();
            }
        });
    }

    handleUserMessage() {
        const message = this.chatInput.value.trim();
        if (message) {
            this.addMessage(message, 'user');
            this.simulateAIResponse();
            this.chatInput.value = '';
        }
    }

    addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = text;
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    simulateAIResponse() {
        setTimeout(() => {
            this.addMessage("I'm a simulated AI response. In a real implementation, this would connect to an AI API.", 'ai');
        }, 1000);
    }
}
