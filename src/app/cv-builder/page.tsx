'use client';

import { useState } from 'react';
import { useChat } from 'ai/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, Download, FileText, CheckCircle } from 'lucide-react';
import { nanoid } from 'nanoid';
import ReactMarkdown from 'react-markdown';

export default function CVBuilderPage() {
  const conversationId = useState(() => nanoid())[0];
  const [cvId, setCvId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/cv/chat',
    body: {
      conversationId,
    },
    onFinish: () => {
      // Update progress based on conversation stage
      setProgress(Math.min(progress + 15, 85));
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('conversationId', conversationId);

    try {
      setIsAnalyzing(true);
      const res = await fetch('/api/cv/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.id) {
        setCvId(data.id);
        setProgress(30);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeCV = async () => {
    if (!cvId) return;

    try {
      setIsAnalyzing(true);
      const res = await fetch('/api/cv/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvId }),
      });

      const analysis = await res.json();
      setProgress(100);
      return analysis;
    } catch (error) {
      console.error('Error analyzing CV:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadCV = () => {
    if (!cvId) return;
    window.open(`/api/cv/${cvId}/download`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI CV Builder
          </h1>
          <p className="text-gray-600 text-lg">
            Build your professional CV through a simple conversation
          </p>
        </div>

        {/* Progress Bar */}
        {progress > 0 && (
          <Card className="mb-6 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                CV Completion
              </span>
              <span className="text-sm text-gray-500">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex flex-col h-[600px]">
              {/* Messages */}
              <ScrollArea className="flex-1 pr-4 mb-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Let's build your CV!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Start by uploading your existing CV or begin a conversation
                    </p>
                    <div className="flex justify-center">
                      <label htmlFor="cv-upload">
                        <Button variant="outline" asChild>
                          <span className="cursor-pointer">
                            Upload Existing CV
                          </span>
                        </Button>
                        <input
                          id="cv-upload"
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            message.role === 'user'
                              ? 'bg-indigo-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <ReactMarkdown className="prose prose-sm max-w-none">
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg px-4 py-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>

              {/* Input */}
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  disabled={isLoading || isAnalyzing}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={isLoading || isAnalyzing || !input.trim()}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </form>
            </div>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={analyzeCV}
                  disabled={!cvId || isAnalyzing}
                >
                  {isAnalyzing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Analyze CV Quality
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={downloadCV}
                  disabled={!cvId || progress < 100}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download CV
                </Button>

                <label htmlFor="cv-upload-sidebar" className="block">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <span className="cursor-pointer">
                      <FileText className="w-4 h-4 mr-2" />
                      Upload CV
                    </span>
                  </Button>
                  <input
                    id="cv-upload-sidebar"
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Tips</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="text-indigo-600">•</span>
                  <span>Be specific about your achievements</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-600">•</span>
                  <span>Include metrics and numbers when possible</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-600">•</span>
                  <span>List all relevant technical skills</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-600">•</span>
                  <span>Keep descriptions concise and impactful</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
