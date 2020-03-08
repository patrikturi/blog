import argparse
from datetime import date
import os
import sys
import shutil
import subprocess
import shlex

assert sys.version_info >= (3, 6)

DEST_REPO_PATH = 'public/'
DEST_REPO_URL = 'git@github.com:patrikturi/patrikturi.github.io.git'


def run_git_command(command):
    full_command = f'git -C {DEST_REPO_PATH} ' + command
    print(f'\n  {full_command}\n')
    subprocess.run(shlex.split(full_command), check=True)


def clone_or_reset_dest_repo():
    dest_git_path = os.path.join(DEST_REPO_PATH, '.git')
    if os.path.isdir(dest_git_path):
        run_git_command('reset --hard origin/master')
        return
    
    if os.path.exists(DEST_REPO_PATH):
        shutil.rmtree(DEST_REPO_PATH)

    cmd = f'git clone {DEST_REPO_URL} {DEST_REPO_PATH}'
    print(cmd)
    subprocess.run(shlex.split(cmd), check=True)


def remove_generated_files():
    to_remove = [ os.path.join(DEST_REPO_PATH, item) for item in os.listdir(DEST_REPO_PATH) if item != '.git' ]
    for path in to_remove:
        print(f'Removing {path}')
        if os.path.isfile(path):
            os.remove(path)
        else:
            shutil.rmtree(path)


def generate_site(commit_message):
    subprocess.run('hugo', check=True)
    run_git_command('add .')
    today = date.today()
    date_string = today.strftime('%b-%d-%Y')
    if not commit_message:
        commit_message = f'Rebuild site {date_string}'
    run_git_command(f'commit -m "{commit_message}"')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--msg', required=False, help='Specify commit message (optional)')
    parser.add_argument('--dry-run', action='store_true', help='Do not upload to the server')
    args = parser.parse_args()

    clone_or_reset_dest_repo()
    remove_generated_files()
    generate_site(args.msg)

    if not args.dry_run:
        run_git_command('push origin master')
