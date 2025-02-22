export class ToolWindow {
    constructor(tool, url) {
        this.tool = tool;
        this.url = url;
        this.element = this.createWindow();
        this.isResizing = false;
        this.setupEventListeners();
    }

    createWindow() {
        const template = document.getElementById('tool-window-template');
        const window = template.content.cloneNode(true).querySelector('.tool-window');
        
        window.querySelector('.tool-window-title').textContent = this.tool;
        window.querySelector('.tool-window-frame').src = this.url;
        
        return window;
    }

    setupEventListeners() {
        let resizeState = null;

        const startResize = (e) => {
            this.isResizing = true;
            const rect = this.element.getBoundingClientRect();
            resizeState = {
                startX: e.clientX,
                startWidth: rect.width
            };
            e.stopPropagation();
        };

        const onResize = (e) => {
            if (!this.isResizing || !resizeState) return;
            
            const dx = e.clientX - resizeState.startX;
            const newWidth = Math.max(200, resizeState.startWidth + dx);
            this.element.style.width = `${newWidth}px`;
        };

        const endResize = () => {
            this.isResizing = false;
            resizeState = null;
        };

        // Attach event listeners
        this.element.querySelector('.resize-handle').addEventListener('mousedown', startResize);
        this.element.querySelector('.tool-window-close').addEventListener('click', () => {
            this.element.remove();
        });

        // Global mouse event listeners
        document.addEventListener('mousemove', onResize);
        document.addEventListener('mouseup', endResize);
    }
}
