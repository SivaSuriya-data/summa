import { ExamFormat } from '../types/exam';

class WasmService {
  private wasmModule: any = null;
  private pyodide: any = null;
  private initialized = false;

  async initializeWasm() {
    if (this.initialized) return;

    try {
      console.log('Initializing WASM services...');
      
      // Try to initialize Rust WASM module (optional for now)
      try {
        const wasmModule = await import('../wasm/pkg/exam_converter.js');
        await wasmModule.default();
        this.wasmModule = wasmModule;
        console.log('Rust WASM module loaded successfully');
      } catch (error) {
        console.warn('Rust WASM module not available, using fallback:', error);
        // Continue without WASM module for now
      }

      // Initialize Pyodide for Python document analysis
      try {
        const { loadPyodide } = await import('pyodide');
        this.pyodide = await loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
        });

        // Install required Python packages
        await this.pyodide.loadPackage(['pillow', 'numpy']);
        
        // Load Python document analyzer
        const pythonCode = await fetch('/python/document_analyzer.py').then(r => r.text());
        this.pyodide.runPython(pythonCode);
        console.log('Pyodide initialized successfully');
      } catch (error) {
        console.warn('Pyodide initialization failed, using fallback:', error);
        // Continue without Pyodide for now
      }

      this.initialized = true;
      console.log('WASM services initialization completed');
    } catch (error) {
      console.error('Failed to initialize WASM services:', error);
      // Don't throw error, allow app to continue with limited functionality
      this.initialized = true;
    }
  }

  async analyzeDocument(fileBuffer: ArrayBuffer, fileName: string): Promise<string> {
    // Fallback document analysis if Pyodide is not available
    if (!this.pyodide) {
      console.log('Using fallback document analysis');
      return this.fallbackAnalyzeDocument(fileName);
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
            try:
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
            except:
                document_type = "document"
        else:
            document_type = "document"
            
        document_type
      `);

      return result;
    } catch (error) {
      console.error('Document analysis failed:', error);
      return this.fallbackAnalyzeDocument(fileName);
    }
  }

  private fallbackAnalyzeDocument(fileName: string): string {
    const name = fileName.toLowerCase();
    
    if (name.includes('photo') || name.includes('passport')) {
      return 'passport_photo';
    } else if (name.includes('sign')) {
      return 'signature';
    } else if (name.includes('aadhar') || name.includes('aadhaar')) {
      return 'aadhar_card';
    } else if (name.includes('10th') || name.includes('ssc')) {
      return '10th_marksheet';
    } else if (name.includes('12th') || name.includes('hsc')) {
      return '12th_marksheet';
    } else if (name.includes('certificate')) {
      return 'certificate';
    }
    
    return 'document';
  }

  async convertDocument(
    fileBuffer: ArrayBuffer,
    fileName: string,
    documentType: string,
    examFormat: ExamFormat
  ): Promise<ArrayBuffer> {
    // If WASM module is available, use it
    if (this.wasmModule) {
      try {
        const uint8Array = new Uint8Array(fileBuffer);
        const result = this.wasmModule.convert_document(
          uint8Array,
          fileName,
          documentType,
          JSON.stringify(examFormat)
        );
        return result.buffer;
      } catch (error) {
        console.error('WASM conversion failed, using fallback:', error);
      }
    }

    // Fallback: return original file for now
    console.log('Using fallback conversion (returning original file)');
    return fileBuffer;
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

export const wasmService = new WasmService();