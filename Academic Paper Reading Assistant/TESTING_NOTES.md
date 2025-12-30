# Knowledge Tree Feature - Testing Guide

## Quick Start Testing

### 1. Navigate to Knowledge Tree
1. Go to Projects Dashboard (`/projects`)
2. Click on "Thesis Chapter 2" project
3. Click on the "🌳 Knowledge Tree" tab (4th tab)

### 2. First-Time Experience
- **Expected:** Onboarding modal should appear automatically
- **Actions to test:**
  - Click through the introduction (2 steps)
  - Select "Build from existing papers"
  - Check "Don't show again"
  - Click "Build Tree"
- **Expected result:** 
  - Modal closes
  - Toast notification: "Building knowledge tree from 12 existing papers..."
  - After 2 seconds: "Knowledge tree built successfully!"
  - Tree visualization appears with animated nodes

### 3. Tree Visualization
- **Expected:** Interactive tree with 9 nodes visible
- **Actions to test:**
  - **Zoom:** Scroll mouse wheel up/down
  - **Pan:** Click and drag on empty space
  - **Reset view:** Click maximize button (top right)
  - **Zoom in/out:** Click +/- buttons (top right)
- **Expected result:** Smooth zoom/pan animations

### 4. Node Interaction
- **Actions to test:**
  - Click on "Blood Biomarkers" node
- **Expected result:**
  - Side panel slides in from right (480px width)
  - Shows comprehensive information:
    - WHAT section with blue background
    - WHY section with mechanism details
    - HOW section with 3 methods:
      - Plasma p-tau181 (4 stars)
      - Neurofilament light (5 stars)
      - Multi-protein panels (2 stars)
    - GAPS section with 3 gaps
    - Contributing Papers list (3 papers)
  - Action buttons at bottom:
    - Link to Node
    - Edit Summary
    - Export Node

### 5. Node Details Panel
- **Actions to test:**
  - Click "Back to Tree" button
  - Click different nodes (Amyloid Plaques, Tau Tangles)
  - Click "Read" button on any paper
- **Expected result:**
  - Panel closes smoothly
  - Different node information loads
  - Toast notification for paper click

### 6. View Modes
- **Actions to test:**
  - Click "Timeline View" tab
- **Expected result:**
  - Switches to timeline visualization
  - Shows chronological progression (2024 events)
  - Click any node → Detail panel appears
  - Switch back to "Tree View" → Returns to tree

### 7. Settings Modal
- **Actions to test:**
  - Click "Settings" button (top right)
- **Expected result:**
  - Settings modal opens
  - 4 sections visible:
    - 🤖 AUTO-BUILD MODE
    - 🌳 TREE STRUCTURE
    - 🎨 VISUAL SETTINGS
    - 📊 AI INTELLIGENCE
  - Toggle switches work
  - Checkboxes are interactive
  - Dropdown menus open
  - Slider moves smoothly
  - "Save Settings" button works
  - "Restore Defaults" resets values

### 8. Export Modal
- **Actions to test:**
  - Click "Export" button (top right)
- **Expected result:**
  - Export modal opens
  - 4 format options visible:
    - Visual map (PNG/SVG)
    - Structured outline (Markdown/Word)
    - Interactive HTML
    - Research note format (LaTeX/BibTeX)
  - Include checkboxes work
  - "Generate Literature Review" checkbox toggles options
  - Style dropdown changes
  - Preview section shows sample content
  - "Export" button shows success toast

### 9. Auto-Build Toggle
- **Actions to test:**
  - Toggle "Auto-Build" switch (top right of tree)
- **Expected result:**
  - Switch animates smoothly
  - State persists when toggling

### 10. Stats Display
- **Expected:** Small white card in top-left corner showing:
  - "9 nodes"
  - "3 main domains"
  - "9 gaps identified"

## Visual Tests

### Colors
- **Blue nodes (🔵):** Amyloid Plaques, Tau Tangles (mechanisms)
- **Green nodes (🟢):** Blood Biomarkers, AI Screening (solutions)
- **Red indicator (🔴):** Should appear for gaps in detail panel
- **Gold star (⭐):** On Amyloid Plaques, Tau Tangles, and root node

### Animations
- **Node appearance:** Smooth scale-in animation (0.5s duration)
- **Connection lines:** Draw from start to end (0.8-1s duration)
- **Panel slide:** Smooth slide-in from right
- **Hover effects:** Nodes scale to 1.05 on hover
- **Zoom/pan:** Smooth transform transitions

### Responsive Behavior
- **Node sizes:** Scale with paper count (80-140px)
- **Text wrapping:** Node titles wrap correctly
- **Panel scrolling:** Detail panel scrolls if content overflows
- **Settings modal:** Scrolls on smaller screens

## Edge Cases to Test

### Empty State (not visible with mock data)
- Clear localStorage
- Should show empty tree state with "Build Knowledge Tree" button

### Long Content
- Node with many papers
- Node with long gap descriptions
- Should scroll in detail panel

### Interactions
- Click node while panel is open → Panel content updates
- Click outside panel → Panel should stay open (must click X or Back)
- Rapid node clicking → Should handle gracefully
- Zoom limits → Should stop at min (0.3) and max (2.0)

## Toast Notifications to Expect

1. **On tree build:** "Building knowledge tree from 12 existing papers..."
2. **After build:** "Knowledge tree built successfully! 4 domains, 18 nodes created"
3. **On node action:** "Node connection feature coming soon!"
4. **On edit:** "Edit node feature coming soon!"
5. **On export node:** "Node exported successfully!"
6. **On paper click:** "Opening paper [id]..."
7. **On export:** "Exporting tree as [format]... Your export will download shortly"
8. **On settings save:** Implicit (closes modal)

## Browser Compatibility

### Should work in:
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile Chrome/Safari (with touch events)

### Known limitations:
- Pan/zoom works best with mouse
- Touch gestures on mobile may need refinement
- Very old browsers may not support Motion animations

## Performance Tests

### With 9 nodes (mock data):
- Initial render: < 100ms
- Animation duration: 0.5-1s total
- Smooth 60fps animations
- No jank on zoom/pan

### Scalability considerations:
- 50+ nodes: May need virtualization
- 100+ nodes: Definitely needs optimization
- Current implementation: Good for 10-30 nodes

## Data Validation

### Check mock data integrity:
```typescript
// All these should be true:
- tree.nodes.length === 9
- tree.mainBranches.length === 3
- tree.connections.length === 3
- Root node has id 'root'
- All nodes have valid positions
- All methods have 1-5 maturity levels
```

## Accessibility (Basic)

### Should test:
- ✅ Keyboard navigation (Tab key)
- ✅ Focus indicators on buttons
- ✅ ARIA labels on interactive elements
- ✅ Color contrast (all text passes WCAG AA)

### Not fully implemented:
- Screen reader tree navigation
- Keyboard-only pan/zoom
- High contrast mode

## Integration Tests

### With existing features:
1. **Projects Dashboard:**
   - Navigate from dashboard to project
   - Should retain project context
   
2. **Other tabs:**
   - Switch between Papers Library, AI Assistant, Insights, Knowledge Tree
   - State should persist
   
3. **Navigation:**
   - Use browser back button
   - Should navigate correctly

## Common Issues & Solutions

### Issue: Onboarding doesn't show
- **Solution:** Clear localStorage key `knowledgeTreeOnboarding`

### Issue: Nodes overlap
- **Solution:** Check mock data positions in `knowledgeTreeData.ts`

### Issue: Panel doesn't open
- **Solution:** Check React DevTools for selectedNode state

### Issue: Animations jerky
- **Solution:** Check browser DevTools performance tab

### Issue: Toast doesn't appear
- **Solution:** Ensure Toaster component is rendered in app root

## Success Criteria

✅ All 9 nodes render correctly  
✅ Zoom/pan works smoothly  
✅ Detail panel slides in/out  
✅ Settings modal opens and saves  
✅ Export modal shows preview  
✅ Timeline view displays correctly  
✅ Onboarding appears first time  
✅ Auto-build toggle works  
✅ All animations are smooth (60fps)  
✅ No console errors  
✅ No TypeScript errors  
✅ Responsive on desktop/tablet  

## Next Steps After Testing

1. **Bug fixes:** Address any issues found
2. **Performance:** Profile if slow with many nodes
3. **Accessibility:** Add keyboard controls
4. **Mobile:** Test on real devices
5. **Backend:** Connect to real API
6. **AI:** Implement real extraction logic
