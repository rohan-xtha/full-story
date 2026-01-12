# Fix for "Page not found (404) at /api/stories/"

## Problem Analysis

The error message shows:
```
Using the URLconf defined in storyverse.urls,
Django tried these URL patterns, in this order:

  admin/

The current path, api/stories/, didn’t match any of these.
```

This indicates that Django is looking for `storyverse.urls` as the root URL configuration, but our code structure doesn't have a `storyverse` directory containing urls.py. 

## Root Cause

The issue is likely due to one of these reasons:

1. **Code Structure Mismatch**: On PythonAnywhere, your code might be in a nested `storyverse` directory, but locally we don't have this structure.

2. **WSGI Configuration**: The WSGI file on PythonAnywhere might not be properly configured.

3. **Missing URL Includes**: The main urls.py might not be including the stories app URLs correctly.

## Solution Steps

### 1. Verify Code Structure on PythonAnywhere

- Log in to PythonAnywhere
- Go to "Files" and check if your code is in `/home/rohanmaske/storyverse/storyverse/` (nested structure)
- If so, you need to adjust the path in your WSGI file

### 2. Correct WSGI Configuration

In your PythonAnywhere WSGI file, ensure the following:

```python
import os
import sys

# If your code is in a nested storyverse directory:
# project_home = '/home/rohanmaske/storyverse/storyverse'

# If your code is directly in the storyverse directory:
project_home = '/home/rohanmaske/storyverse'

if project_home not in sys.path:
    sys.path.insert(0, project_home)

# IMPORTANT: Use the correct settings module
os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'  # No 'storyverse.' prefix

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

### 3. Check for Duplicate URL Configuration

- If there's a `storyverse` directory on PythonAnywhere containing its own urls.py, this could be overriding our main urls.py
- Remove any nested `storyverse` directory or ensure it doesn't contain conflicting configuration

### 4. Verify Main URLs Configuration

Ensure your `urls.py` at the root has the correct API includes:

```python
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('stories.urls')),  # This should include the stories endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
```

### 5. Verify Stories App URLs

Ensure `stories/urls.py` has the correct patterns:

```python
from django.urls import path
from .views import StoryListCreate, StoryRetrieveUpdateDestroy, RegisterView

urlpatterns = [
    path('stories/', StoryListCreate.as_view(), name='story-list-create'),
    path('stories/<int:pk>/', StoryRetrieveUpdateDestroy.as_view(), name='story-detail'),
    path('register/', RegisterView.as_view(), name='register'),
]
```

### 6. Reload PythonAnywhere Web App

After making these changes, don't forget to:
- Save the WSGI file
- Go to "Web" tab on PythonAnywhere
- Click "Reload rohanmaske.pythonanywhere.com"

## Testing

After following these steps, test the API endpoints:
- `https://rohanmaske.pythonanywhere.com/api/stories/` (should return stories list)
- `https://rohanmaske.pythonanywhere.com/api/token/` (should accept login requests)

## Additional Troubleshooting

If the issue persists:

1. Check the PythonAnywhere error logs for more detailed information
2. Ensure the `stories` app is included in `INSTALLED_APPS` in `settings.py`
3. Verify that all migrations have been applied: `python manage.py migrate`
4. Ensure the views are correctly implemented in `stories/views.py`

This should resolve the 404 error and make your API endpoints accessible.