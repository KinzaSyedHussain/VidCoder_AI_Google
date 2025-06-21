import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { insertFileSchema, insertCodeExtractionSchema } from "@shared/schema";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept video, image, and PDF files
    const allowedTypes = [
      'video/mp4',
      'video/avi',
      'video/quicktime',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only video, image, and PDF files are allowed.'));
    }
  }
});

// Mock AI processing functions
function simulateCodeExtraction(file: any): string {
  // Mock extraction based on file type
  const mockCodes = {
    'application/pdf': `# Extracted from PDF
def process_document(doc_path):
    """Process a PDF document and extract text"""
    with open(doc_path, 'rb') as file:
        # PDF processing logic here
        return extract_text(file)

def extract_text(file_obj):
    """Extract text from PDF file object"""
    # Implementation would use PyPDF2 or similar
    return "Extracted text content"`,
    
    'image/jpeg': `# Extracted from image using OCR
import cv2
import pytesseract

def extract_code_from_image(image_path):
    """Extract code from image using OCR"""
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Apply preprocessing
    processed = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
    
    # Extract text
    text = pytesseract.image_to_string(processed)
    return text`,
    
    'image/png': `# Extracted from PNG image
def analyze_screenshot(img_path):
    """Analyze code screenshot and extract content"""
    from PIL import Image
    import numpy as np
    
    img = Image.open(img_path)
    img_array = np.array(img)
    
    # Process image to extract code
    return process_code_regions(img_array)

def process_code_regions(image_array):
    """Process regions that contain code"""
    # Implementation for code region detection
    return "Detected code content"`,
    
    'video/mp4': `# Extracted from video transcription
def transcribe_coding_video(video_path):
    """Extract code from coding tutorial video"""
    import speech_recognition as sr
    
    # Extract audio from video
    audio = extract_audio(video_path)
    
    # Transcribe speech to text
    r = sr.Recognizer()
    with sr.AudioFile(audio) as source:
        audio_data = r.record(source)
        text = r.recognize_google(audio_data)
    
    return parse_code_from_transcript(text)

def extract_audio(video_path):
    """Extract audio track from video"""
    # Implementation using ffmpeg or similar
    return "extracted_audio.wav"`
  };

  return mockCodes[file.mimetype as keyof typeof mockCodes] || `# Extracted code
def sample_function():
    """Sample extracted function"""
    print("Hello, World!")
    return True`;
}

function simulateCodeImprovement(originalCode: string): string {
  // Mock improvement - add docstrings, type hints, and better formatting
  const improvedCode = originalCode
    .replace(/def (\w+)\(/g, 'def $1(')
    .replace(/def (\w+)\((.*?)\):/g, (match, funcName, params) => {
      if (!params.includes(':')) {
        return `def ${funcName}(${params}) -> Any:`;
      }
      return match;
    });

  return `# Improved version with better practices
from typing import Any, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

${improvedCode}

# Added error handling and logging
def handle_errors(func):
    """Decorator for error handling"""
    def wrapper(*args, **kwargs):
        try:
            logger.info(f"Executing {func.__name__}")
            return func(*args, **kwargs)
        except Exception as e:
            logger.error(f"Error in {func.__name__}: {e}")
            raise
    return wrapper`;
}

function detectLanguage(code: string): string {
  // Simple language detection based on keywords
  if (code.includes('def ') || code.includes('import ') || code.includes('print(')) {
    return 'python';
  } else if (code.includes('function ') || code.includes('const ') || code.includes('console.log')) {
    return 'javascript';
  } else if (code.includes('class ') && code.includes('public static void main')) {
    return 'java';
  } else if (code.includes('#include') || code.includes('int main()')) {
    return 'cpp';
  }
  return 'plaintext';
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // File upload endpoint
  app.post("/api/upload", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileData = {
        originalName: req.file.originalname,
        fileName: req.file.filename,
        mimeType: req.file.mimetype,
        size: req.file.size
      };

      const validatedData = insertFileSchema.parse(fileData);
      const savedFile = await storage.createFile(validatedData);

      res.json({
        success: true,
        file: savedFile
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Upload failed" 
      });
    }
  });

  // Code extraction endpoint
  app.post("/api/extract/:fileId", async (req, res) => {
    try {
      const fileId = parseInt(req.params.fileId);
      const file = await storage.getFile(fileId);
      
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      const extractedCode = simulateCodeExtraction(file);
      const language = detectLanguage(extractedCode);

      const extractionData = {
        fileId: fileId,
        extractedCode: extractedCode,
        language: language,
        status: "extracted" as const
      };

      const validatedData = insertCodeExtractionSchema.parse(extractionData);
      const extraction = await storage.createCodeExtraction(validatedData);

      res.json({
        success: true,
        extraction: extraction
      });
    } catch (error) {
      console.error('Extraction error:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Code extraction failed" 
      });
    }
  });

  // Code improvement endpoint
  app.post("/api/improve/:extractionId", async (req, res) => {
    try {
      const extractionId = parseInt(req.params.extractionId);
      const extraction = await storage.getCodeExtraction(extractionId);
      
      if (!extraction) {
        return res.status(404).json({ message: "Code extraction not found" });
      }

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));

      const improvedCode = simulateCodeImprovement(extraction.extractedCode);
      
      const updatedExtraction = await storage.updateCodeExtraction(extractionId, {
        improvedCode: improvedCode,
        status: "improved"
      });

      res.json({
        success: true,
        extraction: updatedExtraction
      });
    } catch (error) {
      console.error('Improvement error:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Code improvement failed" 
      });
    }
  });

  // Get extraction by file ID
  app.get("/api/extraction/file/:fileId", async (req, res) => {
    try {
      const fileId = parseInt(req.params.fileId);
      const extraction = await storage.getCodeExtractionByFileId(fileId);
      
      if (!extraction) {
        return res.status(404).json({ message: "No extraction found for this file" });
      }

      res.json({
        success: true,
        extraction: extraction
      });
    } catch (error) {
      console.error('Get extraction error:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to get extraction" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
