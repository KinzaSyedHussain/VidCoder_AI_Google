# transcript_agent.py

def run(input_data):
    print("[TranscriptAgent] Extracting transcript from image...")
    # For now, just pass through the extracted_code from previous extractor
    transcript = input_data.get('extracted_code', '')
    input_data['transcript'] = transcript
    return input_data 