# PythonAnywhere Deployment Guide

This guide will help you deploy the fixed nested Django project structure to PythonAnywhere.

## Step 1: SSH into PythonAnywhere

1. Open your terminal
2. SSH into your PythonAnywhere account:
   ```bash
   ssh rohanmaske@ssh.pythonanywhere.com
   ```

## Step 2: Update Your Project

1. Navigate to your project directory:
   ```bash
   cd ~/storyverse
   ```

2. Pull the latest changes from GitHub:
   ```bash
   git pull origin main
   ```

## Step 3: Update PythonAnywhere Configuration

1. Go to the PythonAnywhere Web tab
2. Update the **Source code** path to point to the nested structure
3. Update the **Working directory** if needed
4. Update the **WSGI configuration file**

## Step 4: Update WSGI File

1. Click on the WSGI configuration file link
2. Update the settings module import to use the nested structure:
   ```python
   os.environ["DJANGO_SETTINGS_MODULE"] = "storyverse.settings"
   ```
3. Ensure the path includes the nested directory:
   ```python
   path = '/home/rohanmaske/storyverse'
   if path not in sys.path:
       sys.path.append(path)
   ```

## Step 5: Reload Your App

1. Go back to the Web tab
2. Click the **Reload** button for your app
3. Check the error logs if there are any issues

## Step 6: Verify Deployment

1. Visit your API endpoint: https://rohanmaske.pythonanywhere.com/api/
2. You should see the API root or a 404 page (not the error page)
3. Test the registration/login functionality on your GitHub Pages site

## Troubleshooting

- If you still see "ModuleNotFoundError: No module named 'settings'", double-check your WSGI configuration
- Ensure all dependencies are installed: `pip install -r requirements.txt`
- Run migrations: `python manage.py migrate`
- Check the error logs for more details

## Additional Notes

- The nested project structure is now: `~/storyverse/storyverse/settings.py`
- The manage.py file is in the root: `~/storyverse/manage.py`
- The API URL should remain: `https://rohanmaske.pythonanywhere.com/api/`