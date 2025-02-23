import webview
import os
from system_scripts.scan_files import scan_files

class Api:
    def __init__(self):
        print("API initialized")
    
    def scan_files(self):
        print("scan_files called from API")
        return scan_files()
    
    def test(self):
        print("Test method called")
        return "API is working"

api = Api()
print("Available methods:", [m for m in dir(api) if not m.startswith('_')])

window = webview.create_window("Markdown Computer", "index.html", js_api=api)
webview.start(debug=True)
