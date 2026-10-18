export interface HadithBook {
  id: string; // 'bukhari' | 'muslim'
  name: string;
  arabicName: string;
  author: string;
  grade: 'Shahih';
  totalChunks: number;
  totalHadiths: number;
  description: string;
}

export interface HadithItem {
  id: string; // e.g. "bukhari-1"
  book: string; // 'bukhari' | 'muslim'
  bookName: string;
  number: number;
  arabic: string;
  translation: string;
  narrator: string;
  grade: 'Shahih';
  sourceRef: string;
}
