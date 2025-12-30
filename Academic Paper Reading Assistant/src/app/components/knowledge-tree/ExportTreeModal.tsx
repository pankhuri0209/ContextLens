import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Download, FileText, Code, FileImage } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface ExportTreeModalProps {
  open: boolean;
  onClose: () => void;
  onExport: (format: string, options: any) => void;
}

export function ExportTreeModal({ open, onClose, onExport }: ExportTreeModalProps) {
  const [format, setFormat] = useState<'visual' | 'outline' | 'html' | 'research'>('visual');
  const [includeNodes, setIncludeNodes] = useState(true);
  const [includeDescriptions, setIncludeDescriptions] = useState(true);
  const [includePapers, setIncludePapers] = useState(true);
  const [includeGaps, setIncludeGaps] = useState(true);
  const [includeAnnotations, setIncludeAnnotations] = useState(false);
  const [generateReview, setGenerateReview] = useState(true);
  const [reviewStyle, setReviewStyle] = useState('problem-solution');

  const handleExport = () => {
    onExport(format, {
      includeNodes,
      includeDescriptions,
      includePapers,
      includeGaps,
      includeAnnotations,
      generateReview,
      reviewStyle
    });
    onClose();
  };

  const previewContent = `1. Introduction
   
2. Biology & Pathophysiology
   2.1 Amyloid Plaques (5 papers)
       - What: Abnormal protein clusters disrupting cell function
       - Why: Earliest pathological change, 10-20 years before symptoms
       - How: Anti-amyloid antibodies, BACE inhibitors
       
   2.2 Tau Tangles (4 papers)
       - What: Twisted protein fibers inside neurons
       - Why: Correlates strongly with cognitive decline
       - How: Tau aggregation inhibitors
       
3. Diagnosis & Detection
   3.1 Blood Biomarkers (3 papers)
       - What: Non-invasive blood tests for early diagnosis
       - Why: Current methods invasive and expensive
       - How: Plasma p-tau181, NfL, ML panels
       
   3.2 AI-Based Screening (2 papers)
       - What: ML algorithms for early detection
       - Why: Identifies subtle patterns humans miss
       - How: Retinal imaging + deep learning`;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Knowledge Tree
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-6 py-4">
              {/* Export Format */}
              <div>
                <Label className="font-semibold mb-3 block">Export format:</Label>
                <RadioGroup value={format} onValueChange={(value: any) => setFormat(value)}>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 p-3 border-2 border-gray-200 rounded-lg hover:border-blue-400 cursor-pointer transition-colors">
                      <RadioGroupItem value="visual" id="visual" className="mt-1" />
                      <Label htmlFor="visual" className="cursor-pointer flex-1">
                        <div className="flex items-center gap-2 font-medium text-gray-900">
                          <FileImage className="w-4 h-4" />
                          Visual map (PNG/SVG)
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          High-resolution tree diagram for presentations
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-start space-x-3 p-3 border-2 border-gray-200 rounded-lg hover:border-blue-400 cursor-pointer transition-colors">
                      <RadioGroupItem value="outline" id="outline" className="mt-1" />
                      <Label htmlFor="outline" className="cursor-pointer flex-1">
                        <div className="flex items-center gap-2 font-medium text-gray-900">
                          <FileText className="w-4 h-4" />
                          Structured outline (Markdown/Word)
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Hierarchical text format for writing
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-start space-x-3 p-3 border-2 border-gray-200 rounded-lg hover:border-blue-400 cursor-pointer transition-colors">
                      <RadioGroupItem value="html" id="html" className="mt-1" />
                      <Label htmlFor="html" className="cursor-pointer flex-1">
                        <div className="flex items-center gap-2 font-medium text-gray-900">
                          <Code className="w-4 h-4" />
                          Interactive HTML
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Shareable web page with clickable nodes
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-start space-x-3 p-3 border-2 border-gray-200 rounded-lg hover:border-blue-400 cursor-pointer transition-colors">
                      <RadioGroupItem value="research" id="research" className="mt-1" />
                      <Label htmlFor="research" className="cursor-pointer flex-1">
                        <div className="flex items-center gap-2 font-medium text-gray-900">
                          <FileText className="w-4 h-4" />
                          Research note format (LaTeX/BibTeX)
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Academic paper format with citations
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Include Options */}
              <div>
                <Label className="font-semibold mb-3 block">Include:</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="nodes"
                      checked={includeNodes}
                      onCheckedChange={(checked) => setIncludeNodes(checked as boolean)}
                    />
                    <Label htmlFor="nodes" className="text-sm cursor-pointer">
                      All nodes and connections
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="descriptions"
                      checked={includeDescriptions}
                      onCheckedChange={(checked) => setIncludeDescriptions(checked as boolean)}
                    />
                    <Label htmlFor="descriptions" className="text-sm cursor-pointer">
                      What/Why/How descriptions
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="papers"
                      checked={includePapers}
                      onCheckedChange={(checked) => setIncludePapers(checked as boolean)}
                    />
                    <Label htmlFor="papers" className="text-sm cursor-pointer">
                      Contributing papers (with citations)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="gaps"
                      checked={includeGaps}
                      onCheckedChange={(checked) => setIncludeGaps(checked as boolean)}
                    />
                    <Label htmlFor="gaps" className="text-sm cursor-pointer">
                      Research gaps highlighted
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="annotations"
                      checked={includeAnnotations}
                      onCheckedChange={(checked) => setIncludeAnnotations(checked as boolean)}
                    />
                    <Label htmlFor="annotations" className="text-sm cursor-pointer">
                      My personal annotations
                    </Label>
                  </div>
                </div>
              </div>

              {/* Generate Literature Review */}
              <div className="border-t pt-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox
                    id="generateReview"
                    checked={generateReview}
                    onCheckedChange={(checked) => setGenerateReview(checked as boolean)}
                  />
                  <Label htmlFor="generateReview" className="font-semibold cursor-pointer">
                    📝 Generate Literature Review
                  </Label>
                </div>

                {generateReview && (
                  <div className="pl-6 space-y-3">
                    <p className="text-sm text-gray-600">
                      Auto-generate review sections from tree
                    </p>
                    
                    <div>
                      <Label className="text-sm mb-2 block">Style:</Label>
                      <Select value={reviewStyle} onValueChange={setReviewStyle}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="problem-solution">Problem-solution structure</SelectItem>
                          <SelectItem value="chronological">Chronological</SelectItem>
                          <SelectItem value="thematic">Thematic</SelectItem>
                          <SelectItem value="methodological">Methodological</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>

              {/* Preview */}
              <div className="border-t pt-4">
                <Label className="font-semibold mb-3 block">Preview:</Label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-xs">
                  <pre className="whitespace-pre-wrap text-gray-800">{previewContent}</pre>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleExport}>
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
