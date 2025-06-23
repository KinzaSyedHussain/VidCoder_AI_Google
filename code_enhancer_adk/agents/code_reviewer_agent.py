# code_reviewer_agent.py
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=API_KEY)

model = genai.GenerativeModel('gemini-1.5-flash')

def run(input_data):
    print("[CodeReviewerAgent] Reviewing code with Gemini...")
    code = input_data.get('enhanced_code', '')
    prompt = f"""
    You are an expert code reviewer. Review the following code and point out any issues, improvements, or best practices. Return your review as a Markdown list.
    Code:
    {code}
    """
    try:
        response = model.generate_content(prompt)
        review = response.text
    except Exception as e:
        review = f"# Error reviewing code: {e}"
    input_data['review'] = review
    return input_data 