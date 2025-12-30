# Academic Paper Reading Assistant - Project Management Features

## Navigation Guide

### Main Routes
- `/` or `/projects` - **Projects Dashboard** (New Landing Page)
- `/project/:id` - **Single Project Workspace**
- `/papers` - Original Papers Dashboard
- `/reader/:id` - Reading Interface
- `/graph/:id` - Knowledge Graph
- `/export/:id` - Export View

## New Features

### 1. Projects Dashboard
**Location:** `/projects`

**Features:**
- Grid/List view toggle for projects
- Project cards with:
  - Color-coded themes
  - Paper counts (total, unread, annotated)
  - Reading progress bars
  - Citation review progress
  - Last activity timestamps
  - Most cited authors
  - Key methodologies
  - AI enablement badge
  - Action menu (Edit/Archive/Export/Delete)

**Right Sidebar:**
- Cross-project insights (88 total papers)
- AI recommendations panel
- Recent activity feed
- Storage usage meter

### 2. Create Project Modal
**Trigger:** Click "New Project" button

**Step 1 - Basic Info:**
- Project name (required)
- Description with 500 char limit
- Multi-select research areas (10 options)
- Color picker (10 preset colors)
- Start date and target completion

**Step 2 - Initial Setup:**
- Drag-and-drop PDF upload
- DOI/arXiv ID bulk import
- Integration hints for Zotero/Mendeley

**Step 3 - AI Assistant:**
- Research question textarea
- Focus areas (Methods/Theory/Empirical/Review)
- AI auto-suggest toggle
- Frequency selector (Weekly/Bi-weekly/Monthly)
- Expected paper volume slider (10-200)

### 3. Project Workspace
**Location:** `/project/:id`

**Three-Tab Layout:**

#### Tab 1: Papers Library
- **Left Sidebar:** Category filters with counts
- **Toolbar:** Search, Add Papers, View toggle
- **Paper Cards:**
  - Checkbox for bulk selection
  - PDF thumbnail
  - Title, authors, venue, year
  - Multiple category tags (color-coded)
  - Custom tags
  - Status indicators (✓ Read, ○ In Progress, ★ Key Paper, □ Unread)
  - Relevance score with explanation
  - Expandable details
- **Bulk Actions:** Appears when papers selected

#### Tab 2: AI Research Assistant
- **AI Suggestions Panel:**
  - Paper recommendations with reasoning
  - Confidence badges (High/Medium/Low)
  - Suggested categories
  - Feedback buttons (👍 👎)
  - Add to project / Dismiss actions
- **Discovery Queries:**
  - AI search with example queries
  - Query history
- **Monitoring Dashboard:**
  - Watching topics (editable)
  - Notification settings

#### Tab 3: Insights & Analytics
- **Charts:**
  - Pie chart: Paper type distribution
  - Line chart: Reading progress over time
  - Bar chart: Most cited authors
  - Methodology map with progress bars
- **Smart Summaries:**
  - Key methodologies (AI-generated)
  - Research timeline
  - Knowledge gaps detection
- **Export Options:**
  - Literature Review Outline
  - Citation Network
  - Reading List by Category
  - Methodology Comparison Table

## Component Library

### New Components

#### CategoryTag
```tsx
<CategoryTag category="methods" size="md" removable />
```
- Props: category, size (sm/md/lg), removable, isPrimary, onClick
- Color-coded with icons and tooltips
- 6 categories: Methods, Knowledge, Conclusion, Foundational, Review, Uncategorized

#### RelevanceScore
```tsx
<RelevanceScore score={92} reasoning="..." editable />
```
- Visual meter (red→yellow→green gradient)
- Popover with explanation
- Editable slider option

#### ProjectCard
```tsx
<ProjectCard project={project} onEdit={...} />
```
- Rich project preview
- Stats grid and progress bars
- Dropdown menu
- Hover animations

#### CreateProjectModal
```tsx
<CreateProjectModal open={true} onClose={...} onComplete={...} />
```
- 3-step wizard with validation
- Progressive disclosure
- Smooth transitions

## Data Structure

### Project
```typescript
{
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
```

### ProjectPaper
```typescript
{
  id: string;
  title: string;
  authors: string[];
  year: number;
  venue: string;
  categories: PaperCategory[];
  customTags: string[];
  status: 'unread' | 'in-progress' | 'read' | 'key-paper';
  readProgress: number; // 0-100
  relevanceScore: number; // 0-100
  aiReasoning: string;
  dateAdded: string;
  citationCount: number;
  doi?: string;
}
```

### Category System
- 🔬 Methods: Blue (#3B82F6)
- 📚 Knowledge: Purple (#8B5CF6)
- 📊 Conclusion: Green (#10B981)
- 🎯 Foundational: Red (#EF4444)
- 🔍 Review: Orange (#F59E0B)
- 📄 Uncategorized: Gray (#9CA3AF)

## Testing Instructions

1. **Start at Projects Dashboard:**
   - View 3 mock projects
   - Toggle grid/list view
   - Check right sidebar insights

2. **Create New Project:**
   - Click "New Project"
   - Fill all 3 steps
   - Verify validation on Step 1
   - Submit to create

3. **Explore Project Workspace:**
   - Click any project card
   - Navigate through 3 tabs
   - Filter papers by category
   - Select papers for bulk actions
   - Expand paper details

4. **Test AI Features:**
   - Go to AI Assistant tab
   - View suggestions with reasoning
   - Try example queries
   - Add/remove watching topics

5. **View Analytics:**
   - Go to Insights tab
   - Check all charts render
   - View AI summaries
   - Click export options

## Design System

**Colors:**
- Primary: #2563EB (Blue)
- Success: #10B981 (Green)
- Warning: #F59E0B (Orange)
- Error: #EF4444 (Red)
- Purple: #8B5CF6 (AI features)

**Typography:**
- Font: Inter (UI), Georgia (Reading)
- Sizes: Default theme.css tokens

**Spacing:**
- Base: 8px grid system

**Animations:**
- Duration: 300ms
- Easing: ease-in-out
- Motion: Framer Motion for complex animations

**Components:**
- Border radius: 8-12px (rounded-lg/xl)
- Shadows: Subtle elevation on hover
- Borders: 1-2px solid

## Known Mock Data

### Projects (3)
1. "Transformer Models for Protein Folding" (Blue)
2. "Graph Neural Networks Survey" (Purple)
3. "Explainable AI for Healthcare" (Green)

### Papers (6)
1. "Highly accurate protein structure prediction with AlphaFold"
2. "Attention Is All You Need"
3. "ProtTrans: Towards Cracking the Language of Life"
4. "MSA Transformer for Protein Sequence Analysis"
5. "A Review of Deep Learning Methods for Protein Structure Prediction"
6. "End-to-end differentiable learning of protein structure"

### AI Suggestions (3)
1. "ESMFold: Accurate Protein Structure Prediction at Scale"
2. "Geometric Deep Learning on Protein Structure"
3. "Benchmarking AlphaFold2 on Recent CASP Targets"
