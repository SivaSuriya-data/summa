import { ExamFormat } from '../types/exam';

class WasmService {
  private wasmModule: any = null;
  private pyodide: any = null;

  async initializeWasm() {
    try {
      // Initialize Rust WASM module
      const wasmModule = await import('../wasm/pkg/exam_converter.js');
      await wasmModule.default();
      this.wasmModule = wasmModule;

      // Initialize Pyodide for Python document analysis
      const { loadPyodide } = await import('pyodide');
      this.pyodide = await loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
      });

      // Install required Python packages
      await this.pyodide.loadPackage(['pillow', 'numpy']);
      
      // Load Python document analyzer
      const pythonCode = await fetch('/python/document_analyzer.py').then(r => r.text());
      this.pyodide.runPython(pythonCode);

      console.log('WASM and Pyodide initialized successfully');
    } catch (error) {
      console.error('Failed to initialize WASM:', error);
      throw error;
    }
  }

  async analyzeDocument(fileBuffer: ArrayBuffer, fileName: string): Promise<string> {
    if (!this.pyodide) {
      throw new Error('Pyodide not initialized');
    }

    try {
      // Convert ArrayBuffer to Uint8Array for Python
      const uint8Array = new Uint8Array(fileBuffer);
      this.pyodide.globals.set('file_data', uint8Array);
      this.pyodide.globals.set('file_name', fileName);

      // Run Python document analysis
      const result = this.pyodide.runPython(`
        import io
        from PIL import Image
        import numpy as np
        
        # Convert file data to image if it's an image file
        if file_name.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp')):
            image = Image.open(io.BytesIO(file_data.tobytes()))
            # Simple document type detection based on aspect ratio and size
            width, height = image.size
            aspect_ratio = width / height
            
            if 0.6 <= aspect_ratio <= 0.9 and width < 500:
                document_type = "passport_photo"
            elif aspect_ratio > 2 and height < 100:
                document_type = "signature"
            else:
                document_type = "document"
        else:
            document_type = "document"
            
        document_type
      `);

      return result;
    } catch (error) {
      console.error('Document analysis failed:', error);
      return 'unknown_document';
    }
  }

  async convertDocument(
    fileBuffer: ArrayBuffer,
    fileName: string,
    documentType: string,
    examFormat: ExamFormat
  ): Promise<ArrayBuffer> {
    if (!this.wasmModule) {
      throw new Error('WASM module not initialized');
    }

    try {
      // Use Rust WASM for document conversion
      const uint8Array = new Uint8Array(fileBuffer);
      const result = this.wasmModule.convert_document(
        uint8Array,
        fileName,
        documentType,
        JSON.stringify(examFormat)
      );

      return result.buffer;
    } catch (error) {
      console.error('Document conversion failed:', error);
      throw error;
    }
  }

  isInitialized(): boolean {
    return this.wasmModule !== null && this.pyodide !== null;
  }
}

export const wasmService = new WasmService();