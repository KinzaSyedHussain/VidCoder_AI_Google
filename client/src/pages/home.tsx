import { useState } from "react";
import { Code2, HelpCircle, Settings } from "lucide-react";
import FileUpload from "@/components/file-upload";
import CodeEditor from "@/components/code-editor";
import WorkflowStatus from "@/components/workflow-status";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function Home() {
  const [currentStep, setCurrentStep] = useState<'upload' | 'extract' | 'improve' | 'download'>('upload');
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [extraction, setExtraction] = useState<any>(null);
  const [processingOptions, setProcessingOptions] = useState({
    removeComments: true,
    autoFormat: false,
    detectLanguage: true
  });
  const [contentType, setContentType] = useState<'auto' | 'code' | 'text'>('auto');

  const handleFileUploaded = (file: any) => {
    setUploadedFile(file);
    setCurrentStep('extract');
  };

  const handleCodeExtracted = (extractionData: any) => {
    setExtraction(extractionData);
    setCurrentStep('improve');
  };

  const handleCodeImproved = (improvedExtraction: any) => {
    setExtraction(improvedExtraction);
    setCurrentStep('download');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Code2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">AI Code Agent</h1>
                <p className="text-sm text-slate-500">Extract & Refine Code</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <HelpCircle className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Workflow Status */}
        <WorkflowStatus currentStep={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel */}
          <div className="space-y-6">
            {/* File Upload */}
            <FileUpload 
              onFileUploaded={handleFileUploaded}
              disabled={currentStep !== 'upload' && !uploadedFile}
            />

            {/* Extraction Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Extraction Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-2 block">Content Type</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['auto', 'code', 'text'] as const).map((type) => (
                      <Button
                        key={type}
                        variant={contentType === type ? "default" : "outline"}
                        size="sm"
                        className="capitalize"
                        onClick={() => setContentType(type)}
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-2 block">Processing Options</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="removeComments"
                        checked={processingOptions.removeComments}
                        onCheckedChange={(checked) => 
                          setProcessingOptions(prev => ({ ...prev, removeComments: checked as boolean }))
                        }
                      />
                      <Label htmlFor="removeComments" className="text-sm text-slate-600">Remove comments</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="autoFormat"
                        checked={processingOptions.autoFormat}
                        onCheckedChange={(checked) => 
                          setProcessingOptions(prev => ({ ...prev, autoFormat: checked as boolean }))
                        }
                      />
                      <Label htmlFor="autoFormat" className="text-sm text-slate-600">Auto-format code</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="detectLanguage"
                        checked={processingOptions.detectLanguage}
                        onCheckedChange={(checked) => 
                          setProcessingOptions(prev => ({ ...prev, detectLanguage: checked as boolean }))
                        }
                      />
                      <Label htmlFor="detectLanguage" className="text-sm text-slate-600">Detect language</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel */}
          <div className="space-y-6">
            <CodeEditor 
              uploadedFile={uploadedFile}
              extraction={extraction}
              currentStep={currentStep}
              onCodeExtracted={handleCodeExtracted}
              onCodeImproved={handleCodeImproved}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
