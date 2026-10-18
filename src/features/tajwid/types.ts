export interface TajwidLevel {
  level: number;
  title: string;
  arabicTitle: string;
  description: string;
  icon: string;
  color: string;
  lessonSlugs: string[];
}

export interface TajwidRuleItem {
  name: string;
  description: string;
  letters?: string[];
}

export interface TajwidSegment {
  text: string;
  isHighlighted?: boolean;
  ruleId?: string;
}

export interface TajwidExample {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  arabic: string;
  translation: string;
  ruleName: string;
  note?: string;
  segments: TajwidSegment[];
}

export interface TajwidQuizQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface TajwidLesson {
  slug: string;
  level: number;
  title: string;
  arabicTitle: string;
  category: string;
  ruleId: string;
  colorToken: string;
  summary: string;
  description: string;
  letters?: string[];
  rules: TajwidRuleItem[];
  examples: TajwidExample[];
  tips: string[];
  commonMistakes: string[];
  quiz: TajwidQuizQuestion[];
}

export interface TajwidGlossaryTerm {
  term: string;
  arabic: string;
  category: string;
  definition: string;
  example: string;
}
