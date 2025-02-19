import { PyWebViewAPI } from './api.js';

export class FileExplorer {
    constructor() {
        this.fileTree = document.getElementById('fileTree');
        this.loadedFolders = new Set();
        this.init();
    }

    init() {
        this.setupToggle();
        this.populateFileTree();
    }

    setupToggle() {
        document.getElementById('fileExplorerToggle').addEventListener('click', () => {
            document.getElementById('fileExplorer').classList.toggle('collapsed');
        });
    }

    async populateFileTree() {
        try {
            const items = await PyWebViewAPI.listFilesInMdRoot();
            this.fileTree.innerHTML = '';
            items.forEach(item => {
                const itemElement = this.createFileTreeItem(item);
                this.fileTree.appendChild(itemElement);
            });
        } catch (error) {
            console.error('Error populating file tree:', error);
        }
    }

    createFileTreeItem(item) {
        const itemElement = document.createElement('div');
        itemElement.className = 'file-item';
        
        const itemName = document.createElement('span');
        itemName.textContent = item.name;
        itemElement.appendChild(itemName);

        if (item.isDirectory) {
            this.setupFolderItem(itemElement, item);
            // Add collapsed class by default
            itemElement.classList.add('collapsed');
        } else {
            itemElement.classList.add('file');
        }

        return itemElement;
    }

    setupFolderItem(itemElement, item) {
        itemElement.classList.add('folder');
        
        const folderContents = document.createElement('div');
        folderContents.className = 'folder-contents';
        itemElement.appendChild(folderContents);

        itemElement.addEventListener('click', (e) => {
            e.stopPropagation();
            itemElement.classList.toggle('collapsed');
            
            // Only load contents if not already loaded
            if (!this.loadedFolders.has(item.path)) {
                this.loadFolderContents(item.path, folderContents);
                this.loadedFolders.add(item.path);
            }
        });
    }

    async loadFolderContents(path, container) {
        try {
            container.innerHTML = ''; // Clear existing contents
            const items = await PyWebViewAPI.listFilesInFolder(path);
            items.forEach(item => {
                const itemElement = this.createFileTreeItem(item);
                container.appendChild(itemElement);
            });
        } catch (error) {
            console.error('Error loading folder contents:', error);
        }
    }
}
