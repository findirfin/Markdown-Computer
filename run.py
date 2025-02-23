import webview
import os
from system_scripts.scan_files import scan_files

class Api:
    def __init__(self):
        print("API initialized")
    
    def scan_files(self):
        print("scan_files called from API")
        result = scan_files()  # Get the result
        print("Scan result:", result)  # Debug log
        return result  # Explicitly return the result
    
    def test(self):
        print("Test method called")
        return "API is working"

api = Api()
print("Available methods:", [m for m in dir(api) if not m.startswith('_')])

# Create window with debug=True and easier to spot console messages
window = webview.create_window(
    "Markdown Computer",
    "index.html",
    js_api=api
)
print("Window created with API:", api)
webview.start(debug=True)

