import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Slider } from '../components/ui/slider';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, FileText, X, Check } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function OnboardingPage() {
  const navigate = useNavigate();
  const { user, completeOnboarding } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [onboardingData, setOnboardingData] = useState({
    researchField: '',
    researchArea: '',
    researchTopics: [] as string[],
    currentStage: 'early-phd',
    firstProjectName: '',
    researchQuestion: '',
    projectGoal: 'literature-review',
    expectedPaperCount: 50,
  });

  const [topicInput, setTopicInput] = useState('');

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    navigate('/projects');
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await completeOnboarding(onboardingData);
      navigate('/projects');
    } catch (err) {
      console.error('Onboarding error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addTopic = () => {
    if (topicInput.trim() && !onboardingData.researchTopics.includes(topicInput.trim())) {
      setOnboardingData({
        ...onboardingData,
        researchTopics: [...onboardingData.researchTopics, topicInput.trim()],
      });
      setTopicInput('');
    }
  };

  const removeTopic = (topic: string) => {
    setOnboardingData({
      ...onboardingData,
      researchTopics: onboardingData.researchTopics.filter(t => t !== topic),
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return true; // Welcome screen, always can proceed
      case 2:
        return onboardingData.researchField !== '';
      case 3:
        return onboardingData.firstProjectName.trim() !== '';
      case 4:
        return true; // Upload is optional
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {/* Step 1: Welcome */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-xl border border-gray-200 shadow-lg p-8"
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-4">
                  👋 Welcome to PhD Reader, {user?.fullName?.split(' ')[0]}!
                </h1>
                <p className="text-gray-600 text-lg">
                  Let's set up your research workspace
                </p>
              </div>

              <div className="mb-8 flex justify-center">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1758708536050-e911f468ea83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600"
                  alt="Organized research workspace"
                  className="rounded-lg w-full max-w-md"
                />
              </div>

              <p className="text-center text-gray-600 mb-8">
                This will take about 2 minutes
              </p>

              <div className="flex gap-3">
                <Button onClick={handleNext} className="flex-1" size="lg">
                  Let's Get Started →
                </Button>
                <Button onClick={handleSkip} variant="ghost" size="lg">
                  Skip - I'll explore on my own
                </Button>
              </div>

              <div className="text-center mt-6">
                <ProgressIndicator current={1} total={4} />
              </div>
            </motion.div>
          )}

          {/* Step 2: Research Profile */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-xl border border-gray-200 shadow-lg p-8"
            >
              <h1 className="text-2xl font-bold mb-6">Tell Us About Your Research</h1>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="field">Primary Research Field *</Label>
                  <Select
                    value={onboardingData.researchField}
                    onValueChange={(value) => setOnboardingData({ ...onboardingData, researchField: value })}
                  >
                    <SelectTrigger id="field">
                      <SelectValue placeholder="Select your field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="computer-science">Computer Science</SelectItem>
                      <SelectItem value="biology">Biology</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="medicine">Medicine</SelectItem>
                      <SelectItem value="psychology">Psychology</SelectItem>
                      <SelectItem value="economics">Economics</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="area">Specific Area (optional)</Label>
                  <Input
                    id="area"
                    value={onboardingData.researchArea}
                    onChange={(e) => setOnboardingData({ ...onboardingData, researchArea: e.target.value })}
                    placeholder="e.g., Machine Learning, Molecular Biology"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Research Topics (optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      value={topicInput}
                      onChange={(e) => setTopicInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTopic())}
                      placeholder="Add topic and press Enter"
                    />
                    <Button type="button" onClick={addTopic} variant="outline">
                      Add
                    </Button>
                  </div>
                  {onboardingData.researchTopics.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {onboardingData.researchTopics.map((topic) => (
                        <div
                          key={topic}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                        >
                          {topic}
                          <button
                            onClick={() => removeTopic(topic)}
                            className="hover:text-blue-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label>Current Stage:</Label>
                  <RadioGroup
                    value={onboardingData.currentStage}
                    onValueChange={(value) => setOnboardingData({ ...onboardingData, currentStage: value })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="early-phd" id="early" />
                      <Label htmlFor="early" className="font-normal cursor-pointer">Early PhD (Year 1-2)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mid-phd" id="mid" />
                      <Label htmlFor="mid" className="font-normal cursor-pointer">Mid PhD (Year 3-4)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="late-phd" id="late" />
                      <Label htmlFor="late" className="font-normal cursor-pointer">Late PhD (Year 5+)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="postdoc" id="postdoc-stage" />
                      <Label htmlFor="postdoc-stage" className="font-normal cursor-pointer">Postdoc</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <Button onClick={handleBack} variant="outline" className="w-32">
                  ← Back
                </Button>
                <Button onClick={handleNext} className="flex-1" disabled={!canProceed()}>
                  Next →
                </Button>
              </div>

              <div className="text-center mt-6">
                <ProgressIndicator current={2} total={4} />
              </div>
            </motion.div>
          )}

          {/* Step 3: First Project */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-xl border border-gray-200 shadow-lg p-8"
            >
              <h1 className="text-2xl font-bold mb-6">Create Your First Project</h1>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name *</Label>
                  <Input
                    id="projectName"
                    value={onboardingData.firstProjectName}
                    onChange={(e) => setOnboardingData({ ...onboardingData, firstProjectName: e.target.value })}
                    placeholder="e.g., Thesis Chapter 1: Literature Review"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="question">Research Question (optional)</Label>
                  <Textarea
                    id="question"
                    value={onboardingData.researchQuestion}
                    onChange={(e) => setOnboardingData({ ...onboardingData, researchQuestion: e.target.value })}
                    placeholder="What problem are you trying to solve?"
                    rows={3}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Project Goal:</Label>
                  <RadioGroup
                    value={onboardingData.projectGoal}
                    onValueChange={(value) => setOnboardingData({ ...onboardingData, projectGoal: value })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="literature-review" id="lit-review" />
                      <Label htmlFor="lit-review" className="font-normal cursor-pointer">Literature review</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="understanding" id="understanding" />
                      <Label htmlFor="understanding" className="font-normal cursor-pointer">Understanding a specific topic</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="methodology" id="methodology" />
                      <Label htmlFor="methodology" className="font-normal cursor-pointer">Methodology comparison</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="writing" id="writing" />
                      <Label htmlFor="writing" className="font-normal cursor-pointer">Writing a paper</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Expected paper count: ~{onboardingData.expectedPaperCount} papers</Label>
                  <Slider
                    value={[onboardingData.expectedPaperCount]}
                    onValueChange={([value]) => setOnboardingData({ ...onboardingData, expectedPaperCount: value })}
                    min={10}
                    max={200}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>10</span>
                    <span>200</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <Button onClick={handleBack} variant="outline" className="w-32">
                  ← Back
                </Button>
                <Button onClick={handleNext} className="flex-1" disabled={!canProceed()}>
                  Create Project →
                </Button>
              </div>

              <div className="text-center mt-6">
                <ProgressIndicator current={3} total={4} />
              </div>
            </motion.div>
          )}

          {/* Step 4: Upload Papers */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-xl border border-gray-200 shadow-lg p-8"
            >
              <h1 className="text-2xl font-bold mb-6">Add Your First Papers</h1>
              <p className="text-gray-600 mb-6">
                Get started by uploading a few papers you're already reading:
              </p>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-[#2563EB] hover:bg-blue-50 transition-colors cursor-pointer group">
                <Upload className="w-12 h-12 text-gray-400 group-hover:text-[#2563EB] mx-auto mb-4" />
                <p className="text-gray-700 font-medium mb-2">
                  📄 Drag & Drop PDFs Here
                </p>
                <p className="text-gray-500 text-sm mb-4">
                  or click to browse
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <button className="text-[#2563EB] hover:underline block mx-auto">
                    • Add by DOI
                  </button>
                  <button className="text-[#2563EB] hover:underline block mx-auto">
                    • Import from Zotero
                  </button>
                  <button className="text-[#2563EB] hover:underline block mx-auto">
                    • Let AI suggest papers
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <Button onClick={handleBack} variant="outline" className="w-32">
                  ← Back
                </Button>
                <Button onClick={handleSkip} variant="ghost">
                  Skip - I'll add papers later
                </Button>
                <Button onClick={handleComplete} className="flex-1" disabled={loading}>
                  {loading ? 'Setting up...' : 'Finish Setup →'}
                </Button>
              </div>

              <div className="text-center mt-6">
                <ProgressIndicator current={4} total={4} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ProgressIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${
            i + 1 === current
              ? 'bg-[#2563EB] w-8'
              : i + 1 < current
              ? 'bg-[#2563EB]'
              : 'bg-gray-300'
          } transition-all`}
        />
      ))}
      <span className="ml-2 text-sm text-gray-600">
        ({current} of {total})
      </span>
    </div>
  );
}
