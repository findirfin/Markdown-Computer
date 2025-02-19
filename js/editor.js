export class MarkdownEditor {
    constructor() {
        this.editor = document.querySelector('.editor');
        this.toolbarButtons = document.querySelectorAll('.toolbar-btn');
        this.init();
    }

    init() {
        this.setupToolbarButtons();
        this.setupAutoResize();
    }

    setupToolbarButtons() {
        this.toolbarButtons.forEach(button => {
            button.addEventListener('click', () => this.handleToolbarClick(button));
        });
    }

    handleToolbarClick(button) {
        const selection = this.editor.value.substring(
            this.editor.selectionStart,
            this.editor.selectionEnd
        );

        const markdown = this.getMarkdownSyntax(button.textContent, selection);
        
        this.editor.setRangeText(
            markdown,
            this.editor.selectionStart,
            this.editor.selectionEnd,
            'select'
        );
    }

    getMarkdownSyntax(buttonText, selection) {
        const syntaxMap = {
            'B': `**${selection}**`,
            'I': `*${selection}*`,
            '#': `# ${selection}`,
            '-': `- ${selection}`,
            '[]': `- [ ] ${selection}`
        };
        return syntaxMap[buttonText] || selection;
    }

    setupAutoResize() {
        this.editor.addEventListener('input', () => {
            this.editor.style.height = 'auto';
            this.editor.style.height = this.editor.scrollHeight + 'px';
        });
    }
}
