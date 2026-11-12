import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Save, 
  Clock, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { Question, QuestionOption, Exam } from '../types/exam';

interface AdminExamManagerProps {
  exam: Exam;
  questions: Question[];
  onSaveQuestions: (updatedQuestions: Question[], durationMinutes?: number, title?: string) => Promise<void>;
}

export const AdminExamManager: React.FC<AdminExamManagerProps> = ({
  exam,
  questions: initialQuestions,
  onSaveQuestions
}) => {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [examTitle, setExamTitle] = useState(exam.title);
  const [durationMins, setDurationMins] = useState(exam.durationMinutes);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editingQId, setEditingQId] = useState<number | null>(null);

  // New question form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState('Vocabulary');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newOptionA, setNewOptionA] = useState('');
  const [newOptionB, setNewOptionB] = useState('');
  const [newOptionC, setNewOptionC] = useState('');
  const [newOptionD, setNewOptionD] = useState('');
  const [newCorrectAnswer, setNewCorrectAnswer] = useState<QuestionOption>('A');
  const [newExplanation, setNewExplanation] = useState('');

  const handleAddNewQuestion = () => {
    if (!newQuestionText.trim() || !newOptionA.trim() || !newOptionB.trim()) {
      alert('Please fill out the question text and at least options A and B.');
      return;
    }

    const nextId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
    const newQ: Question = {
      id: nextId,
      category: newCategory.trim() || 'General',
      question: newQuestionText.trim(),
      options: {
        A: newOptionA.trim(),
        B: newOptionB.trim(),
        C: newOptionC.trim(),
        D: newOptionD.trim()
      },
      correctAnswer: newCorrectAnswer,
      explanation: newExplanation.trim(),
      marks: 1
    };

    setQuestions([...questions, newQ]);
    // Reset form
    setNewQuestionText('');
    setNewOptionA('');
    setNewOptionB('');
    setNewOptionC('');
    setNewOptionD('');
    setNewExplanation('');
    setShowAddForm(false);
  };

  const handleDeleteQuestion = (id: number) => {
    if (confirm(`Delete Question #${id}?`)) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const handleUpdateOption = (qId: number, optKey: QuestionOption, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        return {
          ...q,
          options: {
            ...q.options,
            [optKey]: value
          }
        };
      }
      return q;
    }));
  };

  const handleUpdateCorrectAnswer = (qId: number, correct: QuestionOption) => {
    setQuestions(questions.map(q => q.id === qId ? { ...q, correctAnswer: correct } : q));
  };

  const handleUpdateQuestionText = (qId: number, text: string) => {
    setQuestions(questions.map(q => q.id === qId ? { ...q, question: text } : q));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await onSaveQuestions(questions, durationMins, examTitle);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Controls */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#28AF60]">
              Curriculum & Question Bank
            </span>
            <h2 className="text-xl font-extrabold text-[#0F4C2A]">
              Examination Management
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Add new MCQs, edit options, change correct answers, and configure test duration.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1.5 bg-[#EAF7F0] hover:bg-[#d4f2e0] text-[#0F4C2A] border border-[#28AF60]/30 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#28AF60]" />
              <span>Add New MCQ</span>
            </button>

            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="flex items-center gap-2 bg-[#28AF60] hover:bg-[#229652] text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-xs shadow-[#28AF60]/30 transition-all cursor-pointer"
            >
              {isSaving ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Examination Changes</span>
                </>
              )}
            </button>
          </div>
        </div>

        {saveSuccess && (
          <div className="mt-4 p-3 bg-[#EAF7F0] border border-[#28AF60]/30 rounded-xl text-xs font-bold text-[#0F4C2A] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#28AF60]" />
            <span>Examination questions and settings updated successfully!</span>
          </div>
        )}

        {/* Exam Title & Duration Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Examination Title
            </label>
            <input
              type="text"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#28AF60] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Duration (Minutes)
            </label>
            <input
              type="number"
              min={5}
              max={180}
              value={durationMins}
              onChange={(e) => setDurationMins(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#28AF60] focus:outline-none"
            />
          </div>
        </div>

      </div>

      {/* Add New Question Modal / Expandable */}
      {showAddForm && (
        <div className="bg-white border-2 border-[#28AF60]/40 rounded-2xl shadow-md p-6 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="font-extrabold text-[#0F4C2A] text-base flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#28AF60]" />
              Create New Multiple Choice Question
            </h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-slate-400 hover:text-slate-700 text-sm"
            >
              Cancel
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category / Topic</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="e.g. Vocabulary, Idiom, Proverb"
                  className="w-full px-3 py-2 text-xs border rounded-lg"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Correct Answer</label>
                <div className="flex items-center gap-3">
                  {(['A', 'B', 'C', 'D'] as QuestionOption[]).map(opt => (
                    <label key={opt} className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="newCorrectAnswer"
                        checked={newCorrectAnswer === opt}
                        onChange={() => setNewCorrectAnswer(opt)}
                        className="text-[#28AF60] focus:ring-[#28AF60]"
                      />
                      <span>Option {opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Question Prompt</label>
              <textarea
                rows={2}
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="Enter the question text..."
                className="w-full px-3 py-2 text-xs border rounded-lg"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Option A</label>
                <input
                  type="text"
                  value={newOptionA}
                  onChange={(e) => setNewOptionA(e.target.value)}
                  placeholder="Option A description..."
                  className="w-full px-3 py-1.5 text-xs border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Option B</label>
                <input
                  type="text"
                  value={newOptionB}
                  onChange={(e) => setNewOptionB(e.target.value)}
                  placeholder="Option B description..."
                  className="w-full px-3 py-1.5 text-xs border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Option C</label>
                <input
                  type="text"
                  value={newOptionC}
                  onChange={(e) => setNewOptionC(e.target.value)}
                  placeholder="Option C description..."
                  className="w-full px-3 py-1.5 text-xs border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Option D</label>
                <input
                  type="text"
                  value={newOptionD}
                  onChange={(e) => setNewOptionD(e.target.value)}
                  placeholder="Option D description..."
                  className="w-full px-3 py-1.5 text-xs border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Explanation / Rationale</label>
              <input
                type="text"
                value={newExplanation}
                onChange={(e) => setNewExplanation(e.target.value)}
                placeholder="Why this answer is correct..."
                className="w-full px-3 py-1.5 text-xs border rounded-lg"
              />
            </div>

            <button
              onClick={handleAddNewQuestion}
              className="bg-[#28AF60] hover:bg-[#229652] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              Add Question to Bank
            </button>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-3">
        {questions.map((q, idx) => {
          const isEditing = editingQId === q.id;

          return (
            <div
              key={q.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs transition-all hover:border-slate-300"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-[#EAF7F0] text-[#28AF60] font-black text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {q.category}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingQId(isEditing ? null : q.id)}
                    className="p-1.5 text-slate-500 hover:text-[#28AF60] rounded-md transition-colors"
                    title="Edit Question"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-md transition-colors"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Question Text */}
              {isEditing ? (
                <div className="mb-3">
                  <textarea
                    rows={2}
                    value={q.question}
                    onChange={(e) => handleUpdateQuestionText(q.id, e.target.value)}
                    className="w-full px-3 py-1.5 text-sm font-semibold border rounded-lg"
                  />
                </div>
              ) : (
                <p className="text-sm font-bold text-slate-900 mb-3">
                  {q.question}
                </p>
              )}

              {/* 4 Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {(['A', 'B', 'C', 'D'] as QuestionOption[]).map(opt => {
                  const isCorrect = q.correctAnswer === opt;

                  return (
                    <div
                      key={opt}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                        isCorrect
                          ? 'bg-[#EAF7F0] border-[#28AF60] text-[#0F4C2A] font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => handleUpdateCorrectAnswer(q.id, opt)}
                        title="Click to set as correct answer"
                        className={`w-6 h-6 rounded-md text-[11px] font-bold flex items-center justify-center cursor-pointer shrink-0 ${
                          isCorrect
                            ? 'bg-[#28AF60] text-white shadow-xs'
                            : 'bg-white border border-slate-300 text-slate-500 hover:border-[#28AF60]'
                        }`}
                      >
                        {opt}
                      </button>

                      {isEditing ? (
                        <input
                          type="text"
                          value={q.options[opt]}
                          onChange={(e) => handleUpdateOption(q.id, opt, e.target.value)}
                          className="w-full px-2 py-0.5 text-xs bg-white border rounded"
                        />
                      ) : (
                        <span className="truncate">{q.options[opt]}</span>
                      )}

                      {isCorrect && (
                        <span className="ml-auto text-[10px] uppercase font-bold text-[#28AF60] bg-white px-1.5 py-0.5 rounded shadow-xs shrink-0">
                          Answer
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {q.explanation && (
                <p className="mt-2 text-[11px] text-slate-500 italic">
                  Note: {q.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
