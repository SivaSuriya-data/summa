import React from 'react';
import { ProcessedFile } from '../types/exam';
import { Download, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface DownloadSectionProps {
  processedFiles: ProcessedFile[];
  onDownloadAll: () => void;
  onDownloadFile: (fileId: string) => void;
}

export default function DownloadSection({ 
  processedFiles, 
  onDownloadAll, 
  onDownloadFile 
}: DownloadSectionProps) {
  const completedFiles = processedFiles.filter(f => f.status === 'completed');
  const errorFiles = processedFiles.filter(f => f.status === 'error');

  if (processedFiles.length === 0) return null;

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Processed Files ({completedFiles.length}/{processedFiles.length})
        </h3>
        
        {completedFiles.length > 0 && (
          <button
            onClick={onDownloadAll}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Download size={16} />
            <span>Download All</span>
          </button>
        )}
      </div>

      <div className="space-y-3">
        {processedFiles.map((file) => (
          <div
            key={file.id}
            className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <FileText className="text-gray-400" size={20} />
              <div>
                <p className="font-medium text-gray-900">{file.processedName}</p>
                <p className="text-sm text-gray-500">
                  Original: {file.originalName}
                </p>
                {file.error && (
                  <p className="text-sm text-red-600 mt-1">{file.error}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {file.status === 'completed' && (
                <>
                  <CheckCircle className="text-green-500" size={20} />
                  <button
                    onClick={() => onDownloadFile(file.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Download
                  </button>
                </>
              )}
              {file.status === 'error' && (
                <AlertCircle className="text-red-500" size={20} />
              )}
              {file.status === 'processing' && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
              )}
            </div>
          </div>
        ))}
      </div>

      {errorFiles.length > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">
            {errorFiles.length} file(s) failed to process. Please check the file formats and try again.
          </p>
        </div>
      )}
    </div>
  );
}