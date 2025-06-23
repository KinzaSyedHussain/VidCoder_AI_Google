# cleaner.py

def run(input_data):
    # Clean/fix code (stub)
    print("[CleanerAgent] Cleaning code...")
    input_data['cleaned_code'] = input_data.get('extracted_code', '')
    return input_data 