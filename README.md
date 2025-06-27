# Competitive Exam Document Converter

A comprehensive web application that converts documents to meet specific competitive exam requirements (NEET, JEE, UPSC, CAT, GATE).

## Features

- **Multi-Exam Support**: Supports NEET, JEE, UPSC, CAT, and GATE exam formats
- **Document Analysis**: Automatic document type detection using Python + OCR
- **Format Conversion**: Rust-based WASM for high-performance image processing
- **Batch Processing**: Convert multiple documents simultaneously
- **Download Options**: Individual file download or bulk ZIP download

## Architecture

- **Frontend**: React + TypeScript with Tailwind CSS
- **Document Analysis**: Python (via Pyodide) for OCR and document classification
- **Image Processing**: Rust compiled to WebAssembly for performance
- **Deployment**: Docker containerized with Nginx

## Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd get-converted-exams

# Build and run with Docker Compose
docker-compose up --build

# Access the application at http://localhost:3000
```

### Development Setup

```bash
# Install dependencies
npm install

# Build WASM module
cd rust-wasm
chmod +x build.sh
./build.sh
cd ..

# Start development server
npm run dev
```

## Exam Format Specifications

### NEET
- Photo: 200×230 pixels, 200 DPI, JPEG
- Signature: 140×60 pixels, 200 DPI, JPEG
- Max file size: 1MB

### JEE
- Photo: 180×240 pixels, 300 DPI, JPEG
- Signature: 140×60 pixels, 300 DPI, JPEG
- Max file size: 500KB

### UPSC
- Photo: 300×400 pixels, 300 DPI, JPEG
- Signature: 140×60 pixels, 300 DPI, JPEG
- Max file size: 2MB

### CAT
- Photo: 240×320 pixels, 200 DPI, JPEG
- Signature: 140×60 pixels, 200 DPI, JPEG
- Max file size: 1MB

### GATE
- Photo: 240×320 pixels, 200 DPI, JPEG
- Signature: 140×60 pixels, 200 DPI, JPEG
- Max file size: 1MB

## Supported Document Types

- Passport Photos
- Signatures
- Aadhar Card
- 10th/12th Marksheets
- Graduation Certificates
- Category Certificates
- Birth Certificates
- Income Certificates

## File Format Support

- **Input**: PDF, JPEG, PNG, BMP, TIFF, DOC, DOCX
- **Output**: JPEG (optimized for exam requirements)

## Development

### Project Structure

```
├── src/
│   ├── components/          # React components
│   ├── services/           # WASM and API services
│   ├── types/              # TypeScript definitions
│   ├── config/             # Exam format configurations
│   └── wasm/               # Generated WASM files
├── rust-wasm/              # Rust source for WASM
├── public/python/          # Python document analyzer
├── Dockerfile              # Container configuration
└── docker-compose.yml      # Multi-service setup
```

### Building WASM Module

```bash
cd rust-wasm
./build.sh
```

### Adding New Exam Formats

1. Update `src/config/examFormats.ts`
2. Add format specifications
3. Update UI components if needed

## Deployment

### Production Build

```bash
# Build for production
npm run build

# Build Docker image
docker build -t exam-converter .

# Run container
docker run -p 3000:80 exam-converter
```

### Environment Variables

- `NODE_ENV`: Set to 'production' for production builds
- `PORT`: Server port (default: 80 in container)

## Performance Considerations

- WASM modules are loaded asynchronously
- Large files are processed in chunks
- Pyodide initialization is cached
- Images are optimized during conversion

## Browser Compatibility

- Chrome 88+
- Firefox 89+
- Safari 14+
- Edge 88+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please create an issue in the repository.