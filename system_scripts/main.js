import { ToolWindow } from './ToolWindow.js';

// Check API availability
async function waitForApi(maxAttempts = 50) {
    for (let i = 0; i < maxAttempts; i++) {
        if (window.pywebview && window.pywebview.api) {
            console.log("API found:", Object.keys(window.pywebview.api));
            // Test API connection
            try {
                const test = await window.pywebview.api.test();
                console.log("API test result:", test);
                return true;
            } catch (e) {
                console.log("API test failed:", e);
            }
        }
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    return false;
}

// Set up tool buttons
document.querySelectorAll('.tool-button').forEach(button => {
    button.addEventListener('click', () => {
        const tool = button.dataset.tool;
        const url = button.dataset.url;
        const window = new ToolWindow(tool, url);
        document.getElementById('workspace').appendChild(window.element);
    });
});

// file scan on start
async function updateFileStructure() {
    try {
        const apiReady = await waitForApi();
        if (!apiReady) {
            throw new Error("API not available after timeout");
        }
        
        const filesStructure = await window.pywebview.api.scan_files();
        console.log('File structure updated:', filesStructure);
        return filesStructure;
    } catch (error) {
        console.error('Error scanning files:', error);
        return null;
    }
}

// Initialize after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    updateFileStructure();
});
