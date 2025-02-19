// Toggle sidebars
document.getElementById('fileExplorerToggle').addEventListener('click', () => {
    document.getElementById('fileExplorer').classList.toggle('collapsed');
});

document.getElementById('aiSidebarToggle').addEventListener('click', () => {
    document.getElementById('aiSidebar').classList.toggle('collapsed');
});

// Function to populate the file tree
function populateFileTree() {
    console.log('populateFileTree called'); // Verify the function is called
    if (window.pywebview && window.pywebview.api && typeof window.pywebview.api.listFilesInMdRoot === 'function') {
        window.pywebview.api.listFilesInMdRoot().then(items => {
            console.log('Items received:', items); // Log the received items
            const fileTree = document.getElementById('fileTree');
            fileTree.innerHTML = ''; // Clear existing content

            items.forEach(item => {
                const itemElement = createFileTreeItem(item);
                fileTree.appendChild(itemElement);
            });
        }).catch(error => {
            console.error('Error listing items:', error);
        });
    } else {
        console.error('pywebview API or listFilesInMdRoot function is not available');
    }
}

// Function to create a file tree item
function createFileTreeItem(item) {
    const itemElement = document.createElement('div');
    itemElement.className = 'file-item';
    
    const itemName = document.createElement('span');
    itemName.textContent = item.name;
    itemElement.appendChild(itemName);

    if (item.isDirectory) {
        itemElement.classList.add('folder');
        
        const folderContents = document.createElement('div');
        folderContents.className = 'folder-contents';
        itemElement.appendChild(folderContents);

        itemElement.addEventListener('click', (e) => {
            e.stopPropagation();
            itemElement.classList.toggle('collapsed');
        });

        // Load folder contents
        loadFolderContents(item.path, folderContents);
    } else {
        itemElement.classList.add('file');
    }

    return itemElement;
}

// Function to load folder contents
function loadFolderContents(path, container) {
    window.pywebview.api.listFilesInFolder(path).then(items => {
        items.forEach(item => {
            const itemElement = createFileTreeItem(item);
            container.appendChild(itemElement);
        });
    }).catch(error => {
        console.error('Error listing folder contents:', error);
    });
}

// Polling mechanism to check for the availability of window.pywebview.api
function checkPywebviewApi() {
    if (window.pywebview && window.pywebview.api) {
        console.log('pywebview API is ready'); // Verify the API is ready
        populateFileTree();
    } else {
        console.log('Waiting for pywebview API...');
        setTimeout(checkPywebviewApi, 100); // Check again after 100ms
    }
}

// Call the function to check for the pywebview API on page load
window.onload = function() {
    console.log('window.onload called'); // Verify onload is called
    checkPywebviewApi();
    // ...other onload functions if any...
};

// Basic markdown editor functionality
const editor = document.querySelector('.editor');
const toolbarButtons = document.querySelectorAll('.toolbar-btn');

toolbarButtons.forEach(button => {
    button.addEventListener('click', () => {
        const selection = editor.value.substring(
            editor.selectionStart,
            editor.selectionEnd
        );

        let markdown = '';
        switch (button.textContent) {
            case 'B':
                markdown = `**${selection}**`;
                break;
            case 'I':
                markdown = `*${selection}*`;
                break;
            case '#':
                markdown = `# ${selection}`;
                break;
            case '-':
                markdown = `- ${selection}`;
                break;
            case '[]':
                markdown = `- [ ] ${selection}`;
                break;
        }

        editor.setRangeText(
            markdown,
            editor.selectionStart,
            editor.selectionEnd,
            'select'
        );
    });
});

// Auto-resize textarea
editor.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
});

// Basic chat functionality
const chatInput = document.querySelector('.chat-input');
const chatMessages = document.querySelector('.chat-messages');

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (message) {
            // Add user message
            const userMsg = document.createElement('div');
            userMsg.className = 'message user';
            userMsg.textContent = message;
            chatMessages.appendChild(userMsg);

            // Simulate AI response
            setTimeout(() => {
                const aiMsg = document.createElement('div');
                aiMsg.className = 'message ai';
                aiMsg.textContent = "I'm a simulated AI response. In a real implementation, this would connect to an AI API.";
                chatMessages.appendChild(aiMsg);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);

            chatInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
});

// TODO: Implement file system functionality
// TODO: Implement markdown preview
// TODO: Add keyboard shortcuts
// TODO: Add file drag and drop
// TODO: Add auto-save functionality
// TODO: Add themes support
// TODO: Add plugin system