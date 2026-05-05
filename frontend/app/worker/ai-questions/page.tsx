'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

interface Question {
  id: string;
  question: string;
  type: 'text' | 'yes_no' | 'multiple_choice';
  options?: string[];
  answer?: string;
}

export default function AIQuestionsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    // Check if patient data exists
    const patientData = sessionStorage.getItem('currentPatient');
    const vitalsData = sessionStorage.getItem('currentVitals');
    
    if (!patientData || !vitalsData) {
      router.push('/worker/new-visit');
      return;
    }

    // Generate mock AI questions based on vitals
    const vitals = JSON.parse(vitalsData);
    const mockQuestions = generateMockQuestions(vitals);
    setQuestions(mockQuestions);
    setLoading(false);
  }, [router]);

  const generateMockQuestions = (vitals: any): Question[] => {
    const temp = parseFloat(vitals.temperature) || 0;
    const spo2 = parseInt(vitals.spo2) || 100;
    const questions: Question[] = [];

    // Generate questions based on vitals
    if (temp > 100) {
      questions.push({
        id: 'fever_duration',
        question: 'How many days has the fever been present?',
        type: 'multiple_choice',
        options: ['Less than 1 day', '1-2 days', '3-5 days', 'More than 5 days'],
      });
      questions.push({
        id: 'fever_pattern',
        question: 'When does the fever occur?',
        type: 'multiple_choice',
        options: ['Continuous', 'Only at night', 'Comes and goes', 'Morning only'],
      });
      questions.push({
        id: 'chills',
        question: 'Is the patient experiencing chills or shivering?',
        type: 'yes_no',
      });
    }

    if (spo2 < 95) {
      questions.push({
        id: 'breathing_difficulty',
        question: 'Is the patient having difficulty breathing?',
        type: 'yes_no',
      });
      questions.push({
        id: 'cough',
        question: 'Is there any cough?',
        type: 'yes_no',
      });
    }

    // General questions
    questions.push({
      id: 'appetite',
      question: 'How is the patient\'s appetite?',
      type: 'multiple_choice',
      options: ['Normal', 'Reduced', 'Very poor', 'Not eating at all'],
    });
    
    questions.push({
      id: 'sleep',
      question: 'How is the patient sleeping?',
      type: 'multiple_choice',
      options: ['Normal', 'Restless', 'Waking frequently', 'Cannot sleep'],
    });

    questions.push({
      id: 'other_symptoms',
      question: 'Are there any other symptoms? (Headache, body pain, weakness, etc.)',
      type: 'text',
    });

    questions.push({
      id: 'medications',
      question: 'What medications has the patient taken?',
      type: 'text',
    });

    return questions;
  };

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (value: string) => {
    if (!currentQuestion) return;

    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));

    // Auto-advance for yes/no and multiple choice
    if (currentQuestion.type !== 'text') {
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(prev => prev + 1);
        }
      }, 300);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Store answers
    sessionStorage.setItem('aiQuestions', JSON.stringify(answers));
    
    // Navigate to triage result
    router.push('/worker/triage-result');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating questions...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent>
            <p className="text-gray-600 text-center py-8">No additional questions needed at this time.</p>
            <Button 
              variant="primary" 
              className="w-full"
              onClick={() => router.push('/worker/triage-result')}
            >
              Continue to Triage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentIndex === questions.length - 1;
  const hasAnswer = currentQuestion && answers[currentQuestion.id];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-3xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Follow-up Questions</h1>
              <p className="text-sm text-gray-600">Adaptive symptom assessment</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push('/worker/triage-result')}
            >
              Skip
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {currentQuestion && (
          <Card className="mb-6">
            <CardContent className="pt-8">
              <div className="mb-8">
                <div className="flex items-start gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {currentIndex + 1}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mt-1">
                    {currentQuestion.question}
                  </h2>
                </div>

                {/* Answer Options */}
                {currentQuestion.type === 'yes_no' && (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleAnswer('yes')}
                      className={`p-6 rounded-lg border-2 text-center font-semibold transition-all ${
                        answers[currentQuestion.id] === 'yes'
                          ? 'border-green-600 bg-green-50 text-green-700'
                          : 'border-gray-300 hover:border-green-400'
                      }`}
                    >
                      ✓ Yes
                    </button>
                    <button
                      onClick={() => handleAnswer('no')}
                      className={`p-6 rounded-lg border-2 text-center font-semibold transition-all ${
                        answers[currentQuestion.id] === 'no'
                          ? 'border-red-600 bg-red-50 text-red-700'
                          : 'border-gray-300 hover:border-red-400'
                      }`}
                    >
                      ✗ No
                    </button>
                  </div>
                )}

                {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(option)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          answers[currentQuestion.id] === option
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            answers[currentQuestion.id] === option
                              ? 'border-blue-600 bg-blue-600'
                              : 'border-gray-400'
                          }`}>
                            {answers[currentQuestion.id] === option && (
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="text-gray-900">{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {currentQuestion.type === 'text' && (
                  <div>
                    <textarea
                      value={answers[currentQuestion.id] || ''}
                      onChange={(e) => handleAnswer(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 min-h-[120px]"
                      placeholder="Type your answer here..."
                    />
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between gap-4 pt-4 border-t">
                <Button
                  variant="secondary"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                >
                  ← Previous
                </Button>

                {isLastQuestion ? (
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={!hasAnswer}
                  >
                    Submit & Continue →
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleNext}
                    disabled={!hasAnswer}
                  >
                    Next Question →
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Answers Summary */}
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-sm">Answers Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(answers).length === 0 ? (
              <p className="text-sm text-gray-500">No answers yet</p>
            ) : (
              <div className="space-y-2">
                {questions.slice(0, currentIndex + 1).map((q) => (
                  answers[q.id] && (
                    <div key={q.id} className="text-sm">
                      <span className="font-medium text-gray-700">{q.question}</span>
                      <p className="text-gray-600 mt-1">→ {answers[q.id]}</p>
                    </div>
                  )
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
