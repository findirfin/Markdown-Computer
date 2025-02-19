import { FileExplorer } from './fileExplorer.js';
import { MarkdownEditor } from './editor.js';
import { Chat } from './chat.js';

document.addEventListener('DOMContentLoaded', () => {
    new FileExplorer();
    new MarkdownEditor();
    new Chat();
});
