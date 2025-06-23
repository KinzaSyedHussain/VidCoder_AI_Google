import os
import google.generativeai as genai

PROMPT_TEMPLATE = """
Translate this {source_language} code to equivalent {target_language}.

Code:
{code}
"""

def run(input_data):
    code = input_data.get('code', '')
    source_language = input_data.get('language', 'python')
    target_language = input_data.get('target_language', 'javascript')
    if not code or source_language == target_language:
        input_data['translated_code'] = code
        return input_data

    prompt = PROMPT_TEMPLATE.format(
        source_language=source_language.capitalize(),
        target_language=target_language.capitalize(),
        code=code
    )
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        translated_code = response.text if hasattr(response, 'text') else str(response)
    except Exception as e:
        translated_code = f"# Error during translation: {e}"
    input_data['translated_code'] = translated_code
    return input_data 