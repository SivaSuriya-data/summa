// Fallback WASM module for development
// This will be replaced by the actual Rust-generated WASM module

export default async function init() {
  console.log('Using fallback WASM module');
  return Promise.resolve();
}

export function convert_document(data, fileName, docType, examFormat) {
  console.log('Fallback document conversion for:', fileName);
  // Return the original data for now
  return data;
}