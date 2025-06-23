# language_detector.py
import os
import google.generativeai as genai
import re
from google.adk.agents import Agent
from code_enhancer_adk.agents.language_translator_adk import LanguageTranslatorADKAgent

# Try to import Pygments for local detection
try:
    from pygments.lexers import guess_lexer
    from pygments.util import ClassNotFound
    HAS_PYGMENTS = True
except ImportError:
    HAS_PYGMENTS = False

PROMPT = (
    "You are a programming language classifier. Only answer with one of: Python, JavaScript, or C++. "
    "Do not explain. What language is this code?\n{code}"
)

class LanguageDetectorAgent(Agent):
    def run(self, input_data, context=None):
        """Detect programming language from code string."""
        code = input_data.get('code', '')
        language = "unknown"
        print("[DEBUG] Input code for detection:", repr(code))
        # 1. Try Gemini API for language detection (with improved prompt)
        try:
            model = genai.GenerativeModel('models/gemini-1.5-flash')
            prompt = PROMPT.format(code=code)
            response = model.generate_content(prompt)
            print("[DEBUG] Gemini response:", response.text)
            detected = response.text.strip().lower()
            if detected in ['python', 'javascript', 'c++', 'cpp']:
                language = 'cpp' if detected in ['c++', 'cpp'] else detected
                print(f"[DEBUG] Gemini detected language: {language}")
            else:
                print("[DEBUG] Gemini unsure, falling back to next method.")
        except Exception as e:
            print("[DEBUG] Gemini error:", e)
            print("[DEBUG] Falling back to next method.")

        # 2. Fallback to Pygments if Gemini is unsure
        if language == "unknown" and HAS_PYGMENTS:
            try:
                lexer = guess_lexer(code)
                name = lexer.name.lower()
                print("[DEBUG] Pygments lexer name:", name)
                if 'python' in name:
                    language = 'python'
                elif 'javascript' in name or 'ecmascript' in name:
                    language = 'javascript'
                elif 'c++' in name or 'cpp' in name:
                    language = 'cpp'
                print(f"[DEBUG] Pygments detected language: {language}")
            except ClassNotFound:
                print("[DEBUG] Pygments could not classify code.")

        # 3. Final fallback: regex
        if language == "unknown":
            print("[DEBUG] Using regex fallback.")
            if re.search(r'#include|std::|cout|cin|int\s+main|;\s*$', code, re.MULTILINE):
                language = "cpp"
            elif re.search(r'\bfunction\b|\bconsole\.log\b|\bvar\b|\blet\b|\bconst\b|=>|\{\s*|\}\s*|//', code):
                language = "javascript"
            elif re.search(r'^\s*def\s|^\s*import\s|print\(|^\s*#', code, re.MULTILINE):
                language = "python"
            print(f"[DEBUG] Regex detected language: {language}")
        print(f"[DEBUG] Final detected language: {language}")
        input_data['language'] = language
        return input_data 