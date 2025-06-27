import React from 'react';
import { EXAM_FORMATS } from '../config/examFormats';

interface ExamSelectorProps {
  selectedExam: string;
  onExamChange: (examId: string) => void;
}

export default function ExamSelector({ selectedExam, onExamChange }: ExamSelectorProps) {
  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Select Exam</h3>
      {Object.values(EXAM_FORMATS).map((exam) => (
        <button
          key={exam.id}
          onClick={() => onExamChange(exam.id)}
          className={`${
            selectedExam === exam.id
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              : "bg-white text-gray-800 hover:bg-gray-50"
          } px-6 py-3 rounded-lg font-semibold text-center shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer border border-gray-200`}
        >
          {exam.name}
        </button>
      ))}
    </div>
  );
}