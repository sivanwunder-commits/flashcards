import React, { useState } from 'react';
import './Learn.css';

interface TenseInfo {
  name: string;
  description: string;
  usage: string;
  examples: string[];
  arEndings: string[];
  erEndings: string[];
  irEndings: string[];
  irregularVerb: {
    verb: string;
    conjugations: string[];
  };
}

const Learn: React.FC = () => {
  const [selectedTense, setSelectedTense] = useState<string>('pretérito_perfeito');

  const tenses: { [key: string]: TenseInfo } = {
    pretérito_perfeito: {
      name: 'Pretérito Perfeito',
      description: 'The simple past tense in Portuguese',
      usage: 'Used to describe completed actions in the past. It expresses actions that happened at a specific time and are now finished.',
      examples: [
        'Eu comi pizza ontem. (I ate pizza yesterday.)',
        'Ela estudou português por dois anos. (She studied Portuguese for two years.)',
        'Nós viajamos para o Brasil. (We traveled to Brazil.)'
      ],
      arEndings: ['ei', 'aste', 'ou', 'amos', 'astes', 'aram'],
      erEndings: ['i', 'este', 'eu', 'emos', 'estes', 'eram'],
      irEndings: ['i', 'iste', 'iu', 'imos', 'istes', 'iram'],
      irregularVerb: {
        verb: 'ser',
        conjugations: ['fui', 'foste', 'foi', 'fomos', 'fostes', 'foram']
      }
    },
    pretérito_imperfeito: {
      name: 'Pretérito Imperfeito',
      description: 'The imperfect past tense in Portuguese',
      usage: 'Used to describe ongoing, habitual, or repeated actions in the past. It sets the background or context for other past events.',
      examples: [
        'Eu comia pizza todos os dias. (I used to eat pizza every day.)',
        'Ela estudava português quando era jovem. (She used to study Portuguese when she was young.)',
        'Nós viajávamos muito. (We used to travel a lot.)'
      ],
      arEndings: ['ava', 'avas', 'ava', 'ávamos', 'áveis', 'avam'],
      erEndings: ['ia', 'ias', 'ia', 'íamos', 'íeis', 'iam'],
      irEndings: ['ia', 'ias', 'ia', 'íamos', 'íeis', 'iam'],
      irregularVerb: {
        verb: 'ser',
        conjugations: ['era', 'eras', 'era', 'éramos', 'éreis', 'eram']
      }
    },
    futuro_do_presente: {
      name: 'Futuro do Presente',
      description: 'The simple future tense in Portuguese',
      usage: 'Used to express future actions or events. It can also express probability or uncertainty about the present.',
      examples: [
        'Eu comerei pizza amanhã. (I will eat pizza tomorrow.)',
        'Ela estudará português no próximo ano. (She will study Portuguese next year.)',
        'Nós viajaremos para o Brasil. (We will travel to Brazil.)'
      ],
      arEndings: ['arei', 'arás', 'ará', 'aremos', 'areis', 'arão'],
      erEndings: ['erei', 'erás', 'erá', 'eremos', 'ereis', 'erão'],
      irEndings: ['irei', 'irás', 'irá', 'iremos', 'ireis', 'irão'],
      irregularVerb: {
        verb: 'ser',
        conjugations: ['serei', 'serás', 'será', 'seremos', 'sereis', 'serão']
      }
    },
    presente_do_subjuntivo: {
      name: 'Presente do Subjuntivo',
      description: 'The present subjunctive tense in Portuguese',
      usage: 'Used to express doubt, desire, emotion, or uncertainty. Often follows certain conjunctions and expressions.',
      examples: [
        'Espero que eu coma pizza hoje. (I hope I eat pizza today.)',
        'É importante que ela estude português. (It\'s important that she study Portuguese.)',
        'Quero que nós viajemos juntos. (I want us to travel together.)'
      ],
      arEndings: ['e', 'es', 'e', 'emos', 'eis', 'em'],
      erEndings: ['a', 'as', 'a', 'amos', 'ais', 'am'],
      irEndings: ['a', 'as', 'a', 'amos', 'ais', 'am'],
      irregularVerb: {
        verb: 'ser',
        conjugations: ['seja', 'sejas', 'seja', 'sejamos', 'sejais', 'sejam']
      }
    },
    imperfeito_do_subjuntivo: {
      name: 'Imperfeito do Subjuntivo',
      description: 'The imperfect subjunctive tense in Portuguese',
      usage: 'Used in hypothetical situations, polite requests, and to express doubt about past events. Often follows "se" (if) for conditional statements.',
      examples: [
        'Se eu comesse pizza, ficaria feliz. (If I ate pizza, I would be happy.)',
        'Era melhor que ela estudasse português. (It would be better if she studied Portuguese.)',
        'Se nós viajássemos, conheceríamos o mundo. (If we traveled, we would know the world.)'
      ],
      arEndings: ['asse', 'asses', 'asse', 'ássemos', 'ásseis', 'assem'],
      erEndings: ['esse', 'esses', 'esse', 'êssemos', 'êsseis', 'essem'],
      irEndings: ['isse', 'isses', 'isse', 'íssemos', 'ísseis', 'issem'],
      irregularVerb: {
        verb: 'ser',
        conjugations: ['fosse', 'fosses', 'fosse', 'fôssemos', 'fôsseis', 'fossem']
      }
    }
  };

  const subjects = ['eu', 'tu', 'ele/ela/você', 'nós', 'vós', 'eles/elas/vocês'];

  const renderConjugationTable = (endings: string[], verb: string, irregular?: string[]) => {
    const conjugations = irregular || endings.map(ending => verb + ending);
    
    return (
      <div className="conjugation-table">
        <h4>Conjugação do verbo "{verb}"</h4>
        <table>
          <thead>
            <tr>
              <th>Pessoa</th>
              <th>Conjugação</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject, index) => (
              <tr key={index}>
                <td>{subject}</td>
                <td className={irregular ? 'irregular' : ''}>{conjugations[index]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const currentTense = tenses[selectedTense];

  return (
    <div className="learn-page">
      <div className="learn-header">
        <div className="tropical-header">
          <div className="tropical-icon">🌴</div>
          <h1>📚 Learn Verb Tenses</h1>
          <div className="tropical-icon">🌺</div>
        </div>
        <p>🌊 Explore os diferentes tempos verbais em português e suas conjugações 🏝️</p>
      </div>

      <div className="learn-content">
        <div className="tense-selector">
          <h3>🌊 Escolha um tempo verbal: 🌊</h3>
          <div className="tense-buttons">
            {Object.keys(tenses).map(tenseKey => (
              <button
                key={tenseKey}
                className={`tense-button ${selectedTense === tenseKey ? 'active' : ''}`}
                onClick={() => setSelectedTense(tenseKey)}
              >
                <span className="tropical-icon">🌴</span>
                {tenses[tenseKey].name}
              </button>
            ))}
          </div>
        </div>

        <div className="tense-details">
          <div className="tense-info">
            <h2>{currentTense.name}</h2>
            <p className="tense-description">{currentTense.description}</p>
            
            <div className="usage-section">
              <h3>Quando usar:</h3>
              <p>{currentTense.usage}</p>
            </div>

            <div className="examples-section">
              <h3>Exemplos:</h3>
              <ul>
                {currentTense.examples.map((example, index) => (
                  <li key={index}>{example}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="conjugation-section">
            <h3>Padrões de Conjugação</h3>
            
            <div className="regular-verbs">
              <h4>Verbos Regulares</h4>
              
              <div className="verb-patterns">
                <div className="pattern-group">
                  <h5>Verbos terminados em -AR</h5>
                  {renderConjugationTable(currentTense.arEndings, 'falar')}
                </div>
                
                <div className="pattern-group">
                  <h5>Verbos terminados em -ER</h5>
                  {renderConjugationTable(currentTense.erEndings, 'comer')}
                </div>
                
                <div className="pattern-group">
                  <h5>Verbos terminados em -IR</h5>
                  {renderConjugationTable(currentTense.irEndings, 'partir')}
                </div>
              </div>
            </div>

            <div className="irregular-verbs">
              <h4>Verbo Irregular Importante</h4>
              {renderConjugationTable(
                currentTense.irregularVerb.conjugations, 
                currentTense.irregularVerb.verb,
                currentTense.irregularVerb.conjugations
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;
