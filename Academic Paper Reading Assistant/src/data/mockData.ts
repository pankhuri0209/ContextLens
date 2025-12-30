export interface Paper {
  id: string;
  title: string;
  authors: string[];
  uploadDate: string;
  status: 'processing' | 'ready' | 'failed';
  citationCount: number;
  criticalityScore: number;
  venue?: string;
  year?: number;
}

export interface Citation {
  id: string;
  paperId: string;
  title: string;
  authors: string[];
  year: number;
  venue: string;
  importanceScore: number;
  citationPurpose: 'critical' | 'core-method' | 'supporting' | 'background';
  whyCited: string;
  keyContribution: string[];
  context: string;
  sections: string[];
  pageNumber: number;
  abstract?: string;
}

export const mockPapers: Paper[] = [
  {
    id: '1',
    title: 'Attention Is All You Need',
    authors: ['Vaswani, A.', 'Shazeer, N.', 'Parmar, N.', 'et al.'],
    uploadDate: '2024-12-28',
    status: 'ready',
    citationCount: 45,
    criticalityScore: 92,
    venue: 'NeurIPS',
    year: 2017
  },
  {
    id: '2',
    title: 'BERT: Pre-training of Deep Bidirectional Transformers',
    authors: ['Devlin, J.', 'Chang, M.', 'Lee, K.', 'Toutanova, K.'],
    uploadDate: '2024-12-27',
    status: 'ready',
    citationCount: 38,
    criticalityScore: 88,
    venue: 'NAACL',
    year: 2019
  },
  {
    id: '3',
    title: 'Understanding Deep Learning Through Gradient Descent',
    authors: ['Smith, J.', 'Anderson, K.'],
    uploadDate: '2024-12-25',
    status: 'processing',
    citationCount: 0,
    criticalityScore: 0
  }
];

export const mockCitations: Citation[] = [
  {
    id: 'c1',
    paperId: '1',
    title: 'Neural Machine Translation by Jointly Learning to Align and Translate',
    authors: ['Bahdanau, D.', 'Cho, K.', 'Bengio, Y.'],
    year: 2015,
    venue: 'ICLR',
    importanceScore: 95,
    citationPurpose: 'critical',
    whyCited: 'Introduces the attention mechanism which is the foundation of this work',
    keyContribution: [
      'First successful application of attention in seq2seq models',
      'Demonstrated that alignment can be learned jointly',
      'Showed significant improvements over fixed-length context vectors'
    ],
    context: 'While previous approaches used fixed-length representations, Bahdanau et al. introduced...',
    sections: ['Introduction', 'Related Work', 'Methods'],
    pageNumber: 2,
    abstract: 'Neural machine translation is a recently proposed approach...'
  },
  {
    id: 'c2',
    paperId: '1',
    title: 'Long Short-Term Memory Networks',
    authors: ['Hochreiter, S.', 'Schmidhuber, J.'],
    year: 1997,
    venue: 'Neural Computation',
    importanceScore: 75,
    citationPurpose: 'core-method',
    whyCited: 'Provides the recurrent architecture that attention mechanisms improve upon',
    keyContribution: [
      'Solved the vanishing gradient problem in RNNs',
      'Enabled learning of long-term dependencies',
      'Became the standard for sequence modeling'
    ],
    context: 'LSTMs (Hochreiter & Schmidhuber, 1997) were the dominant approach before transformers...',
    sections: ['Background', 'Methods'],
    pageNumber: 3
  },
  {
    id: 'c3',
    paperId: '1',
    title: 'Sequence to Sequence Learning with Neural Networks',
    authors: ['Sutskever, I.', 'Vinyals, O.', 'Le, Q.'],
    year: 2014,
    venue: 'NIPS',
    importanceScore: 82,
    citationPurpose: 'core-method',
    whyCited: 'Established the seq2seq paradigm that transformers revolutionize',
    keyContribution: [
      'Introduced encoder-decoder architecture',
      'Demonstrated end-to-end learning for sequences',
      'Achieved strong results on machine translation'
    ],
    context: 'Building on the seq2seq framework (Sutskever et al., 2014), we remove the recurrence...',
    sections: ['Introduction', 'Methods', 'Results'],
    pageNumber: 1
  },
  {
    id: 'c4',
    paperId: '1',
    title: 'Batch Normalization: Accelerating Deep Network Training',
    authors: ['Ioffe, S.', 'Szegedy, C.'],
    year: 2015,
    venue: 'ICML',
    importanceScore: 55,
    citationPurpose: 'supporting',
    whyCited: 'Used as a normalization technique in our architecture',
    keyContribution: [
      'Reduced internal covariate shift',
      'Enabled higher learning rates',
      'Improved training stability'
    ],
    context: 'We apply batch normalization (Ioffe & Szegedy, 2015) after each sublayer...',
    sections: ['Methods'],
    pageNumber: 4
  },
  {
    id: 'c5',
    paperId: '1',
    title: 'Dropout: A Simple Way to Prevent Neural Networks from Overfitting',
    authors: ['Srivastava, N.', 'Hinton, G.', 'Krizhevsky, A.', 'et al.'],
    year: 2014,
    venue: 'JMLR',
    importanceScore: 45,
    citationPurpose: 'supporting',
    whyCited: 'Regularization technique employed during training',
    keyContribution: [
      'Simple yet effective regularization',
      'Prevents co-adaptation of features',
      'Widely applicable across architectures'
    ],
    context: 'We apply dropout (Srivastava et al., 2014) to prevent overfitting...',
    sections: ['Methods', 'Experiments'],
    pageNumber: 5
  },
  {
    id: 'c6',
    paperId: '1',
    title: 'Adam: A Method for Stochastic Optimization',
    authors: ['Kingma, D.', 'Ba, J.'],
    year: 2015,
    venue: 'ICLR',
    importanceScore: 38,
    citationPurpose: 'background',
    whyCited: 'Optimizer used for training our models',
    keyContribution: [
      'Combines advantages of AdaGrad and RMSProp',
      'Computationally efficient',
      'Well-suited for large-scale problems'
    ],
    context: 'All models were trained using Adam optimizer (Kingma & Ba, 2015)...',
    sections: ['Experiments'],
    pageNumber: 6
  }
];
