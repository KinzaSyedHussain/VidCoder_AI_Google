# VidCoder AI: Extract, Enhance & Translate Code from Images

![VidCoder AI Flowchart](flowchart.png)
*(Note: For this diagram to render, ensure GitHub's Mermaid support is active or view it in a compatible Markdown viewer.)*

```mermaid
flowchart TD
    User["User (Web Browser)"] -->|Uploads file / interacts| Streamlit["Streamlit App (app_streamlit.py)"]
    Streamlit -->|Calls| ADK["Code Enhancer ADK (Python Package)"]
    ADK -->|Uses| Gemini["Google Generative AI (Gemini API)"]
    ADK -->|OCR| Pytesseract["Pytesseract & Pillow"]
    ADK -->|PDF to Image| PDF2Image["pdf2image"]
    ADK -->|Agent Logic| ADKLib["google.adk (Vendored)"]
    Gemini -->|API Key| GCP["Google Cloud Project"]
    Streamlit -->|Displays| UI["Results/UI"]
    subgraph Local_Python_Packages
      Pytesseract
      PDF2Image
      ADKLib
    end
Description
VidCoder AI is a Streamlit web application that leverages Google's Gemini AI to streamline your coding workflow. It enables effortless extraction, enhancement, analysis, and multi-language translation of code directly from images.

Inspiration
Manually typing code from images is a huge pain. We were inspired to build a smart, all-in-one AI tool to effortlessly extract, refine, and translate code, leveraging Google ADK concepts and Gemini AI.

What it does
VidCoder AI extracts code from images, then enhances and analyzes it for limitations. It also offers a dedicated tab to translate code between Python, JavaScript, and C++, making it easy to copy or download.

How we built it
We built VidCoder AI as a Streamlit web app, powered by Google's Gemini API (gemini-2.0-flash). We designed a conceptual multi-agent AI pipeline to handle extraction, enhancement, analysis, and translation. OCR is handled by Pytesseract, and pdf2image is included for potential future PDF support.

Challenges we ran into
Accurately extracting diverse code from images and ensuring insightful AI responses were key hurdles. Language detection for short code snippets and orchestrating multiple AI steps within Streamlit also posed challenges.

Accomplishments that we're proud of
We're proud of building a seamless, end-to-end AI-powered workflow for code. We created an intuitive UI and a modular design, effectively solving a real-world problem for developers and students.

What we learned
We gained deep insights into Gemini's multimodal power and the importance of prompt engineering. Building with an "agent-like" design proved crucial for clarity and scalability in AI applications.

What's next for VidCoder AI
Next, we aim to expand VidCoder AI to extract code from PDFs and videos. We'll also add more programming languages and enhance our code review capabilities.

Setup & Installation
To run VidCoder AI locally, follow these steps:

Prerequisites
Python 3.8+
pip (Python package installer)
Tesseract OCR: Installation Guide
Poppler: (Required for pdf2image if you plan to extend to PDFs, or for development. Install according to pdf2image documentation for your OS: pdf2image GitHub)
