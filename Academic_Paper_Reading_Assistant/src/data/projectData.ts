export type PaperCategory = 'methods' | 'knowledge' | 'conclusion' | 'foundational' | 'review' | 'uncategorized';

export type ReadStatus = 'unread' | 'in-progress' | 'read' | 'key-paper';

export interface ProjectPaper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  venue: string;
  categories: PaperCategory[];
  customTags: string[];
  status: ReadStatus;
  readProgress: number; // 0-100
  relevanceScore: number; // 0-100
  aiReasoning: string;
  dateAdded: string;
  citationCount: number;
  doi?: string;
  abstract?: string;
  thumbnailUrl?: string;
  projectNotes?: Record<string, string>; // projectId -> notes
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  researchAreas: string[];
  startDate: string;
  targetCompletion?: string;
  paperCount: number;
  unreadCount: number;
  annotatedCount: number;
  papersRead: number;
  totalPapers: number;
  criticalCitationsReviewed: number;
  totalCriticalCitations: number;
  lastActivity: string;
  mostCitedAuthors: string[];
  keyMethodologies: string[];
  aiSuggestionsEnabled: boolean;
  aiSuggestionFrequency: 'weekly' | 'bi-weekly' | 'monthly';
  papers: ProjectPaper[];
}

export interface AISuggestion {
  id: string;
  paper: Omit<ProjectPaper, 'categories' | 'status'>;
  reasoning: string;
  suggestedCategories: PaperCategory[];
  relevanceScore: number;
  confidence: 'high' | 'medium' | 'low';
  dismissed: boolean;
}

export const categoryConfig = {
  methods: {
    icon: '🔬',
    label: 'Methods',
    color: '#3B82F6',
    description: 'Papers introducing or comparing techniques/algorithms'
  },
  knowledge: {
    icon: '📚',
    label: 'Knowledge',
    color: '#8B5CF6',
    description: 'Theoretical foundations, background, domain knowledge'
  },
  conclusion: {
    icon: '📊',
    label: 'Conclusion',
    color: '#10B981',
    description: 'Papers with empirical results, findings, experiments'
  },
  foundational: {
    icon: '🎯',
    label: 'Foundational',
    color: '#EF4444',
    description: 'Seminal works, must-read papers'
  },
  review: {
    icon: '🔍',
    label: 'Review',
    color: '#F59E0B',
    description: 'Surveys, systematic reviews, meta-analyses'
  },
  uncategorized: {
    icon: '📄',
    label: 'Uncategorized',
    color: '#9CA3AF',
    description: 'Papers not yet categorized'
  }
};

export const mockProjectPapers: ProjectPaper[] = [
  {
    id: 'pp1',
    title: 'Highly accurate protein structure prediction with AlphaFold',
    authors: ['Jumper, J.', 'Evans, R.', 'Pritzel, A.', 'et al.'],
    year: 2021,
    venue: 'Nature',
    categories: ['methods', 'foundational'],
    customTags: ['AlphaFold', 'Deep Learning', 'Structure Prediction'],
    status: 'key-paper',
    readProgress: 100,
    relevanceScore: 98,
    aiReasoning: 'Foundational paper for transformer-based protein folding. Introduces the core architecture you are building upon.',
    dateAdded: '2024-01-20',
    citationCount: 15234,
    doi: '10.1038/s41586-021-03819-2',
    abstract: 'Proteins are essential to life, and understanding their structure can facilitate a mechanistic understanding of their function. Through an enormous experimental effort, the structures of around 100,000 unique proteins have been determined, but this represents a small fraction of the billions of known protein sequences. Structural coverage is bottlenecked by the months to years of painstaking effort required to determine a single protein structure. Accurate computational approaches are needed to address this gap and to enable large-scale structural bioinformatics. We present AlphaFold, a deep learning system that achieves unprecedented levels of accuracy in predicting protein structures.'
  },
  {
    id: 'pp2',
    title: 'Attention Is All You Need',
    authors: ['Vaswani, A.', 'Shazeer, N.', 'Parmar, N.', 'et al.'],
    year: 2017,
    venue: 'NeurIPS',
    categories: ['methods', 'foundational'],
    customTags: ['Transformers', 'Attention', 'Architecture'],
    status: 'read',
    readProgress: 100,
    relevanceScore: 95,
    aiReasoning: 'Introduces transformer architecture which is the basis of modern protein folding models.',
    dateAdded: '2024-01-18',
    citationCount: 89562,
    abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.'
  },
  {
    id: 'pp3',
    title: 'ProtTrans: Towards Cracking the Language of Life',
    authors: ['Elnaggar, A.', 'Heinzinger, M.', 'Dallago, C.', 'et al.'],
    year: 2021,
    venue: 'IEEE/ACM TCBB',
    categories: ['methods', 'knowledge'],
    customTags: ['Protein Language Models', 'Transfer Learning'],
    status: 'in-progress',
    readProgress: 65,
    relevanceScore: 88,
    aiReasoning: 'Applies transformers to protein sequences. Highly relevant for understanding sequence representations.',
    dateAdded: '2024-02-05',
    citationCount: 542,
    abstract: 'Computational biology and bioinformatics provide vast data gold-mines from protein sequences, ideal for Language Models (LMs) taken from Natural Language Processing (NLP). These LMs reach for new prediction frontiers at low inference costs.'
  },
  {
    id: 'pp4',
    title: 'MSA Transformer for Protein Sequence Analysis',
    authors: ['Rao, R.', 'Liu, J.', 'Verkuil, R.', 'et al.'],
    year: 2021,
    venue: 'ICML',
    categories: ['methods'],
    customTags: ['MSA', 'Evolutionary Information'],
    status: 'unread',
    readProgress: 0,
    relevanceScore: 92,
    aiReasoning: 'Key method for processing multiple sequence alignments with transformers, crucial for your approach.',
    dateAdded: '2024-11-10',
    citationCount: 287,
    abstract: 'Unsupervised protein language models trained across millions of diverse sequences learn structure and function of proteins. Protein language models studied to date have been trained to perform inference using single sequences.'
  },
  {
    id: 'pp5',
    title: 'A Review of Deep Learning Methods for Protein Structure Prediction',
    authors: ['Senior, A.', 'Evans, R.', 'Jumper, J.'],
    year: 2020,
    venue: 'Nature Reviews',
    categories: ['review', 'knowledge'],
    customTags: ['Survey', 'Structure Prediction'],
    status: 'read',
    readProgress: 100,
    relevanceScore: 85,
    aiReasoning: 'Comprehensive review providing context for deep learning approaches in protein folding.',
    dateAdded: '2024-01-25',
    citationCount: 1823,
    abstract: 'Predicting the three-dimensional structure of a protein from its amino acid sequence is a grand challenge in computational biology. Recent progress in deep learning has led to significant improvements in this area.'
  },
  {
    id: 'pp6',
    title: 'End-to-end differentiable learning of protein structure',
    authors: ['AlQuraishi, M.'],
    year: 2019,
    venue: 'Cell Systems',
    categories: ['methods', 'conclusion'],
    customTags: ['End-to-end', 'Differentiable'],
    status: 'read',
    readProgress: 100,
    relevanceScore: 90,
    aiReasoning: 'Important early work on end-to-end protein structure prediction with neural networks.',
    dateAdded: '2024-02-12',
    citationCount: 892,
    abstract: 'We introduce a conceptually simple method for predicting protein structure from sequence using a deep neural network. Our method is fully differentiable and can be trained end-to-end.'
  }
];

export const mockProjects: Project[] = [
  {
    id: 'p1',
    name: 'Transformer Models for Protein Folding',
    description: 'Investigating the application of attention mechanisms and transformer architectures to predict protein 3D structure from amino acid sequences.',
    color: '#3B82F6',
    researchAreas: ['Machine Learning', 'Computational Biology', 'Deep Learning'],
    startDate: '2024-01-15',
    targetCompletion: '2025-06-30',
    paperCount: 28,
    unreadCount: 6,
    annotatedCount: 15,
    papersRead: 22,
    totalPapers: 28,
    criticalCitationsReviewed: 45,
    totalCriticalCitations: 78,
    lastActivity: '2024-12-28T10:30:00',
    mostCitedAuthors: ['AlQuraishi, M.', 'Jumper, J.', 'Senior, A.'],
    keyMethodologies: ['Transformers', 'MSA Processing', 'Attention Mechanisms'],
    aiSuggestionsEnabled: true,
    aiSuggestionFrequency: 'weekly',
    papers: []
  },
  {
    id: 'p2',
    name: 'Graph Neural Networks Survey',
    description: 'Comprehensive review of GNN architectures, applications, and theoretical foundations for my literature review chapter.',
    color: '#8B5CF6',
    researchAreas: ['Machine Learning', 'Graph Theory', 'Neural Networks'],
    startDate: '2024-09-01',
    targetCompletion: '2025-01-31',
    paperCount: 42,
    unreadCount: 12,
    annotatedCount: 25,
    papersRead: 30,
    totalPapers: 42,
    criticalCitationsReviewed: 68,
    totalCriticalCitations: 95,
    lastActivity: '2024-12-27T15:45:00',
    mostCitedAuthors: ['Kipf, T.', 'Hamilton, W.', 'Veličković, P.'],
    keyMethodologies: ['Message Passing', 'Graph Convolution', 'Graph Attention'],
    aiSuggestionsEnabled: true,
    aiSuggestionFrequency: 'bi-weekly',
    papers: []
  },
  {
    id: 'p3',
    name: 'Explainable AI for Healthcare',
    description: 'Research on interpretability methods for deep learning models in medical diagnosis applications.',
    color: '#10B981',
    researchAreas: ['Explainable AI', 'Healthcare', 'Medical Imaging'],
    startDate: '2024-03-20',
    paperCount: 18,
    unreadCount: 8,
    annotatedCount: 7,
    papersRead: 10,
    totalPapers: 18,
    criticalCitationsReviewed: 22,
    totalCriticalCitations: 34,
    lastActivity: '2024-12-26T09:20:00',
    mostCitedAuthors: ['Lundberg, S.', 'Ribeiro, M.', 'Molnar, C.'],
    keyMethodologies: ['SHAP', 'LIME', 'Attention Visualization'],
    aiSuggestionsEnabled: false,
    aiSuggestionFrequency: 'monthly',
    papers: []
  }
];

// Now assign papers after both arrays are declared
mockProjects[0].papers = mockProjectPapers.filter(p => ['pp1', 'pp2', 'pp3', 'pp4', 'pp5', 'pp6'].includes(p.id));
mockProjects[1].papers = [];
mockProjects[2].papers = [];

export const mockAISuggestions: AISuggestion[] = [
  {
    id: 's1',
    paper: {
      id: 'pp7',
      title: 'ESMFold: Accurate Protein Structure Prediction at Scale',
      authors: ['Lin, Z.', 'Akin, H.', 'Rao, R.', 'et al.'],
      year: 2023,
      venue: 'Science',
      customTags: ['ESMFold', 'Language Models', 'Scale'],
      readProgress: 0,
      relevanceScore: 94,
      aiReasoning: 'Recent breakthrough achieving AlphaFold-level accuracy with language models. Uses transformers without MSA.',
      dateAdded: new Date().toISOString(),
      citationCount: 423,
      abstract: 'We present ESMFold, a fast and accurate protein structure prediction model that achieves AlphaFold2-level accuracy without requiring multiple sequence alignments.'
    },
    reasoning: 'This paper presents a competing approach to AlphaFold using pure language models. Relevant because it demonstrates transformer applications without MSA processing, which could inform your architecture choices.',
    suggestedCategories: ['methods', 'conclusion'],
    relevanceScore: 94,
    confidence: 'high',
    dismissed: false
  },
  {
    id: 's2',
    paper: {
      id: 'pp8',
      title: 'Geometric Deep Learning on Protein Structure',
      authors: ['Ingraham, J.', 'Garg, V.', 'Barzilay, R.', 'Jaakkola, T.'],
      year: 2023,
      venue: 'NeurIPS',
      customTags: ['Geometric DL', 'Structure', 'Graph Networks'],
      readProgress: 0,
      relevanceScore: 88,
      aiReasoning: 'Combines geometric deep learning with protein structure prediction. Alternative approach to transformers.',
      dateAdded: new Date().toISOString(),
      citationCount: 234,
      abstract: 'We develop geometric deep learning methods for protein structure prediction that leverage the 3D geometry of proteins.'
    },
    reasoning: 'Explores geometric deep learning methods that could complement transformer approaches. Important for understanding alternative architectures.',
    suggestedCategories: ['methods', 'knowledge'],
    relevanceScore: 88,
    confidence: 'high',
    dismissed: false
  },
  {
    id: 's3',
    paper: {
      id: 'pp9',
      title: 'Benchmarking Deep Learning Models for Protein Folding',
      authors: ['Zhang, Y.', 'Liu, X.', 'Chen, M.'],
      year: 2023,
      venue: 'Bioinformatics',
      customTags: ['Benchmark', 'Evaluation', 'Comparison'],
      readProgress: 0,
      relevanceScore: 82,
      aiReasoning: 'Comprehensive benchmark comparing various deep learning approaches for protein folding.',
      dateAdded: new Date().toISOString(),
      citationCount: 156,
      abstract: 'We present a comprehensive benchmark of deep learning models for protein structure prediction across multiple datasets and evaluation metrics.'
    },
    reasoning: 'Provides systematic comparison of different approaches. Useful for understanding the landscape and positioning your work.',
    suggestedCategories: ['review', 'knowledge'],
    relevanceScore: 82,
    confidence: 'medium',
    dismissed: false
  },
  {
    id: 's4',
    paper: {
      id: 'pp10',
      title: 'Transfer Learning for Protein Language Models',
      authors: ['Wang, S.', 'Brown, K.', 'Davis, L.'],
      year: 2023,
      venue: 'ICML',
      customTags: ['Transfer Learning', 'Pre-training', 'Fine-tuning'],
      readProgress: 0,
      relevanceScore: 85,
      aiReasoning: 'Explores transfer learning strategies for protein language models, relevant for model development.',
      dateAdded: new Date().toISOString(),
      citationCount: 189,
      abstract: 'We investigate transfer learning approaches for protein language models and demonstrate effective fine-tuning strategies for downstream tasks.'
    },
    reasoning: 'Covers transfer learning which is crucial for developing practical protein folding models. Could inform your training strategy.',
    suggestedCategories: ['methods', 'knowledge'],
    relevanceScore: 85,
    confidence: 'high',
    dismissed: false
  }
];