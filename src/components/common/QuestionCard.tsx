import React, { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, HelpCircle, AlertCircle, Award } from 'lucide-react';
import type { QuizQuestion } from '../../types';
import { useProgressContext } from '../../contexts/ProgressContext';

interface QuestionCardProps {
  question: QuizQuestion;
  title?: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, title }) => {
  const { recordQuizAttempt, getQuizAttemptsForQuestion } = useProgressContext();
  const previousAttempts = getQuizAttemptsForQuestion(question.id);
  const latestAttempt = previousAttempts.length > 0 ? previousAttempts[previousAttempts.length - 1] : null;

  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(
    latestAttempt ? latestAttempt.selectedAnswers : []
  );
  const [isSubmitted, setIsSubmitted] = useState<boolean>(!!latestAttempt);

  const isMulti = question.type === 'multi';

  const handleOptionToggle = (index: number) => {
    if (isSubmitted) return;
    if (isMulti) {
      setSelectedAnswers(prev =>
        prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index].sort()
      );
    } else {
      setSelectedAnswers([index]);
    }
  };

  const isAnswerCorrect = (): boolean => {
    if (selectedAnswers.length !== question.correctAnswers.length) return false;
    const sortedSelected = [...selectedAnswers].sort();
    const sortedCorrect = [...question.correctAnswers].sort();
    return sortedSelected.every((val, idx) => val === sortedCorrect[idx]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAnswers.length === 0 || isSubmitted) return;

    const correct = isAnswerCorrect();
    setIsSubmitted(true);
    recordQuizAttempt({
      questionId: question.id,
      selectedAnswers,
      correct,
      timestamp: Date.now(),
    });
  };

  const handleReset = () => {
    setSelectedAnswers([]);
    setIsSubmitted(false);
  };

  const correct = isAnswerCorrect();

  return (
    <div
      className="card"
      style={{
        border: isSubmitted
          ? correct
            ? '1px solid var(--color-success)'
            : '1px solid var(--color-error)'
          : '1px solid var(--border-primary)',
        backgroundColor: 'var(--bg-card)',
        padding: 'var(--space-6)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        marginTop: 'var(--space-4)',
        marginBottom: 'var(--space-6)',
      }}
    >
      {/* Header Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--space-2)',
          marginBottom: 'var(--space-4)',
          borderBottom: '1px solid var(--border-primary)',
          paddingBottom: 'var(--space-3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Award size={18} style={{ color: 'var(--color-aws-orange)' }} />
          <span
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--color-aws-orange)',
            }}
          >
            Original AWS certification-style practice question
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span
            className="badge"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-secondary)',
            }}
          >
            {isMulti ? 'Select Multiple' : 'Single Choice'}
          </span>
          <span className={`badge badge-${question.difficulty || 'intermediate'}`}>
            {question.difficulty}
          </span>
        </div>
      </div>

      {title && (
        <h4
          style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-2)',
          }}
        >
          {title}
        </h4>
      )}

      {/* Question Text */}
      <p
        style={{
          fontSize: 'var(--text-base)',
          fontWeight: 500,
          color: 'var(--text-primary)',
          lineHeight: 'var(--leading-relaxed)',
          marginBottom: 'var(--space-5)',
        }}
      >
        {question.question}
      </p>

      {/* Options Form */}
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {question.options.map((option, index) => {
            const isSelected = selectedAnswers.includes(index);
            const isCorrectOption = question.correctAnswers.includes(index);

            let optionBg = 'var(--bg-secondary)';
            let optionBorder = '1px solid var(--border-primary)';
            let optionColor = 'var(--text-primary)';

            if (isSubmitted) {
              if (isCorrectOption) {
                optionBg = 'var(--color-success-bg)';
                optionBorder = '1px solid var(--color-success)';
              } else if (isSelected && !isCorrectOption) {
                optionBg = 'var(--color-error-bg)';
                optionBorder = '1px solid var(--color-error)';
              }
            } else if (isSelected) {
              optionBg = 'var(--bg-active)';
              optionBorder = '1px solid var(--color-cool-blue)';
            }

            return (
              <label
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: optionBg,
                  border: optionBorder,
                  color: optionColor,
                  cursor: isSubmitted ? 'default' : 'pointer',
                  transition: 'background var(--transition-fast), border-color var(--transition-fast)',
                }}
              >
                <input
                  type={isMulti ? 'checkbox' : 'radio'}
                  name={`quiz-${question.id}`}
                  checked={isSelected}
                  disabled={isSubmitted}
                  onChange={() => handleOptionToggle(index)}
                  style={{
                    marginTop: '3px',
                    accentColor: 'var(--color-aws-orange)',
                    cursor: isSubmitted ? 'default' : 'pointer',
                  }}
                  aria-label={option}
                />
                <span
                  style={{
                    flex: 1,
                    fontSize: 'var(--text-sm)',
                    lineHeight: 'var(--leading-normal)',
                  }}
                >
                  <strong style={{ marginRight: '6px' }}>{String.fromCharCode(65 + index)}.</strong>
                  {option}
                </span>

                {isSubmitted && isCorrectOption && (
                  <CheckCircle2
                    size={18}
                    style={{ color: 'var(--color-success)', flexShrink: 0, marginTop: '2px' }}
                    aria-label="Correct answer"
                  />
                )}
                {isSubmitted && isSelected && !isCorrectOption && (
                  <XCircle
                    size={18}
                    style={{ color: 'var(--color-error)', flexShrink: 0, marginTop: '2px' }}
                    aria-label="Incorrect selection"
                  />
                )}
              </label>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div
          style={{
            marginTop: 'var(--space-5)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
          }}
        >
          {!isSubmitted ? (
            <button
              type="submit"
              disabled={selectedAnswers.length === 0}
              className="btn btn-primary"
              style={{
                opacity: selectedAnswers.length === 0 ? 0.5 : 1,
                cursor: selectedAnswers.length === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              Submit Answer
            </button>
          ) : (
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}
            >
              <RotateCcw size={16} />
              Try Again
            </button>
          )}
        </div>
      </form>

      {/* Result feedback and explanations */}
      {isSubmitted && (
        <div
          style={{
            marginTop: 'var(--space-6)',
            paddingTop: 'var(--space-5)',
            borderTop: '1px solid var(--border-primary)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              marginBottom: 'var(--space-3)',
              color: correct ? 'var(--color-success)' : 'var(--color-error)',
              fontWeight: 600,
              fontSize: 'var(--text-base)',
            }}
          >
            {correct ? (
              <>
                <CheckCircle2 size={20} />
                <span>Correct! Well done.</span>
              </>
            ) : (
              <>
                <XCircle size={20} />
                <span>Incorrect. Review the explanation below.</span>
              </>
            )}
          </div>

          {/* Decisive Clue */}
          {question.decisiveClue && (
            <div
              style={{
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-secondary)',
                marginBottom: 'var(--space-4)',
                borderLeft: '4px solid var(--color-aws-orange)',
                fontSize: 'var(--text-sm)',
              }}
            >
              <strong style={{ color: 'var(--color-aws-orange)' }}>Decisive Exam Clue: </strong>
              <span style={{ color: 'var(--text-primary)' }}>{question.decisiveClue}</span>
            </div>
          )}

          {/* Explanation */}
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <h5
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-1)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-1)',
              }}
            >
              <HelpCircle size={15} style={{ color: 'var(--color-cool-blue)' }} />
              Explanation
            </h5>
            <p
              style={{
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)',
                lineHeight: 'var(--leading-relaxed)',
              }}
            >
              {question.explanation}
            </p>
          </div>

          {/* Why Others Wrong */}
          {question.whyOthersWrong && question.whyOthersWrong.length > 0 && (
            <div>
              <h5
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--space-2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-1)',
                }}
              >
                <AlertCircle size={15} style={{ color: 'var(--color-warning)' }} />
                Why Other Options Are Incorrect
              </h5>
              <ul
                style={{
                  paddingLeft: 'var(--space-5)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-2)',
                }}
              >
                {question.whyOthersWrong.map((reason, idx) => (
                  <li key={idx} style={{ lineHeight: 'var(--leading-normal)' }}>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
