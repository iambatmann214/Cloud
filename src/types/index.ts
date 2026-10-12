// Core content types for the AWS Cloud Engineering Academy

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type ServiceCategory = 
  | 'compute' | 'storage' | 'networking' | 'database' | 'security' 
  | 'monitoring' | 'iac' | 'containers' | 'serverless' | 'reliability'
  | 'cost' | 'enterprise' | 'migration' | 'devops' | 'tools';

export interface AWSService {
  id: string;
  name: string;
  shortName?: string;
  category: ServiceCategory;
  difficulty: Difficulty;
  importance: 'essential' | 'important' | 'supporting' | 'specialist';
  icon?: string;
  tagline: string;
  mentalModel: string;
  problemItSolves: string;
  howItWorks: string;
  components?: { name: string; description: string }[];
  realWorldExample: string;
  whenToUse: string[];
  whenNotToUse: string[];
  practicalImplementation?: {
    console?: string;
    cli?: string;
    python?: string;
    iac?: string;
  };
  security: string;
  costDrivers: string;
  limitations: string[];
  commonMistakes: string[];
  alternatives: { service: string; reason: string }[];
  relatedServices: string[];
  scenarioQuestion: QuizQuestion;
  quickRevision: string[];
  sources: { title: string; url: string }[];
  searchTerms: string[];
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  prerequisites: string[];
  estimatedHours: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  pathId: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  order: number;
  content: LessonContent;
  relatedServices?: string[];
  prerequisites?: string[];
}

export interface LessonContent {
  sections: ContentSection[];
}

export interface ContentSection {
  id: string;
  title: string;
  type: 'text' | 'diagram' | 'code' | 'comparison' | 'callout' | 'steps' | 'table' | 'interactive';
  content: string;
  language?: string;
  tableData?: { headers: string[]; rows: string[][] };
  steps?: { title: string; description: string }[];
  diagramType?: 'mermaid' | 'svg' | 'flow';
  expandable?: boolean;
  expandableTitle?: string;
}

export interface Comparison {
  id: string;
  title: string;
  category: string;
  serviceA: string;
  serviceB: string;
  problem: string;
  decisiveDifferences: string[];
  whenToChooseA: string[];
  whenToChooseB: string[];
  workTogether: string;
  tradeoffs: {
    dimension: string;
    optionA: string;
    optionB: string;
  }[];
  scenario: string;
  question: QuizQuestion;
  sources: { title: string; url: string }[];
}

export interface Architecture {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  services: string[];
  diagram: string;
  diagramType: 'mermaid' | 'svg';
  requestFlow: { step: number; description: string; service?: string }[];
  selectionRationale: { service: string; reason: string; alternatives?: string }[];
  securityConsiderations: string[];
  failureModes: { scenario: string; impact: string; mitigation: string }[];
  costDrivers: string[];
  scenarioQuestion: QuizQuestion;
}

export interface Lab {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  estimatedMinutes: number;
  order: number;
  objectives: string[];
  prerequisites: string[];
  services: string[];
  costWarning?: string;
  steps: LabStep[];
  commonErrors: { error: string; solution: string }[];
  troubleshooting: string[];
  securityNotes: string[];
  cleanup: string[];
  verification: string;
}

export interface LabStep {
  id: string;
  title: string;
  instructions: string;
  code?: string;
  codeLanguage?: string;
  expectedOutput?: string;
  tips?: string;
  warning?: string;
  isAdvanced?: boolean;
}

export interface TroubleshootingFlow {
  id: string;
  title: string;
  symptom: string;
  impact: string;
  causes: TroubleshootingCause[];
}

export interface TroubleshootingCause {
  id: string;
  cause: string;
  likelihood: 'high' | 'medium' | 'low';
  checks: TroubleshootingCheck[];
  fix: string;
  verification: string;
  prevention: string;
}

export interface TroubleshootingCheck {
  action: string;
  command?: string;
  consoleLocation?: string;
  interpretation: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'single' | 'multi';
  options: string[];
  correctAnswers: number[];
  explanation: string;
  whyOthersWrong: string[];
  decisiveClue: string;
  relatedTopic?: string;
  difficulty: Difficulty;
  isOriginal: boolean;
  source?: string;
}

export interface GlossaryEntry {
  id: string;
  term: string;
  definition: string;
  category: string;
  relatedTerms: string[];
  learnMoreLink?: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  difficulty: Difficulty;
}

// User progress types
export interface UserProgress {
  completedLessons: string[];
  completedLabs: string[];
  bookmarks: string[];
  notes: Record<string, string>;
  quizAttempts: QuizAttempt[];
  lastVisited: string;
  currentPath: string;
  theme: 'light' | 'dark';
  labChecklist: Record<string, string[]>;
  flashcardProgress: Record<string, 'known' | 'learning' | 'new'>;
}

export interface QuizAttempt {
  questionId: string;
  selectedAnswers: number[];
  correct: boolean;
  timestamp: number;
}
