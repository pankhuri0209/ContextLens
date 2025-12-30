import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { TreeNode, mockKnowledgeTree } from '../../../data/knowledgeTreeData';
import { KnowledgeTreeNode } from './KnowledgeTreeNode';
import { NodeDetailPanel } from './NodeDetailPanel';
import { OnboardingModal } from './OnboardingModal';
import { TreeSettingsModal } from './TreeSettingsModal';
import { ExportTreeModal } from './ExportTreeModal';
import { TimelineView } from './TimelineView';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Settings, Download, Plus, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { toast } from 'sonner';

interface KnowledgeTreeTabProps {
  projectId: string;
  projectName: string;
}

export function KnowledgeTreeTab({ projectId, projectName }: KnowledgeTreeTabProps) {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [viewMode, setViewMode] = useState<'tree' | 'timeline'>('tree');
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const tree = mockKnowledgeTree;

  useEffect(() => {
    // Check if first time visiting knowledge tree
    const hasSeenOnboarding = localStorage.getItem('knowledgeTreeOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = (buildFromExisting: boolean) => {
    localStorage.setItem('knowledgeTreeOnboarding', 'true');
    setShowOnboarding(false);
    
    if (buildFromExisting) {
      toast.success('Building knowledge tree from 12 existing papers...', {
        description: 'This may take a few moments'
      });
      
      // Simulate build process
      setTimeout(() => {
        toast.success('Knowledge tree built successfully!', {
          description: '4 domains, 18 nodes created'
        });
      }, 2000);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(prev => Math.max(0.3, Math.min(2, prev + delta)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains('tree-canvas')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  const renderTreeConnections = () => {
    return tree.connections.map(conn => {
      const fromNode = tree.nodes.find(n => n.id === conn.fromNodeId);
      const toNode = tree.nodes.find(n => n.id === conn.toNodeId);
      
      if (!fromNode || !toNode) return null;

      const lineStyle = {
        solid: '0',
        dashed: '8,4'
      };

      const strokeWidth = {
        weak: 2,
        moderate: 3,
        strong: 4
      };

      return (
        <motion.line
          key={conn.id}
          x1={fromNode.position.x}
          y1={fromNode.position.y}
          x2={toNode.position.x}
          y2={toNode.position.y}
          stroke="#9CA3AF"
          strokeWidth={strokeWidth[conn.strength]}
          strokeDasharray={conn.type === 'alternative' || conn.type === 'contradictory' ? lineStyle.dashed : lineStyle.solid}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.4 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      );
    });
  };

  const renderParentChildConnections = () => {
    return tree.nodes
      .filter(node => node.parentId)
      .map(node => {
        const parent = tree.nodes.find(n => n.id === node.parentId);
        if (!parent) return null;

        return (
          <motion.line
            key={`parent-${node.id}`}
            x1={parent.position.x}
            y1={parent.position.y}
            x2={node.position.x}
            y2={node.position.y}
            stroke="#6B7280"
            strokeWidth={3}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        );
      });
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2">
                🌳 Knowledge Tree: {projectName}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Visual map of research problems, solutions, and gaps
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Auto-Build</span>
                <Switch
                  checked={autoUpdate}
                  onCheckedChange={setAutoUpdate}
                />
              </div>
              
              <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
                <Settings className="w-4 h-4 mr-1" />
                Settings
              </Button>
              
              <Button variant="outline" size="sm" onClick={() => setShowExport(true)}>
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* View Tabs */}
        <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)} className="flex-1">
          <div className="border-b border-gray-200 px-4">
            <TabsList>
              <TabsTrigger value="tree">Tree View</TabsTrigger>
              <TabsTrigger value="timeline">Timeline View</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="tree" className="mt-0">
            {/* Legend */}
            <div className="p-4 pb-0">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-6 text-sm flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Legend:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🔵</span>
                    <span className="text-gray-700">Why (Mechanism)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🟢</span>
                    <span className="text-gray-700">How (Solution)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🔴</span>
                    <span className="text-gray-700">Gap/Unsolved</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>⭐</span>
                    <span className="text-gray-700">Foundational</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tree Canvas */}
            <div className="relative bg-[#FAFAFA]" style={{ height: '700px' }}>
              {/* Toolbar */}
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setScale(prev => Math.min(2, prev + 0.1))}
                  className="bg-white shadow-md"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setScale(prev => Math.max(0.3, prev - 0.1))}
                  className="bg-white shadow-md"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={resetView}
                  className="bg-white shadow-md"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Canvas */}
              <div
                ref={canvasRef}
                className="tree-canvas w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <div
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px)`,
                    position: 'relative',
                    width: '100%',
                    height: '100%'
                  }}
                >
                  {/* SVG for connections */}
                  <svg
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      pointerEvents: 'none'
                    }}
                  >
                    {renderParentChildConnections()}
                    {renderTreeConnections()}
                  </svg>

                  {/* Nodes */}
                  {tree.nodes.map(node => (
                    <KnowledgeTreeNode
                      key={node.id}
                      node={node}
                      isSelected={selectedNode?.id === node.id}
                      onClick={() => setSelectedNode(node)}
                      scale={scale}
                    />
                  ))}
                </div>
              </div>

              {/* Instructions */}
              {!selectedNode && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md border border-gray-200">
                  <p className="text-sm text-gray-600">
                    Click any node to expand and see details • Scroll to zoom • Drag to pan
                  </p>
                </div>
              )}

              {/* Stats */}
              <div className="absolute top-4 left-4 bg-white px-4 py-3 rounded-lg shadow-md border border-gray-200">
                <div className="text-sm space-y-1">
                  <div className="font-semibold text-gray-900">{tree.nodes.length} nodes</div>
                  <div className="text-gray-600">{tree.mainBranches.length} main domains</div>
                  <div className="text-gray-600">
                    {tree.nodes.filter(n => n.gaps.length > 0).reduce((sum, n) => sum + n.gaps.length, 0)} gaps identified
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="mt-0">
            <div className="p-4">
              <TimelineView 
                nodes={tree.nodes} 
                onNodeClick={(node) => setSelectedNode(node)}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Detail Panel */}
      {selectedNode && (
        <NodeDetailPanel
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onLinkNode={() => {
            toast.info('Node connection feature coming soon!');
          }}
          onEditNode={() => {
            toast.info('Edit node feature coming soon!');
          }}
          onExportNode={() => {
            toast.success('Node exported successfully!');
          }}
          onViewPaper={(paperId) => {
            toast.info(`Opening paper ${paperId}...`);
          }}
        />
      )}

      {/* Modals */}
      <OnboardingModal
        open={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={handleOnboardingComplete}
        paperCount={12}
      />

      <TreeSettingsModal
        open={showSettings}
        onClose={() => setShowSettings(false)}
      />

      <ExportTreeModal
        open={showExport}
        onClose={() => setShowExport(false)}
        onExport={(format, options) => {
          toast.success(`Exporting tree as ${format}...`, {
            description: 'Your export will download shortly'
          });
        }}
      />
    </>
  );
}