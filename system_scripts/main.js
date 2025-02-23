import { ToolWindow } from './ToolWindow.js';

// Configuration
const FILE_REFRESH_INTERVAL = 5000; // 5 seconds - balanced for performance

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

// Periodic file structure update
async function startFileStructureUpdates() {    
    async function update() {
        try {
            const apiReady = await waitForApi();
            if (apiReady) {
                await window.pywebview.api.scan_files();
                console.log('File structure updated');
            }
        } catch (error) {
            console.error('Error updating file structure:', error);
        }
    }

    // Initial update
    await update();
    
    // Set up periodic updates with standardized interval
    setInterval(update, FILE_REFRESH_INTERVAL);
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
    startFileStructureUpdates();
});
