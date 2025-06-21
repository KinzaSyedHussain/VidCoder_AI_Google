import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Code2, Copy, Download, ScanText, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface CodeEditorProps {
  uploadedFile: any;
  extraction: any;
  currentStep: 'upload' | 'extract' | 'improve' | 'download';
  onCodeExtracted: (extraction: any) => void;
  onCodeImproved: (extraction: any) => void;
}

export default function CodeEditor({ 
  uploadedFile, 
  extraction, 
  currentStep, 
  onCodeExtracted, 
  onCodeImproved 
}: CodeEditorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("auto");
  const { toast } = useToast();

  const extractMutation = useMutation({
    mutationFn: async (fileId: number) => {
      const response = await apiRequest('POST', `/api/extract/${fileId}`);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Code extracted successfully!",
        description: "Your code is now ready for improvement."
      });
      onCodeExtracted(data.extraction);
    },
    onError: (error) => {
      toast({
        title: "Extraction failed",
        description: error instanceof Error ? error.message : "Failed to extract code",
        variant: "destructive"
      });
    }
  });

  const improveMutation = useMutation({
    mutationFn: async (extractionId: number) => {
      const response = await apiRequest('POST', `/api/improve/${extractionId}`);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Code improved successfully!",
        description: "Your code has been enhanced with best practices."
      });
      onCodeImproved(data.extraction);
    },
    onError: (error) => {
      toast({
        title: "Improvement failed",
        description: error instanceof Error ? error.message : "Failed to improve code",
        variant: "destructive"
      });
    }
  });

  const handleExtractCode = () => {
    if (uploadedFile) {
      extractMutation.mutate(uploadedFile.id);
    }
  };

  const handleImproveCode = () => {
    if (extraction) {
      improveMutation.mutate(extraction.id);
    }
  };

  const handleCopyCode = async () => {
    const codeText = extraction?.improvedCode || extraction?.extractedCode;
    if (codeText) {
      try {
        await navigator.clipboard.writeText(codeText);
        toast({
          title: "Code copied to clipboard!",
          description: "The code has been copied successfully."
        });
      } catch (error) {
        toast({
          title: "Copy failed",
          description: "Failed to copy code to clipboard",
          variant: "destructive"
        });
      }
    }
  };

  const handleDownloadCode = () => {
    const codeText = extraction?.improvedCode || extraction?.extractedCode;
    if (codeText) {
      const language = extraction?.language || 'txt';
      const extension = language === 'python' ? 'py' : language === 'javascript' ? 'js' : 'txt';
      
      const blob = new Blob([codeText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `extracted_code.${extension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Code downloaded successfully!",
        description: `File saved as extracted_code.${extension}`
      });
    }
  };

  const displayCode = extraction?.improvedCode || extraction?.extractedCode;
  const isProcessing = extractMutation.isPending || improveMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Code Editor */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-slate-200">
          <div className="flex items-center justify-between">
            <CardTitle>Code Output</CardTitle>
            <div className="flex items-center space-x-2">
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-detect</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="css">CSS</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyCode}
                disabled={!displayCode}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="relative min-h-96">
            {isProcessing ? (
              <div className="absolute inset-0 bg-slate-900 text-slate-300 font-mono text-sm flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 relative">
                    <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  </div>
                  <p className="text-lg font-medium">Processing...</p>
                  <p className="text-sm text-slate-400 mt-1">
                    {extractMutation.isPending ? 'Extracting code from your file' : 'Improving your code'}
                  </p>
                </div>
              </div>
            ) : displayCode ? (
              <div className="bg-slate-900 text-slate-100 font-mono text-sm overflow-auto">
                <div className="p-6">
                  <pre className="whitespace-pre-wrap">
                    <code>{displayCode}</code>
                  </pre>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 bg-slate-900 text-slate-300 font-mono text-sm overflow-auto">
                <div className="p-6">
                  <div className="flex items-center justify-center h-80 text-slate-500">
                    <div className="text-center">
                      <Code2 className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                      <p className="text-lg font-medium">No code extracted yet</p>
                      <p className="text-sm text-slate-400 mt-1">Upload a file and extract code to see results here</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Processing Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button
              onClick={handleExtractCode}
              disabled={!uploadedFile || currentStep === 'upload' || isProcessing}
              className="w-full"
              size="lg"
            >
              <ScanText className="w-5 h-5 mr-2" />
              {extractMutation.isPending ? 'Extracting...' : 'Extract Code'}
            </Button>
            
            <Button
              onClick={handleImproveCode}
              disabled={!extraction || currentStep === 'upload' || currentStep === 'extract' || isProcessing}
              className="w-full bg-secondary hover:bg-secondary/90"
              size="lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {improveMutation.isPending ? 'Improving...' : 'Improve Code'}
            </Button>
            
            <Button
              onClick={handleDownloadCode}
              disabled={!extraction || isProcessing}
              className="w-full bg-success hover:bg-success/90"
              size="lg"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Code
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
