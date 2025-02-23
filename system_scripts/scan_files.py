import os
import json
from pathlib import Path

def scan_files():
    base_dir = Path(__file__).parent.parent
    files_dir = base_dir / 'files'
    output_file = base_dir / 'file_structure.json'
    
    # Scan directory
    tree = {
        'files': _scan_directory(files_dir)
    }
    
    # Write to file
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(tree, f, indent=2)
        print(f"Updated {output_file}")
    except Exception as e:
        print(f"Error writing to {output_file}: {e}")
    
    return tree['files']

def _scan_directory(directory):
    tree = {}
    try:
        for item in os.listdir(directory):
            item_path = directory / item
            if item_path.is_file():
                stats = item_path.stat()
                file_info = {
                    'type': 'file',
                    'size': stats.st_size,
                    'modified': stats.st_mtime,
                    'extension': item_path.suffix.lower(),
                }
                
                # Add preview for text files (limit to 1KB)
                if item_path.suffix.lower() in ['.txt', '.md', '.json', '.js', '.py', '.html', '.css']:
                    try:
                        with open(item_path, 'r', encoding='utf-8') as f:
                            file_info['preview'] = f.read(1024)
                    except Exception:
                        file_info['preview'] = ''
                
                tree[item] = file_info
            elif item_path.is_dir():
                tree[item] = {
                    'type': 'directory',
                    'contents': _scan_directory(item_path)
                }
    except Exception as e:
        print(f"Error scanning {directory}: {e}")
        tree['error'] = str(e)
    
    return tree
