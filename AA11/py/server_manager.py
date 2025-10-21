import json
import subprocess
import os
import signal
import sys
from urllib.parse import parse_qs

def get_pid():
    try:
        with open('/tmp/websocket_server.pid', 'r') as f:
            return int(f.read().strip())
    except:
        return None

def is_running():
    pid = get_pid()
    if pid is None:
        return False
    try:
        os.kill(pid, 0)
        return True
    except OSError:
        return False

def start_server():
    if is_running():
        return {'status': 'running', 'message': 'Servidor já está rodando'}
    
    try:
        process = subprocess.Popen(
            ['/usr/bin/python3', '/var/www/html/py/websocket_server.py'],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            start_new_session=True
        )
        
        with open('/tmp/websocket_server.pid', 'w') as f:
            f.write(str(process.pid))
        
        return {'status': 'success', 'message': 'Servidor iniciado'}
    except Exception as e:
        return {'status': 'error', 'message': str(e)}

def stop_server():
    pid = get_pid()
    if pid is None:
        return {'status': 'stopped', 'message': 'Servidor não está rodando'}
    
    try:
        os.kill(pid, signal.SIGTERM)
        os.remove('/tmp/websocket_server.pid')
        return {'status': 'success', 'message': 'Servidor parado'}
    except Exception as e:
        return {'status': 'error', 'message': str(e)}

def get_status():
    if is_running():
        return {'status': 'running', 'message': 'Servidor está rodando'}
    else:
        return {'status': 'stopped', 'message': 'Servidor está parado'}

print("Content-Type: application/json\n")

try:
    query_string = os.environ.get('QUERY_STRING', '')
    params = parse_qs(query_string)
    action = params.get('action', ['status'])[0]
    
    if action == 'start':
        result = start_server()
    elif action == 'stop':
        result = stop_server()
    elif action == 'status':
        result = get_status()
    else:
        result = {'status': 'error', 'message': 'Ação inválida'}
    
    print(json.dumps(result))
except Exception as e:
    print(json.dumps({'status': 'error', 'message': str(e)}))