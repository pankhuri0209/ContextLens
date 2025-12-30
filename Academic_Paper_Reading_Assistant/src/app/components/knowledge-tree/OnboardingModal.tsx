import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Sparkles, TreeDeciduous, CheckCircle2, Lightbulb } from 'lucide-react';

interface OnboardingModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: (buildFromExisting: boolean) => void;
  paperCount: number;
}

export function OnboardingModal({ open, onClose, onComplete, paperCount }: OnboardingModalProps) {
  const [step, setStep] = useState(0);
  const [buildOption, setBuildOption] = useState<'existing' | 'empty' | 'example'>('existing');
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleComplete = () => {
    if (dontShowAgain) {
      localStorage.setItem('knowledgeTreeOnboarding', 'true');
    }
    onComplete(buildOption === 'existing');
  };

  const features = [
    {
      icon: <TreeDeciduous className="w-6 h-6 text-green-600" />,
      title: 'Organizes by problem-solution logic',
      description: 'Automatically structures research by domains like Biology, Diagnosis, Treatment'
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-yellow-600" />,
      title: 'Answers What? Why? How? for each topic',
      description: 'Extracts key insights from papers to build comprehensive understanding'
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-blue-600" />,
      title: 'Identifies research gaps automatically',
      description: 'Spots missing pieces in your research domain'
    },
    {
      icon: <Sparkles className="w-6 h-6 text-purple-600" />,
      title: 'Generates literature reviews faster',
      description: 'Export structured reviews with citations in seconds'
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            🌳 Welcome to Your Knowledge Tree!
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Hero Image/Animation */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="text-6xl mb-4"
                >
                  🌳
                </motion.div>
                <p className="text-lg text-gray-700">
                  Your personal research map that grows as you read
                </p>
              </div>

              {/* What it does */}
              <div>
                <h3 className="font-semibold text-lg mb-4">What this does:</h3>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <div className="flex-shrink-0 mt-1">{feature.icon}</div>
                      <div>
                        <p className="font-medium text-gray-900">{feature.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* How it works */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-3">How it works:</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                      1
                    </span>
                    <p className="text-gray-700">
                      As you read papers, AI extracts key problems and solutions
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                      2
                    </span>
                    <p className="text-gray-700">
                      Tree grows automatically, organizing by domain (Biology, Diagnosis, Treatment...)
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                      3
                    </span>
                    <p className="text-gray-700">
                      Click nodes to see What/Why/How details and contributing papers
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                      4
                    </span>
                    <p className="text-gray-700">
                      Export to generate structured literature reviews
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={onClose}>
                  Skip
                </Button>
                <Button onClick={() => setStep(1)}>
                  Get Started
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div>
                <h3 className="font-semibold text-lg mb-4">Let's get started:</h3>
                
                <RadioGroup value={buildOption} onValueChange={(value: any) => setBuildOption(value)}>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 cursor-pointer transition-colors">
                      <RadioGroupItem value="existing" id="existing" className="mt-1" />
                      <Label htmlFor="existing" className="cursor-pointer flex-1">
                        <div className="font-medium text-gray-900">
                          Build tree from papers already in project
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Recommended - analyzes {paperCount} papers you have
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-start space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 cursor-pointer transition-colors">
                      <RadioGroupItem value="empty" id="empty" className="mt-1" />
                      <Label htmlFor="empty" className="cursor-pointer flex-1">
                        <div className="font-medium text-gray-900">
                          Start with empty tree, build as I read
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Tree will grow automatically with each paper you read
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-start space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 cursor-pointer transition-colors">
                      <RadioGroupItem value="example" id="example" className="mt-1" />
                      <Label htmlFor="example" className="cursor-pointer flex-1">
                        <div className="font-medium text-gray-900">
                          Show me an example tree first
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Explore a demo with sample Alzheimer's research
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center space-x-2 pt-4 border-t">
                <Checkbox
                  id="dontShow"
                  checked={dontShowAgain}
                  onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
                />
                <Label
                  htmlFor="dontShow"
                  className="text-sm text-gray-600 cursor-pointer"
                >
                  Don't show this again
                </Label>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep(0)}>
                  Back
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={onClose}>
                    Skip
                  </Button>
                  <Button onClick={handleComplete}>
                    Build Tree
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
