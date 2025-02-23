document.addEventListener('DOMContentLoaded', () => {
    const fileTree = document.getElementById('file-tree');
    let fileStructure = null;
    let lastModified = null;
    let expandedFolders = new Set();
    const FILE_REFRESH_INTERVAL = 5000; // Match main.js interval

    async function loadFileStructure(preserveState = false) {
        try {
            const response = await fetch('/file_structure.json');
            const modified = response.headers.get('last-modified');
            
            if (modified !== lastModified) {
                lastModified = modified;
                const data = await response.json();
                fileStructure = convertJsonToTreeStructure(data.files);
                renderFileTree(preserveState);
            }
        } catch (error) {
            console.error('Failed to load file structure:', error);
            fileTree.innerHTML = '<div class="error">Failed to load files</div>';
        }
    }

    function convertJsonToTreeStructure(files, parentPath = '') {
        const result = {
            type: 'directory',
            children: []
        };

        for (const [name, info] of Object.entries(files)) {
            const currentPath = parentPath ? `${parentPath}/${name}` : name;
            
            if (info.type === 'directory') {
                const dirStructure = convertJsonToTreeStructure(info.contents, currentPath);
                dirStructure.name = name;
                dirStructure.path = currentPath;
                result.children.push(dirStructure);
            } else {
                result.children.push({
                    name: name,
                    type: 'file',
                    path: currentPath
                });
            }
        }

        return result;
    }

    function renderFileTree(preserveState = false) {
        if (!fileTree || !fileStructure) return;
        
        // Store current expanded state if preserving
        if (preserveState) {
            document.querySelectorAll('.directory-content:not(.hidden)').forEach(dir => {
                expandedFolders.add(dir.dataset.path);
            });
        } else {
            expandedFolders.clear();
        }

        fileTree.innerHTML = '';
        fileStructure.children.forEach(child => {
            fileTree.appendChild(createTreeElement(child));
        });
    }

    function createTreeElement(item) {
        const element = document.createElement('div');
        
        if (item.type === 'directory') {
            element.className = 'directory';
            const header = document.createElement('div');
            header.className = 'directory-header';
            header.innerHTML = `<span class="toggle">▶</span> ${item.name}`;
            
            const content = document.createElement('div');
            content.className = 'directory-content hidden';
            content.dataset.path = item.path;
            
            item.children.forEach(child => {
                content.appendChild(createTreeElement(child));
            });

            // Restore expanded state
            if (expandedFolders.has(item.path)) {
                content.classList.remove('hidden');
                header.querySelector('.toggle').textContent = '▼';
            }

            header.addEventListener('click', () => {
                const isExpanded = !content.classList.contains('hidden');
                header.querySelector('.toggle').textContent = isExpanded ? '▶' : '▼';
                content.classList.toggle('hidden');
                
                if (!isExpanded) {
                    expandedFolders.add(item.path);
                } else {
                    expandedFolders.delete(item.path);
                }
            });

            element.appendChild(header);
            element.appendChild(content);
        } else {
            element.className = 'file';
            element.innerHTML = item.name;
            element.addEventListener('click', () => {
                console.log('Selected file:', item.path);
            });
        }

        return element;
    }

    // Initial load and set up automatic updates with matched interval
    loadFileStructure();
    setInterval(() => loadFileStructure(true), FILE_REFRESH_INTERVAL);
});
