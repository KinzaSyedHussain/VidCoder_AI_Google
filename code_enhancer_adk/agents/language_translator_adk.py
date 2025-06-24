from google_adk_vendor.adk.agents import Agent
import google.generativeai as genai
import re

PROMPT_DETECT = (
    "You are a programming language classifier. Only answer with one of: Python, JavaScript, or C++. "
    "Do not explain. What language is this code?\n{code}"
)
PROMPT_TRANSLATE = (
    "Translate this {source_language} code to equivalent {target_language}.\n\nCode:\n{code}"
)

class LanguageTranslatorADKAgent(Agent):
    def run(self, input_data, context=None):
        code = input_data.get('code', '')
        target_language = input_data.get('target_language', 'python')
        detected_language = 'unknown'
        # 1. Detect language using Gemini
        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            prompt = PROMPT_DETECT.format(code=code)
            response = model.generate_content(prompt)
            detected = response.text.strip().lower()
            if detected in ['python', 'javascript', 'c++', 'cpp']:
                detected_language = 'cpp' if detected in ['c++', 'cpp'] else detected
        except Exception as e:
            pass
        # 2. Fallback: regex
        if detected_language == 'unknown':
            if re.search(r'#include|std::|cout|cin|int\s+main|;\s*$', code, re.MULTILINE):
                detected_language = "cpp"
            elif re.search(r'\bfunction\b|\bconsole\.log\b|\bvar\b|\blet\b|\bconst\b|=>|\{\s*|\}\s*|//', code):
                detected_language = "javascript"
            elif re.search(r'^\s*def\s|^\s*import\s|print\(|^\s*#', code, re.MULTILINE):
                detected_language = "python"
        # 3. Translate if needed
        translated_code = code
        if detected_language != target_language:
            try:
                prompt = PROMPT_TRANSLATE.format(
                    source_language=detected_language.capitalize(),
                    target_language=target_language.capitalize(),
                    code=code
                )
                response = model.generate_content(prompt)
                translated_code = response.text
            except Exception as e:
                translated_code = f"[Translation error: {e}]\n{code}"
        return {
            'detected_language': detected_language,
            'translated_code': translated_code
        } 