import webview
import os

def list_files_in_md_root():
    md_root = '/home/findirfin/Development/Markdown Computer/md-root'
    try:
        files_and_folders = os.listdir(md_root)
        return [{'name': f, 'path': os.path.join(md_root, f), 'isDirectory': os.path.isdir(os.path.join(md_root, f))} for f in files_and_folders]
    except Exception as e:
        return str(e)

def list_files_in_folder(path):
    try:
        files_and_folders = os.listdir(path)
        return [{'name': f, 'path': os.path.join(path, f), 'isDirectory': os.path.isdir(os.path.join(path, f))} for f in files_and_folders]
    except Exception as e:
        return str(e)

# Ensure the API is properly exposed
class Api:
    def listFilesInMdRoot(self):
        return list_files_in_md_root()
    
    def listFilesInFolder(self, path):
        return list_files_in_folder(path)

api = Api()

webview.create_window("Markdown Computer", "index.html", js_api=api)
# Enable developer tools by setting debug=True in webview.start
webview.start(debug=True)

#test