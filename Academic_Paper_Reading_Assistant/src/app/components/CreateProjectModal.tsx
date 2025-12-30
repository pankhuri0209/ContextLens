import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Upload, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: (project: any) => void;
}

const researchAreas = [
  'Machine Learning',
  'Deep Learning',
  'Natural Language Processing',
  'Computer Vision',
  'Computational Biology',
  'Neuroscience',
  'Physics',
  'Chemistry',
  'Materials Science',
  'Mathematics',
];

const projectColors = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981',
  '#06B6D4', '#6366F1', '#EF4444', '#14B8A6', '#F97316'
];

export function CreateProjectModal({ open, onClose, onComplete }: CreateProjectModalProps) {
  const [step, setStep] = useState(1);
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    researchAreas: [] as string[],
    color: projectColors[0],
    startDate: new Date().toISOString().split('T')[0],
    targetCompletion: '',
    uploadedPapers: [] as File[],
    dois: '',
    researchQuestion: '',
    focusAreas: {
      methods: false,
      theory: false,
      empirical: false,
      review: false,
    },
    aiEnabled: true,
    aiFrequency: 'weekly' as 'weekly' | 'bi-weekly' | 'monthly',
    expectedPapers: [50],
  });

  const canProceed = () => {
    if (step === 1) {
      return projectData.name.trim().length > 0 && projectData.description.trim().length > 0;
    }
    return true;
  };

  const handleCreate = () => {
    onComplete(projectData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Create New Project</span>
            <div className="flex items-center gap-2 text-sm font-normal text-gray-600">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-[#2563EB] text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <div className={`w-16 h-0.5 ${step >= 2 ? 'bg-[#2563EB]' : 'bg-gray-200'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-[#2563EB] text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <div className={`w-16 h-0.5 ${step >= 3 ? 'bg-[#2563EB]' : 'bg-gray-200'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-[#2563EB] text-white' : 'bg-gray-200'}`}>
                3
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto py-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-medium mb-4">Basic Information</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Project Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="e.g., Transformer Models for Protein Folding"
                        value={projectData.name}
                        onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        placeholder="Describe your research project..."
                        rows={4}
                        maxLength={500}
                        value={projectData.description}
                        onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {projectData.description.length}/500 characters
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Research Areas (select all that apply)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {researchAreas.map((area) => (
                          <label
                            key={area}
                            className="flex items-center gap-2 p-2 rounded border hover:bg-gray-50 cursor-pointer"
                          >
                            <Checkbox
                              checked={projectData.researchAreas.includes(area)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setProjectData({
                                    ...projectData,
                                    researchAreas: [...projectData.researchAreas, area],
                                  });
                                } else {
                                  setProjectData({
                                    ...projectData,
                                    researchAreas: projectData.researchAreas.filter((a) => a !== area),
                                  });
                                }
                              }}
                            />
                            <span className="text-sm">{area}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Project Color
                      </label>
                      <div className="flex gap-2">
                        {projectColors.map((color) => (
                          <button
                            key={color}
                            className={`w-10 h-10 rounded-full border-2 transition-all ${
                              projectData.color === color ? 'border-gray-900 scale-110' : 'border-transparent'
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => setProjectData({ ...projectData, color })}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Start Date
                        </label>
                        <Input
                          type="date"
                          value={projectData.startDate}
                          onChange={(e) => setProjectData({ ...projectData, startDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Target Completion (optional)
                        </label>
                        <Input
                          type="date"
                          value={projectData.targetCompletion}
                          onChange={(e) => setProjectData({ ...projectData, targetCompletion: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-medium mb-4">Initial Setup</h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Upload Founding Papers
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#2563EB] transition-colors">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          Drag and drop PDFs here, or click to browse
                        </p>
                        <Button variant="outline" size="sm">
                          Select Files
                        </Button>
                      </div>
                      {projectData.uploadedPapers.length > 0 && (
                        <div className="mt-3 text-sm text-gray-600">
                          {projectData.uploadedPapers.length} files selected
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="px-2 bg-white text-sm text-gray-500">or</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Paste DOIs or arXiv IDs (one per line)
                      </label>
                      <Textarea
                        placeholder="10.1038/s41586-021-03819-2&#10;arXiv:2106.15928&#10;10.1038/nature14539"
                        rows={4}
                        value={projectData.dois}
                        onChange={(e) => setProjectData({ ...projectData, dois: e.target.value })}
                      />
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm">💡</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-blue-900 mb-1">
                            Import from Reference Managers
                          </div>
                          <p className="text-sm text-blue-700">
                            You can also import papers from Zotero or Mendeley in Step 3
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    AI Research Assistant
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Describe your research question
                      </label>
                      <Textarea
                        placeholder="What are you trying to discover or solve? The AI will use this to find relevant papers."
                        rows={4}
                        value={projectData.researchQuestion}
                        onChange={(e) => setProjectData({ ...projectData, researchQuestion: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-3">
                        Research focus areas
                      </label>
                      <div className="space-y-2">
                        {[
                          { key: 'methods', label: '🔬 Novel methods/techniques' },
                          { key: 'theory', label: '📚 Theoretical foundations' },
                          { key: 'empirical', label: '📊 Empirical studies' },
                          { key: 'review', label: '🔍 Review/survey papers' },
                        ].map(({ key, label }) => (
                          <label key={key} className="flex items-center gap-2 p-3 rounded border hover:bg-gray-50 cursor-pointer">
                            <Checkbox
                              checked={projectData.focusAreas[key as keyof typeof projectData.focusAreas]}
                              onCheckedChange={(checked) =>
                                setProjectData({
                                  ...projectData,
                                  focusAreas: {
                                    ...projectData.focusAreas,
                                    [key]: checked,
                                  },
                                })
                              }
                            />
                            <span>{label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <div className="font-medium text-sm text-purple-900">
                            Find related papers automatically
                          </div>
                          <p className="text-sm text-purple-700 mt-1">
                            AI will suggest papers based on your research focus
                          </p>
                        </div>
                        <Checkbox
                          checked={projectData.aiEnabled}
                          onCheckedChange={(checked) =>
                            setProjectData({ ...projectData, aiEnabled: checked as boolean })
                          }
                        />
                      </label>

                      {projectData.aiEnabled && (
                        <div className="mt-4 space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Suggestion frequency
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              {['weekly', 'bi-weekly', 'monthly'].map((freq) => (
                                <button
                                  key={freq}
                                  className={`px-3 py-2 rounded border text-sm ${
                                    projectData.aiFrequency === freq
                                      ? 'bg-purple-100 border-purple-300 text-purple-900'
                                      : 'bg-white border-gray-200 hover:bg-gray-50'
                                  }`}
                                  onClick={() =>
                                    setProjectData({
                                      ...projectData,
                                      aiFrequency: freq as 'weekly' | 'bi-weekly' | 'monthly',
                                    })
                                  }
                                >
                                  {freq.charAt(0).toUpperCase() + freq.slice(1)}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Expected paper volume: {projectData.expectedPapers[0]} papers
                            </label>
                            <Slider
                              value={projectData.expectedPapers}
                              onValueChange={(value) =>
                                setProjectData({ ...projectData, expectedPapers: value })
                              }
                              min={10}
                              max={200}
                              step={10}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <Button
            variant="ghost"
            onClick={() => {
              if (step === 1) {
                onClose();
              } else {
                setStep(step - 1);
              }
            }}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            {step === 1 ? 'Cancel' : 'Back'}
          </Button>

          <div className="flex gap-2">
            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)} disabled={!canProceed()}>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleCreate}>
                Create Project
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
