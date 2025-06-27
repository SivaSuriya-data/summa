import React, { useState, useRef } from "react";
import { Upload, File, X, CheckCircle, AlertCircle } from "lucide-react";

interface DragAndDropFileProps {
  onFilesSelected: (files: File[]) => void;
}

export default function DragAndDropFile({ onFilesSelected }: DragAndDropFileProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    processFiles(selectedFiles);
  };

  const processFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter((file) => {
      // Accept common document formats
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/bmp",
        "image/tiff"
      ];

      const maxSize = 10 * 1024 * 1024; // 10MB

      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    const updatedFiles = [...files, ...validFiles];
    setFiles(updatedFiles);
    onFilesSelected(updatedFiles);
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesSelected(updatedFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return "📄";
    if (type.includes("word")) return "📝";
    if (type.includes("image")) return "🖼️";
    return "📎";
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Upload Documents
      </h2>

      {/* Drag and Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
          isDragOver
            ? "border-blue-500 bg-blue-50 scale-105"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload
          className={`mx-auto mb-4 ${
            isDragOver ? "text-blue-500" : "text-gray-400"
          }`}
          size={48}
        />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Drop files here or click to browse
        </h3>
        <p className="text-gray-500 mb-4">
          Support for PDF, Images, Word documents up to 10MB each
        </p>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.bmp,.tiff"
        />

        <button
          type="button"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Select Files
        </button>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Selected Files ({files.length})
            </h3>
          </div>

          <div className="space-y-3">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <span className="text-2xl">
                      {getFileIcon(file.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Summary */}
      {files.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between text-sm">
            <span>Total Files: {files.length}</span>
            <span>
              Total Size:{" "}
              {formatFileSize(files.reduce((acc, f) => acc + f.size, 0))}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}