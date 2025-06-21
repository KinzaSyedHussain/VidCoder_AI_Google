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
    fileSize: 200 * 1024 * 1024, // 200MB limit
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

// PLACEHOLDER AI PROCESSING FUNCTIONS - Will be replaced with Google Cloud ADK integration
function simulateCodeExtraction(file: any): string {
  // Enhanced placeholder logic based on file type with intentional errors for improvement demo
  const mockCodes = {
    // For image and PDF files - return Python code with intentional syntax error
    'application/pdf': `# Extracted from PDF document
from flask import Flask, request, jsonify
import os

app = Flask(__name__)

@app.route('/api/upload', methods=['POST'])
def upload_file()  # Missing colon - intentional error for improvement demo
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    # Save uploaded file
    filename = secure_filename(file.filename)
    file.save(os.path.join('uploads', filename))
    
    return jsonify({'message': 'File uploaded successfully', 'filename': filename})

if __name__ == '__main__':
    app.run(debug=True)`,
    
    'image/jpeg': `# Extracted from code screenshot
import pandas as pd
import matplotlib.pyplot as plt

def analyze_data(data_file_path):
    # Load the dataset
    df = pd.read_csv(data_file_path
    
    # Basic statistics
    print("Dataset shape:", df.shape)
    print("\\nColumn info:")
    print(df.info())
    
    # Missing values check
    missing_values = df.isnull().sum()
    print("\\nMissing values:", missing_values)
    
    return df

def create_visualization(dataframe):
    plt.figure(figsize=(10, 6))
    dataframe.hist(bins=20)
    plt.tight_layout()
    plt.show()`,
    
    'image/png': `# Extracted from PNG screenshot
def process_user_data(user_input_data):
    """Process and validate user input data"""
    processed_results = []
    
    for item in user_input_data:
        if item.get('status') == 'active':
            # Process active items
            processed_item = {
                'id': item['id'],
                'name': item['name'],
                'processed_at': datetime.now()
            }
            processed_results.append(processed_item
    
    return processed_results

def generate_report(data):
    """Generate summary report from processed data"""
    total_items = len(data)
    return f"Processed {total_items} items successfully"`,
    
    // For video files - return JavaScript code with improvement opportunities
    'video/mp4': `// Extracted from coding tutorial video
import React, { useState, useEffect } from 'react';

const UserDashboardComponentWithVeryLongVariableNames = () => {
  const [userDataFromAPICallThatIsVeryLong, setUserDataFromAPICallThatIsVeryLong] = useState([]);
  const [isLoadingStateForAPICallToBackend, setIsLoadingStateForAPICallToBackend] = useState(false);

  useEffect(() => {
    fetchUserDataFromBackendAPIEndpoint();
  }, []);

  const fetchUserDataFromBackendAPIEndpoint = async () => {
    setIsLoadingStateForAPICallToBackend(true);
    try {
      const responseFromBackendAPICall = await fetch('/api/users');
      const dataFromAPIResponse = await responseFromBackendAPICall.json();
      setUserDataFromAPICallThatIsVeryLong(dataFromAPIResponse);
    } catch (error) {
      console.log('Error fetching data');
    }
    setIsLoadingStateForAPICallToBackend(false);
  };

  return (
    <div>
      <h2>User Dashboard</h2>
      {isLoadingStateForAPICallToBackend ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {userDataFromAPICallThatIsVeryLong.map(user => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};`,

    'video/avi': `// Extracted from video tutorial
function processOrderData(orders) {
    let totalRevenue = 0;
    let processedOrders = [];
    
    for (let i = 0; i < orders.length; i++) {
        if (orders[i].status === 'completed') {
            totalRevenue += orders[i].amount;
            processedOrders.push({
                orderId: orders[i].id,
                customerName: orders[i].customer.firstName + ' ' + orders[i].customer.lastName,
                orderTotal: orders[i].amount,
                processedDate: new Date().toISOString()
            });
        }
    }
    
    return {
        totalRevenue: totalRevenue,
        processedCount: processedOrders.length,
        orders: processedOrders
    };
}`,

    'video/quicktime': `// Extracted from QuickTime screen recording
const apiEndpointForDataRetrieval = 'https://api.example.com/data';

async function retrieveAndProcessDataFromAPI() {
    const responseFromHTTPRequest = await fetch(apiEndpointForDataRetrieval);
    const jsonDataFromAPIResponse = await responseFromHTTPRequest.json();
    
    const processedDataArrayFromAPICall = jsonDataFromAPIResponse.map(itemFromAPIResponse => {
        return {
            id: itemFromAPIResponse.id,
            title: itemFromAPIResponse.title,
            description: itemFromAPIResponse.description
        };
    });
    
    return processedDataArrayFromAPICall;
}`
  };

  // Return appropriate mock code based on file type, fallback to Python with error
  return mockCodes[file.mimetype as keyof typeof mockCodes] || `# Extracted code from unknown file type
def process_file(file_path):
    """Basic file processing function"""
    with open(file_path, 'r') as f
        content = f.read()
        return content.strip()

def main():
    result = process_file('input.txt')
    print(f"Processed: {result}")`;
}

// PLACEHOLDER CODE IMPROVEMENT - Will be replaced with Google Cloud ADK integration
function simulateCodeImprovement(originalCode: string): string {
  // Enhanced placeholder logic to fix specific errors and improve code quality
  
  // Fix Python syntax errors (missing colons, parentheses)
  if (originalCode.includes('def ') && originalCode.includes('# Extracted from PDF') || originalCode.includes('# Extracted from code screenshot') || originalCode.includes('# Extracted from PNG screenshot')) {
    return originalCode
      // Fix missing colon after function definition
      .replace(/def (\w+)\([^)]*\)\s*(?!:)/g, 'def $1():')
      // Fix missing closing parenthesis in read_csv
      .replace(/pd\.read_csv\([^)]+(?!\))/g, match => match + ')')
      // Fix missing closing parenthesis in append calls
      .replace(/\.append\([^)]+(?!\))/g, match => match + ')')
      // Fix missing closing parenthesis in open calls
      .replace(/with open\([^)]+(?!\))/g, match => match + ')')
      // Add proper imports if missing
      .replace(/^(# Extracted from)/m, `$1
from datetime import datetime
from werkzeug.utils import secure_filename

`)
      // Add comments for clarity
      .replace(/(def \w+\([^)]*\):)/g, '$1\n    """Improved function with proper error handling"""');
  }
  
  // Improve JavaScript code (shorten variable names, add comments)
  if (originalCode.includes('//') || originalCode.includes('const ') || originalCode.includes('function ')) {
    return originalCode
      // Shorten long variable names
      .replace(/userDataFromAPICallThatIsVeryLong/g, 'userData')
      .replace(/isLoadingStateForAPICallToBackend/g, 'isLoading')
      .replace(/UserDashboardComponentWithVeryLongVariableNames/g, 'UserDashboard')
      .replace(/fetchUserDataFromBackendAPIEndpoint/g, 'fetchUserData')
      .replace(/responseFromBackendAPICall/g, 'response')
      .replace(/dataFromAPIResponse/g, 'data')
      .replace(/responseFromHTTPRequest/g, 'response')
      .replace(/jsonDataFromAPIResponse/g, 'jsonData')
      .replace(/processedDataArrayFromAPICall/g, 'processedData')
      .replace(/itemFromAPIResponse/g, 'item')
      .replace(/apiEndpointForDataRetrieval/g, 'API_ENDPOINT')
      // Add helpful comments
      .replace(/(\/\/ Extracted from.*)/g, `$1
// Improved version with better variable names and error handling

`)
      // Improve error handling
      .replace(/console\.log\('Error fetching data'\);/g, `console.error('Failed to fetch user data:', error);`)
      // Add proper error handling to fetch calls
      .replace(/(const response = await fetch\([^)]+\);)/g, `$1
      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`);
      }`);
  }
  
  // Fallback improvement for any other code
  return `// IMPROVED CODE - Enhanced with best practices and error handling

${originalCode}

/* 
 * Improvements made:
 * - Fixed syntax errors
 * - Added proper error handling
 * - Improved variable naming
 * - Added documentation
 */`;
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
