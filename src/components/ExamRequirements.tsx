import React from 'react';
import { ExamFormat } from '../types/exam';
import { Info } from 'lucide-react';

interface ExamRequirementsProps {
  examFormat: ExamFormat;
}

export default function ExamRequirements({ examFormat }: ExamRequirementsProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center mb-3">
        <Info className="text-blue-600 mr-2" size={20} />
        <h3 className="text-lg font-semibold text-blue-800">
          {examFormat.name} Requirements
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <h4 className="font-medium text-gray-800 mb-2">Photo Requirements:</h4>
          <ul className="text-gray-600 space-y-1">
            <li>• Size: {examFormat.requirements.photoSize.width} × {examFormat.requirements.photoSize.height} pixels</li>
            <li>• DPI: {examFormat.requirements.photoSize.dpi}</li>
            <li>• Format: {examFormat.requirements.photoSize.format}</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-800 mb-2">Signature Requirements:</h4>
          <ul className="text-gray-600 space-y-1">
            <li>• Size: {examFormat.requirements.signatureSize.width} × {examFormat.requirements.signatureSize.height} pixels</li>
            <li>• DPI: {examFormat.requirements.signatureSize.dpi}</li>
            <li>• Format: {examFormat.requirements.signatureSize.format}</li>
          </ul>
        </div>
      </div>
      
      <div className="mt-4">
        <h4 className="font-medium text-gray-800 mb-2">Required Documents:</h4>
        <div className="flex flex-wrap gap-2">
          {examFormat.requirements.requiredDocuments.map((doc) => (
            <span
              key={doc}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
            >
              {doc.replace('_', ' ').toUpperCase()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}