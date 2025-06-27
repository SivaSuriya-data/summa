export interface ExamFormat {
  id: string;
  name: string;
  requirements: {
    photoSize: {
      width: number;
      height: number;
      dpi: number;
      format: string;
    };
    signatureSize: {
      width: number;
      height: number;
      dpi: number;
      format: string;
    };
    documentFormats: string[];
    maxFileSize: number;
    requiredDocuments: string[];
  };
}

export interface ProcessedFile {
  id: string;
  originalName: string;
  processedName: string;
  type: string;
  size: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  downloadUrl?: string;
  error?: string;
}

export interface ConversionProgress {
  currentFile: string;
  progress: number;
  stage: 'analyzing' | 'converting' | 'formatting' | 'completed';
}