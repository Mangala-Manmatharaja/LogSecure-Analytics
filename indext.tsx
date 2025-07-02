import { useState, useCallback, useMemo } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { LogViewer } from '@/components/LogViewer';
import { SearchBar } from '@/components/SearchBar';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { SuspiciousKeywords } from '@/components/SuspiciousKeywords';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Search, AlertTriangle, BarChart3, Shield, TrendingUp } from 'lucide-react';

export interface LogEntry {
  id: number;
  timestamp?: string;
  level?: string;
  message: string;
  isSuspicious: boolean;
  matchedKeywords: string[];
  rawLine: string;
}

const Index = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [suspiciousKeywords, setSuspiciousKeywords] = useState<string[]>([
    'error', 'fail', 'denied', 'unauthorized', 'exception', 'critical', 'fatal', 'timeout'
  ]);
  const [activeTab, setActiveTab] = useState('logs');

  const filteredLogs = useMemo(() => {
    if (!searchTerm) return logs;
    const term = searchTerm.toLowerCase();
    return logs.filter(log => 
      log.message.toLowerCase().includes(term) ||
      log.level?.toLowerCase().includes(term) ||
      log.timestamp?.toLowerCase().includes(term)
    );
  }, [logs, searchTerm]);

  const stats = useMemo(() => {
    const total = logs.length;
    const suspicious = logs.filter(log => log.isSuspicious).length;
    const keywordCounts = suspiciousKeywords.reduce((acc, keyword) => {
      acc[keyword] = logs.filter(log => 
        log.matchedKeywords.includes(keyword)
      ).length;
      return acc;
    }, {} as Record<string, number>);

    return { total, suspicious, keywordCounts };
  }, [logs, suspiciousKeywords]);

  const handleFileProcessed = useCallback((processedLogs: LogEntry[], filename: string) => {
    setLogs(processedLogs);
    setFileName(filename);
    setActiveTab('logs');
  }, []);

  const handleKeywordsUpdate = useCallback((newKeywords: string[]) => {
    setSuspiciousKeywords(newKeywords);
    // Re-analyze logs with new keywords
    setLogs(prevLogs => prevLogs.map(log => {
      const matchedKeywords = newKeywords.filter(keyword => 
        log.message.toLowerCase().includes(keyword.toLowerCase())
      );
      return {
        ...log,
        isSuspicious: matchedKeywords.length > 0,
        matchedKeywords
      };
    }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Professional Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl mb-6 shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            LogSecure Analytics
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Professional log file analysis platform with intelligent anomaly detection, 
            advanced search capabilities, and comprehensive security insights
          </p>
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center gap-2 text-slate-500">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">Real-time Analysis</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">Security Focused</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <FileText className="w-5 h-5" />
              <span className="text-sm font-medium">Multi-format Support</span>
            </div>
          </div>
        </div>

        {logs.length === 0 ? (
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-semibold text-slate-800">
                  Get Started with Log Analysis
                </CardTitle>
                <CardDescription className="text-lg text-slate-600">
                  Upload your log files to begin comprehensive security analysis and anomaly detection. 
                  Supports .txt, .log, and .csv formats with intelligent parsing.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <FileUpload 
                  onFileProcessed={handleFileProcessed}
                  suspiciousKeywords={suspiciousKeywords}
                />
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Analysis Summary Card */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-semibold text-slate-800 flex items-center gap-3">
                      <FileText className="text-blue-600" />
                      Analysis Dashboard
                    </CardTitle>
                    <CardDescription className="text-lg mt-2">File: {fileName}</CardDescription>
                  </div>
                  <div className="flex gap-4">
                    <Badge variant="outline" className="text-base px-4 py-2 bg-blue-50 text-blue-700 border-blue-200">
                      {stats.total.toLocaleString()} total entries
                    </Badge>
                    <Badge variant="destructive" className="text-base px-4 py-2">
                      {stats.suspicious.toLocaleString()} suspicious
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Professional Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 h-14 bg-white/80 backdrop-blur-sm border shadow-sm">
                <TabsTrigger value="logs" className="flex items-center gap-3 text-base font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  <FileText className="h-5 w-5" />
                  Log Entries
                </TabsTrigger>
                <TabsTrigger value="search" className="flex items-center gap-3 text-base font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  <Search className="h-5 w-5" />
                  Advanced Search
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-3 text-base font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  <BarChart3 className="h-5 w-5" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="keywords" className="flex items-center gap-3 text-base font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  <AlertTriangle className="h-5 w-5" />
                  Security Keywords
                </TabsTrigger>
              </TabsList>

              <TabsContent value="logs" className="mt-8">
                <LogViewer logs={logs} />
              </TabsContent>

              <TabsContent value="search" className="mt-8 space-y-6">
                <SearchBar 
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  resultCount={filteredLogs.length}
                  totalCount={logs.length}
                />
                <LogViewer logs={filteredLogs} searchTerm={searchTerm} />
              </TabsContent>

              <TabsContent value="analytics" className="mt-8">
                <AnalyticsDashboard logs={logs} stats={stats} />
              </TabsContent>

              <TabsContent value="keywords" className="mt-8">
                <SuspiciousKeywords 
                  keywords={suspiciousKeywords}
                  onKeywordsUpdate={handleKeywordsUpdate}
                  stats={stats.keywordCounts}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
