import os
import mimetypes
from typing import Dict, List
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from werkzeug.exceptions import RequestEntityTooLarge

# Import the new ADK agent
from agent import vidcoder_agent

# Basic Flask app setup
app = Flask(__name__, static_folder='client/dist', static_url_path='/')
CORS(app)

# Configure upload folder and allowed extensions
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov', 'avi', 'pdf'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 200 * 1024 * 1024  # 200 MB upload limit

# Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


class MemoryStorage:
    """Simple in-memory storage for file metadata."""
    def __init__(self):
        self.files: Dict[str, Dict] = {}
        self.next_file_id = 1

    def add_file(self, file_data: Dict) -> Dict:
        file_id = str(self.next_file_id)
        self.files[file_id] = file_data
        self.next_file_id += 1
        return {'id': file_id, **file_data}

    def get_file(self, file_id: str) -> Dict:
        return self.files.get(file_id)

storage = MemoryStorage()


@app.route('/upload', methods=['POST'])
def upload_file():
    """Handles file uploads."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file:
    filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        try:
            file.save(file_path)
            file_info = {
                'originalName': file.filename,
                'fileName': filename,
                'mimeType': file.mimetype or mimetypes.guess_type(filename)[0],
                'size': os.path.getsize(file_path),
                'path': file_path,
            }
            saved_file = storage.add_file(file_info)
            return jsonify({'message': 'File uploaded successfully', 'file': saved_file})
        except RequestEntityTooLarge:
            return jsonify({'error': 'File is larger than the 200MB limit'}), 413
        except Exception as e:
            return jsonify({'error': f'An unexpected error occurred: {e}'}), 500
    return jsonify({'error': 'File upload failed'}), 400


@app.route('/extract_code', methods=['POST'])
def extract_code():
    """Endpoint to extract code from an uploaded file using the ADK agent."""
    data = request.get_json()
    file_id = data.get('fileId')
    
    if not file_id:
        return jsonify({'error': 'No fileId provided'}), 400
        
    file_info = storage.get_file(str(file_id))
    if not file_info:
        return jsonify({'error': 'File not found'}), 404

    # In a real app, you would read the file content. Here, we pass context to the agent.
    file_content_mock = "File content would be here"
    file_type = file_info.get('mimeType', 'unknown')

    # The prompt guides the agent to use the 'extract_code_from_content' tool.
    prompt = f"Extract the code from this content. The file type is {file_type}."
    response = vidcoder_agent.run(prompt)
    
    # The agent's response is the result of the tool call.
    return jsonify({'extractedCode': response})


@app.route('/improve_code', methods=['POST'])
def improve_code():
    """Endpoint to improve code using the ADK agent."""
    data = request.get_json()
    original_code = data.get('code')
    
    if not original_code:
        return jsonify({'error': 'No code provided'}), 400

    # The prompt guides the agent to use the 'improve_code' tool.
    prompt = f"Please improve the following code: {original_code}"
    response = vidcoder_agent.run(prompt)

    return jsonify({'improvedCode': response})


# Static file serving for React frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)