# Fix for PythonAnywhere Deployment Issues

## Issue Analysis

From the logs, we can see two main issues:

1. **First Issue**: `django.db.utils.OperationalError: no such table: stories_story`

   - This means the database tables haven't been created yet

2. **Second Issue**: `ModuleNotFoundError: No module named 'settings'`
   - This means Django can't find the settings module
   - This is the primary issue preventing the app from running

## Root Cause

The problem is with the WSGI configuration. When Django tries to import the `settings` module, it can't find it because:

1. The `project_home` path might be incorrect
2. The Python path isn't properly set up
3. The settings module name might not match the actual file structure

## Solution Steps

### 1. Verify Project Structure on PythonAnywhere

First, confirm your project structure on PythonAnywhere. It should look like this:

```
/home/rohanmaske/storyverse/
├── settings.py
├── urls.py
├── wsgi.py
├── stories/
│   ├── __init__.py
│   ├── models.py
│   ├── views.py
│   └── urls.py
├── db.sqlite3
└── requirements.txt
```

### 2. Fix WSGI Configuration

Update your WSGI file at `/var/www/rohanmaske_pythonanywhere_com_wsgi.py` with the following content:

```python
import os
import sys

# 1. Set the project home directory correctly
# This should be the directory containing settings.py
project_home = '/home/rohanmaske/storyverse'

# 2. Add the project directory to sys.path if it's not already there
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# 3. Set the DJANGO_SETTINGS_MODULE to the correct value
# Since settings.py is directly in the project_home, use just 'settings'
os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'

# 4. Ensure Django uses the correct settings
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

### 3. Run Database Migrations

After fixing the WSGI configuration, you need to create the database tables:

1. Log in to PythonAnywhere
2. Go to "Consoles" > "Bash"
3. Activate your virtual environment:
   ```bash
   workon storyverse-venv
   ```
4. Navigate to your project directory:
   ```bash
   cd /home/rohanmaske/storyverse
   ```
5. Run the migrations:
   ```bash
   python manage.py migrate
   ```
6. (Optional) Create a superuser:
   ```bash
   python manage.py createsuperuser
   ```

### 4. Reload the Web App

1. Go to the "Web" tab in PythonAnywhere
2. Click on "Reload rohanmaske.pythonanywhere.com"
3. Wait a few seconds for the app to reload

### 5. Test the API

After reloading, test the API endpoints:

- `https://rohanmaske.pythonanywhere.com/api/stories/`
- `https://rohanmaske.pythonanywhere.com/api/token/`

## Additional Troubleshooting

### If the issue persists:

1. **Check Python Version**: Ensure the Python version in your virtualenv matches the one in PythonAnywhere's "Web" tab

2. **Check Requirements**: Ensure all dependencies are installed:

   ```bash
   pip install -r requirements.txt
   ```

3. **Check File Permissions**: Ensure all files are readable by the web server

4. **Test the WSGI File**: Run the WSGI file directly to see if it works:

   ```bash
   python /var/www/rohanmaske_pythonanywhere_com_wsgi.py
   ```

5. **Check Project Path**: Verify the exact path to your project:
   ```bash
   pwd
   ls -la
   ```

## Example: Correct WSGI Configuration

Here's a complete working example for your WSGI file:

```python
# This file contains the WSGI configuration required to serve up your
# web application at http://rohanmaske.pythonanywhere.com/

import os
import sys

# Set the project directory
project_home = '/home/rohanmaske/storyverse'

# Add the project directory to the Python path
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Set the Django settings module
os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'

# Import and configure Django
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

## After Fixing

Once you've applied these fixes, your application should:

1. Start without the "ModuleNotFoundError"
2. Have the database tables created
3. Respond to API requests correctly

The key is ensuring that:

- The WSGI file points to the correct project directory
- The Python path includes your project directory
- The settings module name matches your actual file structure
- Database migrations are run to create the tables

This should resolve all the issues you're seeing in the logs.
