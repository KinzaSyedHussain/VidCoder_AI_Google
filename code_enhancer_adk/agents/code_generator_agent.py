# code_generator_agent.py
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=API_KEY)

model = genai.GenerativeModel('gemini-1.5-flash')

def run(input_data):
    print("[CodeGeneratorAgent] Converting transcript to code using Gemini...")
    transcript = input_data.get('transcript', '')
    prompt = f"""
    You are an expert programmer. Convert the following transcript or description into working code. Return only the code, no explanation.
    Transcript:
    {transcript}
    """
    try:
        response = model.generate_content(prompt)
        code = response.text
    except Exception as e:
        code = f"# Error generating code: {e}"
    input_data['generated_code'] = code
    return input_data 