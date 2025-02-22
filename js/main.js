import { ToolWindow } from './ToolWindow.js';

// Set up tool buttons
document.querySelectorAll('.tool-button').forEach(button => {
    button.addEventListener('click', () => {
        const tool = button.dataset.tool;
        const url = button.dataset.url;
        const window = new ToolWindow(tool, url);
        document.getElementById('workspace').appendChild(window.element);
    });
});
