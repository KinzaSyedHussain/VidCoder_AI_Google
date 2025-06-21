#!/usr/bin/env python3
"""
VidCoder AI - Main entry point
Python Flask server for AI Code Extraction and Refinement
"""

if __name__ == "__main__":
    from app import app
    
    print("🚀 Starting VidCoder AI...")
    print("📝 AI Code Extraction and Refinement Agent")
    print("🌐 Server running on http://0.0.0.0:5000")
    print("📁 Upload limit: 200MB")
    print("🎯 Ready for video, image, and PDF files")
    
    app.run(host='0.0.0.0', port=5000, debug=True)