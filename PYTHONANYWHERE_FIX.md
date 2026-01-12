# Fix for PythonAnywhere 'ModuleNotFoundError: No module named 'settings''

## Root Cause Analysis

The persistent error occurs because PythonAnywhere expects a **nested Django project structure**, but our current setup uses a **flat structure**. Django's default configuration looks for settings in a subdirectory with the project name.

### Current Flat Structure (Problematic)
```
/home/rohanmaske/storyverse/
├── settings.py
├── urls.py
├── wsgi.py
└── stories/
```

### Expected Nested Structure (Works with Django)
```
/home/rohanmaske/storyverse/
├── storyverse/           # Project subdirectory
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── stories/              # App directory
├── manage.py
└── requirements.txt
```

## Step-by-Step Fix

### 1. Create Nested Project Structure on PythonAnywhere

```bash
# In PythonAnywhere Bash console
cd /home/rohanmaske/storyverse
mkdir -p storyverse
```

### 2. Move Core Files to Nested Directory

```bash
# In PythonAnywhere Bash console
cd /home/rohanmaske/storyverse
mv settings.py storyverse/
mv urls.py storyverse/
mv wsgi.py storyverse/
# Create __init__.py in nested directory
touch storyverse/__init__.py
```

### 3. Update manage.py

Edit `manage.py` to use the nested settings:

```python
# Change from:
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')

# Change to:
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'storyverse.settings')
```

### 4. Update WSGI File

Replace your entire WSGI file at `/var/www/rohanmaske_pythonanywhere_com_wsgi.py` with this:

```python
import os
import sys
import site

# Add virtualenv site packages
site.addsitedir('/home/rohanmaske/.virtualenvs/storyverse-venv/lib/python3.13/site-packages')

# Set project path
project_home = '/home/rohanmaske/storyverse'

# Add project to Python path
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Set Django settings (now with nested path)
os.environ['DJANGO_SETTINGS_MODULE'] = 'storyverse.settings'
os.environ['PYTHONPATH'] = project_home

# Import and run Django
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

### 5. Update settings.py

Edit `storyverse/settings.py` to update the `WSGI_APPLICATION` setting:

```python
# Change from:
WSGI_APPLICATION = 'wsgi.application'

# Change to:
WSGI_APPLICATION = 'storyverse.wsgi.application'
```

### 6. Run Database Migrations

```bash
# In PythonAnywhere Bash console
cd /home/rohanmaske/storyverse
workon storyverse-venv  # Activate virtualenv
python manage.py migrate
```

### 7. Reload and Test

1. Go to "Web" tab in PythonAnywhere
2. Click "Reload rohanmaske.pythonanywhere.com"
3. Wait 30 seconds
4. Test your site: `https://rohanmaske.pythonanywhere.com/`

## Why This Will Work

By restructuring to the nested format that Django expects, we're aligning our project with Django's default conventions. This resolves the `ModuleNotFoundError` because:

1. Django now looks for `storyverse.settings` which exists at `/home/rohanmaske/storyverse/storyverse/settings.py`
2. The WSGI file correctly points to the nested settings module
3. All Django components can find each other using the standard import structure

## Verification

After completing these steps, you can verify the fix by checking:

1. The error logs should no longer show `ModuleNotFoundError: No module named 'settings'`
2. Your site should load successfully
3. API endpoints like `https://rohanmaske.pythonanywhere.com/api/stories/` should return valid responses

This is the standard Django project structure that works reliably across all hosting environments, including PythonAnywhere.