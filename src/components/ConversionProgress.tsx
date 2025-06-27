import React from 'react';
import { ConversionProgress } from '../types/exam';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface ConversionProgressProps {
  progress: ConversionProgress;
  isVisible: boolean;
}

export default function ConversionProgressComponent({ progress, isVisible }: ConversionProgressProps) {
  if (!isVisible) return null;

  const getStageIcon = () => {
    switch (progress.stage) {
      case 'completed':
        return <CheckCircle className="text-green-500" size={24} />;
      case 'analyzing':
      case 'converting':
      case 'formatting':
        return <Loader2 className="text-blue-500 animate-spin" size={24} />;
      default:
        return <AlertCircle className="text-yellow-500" size={24} />;
    }
  };

  const getStageText = () => {
    switch (progress.stage) {
      case 'analyzing':
        return 'Analyzing documents...';
      case 'converting':
        return 'Converting documents...';
      case 'formatting':
        return 'Formatting for exam requirements...';
      case 'completed':
        return 'Conversion completed!';
      default:
        return 'Processing...';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="mb-4">
            {getStageIcon()}
          </div>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {getStageText()}
          </h3>
          
          <p className="text-gray-600 mb-4">
            Processing: {progress.currentFile}
          </p>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress.progress}%` }}
            />
          </div>
          
          <p className="text-sm text-gray-500">
            {progress.progress}% complete
          </p>
        </div>
      </div>
    </div>
  );
}