import sys
import os

# Add the project root to the Python path
# This is necessary for Streamlit Cloud to find the 'code_enhancer_adk' module
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from dotenv import load_dotenv

load_dotenv()  # Loads .env file

api_key = os.getenv("GOOGLE_API_KEY")
print("GOOGLE_API_KEY:", api_key)  # For debugging, remove after confirming it works

import google.generativeai as genai
# The genai.configure call is deprecated and not needed.
# The library automatically picks up the GOOGLE_API_KEY from the environment.

import streamlit as st
import os
import shutil
import uuid
from code_enhancer_adk.main import process_file
from code_enhancer_adk.agents.language_translator_adk import LanguageTranslatorADKAgent

# --- Page Configuration ---
st.set_page_config(   
    page_title="✅ VidCoder AI",
    page_icon="🤖",
    layout="wide",
)

# --- UI Styling ---
st.markdown("""
<style>
    .stButton>button {
        width: 100%;
    }
    .stSpinner {
        text-align: center;
    }
    .main .block-container {
        padding-top: 2rem;
        padding-bottom: 2rem;
    }
</style>
""", unsafe_allow_html=True)

# --- Session State Initialization ---
if 'extracted_code' not in st.session_state:
    st.session_state.extracted_code = ""
if 'improved_code' not in st.session_state:
    st.session_state.improved_code = ""
if 'upload_key' not in st.session_state:
    st.session_state.upload_key = 0
if 'result' not in st.session_state:
    st.session_state.result = {}

# --- Tabs ---
tabs = st.tabs(["📝 Extract & Enhance", "🌐 Translate"])

# --- Tab 1: Extract & Enhance ---
with tabs[0]:
    st.title("✅ VidCoder AI (Updated)")
    st.markdown("Upload a video, image, or PDF containing code, and let AI extract and refine it for you.")
    uploaded_file = st.file_uploader(
        "Choose a file",
        type=['mp4', 'mov', 'avi', 'png', 'jpg', 'jpeg', 'pdf'],
        key=st.session_state.upload_key
    )
    if uploaded_file is not None:
        if st.button("Extract Code", use_container_width=True):
            with st.spinner("🤖 AI is extracting the code... Please wait."):
                temp_dir = "temp_uploads"
                os.makedirs(temp_dir, exist_ok=True)
                temp_filename = f"{uuid.uuid4()}_{uploaded_file.name}"
                temp_path = os.path.join(temp_dir, temp_filename)
                with open(temp_path, "wb") as f:
                    shutil.copyfileobj(uploaded_file, f)
                try:
                    st.session_state.result = process_file(temp_path)
                except Exception as e:
                    st.session_state.result = {'error': f"An error occurred: {e}"}
                    st.error(st.session_state.result['error'])
                st.session_state.extracted_code = st.session_state.result.get('code', '')
                st.session_state.improved_code = ""
                st.session_state.explanation = st.session_state.result.get('explanation', '')
            st.success("Code extracted!")
        st.markdown("---")
        def code_section(label, code, detected_language=None, session_key=None):
            lang_labels = {'python': 'Python', 'javascript': 'JavaScript', 'cpp': 'C++'}
            if not code:
                return
            st.subheader(label)
            st.code(code)
            st.download_button(
                label=f"Download {label}",
                data=code.encode('utf-8'),
                file_name=f"{label.lower().replace(' ', '_')}.py",
                mime="text/plain"
            )
            # Show detected language for debugging
            if detected_language in lang_labels:
                st.markdown(f"*Detected language:* {lang_labels[detected_language]}")
            else:
                st.markdown(f"*Detected language:* Unknown")
        result = st.session_state.get('result', {})
        code_section("Your Code", st.session_state.get('extracted_code', ''), result.get('language', 'python'), 'extracted')
        code_section("Generated Code", result.get('generated_code', ''), result.get('generated_code_language', None), 'generated')
        code_section("Enhanced Code", result.get('enhanced_code', ''), result.get('enhanced_code_language', None), 'enhanced')
        if result.get('explanation'):
            st.subheader("Explanation:")
            st.markdown(result['explanation'])
        if result.get('transcript'):
            st.subheader("Transcript:")
            st.code(result.get('transcript', ''))
            st.download_button(
                label="Download Transcript",
                data=result.get('transcript', '').encode('utf-8'),
                file_name="transcript.txt",
                mime="text/plain"
            )
        if result.get('review'):
            st.subheader("Code Review:")
            st.markdown(result.get('review', ''))
            st.download_button(
                label="Download Code Review",
                data=result.get('review', '').encode('utf-8'),
                file_name="code_review.md",
                mime="text/markdown"
            )
    else:
        st.info("Please upload a file to get started.")
    if st.button("Clear and Start Over"):
        st.session_state.extracted_code = ""
        st.session_state.improved_code = ""
        st.session_state.result = {}
        st.session_state.upload_key += 1
        st.rerun()

# --- Tab 2: Translate ---
with tabs[1]:
    st.title("🌐 Code Translator")
    st.markdown("Paste or upload code, select the source and target language, and translate using AI.")
    lang_labels = {'python': 'Python', 'javascript': 'JavaScript', 'cpp': 'C++'}
    all_languages = ['python', 'javascript', 'cpp']
    code_input = st.text_area("Paste your code here:", height=200, key="translate_code_input")
    col1, col2 = st.columns(2)
    with col1:
        source_language = st.selectbox("Source Language:", [lang_labels[l] for l in all_languages], key="source_lang")
    with col2:
        target_language = st.selectbox("Target Language:", [lang_labels[l] for l in all_languages], key="target_lang")
    # Map label back to code value
    source_language_code = [k for k, v in lang_labels.items() if v == source_language][0]
    target_language_code = [k for k, v in lang_labels.items() if v == target_language][0]
    if st.button("Translate Code", key="translate_code_btn"):
        translator_agent = LanguageTranslatorADKAgent(name="LanguageTranslatorADKAgentUI")
        result = translator_agent.run({'code': code_input, 'target_language': target_language_code})
        st.session_state['translated_code_ui'] = result.get('translated_code', '')
        st.session_state['detected_language_ui'] = result.get('detected_language', '')
    if st.session_state.get('translated_code_ui', ''):
        st.subheader(f"Translated Code ({lang_labels.get(target_language_code, target_language_code.title())}):")
        st.code(st.session_state['translated_code_ui'])
        st.download_button(
            label="Download Translated Code",
            data=st.session_state['translated_code_ui'].encode('utf-8'),
            file_name=f"translated_code_{target_language_code}.txt",
            mime="text/plain"
        )
        st.info(f"Detected source language: {lang_labels.get(st.session_state.get('detected_language_ui', ''), 'Unknown')}")