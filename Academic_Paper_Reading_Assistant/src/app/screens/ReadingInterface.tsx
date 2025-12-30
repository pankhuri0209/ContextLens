import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, Share2, Download, Search, Filter, Network } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { mockCitations, mockPapers } from '../../data/mockData';
import { CitationBadge } from '../components/CitationBadge';
import { ImportanceScore } from '../components/ImportanceScore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import type { Citation } from '../../data/mockData';

export function ReadingInterface() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const paper = mockPapers.find(p => p.id === id);

  const filteredCitations = mockCitations.filter(c => {
    if (filter === 'all') return true;
    if (filter === 'critical') return c.importanceScore >= 80;
    if (filter === 'core-method') return c.importanceScore >= 60 && c.importanceScore < 80;
    if (filter === 'supporting') return c.importanceScore >= 40 && c.importanceScore < 60;
    if (filter === 'background') return c.importanceScore < 40;
    return true;
  });

  if (!paper) return null;

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Top Toolbar */}
      <div className="border-b border-gray-200 bg-white z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h2 className="text-lg">{paper.title}</h2>
                <p className="text-sm text-gray-600">{paper.authors.join(', ')} • {paper.venue} {paper.year}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Tabs defaultValue="reading" className="mr-4">
                <TabsList>
                  <TabsTrigger value="reading" className="gap-2">
                    <FileText className="w-4 h-4" />
                    Reading Mode
                  </TabsTrigger>
                  <TabsTrigger value="graph" className="gap-2" onClick={() => navigate(`/graph/${id}`)}>
                    <Network className="w-4 h-4" />
                    Graph Mode
                  </TabsTrigger>
                  <TabsTrigger value="export" className="gap-2" onClick={() => navigate(`/export/${id}`)}>
                    <Share2 className="w-4 h-4" />
                    Export
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Search citations..." className="pl-9" />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">Filter:</span>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant={filter === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilter('all')}
                >
                  All
                </Button>
                <Button
                  size="sm"
                  variant={filter === 'critical' ? 'default' : 'outline'}
                  onClick={() => setFilter('critical')}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  Critical
                </Button>
                <Button
                  size="sm"
                  variant={filter === 'core-method' ? 'default' : 'outline'}
                  onClick={() => setFilter('core-method')}
                  className="border-orange-300 text-orange-700 hover:bg-orange-50"
                >
                  Core Method
                </Button>
                <Button
                  size="sm"
                  variant={filter === 'supporting' ? 'default' : 'outline'}
                  onClick={() => setFilter('supporting')}
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  Supporting
                </Button>
                <Button
                  size="sm"
                  variant={filter === 'background' ? 'default' : 'outline'}
                  onClick={() => setFilter('background')}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Background
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* PDF Viewer (Left - 60%) */}
        <div className="w-[60%] border-r border-gray-200 bg-gray-50 overflow-auto">
          <div className="max-w-4xl mx-auto p-8">
            {/* Simulated PDF Content */}
            <div className="bg-white shadow-lg rounded-lg p-12 min-h-[1200px]">
              <h1 className="text-3xl font-serif mb-6">{paper.title}</h1>
              <p className="text-gray-600 mb-8 font-serif">{paper.authors.join(', ')}</p>

              <div className="space-y-6 font-serif leading-relaxed">
                <section>
                  <h2 className="text-xl font-semibold mb-3">Abstract</h2>
                  <p className="text-gray-800">
                    The dominant sequence transduction models are based on complex recurrent or convolutional neural networks{' '}
                    <CitationBadge citation={mockCitations[1]} onClick={() => setSelectedCitation(mockCitations[1])} />{' '}
                    that include an encoder and a decoder. The best performing models also connect the encoder and decoder through{' '}
                    an attention mechanism{' '}
                    <CitationBadge citation={mockCitations[0]} onClick={() => setSelectedCitation(mockCitations[0])} />.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">Introduction</h2>
                  <p className="text-gray-800 mb-4">
                    Recurrent neural networks, long short-term memory{' '}
                    <CitationBadge citation={mockCitations[1]} onClick={() => setSelectedCitation(mockCitations[1])} />{' '}
                    and gated recurrent neural networks in particular, have been firmly established as state of the art approaches in 
                    sequence modeling and transduction problems such as language modeling and machine translation{' '}
                    <CitationBadge citation={mockCitations[2]} onClick={() => setSelectedCitation(mockCitations[2])} />.
                  </p>
                  <p className="text-gray-800">
                    Attention mechanisms have become an integral part of compelling sequence modeling and transduction models in various tasks,
                    allowing modeling of dependencies without regard to their distance in the input or output sequences{' '}
                    <CitationBadge citation={mockCitations[0]} onClick={() => setSelectedCitation(mockCitations[0])} />.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">Model Architecture</h2>
                  <p className="text-gray-800 mb-4">
                    Most competitive neural sequence transduction models have an encoder-decoder structure{' '}
                    <CitationBadge citation={mockCitations[2]} onClick={() => setSelectedCitation(mockCitations[2])} />.
                    Here, the encoder maps an input sequence to a sequence of continuous representations. Given these representations,
                    the decoder then generates an output sequence one element at a time.
                  </p>
                  <p className="text-gray-800">
                    We employ batch normalization{' '}
                    <CitationBadge citation={mockCitations[3]} onClick={() => setSelectedCitation(mockCitations[3])} />{' '}
                    and dropout{' '}
                    <CitationBadge citation={mockCitations[4]} onClick={() => setSelectedCitation(mockCitations[4])} />{' '}
                    to regularize our networks.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-3">Training</h2>
                  <p className="text-gray-800">
                    We trained our models using the Adam optimizer{' '}
                    <CitationBadge citation={mockCitations[5]} onClick={() => setSelectedCitation(mockCitations[5])} />{' '}
                    with β₁ = 0.9, β₂ = 0.98 and ε = 10⁻⁹. We varied the learning rate over the course of training.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>

        {/* Citation Panel (Right - 40%) */}
        <div className="w-[40%] bg-white overflow-auto">
          <div className="p-6">
            <AnimatePresence mode="wait">
              {selectedCitation ? (
                <motion.div
                  key={selectedCitation.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="mb-2">{selectedCitation.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {selectedCitation.authors.join(', ')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {selectedCitation.venue} {selectedCitation.year}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-medium text-gray-700">Importance Score:</span>
                      <ImportanceScore score={selectedCitation.importanceScore} size="md" />
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium mb-2 text-sm text-gray-900">Why cited here:</h4>
                    <p className="text-sm text-gray-700">{selectedCitation.whyCited}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 text-sm">Key Contribution:</h4>
                    <ul className="space-y-2">
                      {selectedCitation.keyContribution.map((item, i) => (
                        <li key={i} className="flex gap-2 text-sm text-gray-700">
                          <span className="text-[#2563EB] mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2 text-sm text-gray-900">Context:</h4>
                    <p className="text-sm text-gray-700 italic">"{selectedCitation.context}"</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 text-sm">Appears in sections:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCitation.sections.map((section, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-700">
                          {section}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <Button className="flex-1">Add to Reading Queue</Button>
                    <Button variant="outline" onClick={() => navigate(`/graph/${id}`)}>
                      <Network className="w-4 h-4" />
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center p-8"
                >
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 text-[#2563EB]" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Click any citation to see details</h3>
                  <p className="text-sm text-gray-600">
                    Citation badges are color-coded by importance:
                  </p>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span>Critical (80-100)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded"></div>
                      <span>Core Method (60-79)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded"></div>
                      <span>Supporting (40-59)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-500 rounded"></div>
                      <span>Background (0-39)</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
