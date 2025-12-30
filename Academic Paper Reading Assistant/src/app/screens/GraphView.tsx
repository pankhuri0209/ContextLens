import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, Settings as SettingsIcon, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { mockCitations, mockPapers } from '../../data/mockData';
import { ImportanceScore } from '../components/ImportanceScore';
import { Button } from '../components/ui/button';
import { Slider } from '../components/ui/slider';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import type { Citation } from '../../data/mockData';

export function GraphView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedNode, setSelectedNode] = useState<Citation | null>(null);
  const [minScore, setMinScore] = useState([0]);
  const paper = mockPapers.find(p => p.id === id);

  if (!paper) return null;

  const filteredCitations = mockCitations.filter(c => c.importanceScore >= minScore[0]);

  // Calculate positions for nodes in a radial layout
  const getNodePosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const radius = 200;
    return {
      x: 400 + Math.cos(angle) * radius,
      y: 300 + Math.sin(angle) * radius
    };
  };

  const getNodeColor = (purpose: string) => {
    switch (purpose) {
      case 'critical': return '#EF4444';
      case 'core-method': return '#F59E0B';
      case 'supporting': return '#2563EB';
      case 'background': return '#9CA3AF';
      default: return '#9CA3AF';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Top Bar */}
      <div className="border-b border-gray-200 bg-white z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate(`/reader/${id}`)}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h2 className="text-lg">{paper.title}</h2>
                <p className="text-sm text-gray-600">Citation Knowledge Graph</p>
              </div>
            </div>

            <Tabs defaultValue="graph">
              <TabsList>
                <TabsTrigger value="reading" onClick={() => navigate(`/reader/${id}`)}>
                  <FileText className="w-4 h-4 mr-2" />
                  Reading Mode
                </TabsTrigger>
                <TabsTrigger value="graph">
                  Graph Mode
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Graph Canvas */}
        <div className="flex-1 bg-gray-50 relative overflow-hidden">
          <svg className="w-full h-full">
            {/* Connections */}
            {filteredCitations.map((citation, index) => {
              const pos = getNodePosition(index, filteredCitations.length);
              const strokeWidth = citation.importanceScore / 20;
              const dashArray = citation.citationPurpose === 'supporting' ? '5,5' : '0';

              return (
                <line
                  key={`line-${citation.id}`}
                  x1="400"
                  y1="300"
                  x2={pos.x}
                  y2={pos.y}
                  stroke={getNodeColor(citation.citationPurpose)}
                  strokeWidth={strokeWidth}
                  strokeDasharray={dashArray}
                  opacity="0.3"
                />
              );
            })}

            {/* Center Node (Current Paper) */}
            <g>
              <circle
                cx="400"
                cy="300"
                r="40"
                fill="#2563EB"
                stroke="#1E40AF"
                strokeWidth="3"
              />
              <text
                x="400"
                y="305"
                textAnchor="middle"
                fill="white"
                className="text-sm font-medium"
              >
                Current Paper
              </text>
            </g>

            {/* Citation Nodes */}
            {filteredCitations.map((citation, index) => {
              const pos = getNodePosition(index, filteredCitations.length);
              const size = 10 + (citation.importanceScore / 5);

              return (
                <g key={citation.id}>
                  <motion.circle
                    cx={pos.x}
                    cy={pos.y}
                    r={size}
                    fill={getNodeColor(citation.citationPurpose)}
                    stroke={selectedNode?.id === citation.id ? '#000' : '#fff'}
                    strokeWidth={selectedNode?.id === citation.id ? '3' : '2'}
                    className="cursor-pointer"
                    whileHover={{ scale: 1.2 }}
                    onClick={() => setSelectedNode(citation)}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  />
                  <text
                    x={pos.x}
                    y={pos.y - size - 8}
                    textAnchor="middle"
                    className="text-xs font-medium pointer-events-none"
                    fill="#374151"
                  >
                    {citation.authors[0].split(',')[0]} {citation.year}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Floating Control Panel */}
          <div className="absolute top-6 right-6 bg-white rounded-lg shadow-lg p-4 w-80">
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <SettingsIcon className="w-4 h-4" />
              Graph Controls
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Legend</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span>Critical (80-100)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                    <span>Core Method (60-79)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span>Supporting (40-59)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                    <span>Background (0-39)</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium mb-2">Minimum Importance</h4>
                <div className="flex items-center gap-3">
                  <Slider
                    value={minScore}
                    onValueChange={setMinScore}
                    max={100}
                    step={10}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-8">{minScore[0]}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium mb-2">Layout</h4>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm" className="text-xs">Radial</Button>
                  <Button variant="ghost" size="sm" className="text-xs">Force</Button>
                  <Button variant="ghost" size="sm" className="text-xs">Tree</Button>
                </div>
              </div>

              <Button className="w-full" variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Graph
              </Button>
            </div>
          </div>
        </div>

        {/* Citation Detail Sidebar */}
        {selectedNode && (
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            className="w-96 bg-white border-l border-gray-200 p-6 overflow-auto"
          >
            <div className="space-y-4">
              <div>
                <h3 className="mb-2">{selectedNode.title}</h3>
                <p className="text-sm text-gray-600">
                  {selectedNode.authors.join(', ')}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedNode.venue} {selectedNode.year}
                </p>
              </div>

              <ImportanceScore score={selectedNode.importanceScore} size="lg" />

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2 text-sm">Why cited:</h4>
                <p className="text-sm text-gray-700">{selectedNode.whyCited}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2 text-sm">Key Contributions:</h4>
                <ul className="space-y-2">
                  {selectedNode.keyContribution.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-700">
                      <span className="text-[#2563EB]">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <Button className="flex-1" onClick={() => navigate(`/reader/${id}`)}>
                  View in Paper
                </Button>
                <Button variant="outline">Add to Queue</Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
