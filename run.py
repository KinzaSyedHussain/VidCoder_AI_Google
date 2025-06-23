#!/usr/bin/env python3
"""
VidCoder AI - Main entry point
Python Flask server for AI Code Extraction and Refinement
"""

import os
import subprocess
import sys

def main():
    """
    Main entry point to run the VidCoder AI Streamlit application.
    """
    print("🚀 Starting VidCoder AI with Streamlit...")
    
    # Get the directory of the run.py script
    script_dir = os.path.dirname(os.path.realpath(__file__))
    
    # Construct the full path to the streamlit app script
    app_path = os.path.join(script_dir, "app_streamlit.py")
    
    # Command to run streamlit as a module, which is more robust
    command = [sys.executable, "-m", "streamlit", "run", app_path]
    
    print(f"Executing command: {' '.join(command)}")
    
    # Execute the command
    subprocess.run(command, check=True)

if __name__ == "__main__":
    main()