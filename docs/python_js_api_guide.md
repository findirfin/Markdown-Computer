# Python-JavaScript API Guide

## Adding New Python Functions

1. Create your Python function in a module (e.g., in `system_scripts/my_module.py`):
```python
def my_function(param1, param2):
    result = do_something(param1, param2)
    return result
```

2. Add the function to the Api class in `run.py`:
```python
class Api:
    def __init__(self):
        print("API initialized")
    
    # Method 1: Direct implementation
    def direct_method(self, param):
        return {"result": param}
    
    # Method 2: Import and wrap external function
    def my_function(self, param1, param2):
        from system_scripts.my_module import my_function
        return my_function(param1, param2)
```

## Calling Python Functions from JavaScript

### Basic Usage
```javascript
// Simple function call
async function callPythonFunction() {
    try {
        const result = await window.pywebview.api.my_function("param1", "param2");
        console.log("Result:", result);
    } catch (error) {
        console.error("Error:", error);
    }
}
```

### With API Check
```javascript
// Recommended pattern with API availability check
async function callPythonFunction() {
    // Wait for API to be ready
    if (!window.pywebview || !window.pywebview.api) {
        console.log('Waiting for API...');
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    try {
        const result = await window.pywebview.api.my_function("param1", "param2");
        console.log("Result:", result);
    } catch (error) {
        console.error("Error:", error);
    }
}
```

## Data Types

The following data types can be passed between Python and JavaScript:
- Strings
- Numbers
- Booleans
- Arrays/Lists
- Objects/Dictionaries
- null/None

Example:
```javascript
// JavaScript
const data = {
    text: "hello",
    number: 42,
    list: [1, 2, 3],
    nested: {
        key: "value"
    }
};
const result = await window.pywebview.api.process_data(data);
```

```python
# Python
def process_data(self, data):
    text = data['text']      # string
    number = data['number']   # int
    list_data = data['list'] # list
    nested = data['nested']  # dict
    return {"processed": True}
```

## Best Practices

1. Always use async/await when calling Python functions
2. Add error handling using try/catch
3. Check for API availability before calling functions
4. Use meaningful function names
5. Document the expected parameters and return values
6. Keep data structures simple and JSON-serializable
