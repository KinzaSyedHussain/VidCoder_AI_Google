# code_improver.py

import os
import google.generativeai as genai

def run(input_data):
    code = input_data.get('cleaned_code', '') or input_data.get('extracted_code', '')
    if not code.strip():
        input_data['improved_code'] = "# No code provided to refactor."
        return input_data

    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
    model = genai.GenerativeModel('models/gemini-1.5-flash')
    prompt = f"Improve and refactor the following code. Fix any errors and make it more readable:\n\n{code}"
    response = model.generate_content(prompt)
    input_data['improved_code'] = response.text
    return input_data