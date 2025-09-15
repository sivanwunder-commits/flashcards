# Portuguese Verb Tenses Flashcards App - Software Specification

## 1. Project Overview

### 1.1 Purpose
A web-based flashcards application designed to help users learn Portuguese verb conjugations across all tenses (excluding present tense). The app focuses on contextual learning through phrases and provides comprehensive tracking of learning progress.

### 1.2 Technology Stack
- **Frontend Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Modules or Styled Components
- **Data Storage**: JSON files with browser localStorage for user progress
- **Deployment**: Static web hosting (Vercel, Netlify, or similar)

### 1.3 Target Users
- Portuguese language learners at intermediate to advanced levels
- Students focusing on verb conjugation mastery
- Self-directed learners seeking structured practice

## 2. Functional Requirements

### 2.1 Core Features

#### 2.1.1 Flashcard System
- **Card Structure**: Each card displays a contextual Portuguese phrase with a verb in infinitive form
- **Example**: "Eu _____ (comer) pizza ontem" → Answer: "comi"
- **Flip Mechanism**: Click to reveal the correct conjugation
- **Feedback System**: Two buttons after revealing answer: "Got it right" and "Got it wrong"

#### 2.1.2 Verb Coverage
- **Tenses Included**:
  - Pretérito Perfeito (Simple Past)
  - Pretérito Imperfeito (Imperfect Past)
  - Pretérito Mais-que-perfeito (Pluperfect)
  - Futuro do Presente (Future)
  - Futuro do Pretérito (Conditional Future)
  - Presente do Subjuntivo (Present Subjunctive)
  - Imperfeito do Subjuntivo (Imperfect Subjunctive)
  - Futuro do Subjuntivo (Future Subjunctive)
  - Pluscuamperfecto do Subjuntivo (Pluperfect Subjunctive)
- **Verb Types**: Regular and irregular verbs (ar, er, ir endings)
- **Subjects**: All six persons (eu, tu, ele/ela, nós, vós, eles/elas)

#### 2.1.3 Progress Tracking
- **Wrong Cards Memory**: System remembers cards marked as incorrect
- **Review Mode**: Option to study only previously incorrect cards
- **Session Tracking**: Records which cards were studied in each session

#### 2.1.4 Quiz/Test Mode
- **Multiple Choice Questions**: 4 options per question
- **Distractor Generation**: Wrong answers include:
  - Misspellings of correct conjugation
  - Conjugations for different tenses of same verb
  - Conjugations for different subjects of same verb
- **Session Length**: 10 questions per quiz session
- **Immediate Feedback**: Show correct answer after each question

#### 2.1.5 Statistics Dashboard
- **Overall Metrics**:
  - Total cards studied
  - Correct vs. incorrect answers
  - Success rate percentage
- **Performance by Tense**: Accuracy breakdown for each verb tense
- **Performance by Verb Type**: Regular vs. irregular verb accuracy
- **Progress Over Time**: Historical performance data
- **Study Streaks**: Consecutive days of study

### 2.2 User Interface Requirements

#### 2.2.1 Design Theme
- **Style**: Colorful, tropical design
- **Color Palette**: 
  - Primary: Vibrant greens, blues, and oranges
  - Secondary: Warm yellows and coral accents
  - Background: Light tropical gradients
- **Typography**: Modern, readable fonts with Portuguese character support
- **Icons**: Tropical-themed icons (palm leaves, sun, waves)

#### 2.2.2 Page Structure
- **Home Page**: Welcome screen with navigation to different modes
- **Study Mode**: Main flashcard interface
- **Quiz Mode**: Multiple choice test interface
- **Statistics Page**: Progress tracking and analytics
- **Settings Page**: User preferences and data management

#### 2.2.3 Navigation
- **Multi-page Application**: Separate routes for each major feature
- **Navigation Bar**: Persistent navigation with tropical styling
- **Breadcrumbs**: Clear indication of current page location

#### 2.2.4 Layout Requirements
- **Full-Width Layout**: Header and content must extend to full browser width
- **Consistent Container Width**: Maximum content width of 1200px, centered
- **Box-Sizing**: Universal border-box sizing for consistent element dimensions
- **Responsive Design**: Layout adapts properly to all screen sizes
- **No Layout Gaps**: Eliminate white space issues between header and content
- **Proper Flexbox Usage**: App container uses flexbox column layout for proper stretching

## 3. Technical Requirements

### 3.1 Data Structure

#### 3.1.1 Card Data Format (JSON)
```json
{
  "id": "unique_identifier",
  "phrase": "Eu _____ (comer) pizza ontem",
  "verb": "comer",
  "tense": "pretérito_perfeito",
  "subject": "eu",
  "correctAnswer": "comi",
  "verbType": "regular",
  "category": "food_verbs"
}
```

#### 3.1.2 User Progress Format
```json
{
  "userId": "unique_user_id",
  "sessions": [
    {
      "date": "2024-01-15",
      "cardsStudied": ["card1", "card2"],
      "correctAnswers": ["card1"],
      "incorrectAnswers": ["card2"]
    }
  ],
  "wrongCards": ["card2", "card5"],
  "statistics": {
    "totalStudied": 150,
    "totalCorrect": 120,
    "accuracyByTense": {...},
    "accuracyByVerbType": {...}
  }
}
```

### 3.2 Component Architecture

#### 3.2.1 Core Components
- **App**: Main application wrapper with routing
- **Header**: Navigation and branding
- **Card**: Individual flashcard component
- **QuizQuestion**: Multiple choice question component
- **StatisticsChart**: Data visualization components
- **ProgressTracker**: Session and progress management

#### 3.2.2 State Management
- **React Context**: Global state for user progress and settings
- **Local State**: Component-specific state using useState/useReducer
- **Persistence**: localStorage for user data persistence

### 3.3 CSS Implementation Requirements

#### 3.3.1 Global Styles
- **Universal Box-Sizing**: `* { box-sizing: border-box; }` must be applied globally
- **Body Reset**: Remove default margins, padding, and flexbox centering from body
- **Full-Width Containers**: All main containers must use `width: 100%`

#### 3.3.2 Layout Structure
```css
/* App Layout */
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.header {
  width: 100%;
  /* Header styles */
}

.navigation {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  /* Navigation styles */
}
```

#### 3.3.3 Critical Layout Rules
- **No body flexbox centering**: Body must not use `display: flex` or `place-items: center`
- **Consistent max-width**: Header and main content must use same max-width (1200px)
- **Proper box-sizing**: All elements must use `border-box` sizing
- **Full-width headers**: Header background must extend to full browser width

### 3.4 Performance Requirements
- **Initial Load Time**: < 3 seconds
- **Card Flip Animation**: < 200ms
- **Quiz Response Time**: < 100ms
- **Data Persistence**: Immediate save to localStorage

## 4. User Stories

### 4.1 Study Mode
- **As a user**, I want to flip flashcards to see the correct conjugation so I can learn Portuguese verb forms
- **As a user**, I want to mark cards as correct or incorrect so the app can track my progress
- **As a user**, I want to review only the cards I got wrong so I can focus on my weak areas

### 4.2 Quiz Mode
- **As a user**, I want to take multiple choice quizzes so I can test my knowledge
- **As a user**, I want immediate feedback on quiz answers so I can learn from mistakes
- **As a user**, I want 10-question quiz sessions so I can have focused practice

### 4.3 Progress Tracking
- **As a user**, I want to see my overall statistics so I can track my learning progress
- **As a user**, I want to see my performance by tense so I can identify which tenses need more practice
- **As a user**, I want to see my performance by verb type so I can focus on regular vs. irregular verbs

## 5. Non-Functional Requirements

### 5.1 Usability
- **Accessibility**: WCAG 2.1 AA compliance
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Intuitive Navigation**: Clear user flow and minimal learning curve

### 5.2 Reliability
- **Data Persistence**: User progress never lost
- **Error Handling**: Graceful handling of data loading errors
- **Offline Capability**: Basic functionality works without internet

### 5.3 Performance
- **Fast Loading**: Optimized bundle size and lazy loading
- **Smooth Animations**: 60fps card flip and transition animations
- **Efficient Memory Usage**: Proper cleanup of components and event listeners

## 6. Implementation Phases

### 6.1 Phase 1: Core Functionality (Week 1-2)
- Basic flashcard component with flip animation
- JSON data structure and loading
- Correct/incorrect feedback system
- Basic routing and navigation

### 6.2 Phase 2: Quiz Mode (Week 3)
- Multiple choice quiz component
- Distractor generation logic
- Quiz session management
- Immediate feedback system

### 6.3 Phase 3: Progress Tracking (Week 4)
- User progress storage in localStorage
- Wrong cards tracking and review mode
- Basic statistics calculation
- Statistics page implementation

### 6.4 Phase 4: Polish & Enhancement (Week 5)
- Tropical design implementation
- Advanced statistics and charts
- Performance optimization
- Testing and bug fixes

## 7. Data Requirements

### 7.1 Initial Dataset
- **Minimum**: 200 verb cards across all tenses
- **Target**: 500+ verb cards for comprehensive coverage
- **Categories**: Common verbs, irregular verbs, reflexive verbs
- **Phrases**: Contextual sentences that clearly indicate tense and subject

### 7.2 Data Sources
- Portuguese grammar references
- Language learning textbooks
- Native speaker validation for phrase authenticity

## 8. Testing Strategy

### 8.1 Unit Testing
- Component rendering tests
- State management tests
- Utility function tests

### 8.2 Integration Testing
- User flow testing
- Data persistence testing
- Cross-browser compatibility

### 8.3 User Acceptance Testing
- Portuguese language learner feedback
- Usability testing with target audience
- Performance testing on various devices

## 9. Deployment & Maintenance

### 9.1 Deployment
- **Platform**: Vercel or Netlify for static hosting
- **Domain**: Custom domain with SSL certificate
- **CDN**: Global content delivery for fast loading

### 9.2 Maintenance
- **Data Updates**: Regular addition of new verb cards
- **Bug Fixes**: Monthly maintenance releases
- **Feature Updates**: Quarterly feature additions based on user feedback

## 10. Common Implementation Issues & Solutions

### 10.1 Layout Issues
- **Problem**: White space on right side of pages
- **Solution**: Ensure body doesn't use `display: flex` or `place-items: center`
- **Problem**: Header and content misalignment
- **Solution**: Use consistent max-width (1200px) and centering for both header and main content
- **Problem**: Inconsistent element sizing
- **Solution**: Apply universal `box-sizing: border-box` rule

### 10.2 CSS Best Practices
- Always use `width: 100%` on main containers
- Apply `box-sizing: border-box` globally
- Use flexbox column layout for app container
- Ensure header background extends full width
- Test layout on multiple screen sizes

## 11. Success Metrics

### 11.1 User Engagement
- Daily active users
- Average session duration
- Cards studied per session

### 11.2 Learning Effectiveness
- Improvement in accuracy over time
- User retention rates
- Feedback from Portuguese language learners

### 11.3 Technical Performance
- Page load times
- Error rates
- Cross-browser compatibility scores