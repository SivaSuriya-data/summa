import React, { useState, useEffect } from "react";
import "./App.css";
import DragAndDropFile from "./components/DragAndDropFile";
import ExamSelector from "./components/ExamSelector";
import ExamRequirements from "./components/ExamRequirements";
import ConversionProgress from "./components/ConversionProgress";
import DownloadSection from "./components/DownloadSection";
import { EXAM_FORMATS } from "./config/examFormats";
import { ProcessedFile, ConversionProgress as ConversionProgressType } from "./types/exam";
import { wasmService } from "./services/wasmService";
import JSZip from "jszip";

function App() {
  const [selectedExam, setSelectedExam] = useState("neet");
  const [files, setFiles] = useState<File[]>([]);
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState<ConversionProgressType>({
    currentFile: "",
    progress: 0,
    stage: "analyzing"
  });
  const [wasmInitialized, setWasmInitialized] = useState(false);
  const [initializationStatus, setInitializationStatus] = useState("Initializing system...");

  useEffect(() => {
    initializeWasm();
  }, []);

  const initializeWasm = async () => {
    try {
      setInitializationStatus("Loading WASM modules...");
      await wasmService.initializeWasm();
      setWasmInitialized(true);
      setInitializationStatus("System ready!");
      
      // Clear status message after 2 seconds
      setTimeout(() => {
        setInitializationStatus("");
      }, 2000);
    } catch (error) {
      console.error("Failed to initialize WASM:", error);
      setInitializationStatus("System ready (limited functionality)");
      setWasmInitialized(true); // Allow app to continue
      
      setTimeout(() => {
        setInitializationStatus("");
      }, 3000);
    }
  };

  const handleFilesSelected = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setProcessedFiles([]);
  };

  const handleConvert = async () => {
    if (!wasmInitialized) {
      alert("System is still initializing. Please wait a moment and try again.");
      return;
    }

    if (files.length === 0) {
      alert("Please select files to convert.");
      return;
    }

    setIsConverting(true);
    const examFormat = EXAM_FORMATS[selectedExam];
    const newProcessedFiles: ProcessedFile[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        setConversionProgress({
          currentFile: file.name,
          progress: (i / files.length) * 100,
          stage: "analyzing"
        });

        try {
          // Read file as ArrayBuffer
          const fileBuffer = await file.arrayBuffer();

          // Analyze document type
          setConversionProgress(prev => ({ ...prev, stage: "analyzing" }));
          const documentType = await wasmService.analyzeDocument(fileBuffer, file.name);

          // Convert document
          setConversionProgress(prev => ({ ...prev, stage: "converting" }));
          const convertedBuffer = await wasmService.convertDocument(
            fileBuffer,
            file.name,
            documentType,
            examFormat
          );

          // Format for exam requirements
          setConversionProgress(prev => ({ ...prev, stage: "formatting" }));
          
          // Create processed file entry
          const processedFile: ProcessedFile = {
            id: Math.random().toString(36).substr(2, 9),
            originalName: file.name,
            processedName: `${examFormat.name}_${documentType}_${file.name}`,
            type: file.type,
            size: convertedBuffer.byteLength,
            status: "completed",
            downloadUrl: URL.createObjectURL(new Blob([convertedBuffer], { type: file.type }))
          };

          newProcessedFiles.push(processedFile);

        } catch (error) {
          console.error(`Error processing ${file.name}:`, error);
          newProcessedFiles.push({
            id: Math.random().toString(36).substr(2, 9),
            originalName: file.name,
            processedName: file.name,
            type: file.type,
            size: file.size,
            status: "error",
            error: error instanceof Error ? error.message : "Unknown error"
          });
        }
      }

      setConversionProgress({
        currentFile: "All files processed",
        progress: 100,
        stage: "completed"
      });

      setProcessedFiles(newProcessedFiles);

    } catch (error) {
      console.error("Conversion failed:", error);
      alert("Conversion failed. Please try again.");
    } finally {
      setTimeout(() => {
        setIsConverting(false);
      }, 2000);
    }
  };

  const handleDownloadAll = async () => {
    const completedFiles = processedFiles.filter(f => f.status === "completed" && f.downloadUrl);
    
    if (completedFiles.length === 0) return;

    try {
      const zip = new JSZip();
      
      for (const file of completedFiles) {
        if (file.downloadUrl) {
          const response = await fetch(file.downloadUrl);
          const blob = await response.blob();
          zip.file(file.processedName, blob);
        }
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `${EXAM_FORMATS[selectedExam].name}_converted_documents.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Failed to create zip file:", error);
      alert("Failed to download files. Please try downloading individually.");
    }
  };

  const handleDownloadFile = (fileId: string) => {
    const file = processedFiles.find(f => f.id === fileId);
    if (file && file.downloadUrl) {
      const a = document.createElement("a");
      a.href = file.downloadUrl;
      a.download = file.processedName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4 leading-tight">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                getConvertedExams.io
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Your all-in-one
              <strong className="text-gray-800"> Competitive Exams </strong>
              Document Converter
            </p>
            {initializationStatus && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800">{initializationStatus}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left sidebar - Exam selection */}
            <div className="lg:col-span-1">
              <ExamSelector
                selectedExam={selectedExam}
                onExamChange={setSelectedExam}
              />
            </div>

            {/* Main content */}
            <div className="lg:col-span-3">
              <ExamRequirements examFormat={EXAM_FORMATS[selectedExam]} />
              
              <DragAndDropFile onFilesSelected={handleFilesSelected} />

              {files.length > 0 && (
                <div className="mt-6 text-center">
                  <button
                    onClick={handleConvert}
                    disabled={!wasmInitialized || isConverting}
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                  >
                    {isConverting ? "Converting..." : `Convert for ${EXAM_FORMATS[selectedExam].name}`}
                  </button>
                </div>
              )}

              <DownloadSection
                processedFiles={processedFiles}
                onDownloadAll={handleDownloadAll}
                onDownloadFile={handleDownloadFile}
              />
            </div>
          </div>
        </div>
      </div>

      <ConversionProgress
        progress={conversionProgress}
        isVisible={isConverting}
      />
    </div>
  );
}

export default App;