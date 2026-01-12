# Checking Files on PythonAnywhere

## Why You're Getting "No such file or directory" Errors

The error `mv: cannot stat 'settings.py': No such file or directory` means that `settings.py` and `urls.py` aren't in your current directory. Let's first check what files are actually present in your PythonAnywhere storyverse directory.

## Step 1: Check Current Directory and Files

```bash
# In PythonAnywhere Bash console
# First, confirm you're in the right directory
pwd

# List all files and directories
ls -la
```

## Step 2: Look for Django Files

You should see something like:

```
total 28
drwxr-xr-x 3 rohanmaske rohanmaske 4096 Jan 12 05:24 .
drwxr-xr-x 9 rohanmaske rohanmaske 4096 Jan 12 05:19 ..
-rw-r--r-- 1 rohanmaske rohanmaske  261 Jan 11 11:10 .gitignore
-rw-r--r-- 1 rohanmaske rohanmaske  677 Jan 11 11:52 manage.py
-rw-r--r-- 1 rohanmaske rohanmaske  123 Jan 11 14:46 requirements.txt
drwxr-xr-x 3 rohanmaske rohanmaske 4096 Jan 11 11:39 stories
drwxr-xr-x 2 rohanmaske rohanmaske 4096 Jan 12 05:24 storyverse
```

## Step 3: If Settings Files Are Missing

If you don't see `settings.py`, `urls.py`, or `wsgi.py`, it means you need to copy them from your local machine to PythonAnywhere. Here's how:

1. **On your local machine**: Compress the files into a ZIP archive
2. **On PythonAnywhere**: Use the "Files" tab to upload the ZIP file
3. **Extract the ZIP file** using the PythonAnywhere Bash console:
   ```bash
   unzip your-archive-name.zip
   ```

## Step 4: Verify Files Are Present

After uploading, run `ls -la` again to confirm the files are now in the directory.

## Step 5: Continue with the Fix

Once you have `settings.py`, `urls.py`, and `wsgi.py` in your storyverse directory, continue with the steps from the PYTHONANYWHERE_FIX.md guide:

```bash
# Move files to nested directory
mv settings.py storyverse/
mv urls.py storyverse/
mv wsgi.py storyverse/
```

## Step 6: Update Configuration Files

Then update the configuration files as outlined in the guide.

## Alternative Approach: Clone from GitHub

If you have all the files in your GitHub repository, you can clone it directly to PythonAnywhere:

```bash
# In PythonAnywhere Bash console
cd ~
git clone https://github.com/rohan-xtha/full-story.git storyverse
cd storyverse
ls -la  # Check if files are present
```

This will get all the latest files from your GitHub repository.

Let me know what you see when you run `ls -la` and we'll proceed from there!
