# Monitor de Mensagens TCP/UDP

## O que faz?
Recebe mensagens de clientes TCP e UDP e mostra em tempo real na interface web.

## Instalação

### 1. Conectar no servidor
```bash
ssh seu_usuario@server_name.idUFSC.vms.ufsc.br
```

### 2. Instalar dependências
```bash
sudo apt update
sudo apt install apache2 python3 python3-pip -y
sudo pip3 install websockets
```

### 3. Criar pastas
```bash
sudo mkdir -p /var/www/html/css
sudo mkdir -p /var/www/html/js
sudo mkdir -p /var/www/html/py
```

### 4. Criar arquivos

```bash
sudo nano /var/www/html/index.html
```
Cole o conteúdo do index.html e salve

```bash
sudo nano /var/www/html/css/ws.css
```
Cole o conteúdo do ws.css e salve

```bash
sudo nano /var/www/html/js/ws.js
```
Cole o conteúdo do ws.js e salve

```bash
sudo nano /var/www/html/py/server_manager.py
```
Cole o conteúdo do server_manager.py e salve

```bash
sudo nano /var/www/html/py/websocket_server.py
```
Cole o conteúdo do websocket_server.py e salve

### 5. Dar permissões
```bash
sudo chmod +x /var/www/html/py/server_manager.py
sudo chmod +x /var/www/html/py/websocket_server.py
sudo chmod 777 /tmp
sudo chown -R www-data:www-data /var/www/html
```

### 6. Configurar Apache
```bash
sudo nano /etc/apache2/sites-available/000-default.conf
```

Substitua todo o conteúdo por:
```apache
<VirtualHost *:80>
    ServerAdmin webmaster@localhost
    DocumentRoot /var/www/html

    <Directory "/var/www/html">
        Options +ExecCGI
        DirectoryIndex index.html
        AddHandler cgi-script .py
        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

### 7. Habilitar módulos
```bash
sudo a2enmod cgi
sudo a2enmod cgid
sudo systemctl restart apache2
```

### 8. Liberar portas
```bash
sudo ufw allow 80/tcp
sudo ufw allow 8080/tcp
sudo ufw allow 8081/udp
sudo ufw allow 8082/tcp
```

## Como usar

### Acessar interface
```
http://server_name.idUFSC.vms.ufsc.br/
```

Clicar em "Iniciar Servidor"

### Testar clientes

Cliente TCP:
```bash
python3 tcp_client.py
```
Digite: server_name.idUFSC.vms.ufsc.br

Cliente UDP:
```bash
python3 udp_client.py
```
Digite: server_name.idUFSC.vms.ufsc.br

## Portas
- 8080: TCP
- 8081: UDP
- 8082: WebSocket

## Funcionalidades
- Status do servidor
- Contadores de mensagens TCP, UDP e total
- Filtros por protocolo
- Exibição de IP, data, hora e conteúdo
- Logs de depuração

## Solução de problemas

Ver status do Apache:
```bash
sudo systemctl status apache2
```

Ver logs de erro:
```bash
sudo tail -f /var/log/apache2/error.log
```

Ver se o servidor está rodando:
```bash
ps aux | grep websocket_server
```