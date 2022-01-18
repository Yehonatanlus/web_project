import subprocess
import sys, os

# Activating environemnet with conda
os.system('conda init bash')
os.system('conda activate web_project')

# Creating server and bot processes
curr_path = os.path.abspath(os.getcwd())
proc_a = subprocess.Popen([r'python3', r'bot.py'], cwd=curr_path + '/bot')
proc_b = subprocess.Popen([r'python3', r'server.py'], cwd=curr_path)

try:
    proc_a.wait()
    proc_b.wait()
except KeyboardInterrupt:
    proc_a.kill()
    proc_b.kill()