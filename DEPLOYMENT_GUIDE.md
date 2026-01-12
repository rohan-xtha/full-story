# Backend Deployment Guide for PythonAnywhere

## Current Status

The backend is currently running locally for development purposes. This allows for easy testing and debugging during development. However, for production use, we need to deploy it to a hosting service like PythonAnywhere.

## Steps to Deploy Backend to PythonAnywhere

### 1. Create a PythonAnywhere Account

- Go to [PythonAnywhere](https://www.pythonanywhere.com/)
- Sign up for a free account (or paid if you need more resources)

### 2. Set Up a Web App

- Log in to PythonAnywhere
- Click on "Web" in the top navigation
- Click on "Add a new web app"
- Select "Manual Configuration"
- Choose the appropriate Python version (Python 3.12 recommended)
- Click "Next" to create the web app

### 3. Configure Virtual Environment

- In PythonAnywhere, go to "Consoles" > "Bash"
- Create a virtual environment:
  ```bash
  mkvirtualenv --python=/usr/bin/python3.12 storyverse-venv
  ```
- Activate the virtual environment:
  ```bash
  workon storyverse-venv
  ```

### 4. Upload Backend Code

- Option 1: Clone from GitHub

  ```bash
  git clone https://github.com/rohan-xtha/full-story.git
  cd full-story
  ```

- Option 2: Upload via PythonAnywhere's file manager
  - Click on "Files" in the top navigation
  - Upload the backend files to your home directory

### 5. Install Dependencies

- Navigate to your project directory
- Install the dependencies from requirements.txt:
  ```bash
  pip install -r requirements.txt
  ```

### 6. Configure Database

- Create the database tables:
  ```bash
  python manage.py migrate
  ```
- Create a superuser (optional but recommended):
  ```bash
  python manage.py createsuperuser
  ```

### 7. Configure WSGI File

- In PythonAnywhere, go to "Web" > "WSGI configuration file"
- Edit the WSGI file to point to your Django project:

  ```python
  import os
  import sys

  # add your project directory to the sys.path
  project_home = '/home/rohanmaske/storyverse'
  if project_home not in sys.path:
      sys.path.insert(0, project_home)

  # set environment variable to tell django where your settings.py is
  os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'  # Note: No 'storyverse.' prefix

  # serve django via WSGI
  from django.core.wsgi import get_wsgi_application
  application = get_wsgi_application()
  ```

- Your current WSGI file has `os.environ['DJANGO_SETTINGS_MODULE'] = 'storyverse.settings'` which is incorrect - remove the 'storyverse.' prefix
- Ensure the `project_home` path matches your actual directory structure on PythonAnywhere

### 8. Update Allowed Hosts

- Edit `settings.py` to include your PythonAnywhere URL:
  ```python
  ALLOWED_HOSTS = ['rohanmaske.pythonanywhere.com', '127.0.0.1', 'localhost']
  ```
- This allows both your production URL and local development access

### 9. Reload the Web App

- In PythonAnywhere, go to "Web"
- Click on "Reload yourusername.pythonanywhere.com"

## Update Frontend API URL

After deploying the backend to PythonAnywhere, you need to update the frontend to connect to the production backend:

1. In the frontend code, find the API base URL (typically in `src/utils/api.js` or similar)
2. Change it from `http://localhost:8000/` to `https://rohanmaske.pythonanywhere.com/`
3. Rebuild and redeploy the frontend:
   ```bash
   npm run build
   npm run deploy
   ```

## Testing the Deployment

- Backend API: https://yourusername.pythonanywhere.com/api/stories/
- Frontend: https://rohan-xtha.github.io/full-story/

## Additional Notes

- For production, consider:
  - Setting `DEBUG = False` in `settings.py`
  - Using a more secure `SECRET_KEY`
  - Configuring HTTPS
  - Adding proper error logging
  - Implementing rate limiting

This guide will help you deploy your backend to PythonAnywhere, making it accessible from anywhere on the internet.
