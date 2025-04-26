from flask import Flask, render_template
from flask_socketio import SocketIO, send

app = Flask(__name__)
socketio = SocketIO(app)

# Serve the HTML page
@app.route('/')
def index():
    return render_template('index.html')  # Replace with the path to your HTML file

# WebSocket event
@socketio.on('message')
def handle_message(message):
    print('Received message: ' + message)
    send(message, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=8000)
