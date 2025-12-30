import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, TrendingUp, Clock, Search, Settings, BookOpen, List } from 'lucide-react';
import { motion } from 'motion/react';
import { mockPapers } from '../../data/mockData';
import { StatusBadge } from '../components/StatusBadge';
import { ImportanceScore } from '../components/ImportanceScore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Progress } from '../components/ui/progress';

export function Dashboard() {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Simulate upload
    setTimeout(() => navigate('/reader/1'), 1500);
  };

  return (
    <div className="flex h-screen bg-[#FAFAFA]">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <h1 className="flex items-center gap-2 text-xl font-semibold text-[#2563EB]">
            <BookOpen className="w-6 h-6" />
            PaperLens
          </h1>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg bg-blue-50 text-[#2563EB] font-medium">
            <FileText className="w-5 h-5" />
            Dashboard
          </button>
          <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
            <List className="w-5 h-5" />
            My Papers
          </button>
          <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
            <Clock className="w-5 h-5" />
            Reading Queue
          </button>
          <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700">
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Storage</span>
              <span className="font-medium text-gray-900">2.4 GB / 10 GB</span>
            </div>
            <Progress value={24} className="h-2" />
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm font-medium text-gray-900">Quick Stats</div>
            <div className="mt-2 space-y-1 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Papers analyzed</span>
                <span className="font-semibold">127</span>
              </div>
              <div className="flex justify-between">
                <span>Time saved</span>
                <span className="font-semibold">42h this month</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="mb-2">Welcome back, Researcher</h2>
            <p className="text-gray-600">Upload a paper to start analyzing citations and building your knowledge graph</p>
          </div>

          {/* Upload Area */}
          <motion.div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            animate={{ scale: dragActive ? 1.02 : 1 }}
            className={`mb-8 border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
              dragActive ? 'border-[#2563EB] bg-blue-50' : 'border-gray-300 bg-white'
            }`}
          >
            <div className="flex flex-col items-center gap-4">
              <div className={`p-4 rounded-full ${dragActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <Upload className={`w-8 h-8 ${dragActive ? 'text-[#2563EB]' : 'text-gray-400'}`} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {dragActive ? 'Drop your paper here' : 'Upload PDF Paper'}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Drag and drop your paper here, or{' '}
                  <button className="text-[#2563EB] hover:underline">browse files</button>
                </p>
              </div>
              <Button className="mt-2">
                <Upload className="w-4 h-4 mr-2" />
                Select PDF
              </Button>
            </div>
          </motion.div>

          {/* Search */}
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input placeholder="Search papers..." className="pl-10" />
          </div>

          {/* Recent Papers */}
          <div>
            <h3 className="mb-4">Recent Papers</h3>
            <div className="space-y-4">
              {mockPapers.map((paper, index) => (
                <motion.div
                  key={paper.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => paper.status === 'ready' && navigate(`/reader/${paper.id}`)}
                  className={`bg-white rounded-lg p-6 border border-gray-200 ${
                    paper.status === 'ready' ? 'cursor-pointer hover:border-[#2563EB] hover:shadow-md' : ''
                  } transition-all`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900 truncate">{paper.title}</h4>
                        <StatusBadge status={paper.status} size="sm" />
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{paper.authors.join(', ')}</p>
                      {paper.venue && (
                        <p className="text-sm text-gray-500">
                          {paper.venue} {paper.year} • Uploaded {new Date(paper.uploadDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {paper.status === 'ready' && (
                      <div className="flex items-center gap-6 flex-shrink-0">
                        <div className="text-center">
                          <div className="text-2xl font-semibold text-gray-900">{paper.citationCount}</div>
                          <div className="text-xs text-gray-600">Citations</div>
                        </div>
                        <ImportanceScore score={paper.criticalityScore} size="md" showLabel={false} />
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Open</Button>
                          <Button variant="ghost" size="sm">Export</Button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
