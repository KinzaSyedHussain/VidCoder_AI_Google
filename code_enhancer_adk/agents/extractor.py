# extractor.py

import pytesseract
from PIL import Image
import os
import google_adk_vendor.adk
from google_adk_vendor.adk.agents import Agent
from dotenv import load_dotenv
import google.generativeai as genai

# Set the tesseract_cmd path to where tesseract.exe is installed
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Initialize the agent (details may vary)
my_agent = Agent(
    name="code_generator",
    model="gemini-1.5-flash",
    instruction="You are an expert programmer. Convert transcript to code.",
)

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=api_key)

def run(input_data):
    print("[ExtractorAgent] Extracting code...")

    file_path = input_data.get('file_path')
    mime_type = input_data.get('mime_type', '')

    extracted_code = ""

    try:
        if mime_type and mime_type.startswith("image"):
            # Handle image files
            image = Image.open(file_path)
            extracted_code = pytesseract.image_to_string(image)
        elif mime_type == "application/pdf":
            # Handle PDF files
            from pdf2image import convert_from_path
            pages = convert_from_path(file_path)
            text_list = []
            for page_num, page in enumerate(pages):
                text = pytesseract.image_to_string(page)
                text_list.append(f"# Page {page_num+1}\n{text}")
            extracted_code = "\n".join(text_list)
        else:
            extracted_code = "# Unsupported file type for extraction."
    except Exception as e:
        extracted_code = f"# Error during extraction: {e}"

    input_data['extracted_code'] = extracted_code
    return input_data

def generate_code(input_data):
    transcript = input_data.get('transcript', '')
    prompt = f"Convert this transcript to code:\n{transcript}"
    response = my_agent.run(prompt)
    input_data['generated_code'] = response
    return input_data 