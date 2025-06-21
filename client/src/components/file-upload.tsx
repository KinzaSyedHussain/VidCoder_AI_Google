import { useState, useRef } from "react";
import { UploadCloud, Video, Image, FileText, File, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface FileUploadProps {
  onFileUploaded: (file: any) => void;
  disabled?: boolean;
}

export default function FileUpload({ onFileUploaded, disabled }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowedTypes = [
      'video/mp4', 'video/avi', 'video/quicktime',
      'image/jpeg', 'image/png', 'image/gif',
      'application/pdf'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select a video, image, or PDF file.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (200MB limit)
    if (file.size > 200 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 200MB.",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      const result = await response.json();
      
      toast({
        title: "File uploaded successfully!",
        description: `${file.name} is ready for processing.`
      });

      onFileUploaded(result.file);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive"
      });
      setSelectedFile(null);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Content</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer group ${
            dragOver 
              ? 'border-primary bg-primary/5' 
              : disabled 
                ? 'border-slate-200 bg-slate-50 cursor-not-allowed' 
                : 'border-slate-300 hover:border-primary hover:bg-primary/5'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <div className="space-y-4">
            <div className={`w-16 h-16 mx-auto rounded-lg flex items-center justify-center transition-colors ${
              dragOver || !disabled 
                ? 'bg-primary/10' 
                : 'bg-slate-100'
            }`}>
              <UploadCloud className={`w-8 h-8 transition-colors ${
                dragOver 
                  ? 'text-primary' 
                  : disabled 
                    ? 'text-slate-400' 
                    : 'text-slate-400 group-hover:text-primary'
              }`} />
            </div>
            <div>
              <p className="text-lg font-medium text-slate-700">
                {uploading ? 'Uploading...' : 'Drop files here or click to browse'}
              </p>
              <p className="text-sm text-slate-500 mt-1">Support for video, images, and PDF files</p>
            </div>
            <div className="flex items-center justify-center space-x-6 text-sm text-slate-400">
              <div className="flex items-center space-x-1">
                <Video className="w-4 h-4" />
                <span>MP4, AVI</span>
              </div>
              <div className="flex items-center space-x-1">
                <Image className="w-4 h-4" />
                <span>PNG, JPG</span>
              </div>
              <div className="flex items-center space-x-1">
                <FileText className="w-4 h-4" />
                <span>PDF</span>
              </div>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="video/*,image/*,.pdf"
            onChange={handleFileInputChange}
            disabled={disabled || uploading}
          />
        </div>

        {selectedFile && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <File className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{selectedFile.name}</p>
                <p className="text-xs text-slate-500">{formatFileSize(selectedFile.size)}</p>
              </div>
              {!uploading && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  className="h-6 w-6"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
