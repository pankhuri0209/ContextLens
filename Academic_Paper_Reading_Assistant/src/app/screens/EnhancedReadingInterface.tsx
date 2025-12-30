import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, X, ChevronDown, ChevronUp, Plus, Star, Tag, 
  Move, Bookmark, FileText, Network, Share2, MessageSquare,
  Highlighter, ListPlus, FileStack, Users, BookmarkCheck,
  Zap, Clock, TrendingUp, BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { mockProjects, mockProjectPapers, categoryConfig } from '../../data/projectData';
import type { PaperCategory, ReadStatus, ProjectPaper } from '../../data/projectData';
import { mockCitations } from '../../data/mockData';
import type { Citation } from '../../data/mockData';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { CitationBadge } from '../components/CitationBadge';
import { ImportanceScore } from '../components/ImportanceScore';

interface ReadingSession {
  startTime: number;
  citationsExplored: number;
  notesAdded: number;
  highlightsAdded: number;
  initialProgress: number;
}

interface EnhancedReadingState {
  projectId: string;
  paperId: string;
  showTutorial: boolean;
  showSessionSummary: boolean;
  session: ReadingSession;
  currentProgress: number;
  lastScrollPosition: number;
}

export function EnhancedReadingInterface() {
  const { projectId, paperId } = useParams<{ projectId: string; paperId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [project, setProject] = useState(() => mockProjects.find(p => p.id === projectId));
  const [paper, setPaper] = useState<ProjectPaper | null>(() => {
    const proj = mockProjects.find(p => p.id === projectId);
    return proj?.papers.find(p => p.id === paperId) || null;
  });

  const [contextBarCollapsed, setContextBarCollapsed] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [citationPanelTab, setCitationPanelTab] = useState<'details' | 'related' | 'project'>('details');
  const [showTutorial, setShowTutorial] = useState(false);
  const [showSessionSummary, setShowSessionSummary] = useState(false);
  const [projectNotes, setProjectNotes] = useState(paper?.projectNotes?.[projectId || ''] || '');
  
  const [session, setSession] = useState<ReadingSession>({
    startTime: Date.now(),
    citationsExplored: 0,
    notesAdded: 0,
    highlightsAdded: 0,
    initialProgress: paper?.readProgress || 0
  });

  const [currentProgress, setCurrentProgress] = useState(paper?.readProgress || 0);
  const [relevanceScore, setRelevanceScore] = useState(paper?.relevanceScore || 0);
  const [selectedCategories, setSelectedCategories] = useState<PaperCategory[]>(paper?.categories || []);
  const [paperStatus, setPaperStatus] = useState<ReadStatus>(paper?.status || 'in-progress');
  const [customTags, setCustomTags] = useState<string[]>(paper?.customTags || []);
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState('');

  // Check if first time reading
  useEffect(() => {
    if (paper && paper.readProgress === 0 && paper.status === 'unread') {
      setShowTutorial(true);
    }
    
    // Simulate scroll to last position
    const resumePosition = location.state?.resumePosition;
    if (resumePosition) {
      setTimeout(() => {
        // Show toast notification
      }, 500);
    }
  }, [paper, location.state]);

  // Track session time
  useEffect(() => {
    const interval = setInterval(() => {
      // Auto-save progress
      const elapsed = Math.floor((Date.now() - session.startTime) / 1000);
      if (elapsed % 30 === 0) { // Save every 30 seconds
        // Simulate auto-save
        console.log('Auto-saved reading progress');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [session.startTime]);

  // Handle exit with session summary
  const handleExitReading = () => {
    const sessionDuration = Math.floor((Date.now() - session.startTime) / (1000 * 60)); // minutes
    
    if (sessionDuration >= 15) {
      setShowSessionSummary(true);
    } else {
      navigateBackToLibrary();
    }
  };

  const navigateBackToLibrary = () => {
    navigate(`/project/${projectId}`, { 
      state: { 
        scrollToLast: true,
        lastReadPaperId: paperId 
      } 
    });
  };

  const handleCitationClick = (citation: Citation) => {
    setSelectedCitation(citation);
    setSession(prev => ({
      ...prev,
      citationsExplored: prev.citationsExplored + 1
    }));
  };

  const toggleCategory = (category: PaperCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const addCustomTag = () => {
    if (newTag.trim() && !customTags.includes(newTag.trim())) {
      setCustomTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
      setShowTagInput(false);
    }
  };

  const removeTag = (tag: string) => {
    setCustomTags(prev => prev.filter(t => t !== tag));
  };

  const handleSaveSession = (markAs: ReadStatus) => {
    setPaperStatus(markAs);
    setShowSessionSummary(false);
    navigateBackToLibrary();
  };

  if (!project || !paper) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Paper not found</h2>
          <Button onClick={() => navigate('/projects')}>Back to Projects</Button>
        </div>
      </div>
    );
  }

  const relatedProjectPapers = project.papers.filter(p => 
    p.id !== paperId && p.categories.some(c => selectedCategories.includes(c))
  ).slice(0, 3);

  const sessionDuration = Math.floor((Date.now() - session.startTime) / (1000 * 60));
  const progressGain = currentProgress - session.initialProgress;

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Tutorial Overlay */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
            onClick={() => setShowTutorial(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl mx-4"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-4">Welcome to Enhanced Reading Mode 🎉</h3>
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Click any citation for instant context</p>
                    <p className="text-sm text-gray-600">Color-coded badges show citation importance</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Network className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Switch to Graph Mode</p>
                    <p className="text-sm text-gray-600">See how papers connect in your project</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Track your progress</p>
                    <p className="text-sm text-gray-600">Categorize papers and update relevance as you read</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => setShowTutorial(false)} className="flex-1">
                  Got it!
                </Button>
                <Button variant="outline" onClick={() => setShowTutorial(false)} className="flex-1">
                  Skip tour
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Session Summary Modal */}
      <AnimatePresence>
        {showSessionSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-xl shadow-2xl p-8 max-w-xl mx-4"
            >
              <h3 className="text-2xl font-bold mb-2">Reading Session Complete! 🎉</h3>
              <p className="text-gray-600 mb-6">Great progress on your research</p>

              {/* Progress Visualization */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Reading Progress</span>
                  <span className="font-semibold">
                    {session.initialProgress}% → {currentProgress}%
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full flex">
                    <motion.div
                      initial={{ width: `${session.initialProgress}%` }}
                      animate={{ width: `${currentProgress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                    />
                  </div>
                </div>
              </div>

              {/* Session Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Time Spent</span>
                  </div>
                  <p className="text-2xl font-bold">{sessionDuration} min</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <FileStack className="w-4 h-4" />
                    <span className="text-sm">Citations Explored</span>
                  </div>
                  <p className="text-2xl font-bold">{session.citationsExplored}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm">Notes Added</span>
                  </div>
                  <p className="text-2xl font-bold">{session.notesAdded}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Highlighter className="w-4 h-4" />
                    <span className="text-sm">Highlights</span>
                  </div>
                  <p className="text-2xl font-bold">{session.highlightsAdded}</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3 mb-6">
                <label className="block text-sm font-semibold text-gray-700">Update paper status:</label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={paperStatus === 'read' ? 'default' : 'outline'}
                    onClick={() => setPaperStatus('read')}
                    className="w-full"
                  >
                    <BookmarkCheck className="w-4 h-4 mr-2" />
                    Mark as Read
                  </Button>
                  <Button
                    variant={paperStatus === 'in-progress' ? 'default' : 'outline'}
                    onClick={() => setPaperStatus('in-progress')}
                    className="w-full"
                  >
                    <Bookmark className="w-4 h-4 mr-2" />
                    Continue Later
                  </Button>
                  <Button
                    variant={paperStatus === 'key-paper' ? 'default' : 'outline'}
                    onClick={() => setPaperStatus('key-paper')}
                    className="w-full"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Key Paper
                  </Button>
                </div>
              </div>

              {/* Optional Learning Note */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  What did you learn? (optional)
                </label>
                <Textarea
                  placeholder="Key takeaways, insights, or questions..."
                  className="resize-none"
                  rows={3}
                  onChange={(e) => {
                    if (e.target.value.trim()) {
                      setSession(prev => ({ ...prev, notesAdded: prev.notesAdded + 1 }));
                    }
                  }}
                />
              </div>

              {/* Next Paper Suggestion */}
              {relatedProjectPapers.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm font-semibold text-blue-900 mb-2">
                    📖 Suggested next read:
                  </p>
                  <p className="text-sm text-blue-800 mb-2">{relatedProjectPapers[0].title}</p>
                  <p className="text-xs text-blue-600">
                    Similar methodology • {relatedProjectPapers[0].relevanceScore}/100 relevance
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  onClick={() => handleSaveSession(paperStatus)}
                  className="flex-1"
                >
                  Save & Return to Project
                </Button>
                {relatedProjectPapers.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowSessionSummary(false);
                      navigate(`/project/${projectId}/read/${relatedProjectPapers[0].id}`);
                    }}
                    className="flex-1"
                  >
                    Read Next Paper
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Toolbar with Breadcrumb */}
      <div className="border-b border-gray-200 bg-white z-20 flex-shrink-0">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleExitReading}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Exit Reading
            </Button>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span 
                className="hover:text-blue-600 cursor-pointer"
                onClick={() => navigate('/projects')}
              >
                Projects
              </span>
              <span>/</span>
              <span 
                className="hover:text-blue-600 cursor-pointer flex items-center gap-1"
                onClick={() => navigate(`/project/${projectId}`)}
              >
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: project.color }}
                />
                {project.name}
              </span>
              <span>/</span>
              <span>Reading</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Tabs defaultValue="reading" className="mr-4">
              <TabsList>
                <TabsTrigger value="reading" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Reading
                </TabsTrigger>
                <TabsTrigger 
                  value="graph" 
                  className="gap-2"
                  onClick={() => navigate(`/project/${projectId}/graph/${paperId}`)}
                >
                  <Network className="w-4 h-4" />
                  Graph
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Project Context Bar */}
      <AnimatePresence>
        {!contextBarCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white overflow-hidden"
          >
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="text-sm text-gray-600">
                    Reading in project: <span className="font-semibold text-gray-900">{project.name}</span>
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setContextBarCollapsed(true)}
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                {/* Categories */}
                <div className="flex items-center gap-2">
                  {selectedCategories.map(cat => {
                    const config = categoryConfig[cat];
                    return (
                      <button
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        className="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 transition-all hover:opacity-80"
                        style={{ 
                          backgroundColor: `${config.color}20`,
                          color: config.color,
                          border: `1px solid ${config.color}40`
                        }}
                      >
                        <span>{config.icon}</span>
                        <span>{config.label}</span>
                        <X className="w-3 h-3 ml-1" />
                      </button>
                    );
                  })}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => {
                      // Show category selector
                      const availableCategories = (Object.keys(categoryConfig) as PaperCategory[])
                        .filter(c => !selectedCategories.includes(c) && c !== 'uncategorized');
                      if (availableCategories.length > 0) {
                        toggleCategory(availableCategories[0]);
                      }
                    }}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add category
                  </Button>
                </div>

                {/* Divider */}
                <div className="h-6 w-px bg-gray-300" />

                {/* Relevance Score */}
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-semibold">{relevanceScore}/100</span>
                  <button 
                    className="text-xs text-blue-600 hover:underline"
                    onClick={() => {
                      const newScore = prompt('Update relevance score (0-100):', relevanceScore.toString());
                      if (newScore && !isNaN(parseInt(newScore))) {
                        const score = Math.max(0, Math.min(100, parseInt(newScore)));
                        setRelevanceScore(score);
                      }
                    }}
                  >
                    adjust
                  </button>
                </div>

                {/* Divider */}
                <div className="h-6 w-px bg-gray-300" />

                {/* Status Dropdown */}
                <div className="flex items-center gap-2">
                  <select
                    value={paperStatus}
                    onChange={(e) => setPaperStatus(e.target.value as ReadStatus)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="unread">Unread</option>
                    <option value="in-progress">Reading</option>
                    <option value="read">Read</option>
                    <option value="key-paper">Key Paper</option>
                  </select>
                </div>

                {/* Divider */}
                <div className="h-6 w-px bg-gray-300" />

                {/* Custom Tags */}
                <div className="flex items-center gap-2 flex-wrap">
                  {customTags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                      <button onClick={() => removeTag(tag)}>
                        <X className="w-3 h-3 hover:text-red-600" />
                      </button>
                    </span>
                  ))}
                  {showTagInput ? (
                    <div className="flex items-center gap-1">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') addCustomTag();
                          if (e.key === 'Escape') setShowTagInput(false);
                        }}
                        placeholder="Tag name..."
                        className="h-7 w-32 text-xs"
                        autoFocus
                      />
                      <Button size="sm" onClick={addCustomTag} className="h-7 px-2">
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setShowTagInput(true)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add tag
                    </Button>
                  )}
                </div>

                {/* Divider */}
                <div className="h-6 w-px bg-gray-300" />

                {/* Reading Progress */}
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{currentProgress}% read</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={currentProgress}
                    onChange={(e) => setCurrentProgress(parseInt(e.target.value))}
                    className="w-24 h-1"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed Context Bar */}
      {contextBarCollapsed && (
        <div className="border-b border-gray-200 bg-gray-50">
          <button
            onClick={() => setContextBarCollapsed(false)}
            className="w-full px-6 py-2 flex items-center justify-between hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: project.color }}
              />
              <span>{project.name}</span>
              <span className="text-gray-400">•</span>
              <span>{currentProgress}% complete</span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      )}

      {/* Main Reading Area: Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* PDF Viewer (60%) */}
        <div className="w-[60%] border-r border-gray-200 bg-gray-50 relative overflow-y-auto">
          {/* Mock PDF with Citation Badges */}
          <div className="max-w-4xl mx-auto p-8">
            <div className="bg-white shadow-lg rounded-lg p-12 mb-8">
              <h1 className="text-3xl font-bold mb-4">{paper.title}</h1>
              <p className="text-gray-600 mb-8">
                {paper.authors.join(', ')} • {paper.venue} • {paper.year}
              </p>
              
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold mb-4">Abstract</h2>
                <p className="mb-6 text-gray-700 leading-relaxed">
                  {paper.abstract || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'}
                </p>

                <h2 className="text-2xl font-bold mb-4 mt-8">Introduction</h2>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  Recent advances in machine learning have shown remarkable progress in various domains.
                  <CitationBadge
                    citation={mockCitations[0]}
                    onClick={() => handleCitationClick(mockCitations[0])}
                    className="mx-1 cursor-pointer"
                  />
                  However, challenges remain in understanding the fundamental mechanisms.
                  <CitationBadge
                    citation={mockCitations[1]}
                    onClick={() => handleCitationClick(mockCitations[1])}
                    className="mx-1 cursor-pointer"
                  />
                </p>
                
                <p className="mb-6 text-gray-700 leading-relaxed">
                  This paper addresses these challenges by introducing a novel approach
                  <CitationBadge
                    citation={mockCitations[2]}
                    onClick={() => handleCitationClick(mockCitations[2])}
                    className="mx-1 cursor-pointer"
                  />
                  that combines recent theoretical insights with practical applications.
                </p>

                <h2 className="text-2xl font-bold mb-4 mt-8">Methodology</h2>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  Our approach builds on previous work in neural architectures
                  <CitationBadge
                    citation={mockCitations[3]}
                    onClick={() => handleCitationClick(mockCitations[3])}
                    className="mx-1 cursor-pointer"
                  />
                  and optimization techniques.
                  <CitationBadge
                    citation={mockCitations[4]}
                    onClick={() => handleCitationClick(mockCitations[4])}
                    className="mx-1 cursor-pointer"
                  />
                </p>

                <p className="mb-6 text-gray-700 leading-relaxed">
                  We evaluated our method on standard benchmarks
                  <CitationBadge
                    citation={mockCitations[5]}
                    onClick={() => handleCitationClick(mockCitations[5])}
                    className="mx-1 cursor-pointer"
                  />
                  demonstrating state-of-the-art performance across multiple metrics.
                </p>

                <h2 className="text-2xl font-bold mb-4 mt-8">Results</h2>
                <p className="mb-4 text-gray-700 leading-relaxed">
                  Our experiments show significant improvements over baseline methods.
                  <CitationBadge
                    citation={mockCitations[6]}
                    onClick={() => handleCitationClick(mockCitations[6])}
                    className="mx-1 cursor-pointer"
                  />
                  The results validate our theoretical predictions.
                </p>
              </div>
            </div>
          </div>

          {/* Floating Action Button */}
          <motion.div
            className="fixed bottom-8 right-[42%] z-10"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-white rounded-full shadow-lg border border-gray-200 p-2 flex flex-col gap-2">
              <button
                className="p-3 hover:bg-gray-100 rounded-full transition-colors group relative"
                title="Add highlight"
                onClick={() => {
                  setSession(prev => ({ ...prev, highlightsAdded: prev.highlightsAdded + 1 }));
                }}
              >
                <Highlighter className="w-5 h-5 text-gray-700" />
              </button>
              <button
                className="p-3 hover:bg-gray-100 rounded-full transition-colors group relative"
                title="Add to reading queue"
              >
                <ListPlus className="w-5 h-5 text-gray-700" />
              </button>
              <button
                className="p-3 hover:bg-gray-100 rounded-full transition-colors group relative"
                title="Generate summary"
              >
                <Zap className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Citation Panel (40%) */}
        <div className="w-[40%] bg-white flex flex-col">
          {/* Panel Tabs */}
          <div className="border-b border-gray-200 px-6 pt-4">
            <Tabs value={citationPanelTab} onValueChange={(v) => setCitationPanelTab(v as any)}>
              <TabsList className="w-full">
                <TabsTrigger value="details" className="flex-1">
                  Citation Details
                </TabsTrigger>
                <TabsTrigger value="related" className="flex-1">
                  Related Papers
                </TabsTrigger>
                <TabsTrigger value="project" className="flex-1">
                  Project Context
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {citationPanelTab === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {selectedCitation ? (
                    <div className="space-y-4">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-bold text-lg">{selectedCitation.title}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedCitation(null)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <ImportanceScore score={selectedCitation.importanceScore} />
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">One-line summary:</p>
                        <p className="text-sm text-gray-900">{selectedCitation.oneLiner}</p>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Full context:</p>
                        <p className="text-sm text-gray-800 leading-relaxed">{selectedCitation.contextualSummary}</p>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Why it matters:</p>
                        <p className="text-sm text-gray-800 leading-relaxed">{selectedCitation.relevanceExplanation}</p>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-600 mb-2">Authors: {selectedCitation.authors.join(', ')}</p>
                        <p className="text-xs text-gray-600">Published: {selectedCitation.year}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-blue-600" />
                      </div>
                      <h4 className="font-semibold mb-2">Start Your Reading</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        This paper has {mockCitations.length} citations
                      </p>
                      <div className="bg-gray-50 rounded-lg p-4 text-left mb-4">
                        <p className="text-sm font-semibold mb-2">Top 3 must-read citations:</p>
                        <div className="space-y-2">
                          {mockCitations.slice(0, 3).map((citation, idx) => (
                            <div
                              key={citation.id}
                              onClick={() => handleCitationClick(citation)}
                              className="w-full text-left p-2 hover:bg-white rounded transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <CitationBadge citation={citation} />
                                <span className="text-xs font-semibold">{citation.title}</span>
                              </div>
                              <p className="text-xs text-gray-600 pl-8">{citation.oneLiner}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {citationPanelTab === 'related' && (
                <motion.div
                  key="related"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <h4 className="font-semibold mb-4">Papers citing this work</h4>
                  <div className="space-y-3">
                    {mockCitations.slice(0, 4).map((citation) => (
                      <div key={citation.id} className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors cursor-pointer">
                        <div className="flex items-start gap-2 mb-2">
                          <CitationBadge citation={citation} />
                          <p className="text-sm font-semibold flex-1">{citation.title}</p>
                        </div>
                        <p className="text-xs text-gray-600">{citation.authors.join(', ')}</p>
                        <p className="text-xs text-gray-500 mt-1">{citation.oneLiner}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {citationPanelTab === 'project' && (
                <motion.div
                  key="project"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div>
                    <h4 className="font-semibold mb-3">This paper's role in your project</h4>
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-sm text-gray-800 leading-relaxed">
                        {paper.aiReasoning}
                      </p>
                    </div>
                  </div>

                  {relatedProjectPapers.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3">Related papers in this project</h4>
                      <div className="space-y-2">
                        {relatedProjectPapers.map((relatedPaper) => (
                          <div 
                            key={relatedPaper.id}
                            className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors cursor-pointer"
                            onClick={() => navigate(`/project/${projectId}/read/${relatedPaper.id}`)}
                          >
                            <p className="text-sm font-semibold mb-1">{relatedPaper.title}</p>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              {relatedPaper.categories.map(cat => {
                                const config = categoryConfig[cat];
                                return (
                                  <span
                                    key={cat}
                                    className="text-xs px-2 py-0.5 rounded-full"
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
                            <p className="text-xs text-gray-600">
                              Relevance: {relatedPaper.relevanceScore}/100
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold mb-3">Your notes on this paper</h4>
                    <Textarea
                      value={projectNotes}
                      onChange={(e) => {
                        setProjectNotes(e.target.value);
                        if (e.target.value.length > projectNotes.length + 10) {
                          setSession(prev => ({ ...prev, notesAdded: prev.notesAdded + 1 }));
                        }
                      }}
                      placeholder="Add your thoughts, key insights, questions..."
                      className="resize-none min-h-[150px]"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Auto-saved • Last updated {new Date().toLocaleTimeString()}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <ListPlus className="w-4 h-4 mr-2" />
                      Add to reading queue
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileStack className="w-4 h-4 mr-2" />
                      Compare with another paper
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Auto-save indicator */}
      <AnimatePresence>
        {currentProgress !== paper.readProgress && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm shadow-lg"
          >
            Progress saved ✓
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}