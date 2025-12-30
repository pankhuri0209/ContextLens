import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Checkbox } from '../ui/checkbox';
import { Settings } from 'lucide-react';
import { defaultTreeSettings, branchOptions } from '../../../data/knowledgeTreeData';

interface TreeSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function TreeSettingsModal({ open, onClose }: TreeSettingsModalProps) {
  const [settings, setSettings] = useState(defaultTreeSettings);

  const handleSave = () => {
    // In a real app, this would save to backend
    localStorage.setItem('treeSettings', JSON.stringify(settings));
    onClose();
  };

  const handleReset = () => {
    setSettings(defaultTreeSettings);
  };

  const toggleBranch = (branch: string) => {
    setSettings(prev => ({
      ...prev,
      enabledBranches: prev.enabledBranches.includes(branch)
        ? prev.enabledBranches.filter(b => b !== branch)
        : [...prev.enabledBranches, branch]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Knowledge Tree Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Auto-Build Mode */}
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              🤖 AUTO-BUILD MODE
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoUpdate" className="text-base">
                  Automatically update tree as I read papers
                </Label>
                <Switch
                  id="autoUpdate"
                  checked={settings.autoUpdate}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({ ...prev, autoUpdate: checked }))
                  }
                />
              </div>

              <div className="space-y-3 pl-4 border-l-2 border-gray-200">
                <p className="text-sm text-gray-600 font-medium">Build tree from:</p>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="abstracts"
                    checked={settings.buildFromAbstracts}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, buildFromAbstracts: checked as boolean }))
                    }
                  />
                  <Label htmlFor="abstracts" className="text-sm cursor-pointer">
                    Paper abstracts and introductions
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="citations"
                    checked={settings.buildFromCitations}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, buildFromCitations: checked as boolean }))
                    }
                  />
                  <Label htmlFor="citations" className="text-sm cursor-pointer">
                    Citation contexts and summaries
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="highlights"
                    checked={settings.buildFromHighlights}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, buildFromHighlights: checked as boolean }))
                    }
                  />
                  <Label htmlFor="highlights" className="text-sm cursor-pointer">
                    My highlights and annotations
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="fulltext"
                    checked={settings.buildFromFullText}
                    onCheckedChange={(checked) =>
                      setSettings(prev => ({ ...prev, buildFromFullText: checked as boolean }))
                    }
                  />
                  <Label htmlFor="fulltext" className="text-sm cursor-pointer">
                    Full text (slower, more detailed)
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Tree Structure */}
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              🌳 TREE STRUCTURE
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Main branches (problem domains):
                </Label>
                <div className="space-y-2">
                  {branchOptions.map(branch => (
                    <div key={branch} className="flex items-center space-x-2">
                      <Checkbox
                        id={branch}
                        checked={settings.enabledBranches.includes(branch)}
                        onCheckedChange={() => toggleBranch(branch)}
                      />
                      <Label htmlFor={branch} className="text-sm cursor-pointer">
                        {branch}
                      </Label>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="mt-3">
                  + Add Custom Branch
                </Button>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Sub-branch generation:
                </Label>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    Auto-create sub-branches when
                  </span>
                  <Select
                    value={settings.minPapersForSubBranch.toString()}
                    onValueChange={(value) =>
                      setSettings(prev => ({ ...prev, minPapersForSubBranch: parseInt(value) }))
                    }
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="7">7</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-gray-600">
                    papers mention a new specific problem/method
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Visual Settings */}
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              🎨 VISUAL SETTINGS
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Node color coding:
                </Label>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <span className="text-lg">🔵</span> Why/Mechanism
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-lg">🟢</span> How/Solution
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-lg">🔴</span> Gap/Unsolved
                  </span>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Show node labels:
                </Label>
                <Select
                  value={settings.showLabels}
                  onValueChange={(value: any) =>
                    setSettings(prev => ({ ...prev, showLabels: value }))
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="always">Always</SelectItem>
                    <SelectItem value="hover">On hover</SelectItem>
                    <SelectItem value="click">On click</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showCounts" className="text-sm">
                  Show paper counts on nodes
                </Label>
                <Switch
                  id="showCounts"
                  checked={settings.showPaperCounts}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({ ...prev, showPaperCounts: checked }))
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* AI Intelligence */}
          <div>
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              📊 AI INTELLIGENCE
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="detectRelationships" className="text-sm">
                  Auto-detect problem-solution relationships
                </Label>
                <Switch
                  id="detectRelationships"
                  checked={settings.autoDetectRelationships}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({ ...prev, autoDetectRelationships: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="identifyGaps" className="text-sm">
                  Identify research gaps automatically
                </Label>
                <Switch
                  id="identifyGaps"
                  checked={settings.autoIdentifyGaps}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({ ...prev, autoIdentifyGaps: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="suggestLinks" className="text-sm">
                  Suggest cross-links between nodes
                </Label>
                <Switch
                  id="suggestLinks"
                  checked={settings.suggestCrossLinks}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({ ...prev, suggestCrossLinks: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="flagContradictions" className="text-sm">
                  Flag contradictory findings
                </Label>
                <Switch
                  id="flagContradictions"
                  checked={settings.flagContradictions}
                  onCheckedChange={(checked) =>
                    setSettings(prev => ({ ...prev, flagContradictions: checked }))
                  }
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">
                  AI confidence threshold:
                </Label>
                <div className="space-y-2">
                  <Slider
                    value={[
                      settings.aiConfidenceThreshold === 'low' ? 33 :
                      settings.aiConfidenceThreshold === 'medium' ? 66 : 100
                    ]}
                    onValueChange={([value]) => {
                      const threshold = value <= 33 ? 'low' : value <= 66 ? 'medium' : 'high';
                      setSettings(prev => ({ ...prev, aiConfidenceThreshold: threshold }));
                    }}
                    max={100}
                    step={33}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                  <p className="text-xs text-gray-600 italic">
                    Only add nodes AI is confident about
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            Restore Defaults
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
