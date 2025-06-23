# main.py
# Entry point for the code-enhancer-adk workflow
# Loads workflow from agent.yaml and orchestrates agents

import os
from .agents import (
    input_handler, media_type, extractor, language_detector, cleaner, code_improver, explanation, output,
    transcript_agent, code_generator_agent, code_enhancer_agent, code_reviewer_agent
)
from .agents.language_translator_adk import LanguageTranslatorADKAgent

def process_file(file_path):
    """
    Runs the uploaded file through the agent pipeline and returns the result.
    """
    data = {'file_path': file_path}
    # Old pipeline (for compatibility)
    data = input_handler.run(data)
    data = media_type.run(data)
    data = extractor.run(data)
    # Use ADK agent for language detection and translation
    translator_agent = LanguageTranslatorADKAgent(name="LanguageTranslatorADKAgent")
    translation_result = translator_agent.run({'code': data.get('code', ''), 'target_language': 'python'})
    data['language'] = translation_result.get('detected_language', 'unknown')
    data['translated_code'] = translation_result.get('translated_code', '')
    data = cleaner.run(data)
    data = code_improver.run(data)
    data = explanation.run(data)
    result = output.run(data)

    # New pipeline
    data = transcript_agent.run(data)
    data = code_generator_agent.run(data)
    data = code_enhancer_agent.run(data)
    data = code_reviewer_agent.run(data)

    # Merge results
    result['transcript'] = data.get('transcript', '')
    result['generated_code'] = data.get('generated_code', '')
    result['enhanced_code'] = data.get('enhanced_code', '')
    result['review'] = data.get('review', '')
    # Add detected language and translated code to result
    result['language'] = data.get('language', 'unknown')
    result['translated_code'] = data.get('translated_code', '')
    return result

if __name__ == "__main__":
    print("[Stub] This will orchestrate the agent workflow as defined in agent.yaml.")

__all__ = ["process_file"] 