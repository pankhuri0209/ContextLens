import React, { useState } from 'react';
import { X, Upload, FileText, Check, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import type { PaperCategory } from '../../../data/projectData';
import { categoryConfig } from '../../../data/projectData';

interface UploadStep {
  file: File;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  progress: number;
  error?: string;
  metadata?: {
    title: string;
    authors: string[];
    year: number;
    venue: string;
    citationCount: number;
  };
  suggestedCategories?: PaperCategory[];
  relevanceScore?: number;
}

interface UploadPapersModalProps {
  projectId: string;
  projectName: string;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (papers: any[]) => void;
}

export function UploadPapersModal({ 
  projectId, 
  projectName,
  isOpen, 
  onClose,
  onComplete 
}: UploadPapersModalProps) {
  const [uploadState, setUploadState] = useState<'select' | 'uploading' | 'categorizing' | 'complete'>('select');
  const [uploads, setUploads] = useState<UploadStep[]>([]);
  const [currentCategorizationIndex, setCurrentCategorizationIndex] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<PaperCategory[]>([]);
  const [customTags, setCustomTags] = useState<string>('');

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setUploadState('uploading');
    
    const newUploads: UploadStep[] = files.map(file => ({
      file,
      status: 'uploading',
      progress: 0
    }));
    
    setUploads(newUploads);

    // Simulate upload and processing
    for (let i = 0; i < newUploads.length; i++) {
      // Upload simulation
      await simulateUpload(i);
      
      // Processing simulation
      await simulateProcessing(i);
    }

    // Move to categorization step
    setUploadState('categorizing');
  };

  const simulateUpload = async (index: number) => {
    return new Promise<void>((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploads(prev => prev.map((u, i) => 
            i === index ? { ...u, progress: 100, status: 'processing' } : u
          ));
          resolve();
        } else {
          setUploads(prev => prev.map((u, i) => 
            i === index ? { ...u, progress } : u
          ));
        }
      }, 200);
    });
  };

  const simulateProcessing = async (index: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // Mock extracted metadata
        const mockMetadata = {
          title: uploads[index].file.name.replace('.pdf', ''),
          authors: ['Author, A.', 'Researcher, B.', 'et al.'],
          year: 2023,
          venue: 'NeurIPS',
          citationCount: Math.floor(Math.random() * 1000)
        };

        const mockSuggestedCategories: PaperCategory[] = ['methods', 'knowledge'];
        const mockRelevanceScore = Math.floor(Math.random() * 20) + 80;

        setUploads(prev => prev.map((u, i) => 
          i === index ? { 
            ...u, 
            status: 'ready',
            metadata: mockMetadata,
            suggestedCategories: mockSuggestedCategories,
            relevanceScore: mockRelevanceScore
          } : u
        ));
        resolve();
      }, 2000);
    });
  };

  const handleCategorizePaper = (applyToAll: boolean) => {
    if (applyToAll) {
      // Apply categories to all papers and complete
      setUploadState('complete');
    } else {
      // Move to next paper
      if (currentCategorizationIndex < uploads.length - 1) {
        setCurrentCategorizationIndex(prev => prev + 1);
        setSelectedCategories([]);
        setCustomTags('');
      } else {
        setUploadState('complete');
      }
    }
  };

  const handleComplete = () => {
    onComplete(uploads);
    onClose();
    // Reset state
    setUploadState('select');
    setUploads([]);
    setCurrentCategorizationIndex(0);
  };

  if (!isOpen) return null;

  const currentUpload = uploads[currentCategorizationIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">
                {uploadState === 'select' && 'Upload Research Papers'}
                {uploadState === 'uploading' && 'Processing Papers'}
                {uploadState === 'categorizing' && 'Categorize Papers'}
                {uploadState === 'complete' && 'Upload Complete!'}
              </h2>
              <p className="text-sm text-gray-600">Project: {projectName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Step 1: File Selection */}
            {uploadState === 'select' && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Drag & Drop PDFs Here</h3>
                  <p className="text-sm text-gray-600 mb-4">or click to browse</p>
                  <input
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button as="span" className="cursor-pointer">
                      Browse Files
                    </Button>
                  </label>
                  <p className="text-xs text-gray-500 mt-4">
                    Supports: PDF, up to 50MB each • Multiple files allowed
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Upload Progress */}
            {uploadState === 'uploading' && (
              <div className="space-y-4">
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    Processing {uploads.filter(u => u.status !== 'uploading').length} of {uploads.length} papers...
                  </p>
                </div>

                {uploads.map((upload, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-2">
                      <FileText className="w-5 h-5 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{upload.file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(upload.file.size / (1024 * 1024)).toFixed(1)} MB
                        </p>
                      </div>
                      <div>
                        {upload.status === 'uploading' && (
                          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                        )}
                        {upload.status === 'processing' && (
                          <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                        )}
                        {upload.status === 'ready' && (
                          <Check className="w-5 h-5 text-green-600" />
                        )}
                        {upload.status === 'error' && (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                    </div>

                    {/* Progress */}
                    {upload.status === 'uploading' && (
                      <div className="space-y-1">
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${upload.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-600">Uploading... {Math.floor(upload.progress)}%</p>
                      </div>
                    )}

                    {upload.status === 'processing' && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            {upload.metadata ? <Check className="w-3 h-3 text-green-600" /> : <Loader2 className="w-3 h-3 animate-spin" />}
                            <span>Extracted metadata</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Parsing citations...</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {upload.status === 'ready' && (
                      <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
                        <Check className="w-3 h-3" />
                        <span>Ready to categorize</span>
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex items-center justify-between pt-4">
                  <Button variant="outline" onClick={onClose}>
                    Cancel Upload
                  </Button>
                  {uploads.every(u => u.status === 'ready') && (
                    <Button onClick={() => setUploadState('categorizing')}>
                      Continue to Categorization
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Categorization */}
            {uploadState === 'categorizing' && currentUpload && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      Paper {currentCategorizationIndex + 1} of {uploads.length}
                    </span>
                    <span className="text-xs text-gray-500">{currentUpload.file.name}</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all"
                      style={{ width: `${((currentCategorizationIndex + 1) / uploads.length) * 100}%` }}
                    />
                  </div>
                </div>

                {currentUpload.metadata && (
                  <>
                    <div>
                      <h3 className="text-lg font-bold mb-2">{currentUpload.metadata.title}</h3>
                      <p className="text-sm text-gray-600">
                        {currentUpload.metadata.authors.join(', ')} • {currentUpload.metadata.venue} {currentUpload.metadata.year}
                      </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm font-semibold text-blue-900 mb-2">AI Suggests:</p>
                      <div className="flex gap-2">
                        {currentUpload.suggestedCategories?.map(cat => {
                          const config = categoryConfig[cat];
                          return (
                            <span
                              key={cat}
                              className="px-3 py-1 rounded-full text-sm font-medium"
                              style={{
                                backgroundColor: `${config.color}20`,
                                color: config.color
                              }}
                            >
                              {config.icon} {config.label}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Select categories (multiple allowed):
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {(Object.keys(categoryConfig) as PaperCategory[]).map(key => {
                          if (key === 'uncategorized') return null;
                          const config = categoryConfig[key];
                          const isSelected = selectedCategories.includes(key) || 
                            (selectedCategories.length === 0 && currentUpload.suggestedCategories?.includes(key));
                          
                          return (
                            <button
                              key={key}
                              onClick={() => {
                                if (selectedCategories.includes(key)) {
                                  setSelectedCategories(prev => prev.filter(c => c !== key));
                                } else {
                                  setSelectedCategories(prev => [...prev, key]);
                                }
                              }}
                              className={`p-3 rounded-lg border-2 transition-all text-left ${
                                isSelected
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">{config.icon}</span>
                                <span className="font-semibold text-sm">{config.label}</span>
                              </div>
                              <p className="text-xs text-gray-600">{config.description}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Relevance to "{projectName}":
                      </label>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-yellow-400 to-green-500"
                              style={{ width: `${currentUpload.relevanceScore}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-lg font-bold text-blue-600 min-w-[60px]">
                          {currentUpload.relevanceScore}/100
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        AI detected high relevance based on project research areas and existing papers
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Custom tags (optional):
                      </label>
                      <Input
                        value={customTags}
                        onChange={(e) => setCustomTags(e.target.value)}
                        placeholder="e.g., transformers, attention, important"
                      />
                      <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
                    </div>

                    <div className="flex items-center gap-3 pt-4">
                      <Button variant="outline" onClick={() => handleCategorizePaper(false)}>
                        Skip
                      </Button>
                      {currentCategorizationIndex < uploads.length - 1 ? (
                        <>
                          <Button onClick={() => handleCategorizePaper(false)} className="flex-1">
                            Next →
                          </Button>
                          <Button onClick={() => handleCategorizePaper(true)} variant="outline">
                            Apply to All {uploads.length} Papers
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => handleCategorizePaper(false)} className="flex-1">
                          Finish
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Step 4: Complete */}
            {uploadState === 'complete' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  ✓ {uploads.length} Paper{uploads.length > 1 ? 's' : ''} Added Successfully!
                </h3>
                <p className="text-gray-600 mb-6">
                  Papers added to: <span className="font-semibold">{projectName}</span>
                </p>

                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
                  {uploads.slice(0, 3).map((upload, index) => (
                    <div key={index} className="flex items-center gap-2 py-2">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm text-gray-800 truncate">{upload.metadata?.title || upload.file.name}</span>
                    </div>
                  ))}
                  {uploads.length > 3 && (
                    <p className="text-sm text-gray-600 text-center pt-2">
                      + {uploads.length - 3} more
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-700">What's next?</p>
                  <div className="flex flex-col gap-2">
                    <Button onClick={handleComplete} className="w-full">
                      View in Papers Library
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setUploadState('select');
                        setUploads([]);
                        setCurrentCategorizationIndex(0);
                      }}
                      className="w-full"
                    >
                      Add More Papers
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
