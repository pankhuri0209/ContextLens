import React, { useState } from 'react';
import { Sparkles, ThumbsUp, ThumbsDown, X, Search, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import type { AISuggestion } from '../../../data/projectData';
import { CategoryTag } from '../CategoryTag';
import { RelevanceScore } from '../RelevanceScore';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';

interface AIAssistantTabProps {
  projectId: string;
  suggestions: AISuggestion[];
}

const exampleQueries = [
  'Find papers using transformer models for protein folding',
  'Survey papers on graph neural networks published after 2020',
  'Papers citing "Attention Is All You Need"',
  'Recent work on explainable AI in healthcare',
];

const watchingTopics = [
  'Transformer architectures',
  'Protein structure prediction',
  'Deep learning for biology',
];

export function AIAssistantTab({ projectId, suggestions }: AIAssistantTabProps) {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [queryHistory, setQueryHistory] = useState<string[]>([]);
  const [currentQuery, setCurrentQuery] = useState('');

  const activeSuggestions = suggestions.filter((s) => !dismissed.includes(s.id));

  const getConfidenceBadge = (confidence: string) => {
    const config = {
      high: { label: 'High Confidence', color: 'bg-green-100 text-green-700 border-green-300' },
      medium: { label: 'Medium Confidence', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
      low: { label: 'Low Confidence', color: 'bg-gray-100 text-gray-700 border-gray-300' },
    };
    return config[confidence as keyof typeof config];
  };

  const handleDismiss = (id: string) => {
    setDismissed([...dismissed, id]);
  };

  const handleSearch = () => {
    if (currentQuery.trim()) {
      setQueryHistory([currentQuery, ...queryHistory.slice(0, 4)]);
      setCurrentQuery('');
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Recommendations Panel */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            Papers You Might Need
          </h2>
          <span className="text-sm text-purple-700">
            {activeSuggestions.length} new suggestions
          </span>
        </div>

        <div className="space-y-4">
          {activeSuggestions.map((suggestion, index) => {
            const confidenceBadge = getConfidenceBadge(suggestion.confidence);

            return (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg p-5 border border-purple-200 relative"
              >
                <button
                  onClick={() => handleDismiss(suggestion.id)}
                  className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>

                <div className="space-y-3">
                  {/* Paper Info */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2 pr-8">
                      {suggestion.paper.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {suggestion.paper.authors.join(', ')} • {suggestion.paper.year}
                    </p>
                  </div>

                  {/* AI Reasoning */}
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-blue-900 mb-1">
                          Why this is relevant:
                        </div>
                        <p className="text-sm text-blue-800">{suggestion.reasoning}</p>
                      </div>
                    </div>
                  </div>

                  {/* Relevance Score and Categories */}
                  <div className="flex items-center gap-4">
                    <RelevanceScore score={suggestion.relevanceScore} reasoning={suggestion.reasoning} />

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Suggested:</span>
                      {suggestion.suggestedCategories.map((category) => (
                        <CategoryTag key={category} category={category} size="sm" />
                      ))}
                    </div>

                    <div className="ml-auto">
                      <span
                        className={`px-2 py-1 rounded-full text-xs border ${confidenceBadge.color}`}
                      >
                        {confidenceBadge.label}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                    <Button className="flex-1">
                      Add to Project
                    </Button>
                    <Button variant="outline" size="sm">
                      Not Relevant
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ThumbsDown className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {activeSuggestions.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">No new suggestions yet</h3>
              <p className="text-sm text-gray-600 mb-4">
                Check back later or use the search below to find specific papers
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Discovery Queries */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="mb-4">Ask AI to Find Papers</h2>

        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="e.g., Find papers using transformer models for protein folding"
              className="pl-10 pr-24"
              value={currentQuery}
              onChange={(e) => setCurrentQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>

          {/* Example Queries */}
          <div>
            <div className="text-sm text-gray-600 mb-2">Try these examples:</div>
            <div className="flex flex-wrap gap-2">
              {exampleQueries.map((query) => (
                <button
                  key={query}
                  onClick={() => setCurrentQuery(query)}
                  className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 border border-gray-200 transition-colors"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>

          {/* Query History */}
          {queryHistory.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <div className="text-sm text-gray-600 mb-2">Recent searches:</div>
              <div className="space-y-2">
                {queryHistory.map((query, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentQuery(query)}
                    className="flex items-center gap-2 w-full p-2 hover:bg-gray-50 rounded text-sm text-left text-gray-700"
                  >
                    <Search className="w-4 h-4 text-gray-400" />
                    {query}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Monitoring Dashboard */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gray-400" />
            Monitoring
          </h2>
          <Button variant="outline" size="sm">
            Edit Topics
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium mb-3">Watching these topics:</div>
            <div className="flex flex-wrap gap-2">
              {watchingTopics.map((topic) => (
                <span
                  key={topic}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200 flex items-center gap-2"
                >
                  {topic}
                  <button className="hover:bg-blue-100 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button className="px-3 py-1.5 border-2 border-dashed border-gray-300 rounded-full text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors">
                + Add Topic
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="text-sm font-medium mb-3">Notification Settings:</div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" className="rounded" defaultChecked />
                <span>New relevant papers (Weekly digest)</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" className="rounded" defaultChecked />
                <span>Citation alerts</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" className="rounded" />
                <span>Project milestones</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
