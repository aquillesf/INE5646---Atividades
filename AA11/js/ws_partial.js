// Depuração
const debugInfo = document.getElementById('debugInfo');
const debugToggle = document.getElementById('debugToggle');
let debugMode = false;

// URL para o gerenciador do servidor
const managerUrl = '/py/server_manager.py';

// Define o websocket (ws)
const websocketUrl = `ws://${window.location.hostname}:8082`; // URL para o WebSocket

debugToggle.addEventListener('click', () => {
    debugMode = !debugMode;
    debugInfo.style.display = debugMode ? 'block' : 'none';
    debugToggle.textContent = debugMode ? 'Ocultar Informações de Depuração' : 'Exibir Informações de Depuração';
});

function logDebug(message) {
    const now = new Date().toISOString();
    debugInfo.innerHTML += `[${now}] ${message}\n`;
    debugInfo.scrollTop = debugInfo.scrollHeight;
    console.log(`[DEBUG] ${message}`);
}

// Implemente o restante...

function updateServerStatus(status) {
    logDebug(`Atualizando status do servidor: ${status}`);
    
    if (status === 'online' || status === 'running') {
        statusDot.className = 'status-dot status-online';
        statusText.textContent = 'Servidor online';
        startButton.disabled = true;
        stopButton.disabled = false;
    } else if (status === 'offline' || status === 'stopped') {
        statusDot.className = 'status-dot status-offline';
        statusText.textContent = 'Servidor offline';
        startButton.disabled = false;
        stopButton.disabled = true;
    } else if (status === 'starting') {
        statusText.textContent = 'Iniciando servidor';
        startButton.disabled = true;
        stopButton.disabled = true;
    } else if (status === 'stopping') {
        statusText.textContent = 'Parando servidor';
        startButton.disabled = true;
        stopButton.disabled = true;
    } else if (status === 'checking') {
        statusText.textContent = 'Verificando status do servidor';
    }
}

function connectWebSocket() {
    logDebug(`Conectando ao WebSocket: ${websocketUrl}`);
    
    try {
        ws = new WebSocket(websocketUrl);
        
        ws.onopen = () => {
            logDebug('WebSocket conectado');
            updateServerStatus('online');
            reconnectAttempts = 0;
        };
        
        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                logDebug(`Mensagem recebida: ${JSON.stringify(data)}`);
                handleMessage(data);
            } catch (e) {
                logDebug(`Erro ao processar mensagem: ${e.message}`);
            }
        };
        
        ws.onerror = (error) => {
            logDebug(`Erro no WebSocket: ${error}`);
        };
        
        ws.onclose = () => {
            logDebug('WebSocket desconectado');
            updateServerStatus('offline');
            
            if (reconnectAttempts < maxReconnectAttempts) {
                reconnectAttempts++;
                logDebug(`Tentando reconectar (${reconnectAttempts}/${maxReconnectAttempts})...`);
                setTimeout(connectWebSocket, 3000);
            }
        };
        
    } catch (e) {
        logDebug(`Erro ao conectar WebSocket: ${e.message}`);
        updateServerStatus('offline');
    }
}

function handleMessage(data) {
    const message = {
        id: Date.now(),
        protocol: data.protocol || 'TCP',
        ip: data.ip || 'Desconhecido',
        content: data.message || data.content || '',
        timestamp: new Date()
    };
    
    messages.push(message);
    
    if (message.protocol === 'TCP') {
        tcpMessages++;
        tcpCount.textContent = tcpMessages;
    } else if (message.protocol === 'UDP') {
        udpMessages++;
        udpCount.textContent = udpMessages;
    }
    
    totalCount.textContent = messages.length;
    
    renderMessages();
}

function renderMessages() {
    const filteredMessages = messages.filter(msg => {
        if (currentFilter === 'all') return true;
        if (currentFilter === 'tcp') return msg.protocol === 'TCP';
        if (currentFilter === 'udp') return msg.protocol === 'UDP';
        return true;
    });
    
    if (filteredMessages.length === 0) {
        messageList.innerHTML = '<div class="no-messages">Nenhuma mensagem recebida ainda. Conecte clientes TCP/UDP para receber mensagens.</div>';
        return;
    }
    
    messageList.innerHTML = filteredMessages.map(msg => {
        const protocolClass = msg.protocol.toLowerCase();
        const date = msg.timestamp.toLocaleDateString('pt-BR');
        const time = msg.timestamp.toLocaleTimeString('pt-BR');
        
        return `
            <div class="message ${protocolClass}">
                <div class="message-header">
                    <span>
                        <span class="protocol-badge ${protocolClass}-badge">${msg.protocol}</span>
                        <strong>${msg.ip}</strong>
                    </span>
                    <span>${date} ${time}</span>
                </div>
                <div class="message-content">${msg.content}</div>
            </div>
        `;
    }).join('');
    
    messageList.scrollTop = messageList.scrollHeight;
}

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const tabText = tab.textContent.toLowerCase();
        if (tabText === 'todas') {
            currentFilter = 'all';
        } else if (tabText === 'tcp') {
            currentFilter = 'tcp';
        } else if (tabText === 'udp') {
            currentFilter = 'udp';
        }
        
        renderMessages();
    });
});

startButton.addEventListener('click', async () => {
    logDebug('Solicitando início do servidor...');
    updateServerStatus('starting');
    
    try {
        const response = await fetch('/py/server_manager.py?action=start', {
            method: 'GET'
        });
        
        const data = await response.json();
        logDebug(`Resposta do início: ${JSON.stringify(data)}`);
        
        if (data.status === 'success' || data.status === 'running') {
            updateServerStatus('running');
            setTimeout(connectWebSocket, 1000);
        } else {
            updateServerStatus('offline');
        }
    } catch (e) {
        logDebug(`Erro ao iniciar servidor: ${e.message}`);
        updateServerStatus('offline');
        connectWebSocket();
    }
});

stopButton.addEventListener('click', async () => {
    logDebug('Solicitando parada do servidor...');
    updateServerStatus('stopping');
    
    try {
        const response = await fetch('/py/server_manager.py?action=stop', {
            method: 'GET'
        });
        
        const data = await response.json();
        logDebug(`Resposta da parada: ${JSON.stringify(data)}`);
        
        if (ws) {
            ws.close();
            ws = null;
        }
        
        updateServerStatus('stopped');
    } catch (e) {
        logDebug(`Erro ao parar servidor: ${e.message}`);
        updateServerStatus('offline');
    }
});

clearButton.addEventListener('click', () => {
    messages = [];
    tcpMessages = 0;
    udpMessages = 0;
    
    tcpCount.textContent = '0';
    udpCount.textContent = '0';
    totalCount.textContent = '0';
    
    renderMessages();
    logDebug('Mensagens limpas');
});

async function checkServerStatus() {
    logDebug('Verificando status do servidor...');
    updateServerStatus('checking');
    
    try {
        const response = await fetch('/py/server_manager.py?action=status', {
            method: 'GET'
        });
        
        const data = await response.json();
        logDebug(`Status recebido: ${JSON.stringify(data)}`);
        
        if (data.status === 'running') {
            updateServerStatus('running');
            connectWebSocket();
        } else {
            updateServerStatus('offline');
        }
    } catch (e) {
        logDebug(`Erro ao verificar status: ${e.message}`);
        updateServerStatus('offline');
    }
}

window.addEventListener('load', () => {
    logDebug('Página carregada');
    checkServerStatus();
});

window.addEventListener('beforeunload', () => {
    if (ws) {
        ws.close();
    }
});
