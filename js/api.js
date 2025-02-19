export class PyWebViewAPI {
    static async waitForAPI() {
        return new Promise((resolve) => {
            const check = () => {
                if (window.pywebview && window.pywebview.api) {
                    resolve(window.pywebview.api);
                } else {
                    setTimeout(check, 100);
                }
            };
            check();
        });
    }

    static async listFilesInMdRoot() {
        const api = await this.waitForAPI();
        return api.listFilesInMdRoot();
    }

    static async listFilesInFolder(path) {
        const api = await this.waitForAPI();
        return api.listFilesInFolder(path);
    }
}
