#!/usr/bin/env node
/**
 * Compatibility shim to redirect to Python Flask server
 * This file ensures the workflow can start properly
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔄 Redirecting to Python Flask server...');

// Start the Python Flask server
const pythonProcess = spawn('python', ['run.py'], {
  cwd: join(__dirname, '..'),
  stdio: 'inherit'
});

pythonProcess.on('error', (error) => {
  console.error('Failed to start Python server:', error);
  process.exit(1);
});

pythonProcess.on('close', (code) => {
  console.log(`Python server exited with code ${code}`);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down...');
  pythonProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  pythonProcess.kill('SIGTERM');
});