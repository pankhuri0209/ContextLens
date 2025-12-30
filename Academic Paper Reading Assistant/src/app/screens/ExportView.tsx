import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, Download, CheckCircle } from 'lucide-react';
import { mockPapers } from '../../data/mockData';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { Progress } from '../components/ui/progress';

export function ExportView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [format, setFormat] = useState('annotated-pdf');
  const [includeGraph, setIncludeGraph] = useState(true);
  const [criticalOnly, setCriticalOnly] = useState(false);
  const [includeNotes, setIncludeNotes] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const paper = mockPapers.find(p => p.id === id);

  if (!paper) return null;

  const handleExport = () => {
    setExporting(true);
    setExportProgress(0);

    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setExporting(false);
            setExportProgress(0);
          }, 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/reader/${id}`)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Reading
          </Button>
          <h1>Export Annotated Paper</h1>
          <p className="text-gray-600 mt-2">{paper.title}</p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Export Options */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="mb-4">Export Format</h2>

              <div className="space-y-3">
                <button
                  onClick={() => setFormat('annotated-pdf')}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    format === 'annotated-pdf'
                      ? 'border-[#2563EB] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                      format === 'annotated-pdf' ? 'border-[#2563EB]' : 'border-gray-300'
                    }`}>
                      {format === 'annotated-pdf' && (
                        <div className="w-3 h-3 rounded-full bg-[#2563EB]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Annotated PDF</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Original paper with inline citation summaries and highlights
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setFormat('html')}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    format === 'html'
                      ? 'border-[#2563EB] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                      format === 'html' ? 'border-[#2563EB]' : 'border-gray-300'
                    }`}>
                      {format === 'html' && (
                        <div className="w-3 h-3 rounded-full bg-[#2563EB]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">HTML Interactive</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Clickable web version with interactive citations
                      </div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setFormat('markdown')}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    format === 'markdown'
                      ? 'border-[#2563EB] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                      format === 'markdown' ? 'border-[#2563EB]' : 'border-gray-300'
                    }`}>
                      {format === 'markdown' && (
                        <div className="w-3 h-3 rounded-full bg-[#2563EB]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Reading Notes (Markdown)</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Structured summary with key citations and insights
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="mb-4">Customization</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="graph"
                    checked={includeGraph}
                    onCheckedChange={(checked) => setIncludeGraph(checked as boolean)}
                  />
                  <div className="flex-1">
                    <label htmlFor="graph" className="cursor-pointer">
                      Include graph visualization
                    </label>
                    <p className="text-sm text-gray-600">
                      Embed the citation network graph as an image
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="critical"
                    checked={criticalOnly}
                    onCheckedChange={(checked) => setCriticalOnly(checked as boolean)}
                  />
                  <div className="flex-1">
                    <label htmlFor="critical" className="cursor-pointer">
                      Include only critical citations (score {'>'}70)
                    </label>
                    <p className="text-sm text-gray-600">
                      Filter out less important references
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="notes"
                    checked={includeNotes}
                    onCheckedChange={(checked) => setIncludeNotes(checked as boolean)}
                  />
                  <div className="flex-1">
                    <label htmlFor="notes" className="cursor-pointer">
                      Include my highlights and notes
                    </label>
                    <p className="text-sm text-gray-600">
                      Add your personal annotations to the export
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleExport}
              disabled={exporting}
            >
              {exporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export Paper
                </>
              )}
            </Button>

            {exporting && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Processing...</span>
                  <span>{exportProgress}%</span>
                </div>
                <Progress value={exportProgress} className="h-2" />
              </div>
            )}

            {exportProgress === 100 && !exporting && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div className="text-sm text-green-800">
                  Export complete! Download started automatically.
                </div>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="mb-4">Preview</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 bg-gray-50">
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="space-y-2 mt-6">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
                <div className="flex gap-2 mt-4">
                  <div className="h-6 w-24 bg-red-200 rounded"></div>
                  <div className="h-6 w-20 bg-orange-200 rounded"></div>
                </div>
                <div className="space-y-2 mt-6">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                {includeGraph && (
                  <div className="mt-8 h-48 bg-blue-100 rounded flex items-center justify-center text-blue-600">
                    Citation Graph
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Export Includes:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• {format === 'annotated-pdf' ? 'PDF with annotations' : format === 'html' ? 'Interactive HTML file' : 'Markdown summary'}</li>
                <li>• {criticalOnly ? '12 critical citations' : '45 total citations'}</li>
                {includeGraph && <li>• Citation knowledge graph</li>}
                {includeNotes && <li>• Your personal notes</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
