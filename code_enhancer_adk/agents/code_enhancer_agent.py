# code_enhancer_agent.py
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

model = genai.GenerativeModel('gemini-1.5-flash')

def run(input_data):
    print("[CodeEnhancerAgent] Enhancing code with Gemini...")
    code = input_data.get('generated_code', '')
    prompt = f"""
    You are an expert code reviewer and optimizer. Refactor, optimize, and add best practices and comments to the following code. Return only the improved code, no explanation.
    Code:
    {code}
    """
    try:
        response = model.generate_content(prompt)
        enhanced_code = response.text
    except Exception as e:
        enhanced_code = f"# Error enhancing code: {e}"
    input_data['enhanced_code'] = enhanced_code
    return input_data 