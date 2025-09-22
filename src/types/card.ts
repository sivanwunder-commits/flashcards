// Type definitions for flashcard data structures

export type VerbType = 'regular' | 'irregular';

// Supported subjects. Using singular forms individually for clarity.
export type Subject =
  | 'eu'
  | 'tu'
  | 'ele'
  | 'ela'
  | 'nós'
  | 'vós'
  | 'eles'
  | 'elas';

// Supported tenses according to the specification. Accented strings are preserved.
export type Tense =
  | 'pretérito_perfeito'
  | 'pretérito_imperfeito'
  | 'pretérito_mais_que_perfeito'
  | 'futuro_do_presente'
  | 'futuro_do_pretérito'
  | 'presente_do_subjuntivo'
  | 'imperfeito_do_subjuntivo'
  | 'futuro_do_subjuntivo'
  | 'pluscuamperfecto_do_subjuntivo';

export interface Card {
  id: string;
  phrase: string;
  verb: string;
  tense: Tense;
  subject: Subject;
  correctAnswer: string;
  verbType: VerbType;
  category: string;
}


