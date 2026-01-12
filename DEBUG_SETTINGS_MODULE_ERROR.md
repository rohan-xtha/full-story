# Debugging 'ModuleNotFoundError: No module named 'settings''

## Issue Analysis

The error `ModuleNotFoundError: No module named 'settings'` means Django can't find your `settings.py` file even though you've configured the WSGI file. Let's systematically debug this issue.

## Step 1: Verify Settings File Location

First, confirm that `settings.py` exists in the correct location on PythonAnywhere:

```bash
# In PythonAnywhere Bash console
cd /home/rohanmaske/storyverse
ls -la
```

You should see `settings.py` in the output. If not, it's in the wrong location!

## Step 2: Test Python Import Directly

Let's test if Python can import the settings module directly:

```bash
# In PythonAnywhere Bash console
cd /home/rohanmaske/storyverse
python -c "import settings; print('Settings imported successfully!'); print(settings.__file__)"
```

### Expected Output:
```
Settings imported successfully!
/home/rohanmaske/storyverse/settings.py
```

### If You Get an Error:
- Check if `settings.py` has syntax errors: `python -m py_compile settings.py`
- Check file permissions: `ls -l settings.py` (should be readable: `-rw-r--r--`)

## Step 3: Debug WSGI File

Let's create a debug version of the WSGI file to see what's happening:

```bash
# In PythonAnywhere Bash console
cat > /home/rohanmaske/debug_wsgi.py << 'EOF'
import os
import sys
import traceback

print("=== DEBUG WSGI START ===")
print(f"Current working directory: {os.getcwd()}")
print(f"Original sys.path: {sys.path}")

# Add project to path
project_home = '/home/rohanmaske/storyverse'
if project_home not in sys.path:
    sys.path.insert(0, project_home)
    print(f"Added {project_home} to sys.path")

print(f"Updated sys.path: {sys.path}")

# Set settings module
os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'
print(f"DJANGO_SETTINGS_MODULE: {os.environ['DJANGO_SETTINGS_MODULE']}")

# Try to import settings
print("Attempting to import settings...")
try:
    import settings
    print(f"Success! settings.__file__: {settings.__file__}")
except Exception as e:
    print(f"Failed to import settings: {e}")
    traceback.print_exc()

print("=== DEBUG WSGI END ===")
EOF
```

Now run this debug file:

```bash
# In PythonAnywhere Bash console
python /home/rohanmaske/debug_wsgi.py
```

This will show exactly what's happening when Django tries to import the settings.

## Step 4: Check Virtual Environment Configuration

1. **Verify virtualenv path**: In PythonAnywhere "Web" tab, check the virtualenv path. It should be something like `/home/rohanmaske/.virtualenvs/storyverse-venv`

2. **Activate virtualenv and test**: 
   ```bash
   workon storyverse-venv
   python -c "import settings; print(settings.__file__)"
   ```

3. **Check Python version match**: 
   ```bash
   # In virtualenv
   python --version
   ```
   This should match the Python version in the "Web" tab.

## Step 5: Fix Common Issues

### Issue 1: Wrong Project Path
If your project is actually in a subdirectory, update the WSGI file:

```python
# If settings.py is in /home/rohanmaske/storyverse/storyverse/
project_home = '/home/rohanmaske/storyverse'
os.environ['DJANGO_SETTINGS_MODULE'] = 'storyverse.settings'
```

### Issue 2: Missing __init__.py
Ensure the stories directory has an __init__.py file:

```bash
# In PythonAnywhere Bash console
touch /home/rohanmaske/storyverse/stories/__init__.py
```

### Issue 3: Permission Problems
Fix file permissions:

```bash
# In PythonAnywhere Bash console
cd /home/rohanmaske/storyverse
chmod 644 settings.py
chmod 755 .
chmod 755 stories/
```

### Issue 4: Case Sensitivity
Check if the filename is correct (case matters!):

```bash
# In PythonAnywhere Bash console
ls -la set*  # Should show settings.py, not Settings.py or SETTINGS.py
```

## Step 6: Update WSGI File with Absolute Path

Try using an absolute import path in the WSGI file:

```python
import os
import sys
import site

# Add virtualenv packages to path
site.addsitedir('/home/rohanmaske/.virtualenvs/storyverse-venv/lib/python3.12/site-packages')

# Set project home
project_home = '/home/rohanmaske/storyverse'
os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'
os.environ['PYTHONPATH'] = project_home

# Add project to path
sys.path.insert(0, project_home)

# Import and run Django
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

## Step 7: Reload and Test

After making changes:
1. Save the WSGI file
2. Go to "Web" tab in PythonAnywhere
3. Click "Reload rohanmaske.pythonanywhere.com"
4. Check the error logs again

## Step 8: If All Else Fails

Create a simple Django project structure that matches what Django expects:

```bash
# In PythonAnywhere Bash console
cd /home/rohanmaske
mkdir -p storyverse_project/storyverse
cp storyverse/settings.py storyverse_project/storyverse/
cp storyverse/urls.py storyverse_project/storyverse/
cp storyverse/wsgi.py storyverse_project/storyverse/
cp -r storyverse/stories storyverse_project/
```

Then update your WSGI file to use this structure:

```python
project_home = '/home/rohanmaske/storyverse_project'
os.environ['DJANGO_SETTINGS_MODULE'] = 'storyverse.settings'
```

## Expected Results

After following these steps, you should see the error change from:
```
ModuleNotFoundError: No module named 'settings'
```

To either:
1. A successful server start, or
2. A different error (which means we've made progress!)

The key is to systematically verify each step and understand exactly why Python can't find your settings module.