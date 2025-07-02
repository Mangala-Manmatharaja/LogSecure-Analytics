import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { LogEntry } from '@/pages/Index';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileProcessed: (logs: LogEntry[], fileName: string) => void;
  suspiciousKeywords: string[];
}

export const FileUpload = ({ onFileProcessed, suspiciousKeywords }: FileUploadProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const parseLogLine = (line: string, index: number): LogEntry => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      return {
        id: index,
        message: '',
        isSuspicious: false,
        matchedKeywords: [],
        rawLine: line
      };
    }

    // Try to extract timestamp (common patterns)
    let timestamp: string | undefined;
    let level: string | undefined;
    let message = trimmedLine;

    // Pattern for timestamp at start (YYYY-MM-DD HH:MM:SS or similar)
    const timestampMatch = trimmedLine.match(/^(\d{4}-\d{2}-\d{2}[\s\T]\d{2}:\d{2}:\d{2}(?:\.\d{3})?)/);
    if (timestampMatch) {
      timestamp = timestampMatch[1];
      message = trimmedLine.substring(timestampMatch[0].length).trim();
    }

    // Pattern for log level (ERROR, WARN, INFO, DEBUG, etc.)
    const levelMatch = message.match(/\b(ERROR|WARN|WARNING|INFO|DEBUG|TRACE|FATAL|CRITICAL)\b/i);
    if (levelMatch) {
      level = levelMatch[1].toUpperCase();
    }

    // Check for suspicious keywords
    const matchedKeywords = suspiciousKeywords.filter(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );

    return {
      id: index,
      timestamp,
      level,
      message: message,
      isSuspicious: matchedKeywords.length > 0,
      matchedKeywords,
      rawLine: line
    };
  };

  const parseCsvLine = (line: string, index: number, headers?: string[]): LogEntry => {
    const columns = line.split(',').map(col => col.trim().replace(/^"|"$/g, ''));
    
    let timestamp: string | undefined;
    let level: string | undefined;
    let message = '';

    if (headers) {
      // Map columns based on headers
      headers.forEach((header, i) => {
        const value = columns[i] || '';
        const lowerHeader = header.toLowerCase();
        
        if (lowerHeader.includes('time') || lowerHeader.includes('date')) {
          timestamp = value;
        } else if (lowerHeader.includes('level') || lowerHeader.includes('severity')) {
          level = value.toUpperCase();
        } else if (lowerHeader.includes('message') || lowerHeader.includes('msg') || lowerHeader.includes('text')) {
          message = value;
        }
      });
    } else {
      // Assume first few columns might be timestamp, level, message
      if (columns.length >= 3) {
        timestamp = columns[0];
        level = columns[1].toUpperCase();
        message = columns.slice(2).join(' ');
      } else {
        message = columns.join(' ');
      }
    }

    // Check for suspicious keywords
    const matchedKeywords = suspiciousKeywords.filter(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );

    return {
      id: index,
      timestamp,
      level,
      message,
      isSuspicious: matchedKeywords.length > 0,
      matchedKeywords,
      rawLine: line
    };
  };

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ['.txt', '.log', '.csv'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!allowedTypes.includes(fileExtension)) {
      toast({
        title: "Unsupported file type",
        description: "Please upload a .txt, .log, or .csv file.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const text = await file.text();
      const lines = text.split('\n');
      const totalLines = lines.length;
      
      if (totalLines === 0) {
        throw new Error('File is empty');
      }

      const logs: LogEntry[] = [];
      let headers: string[] | undefined;

      // For CSV files, first line might be headers
      if (fileExtension === '.csv' && lines.length > 1) {
        const firstLine = lines[0].trim();
        if (firstLine.toLowerCase().includes('time') || 
            firstLine.toLowerCase().includes('level') || 
            firstLine.toLowerCase().includes('message')) {
          headers = firstLine.split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        }
      }

      const startIndex = headers ? 1 : 0;
      
      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim()) {
          const logEntry = fileExtension === '.csv' 
            ? parseCsvLine(line, i, headers)
            : parseLogLine(line, i);
          logs.push(logEntry);
        }
        
        // Update progress
        if (i % 100 === 0) {
          setProgress((i / totalLines) * 100);
        }
      }

      setProgress(100);
      onFileProcessed(logs, file.name);
      
      toast({
        title: "File processed successfully",
        description: `Parsed ${logs.length} log entries from ${file.name}`,
      });

    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Error processing file",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
      // Reset input
      event.target.value = '';
    }
  }, [onFileProcessed, suspiciousKeywords, toast]);

  return (
    <div className="space-y-4">
      <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-blue-50 rounded-full">
              <Upload className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Upload Log File</h3>
              <p className="text-gray-600 mb-4">
                Select a .txt, .log, or .csv file to analyze
              </p>
            </div>
            <div className="relative">
              <input
                type="file"
                accept=".txt,.log,.csv"
                onChange={handleFileUpload}
                disabled={isProcessing}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <Button disabled={isProcessing} className="px-8">
                <FileText className="h-4 w-4 mr-2" />
                {isProcessing ? 'Processing...' : 'Choose File'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {isProcessing && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 animate-spin" />
              <div className="flex-1">
                <p className="text-sm font-medium">Processing file...</p>
                <Progress value={progress} className="mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
