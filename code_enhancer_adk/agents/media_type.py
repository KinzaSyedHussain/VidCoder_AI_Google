# media_type.py
import mimetypes

def run(input_data):
    # Detect file type using mimetypes (stub)
    print("[MediaTypeAgent] Detecting file type...")
    file_path = input_data.get('file_path')
    mime_type, _ = mimetypes.guess_type(file_path)
    input_data['mime_type'] = mime_type
    return input_data 