import { ExamFormat } from '../types/exam';

export const EXAM_FORMATS: Record<string, ExamFormat> = {
  neet: {
    id: 'neet',
    name: 'NEET',
    requirements: {
      photoSize: {
        width: 200,
        height: 230,
        dpi: 200,
        format: 'JPEG'
      },
      signatureSize: {
        width: 140,
        height: 60,
        dpi: 200,
        format: 'JPEG'
      },
      documentFormats: ['PDF', 'JPEG', 'PNG'],
      maxFileSize: 1024 * 1024, // 1MB
      requiredDocuments: [
        'passport_photo',
        'signature',
        '10th_marksheet',
        '12th_marksheet',
        'category_certificate',
        'aadhar_card'
      ]
    }
  },
  jee: {
    id: 'jee',
    name: 'JEE',
    requirements: {
      photoSize: {
        width: 180,
        height: 240,
        dpi: 300,
        format: 'JPEG'
      },
      signatureSize: {
        width: 140,
        height: 60,
        dpi: 300,
        format: 'JPEG'
      },
      documentFormats: ['PDF', 'JPEG', 'PNG'],
      maxFileSize: 500 * 1024, // 500KB
      requiredDocuments: [
        'passport_photo',
        'signature',
        '10th_marksheet',
        '12th_marksheet',
        'category_certificate',
        'aadhar_card'
      ]
    }
  },
  upsc: {
    id: 'upsc',
    name: 'UPSC',
    requirements: {
      photoSize: {
        width: 300,
        height: 400,
        dpi: 300,
        format: 'JPEG'
      },
      signatureSize: {
        width: 140,
        height: 60,
        dpi: 300,
        format: 'JPEG'
      },
      documentFormats: ['PDF', 'JPEG', 'PNG'],
      maxFileSize: 2 * 1024 * 1024, // 2MB
      requiredDocuments: [
        'passport_photo',
        'signature',
        '10th_marksheet',
        '12th_marksheet',
        'graduation_certificate',
        'category_certificate',
        'aadhar_card'
      ]
    }
  },
  cat: {
    id: 'cat',
    name: 'CAT',
    requirements: {
      photoSize: {
        width: 240,
        height: 320,
        dpi: 200,
        format: 'JPEG'
      },
      signatureSize: {
        width: 140,
        height: 60,
        dpi: 200,
        format: 'JPEG'
      },
      documentFormats: ['PDF', 'JPEG', 'PNG'],
      maxFileSize: 1024 * 1024, // 1MB
      requiredDocuments: [
        'passport_photo',
        'signature',
        '10th_marksheet',
        '12th_marksheet',
        'graduation_certificate',
        'category_certificate',
        'aadhar_card'
      ]
    }
  },
  gate: {
    id: 'gate',
    name: 'GATE',
    requirements: {
      photoSize: {
        width: 240,
        height: 320,
        dpi: 200,
        format: 'JPEG'
      },
      signatureSize: {
        width: 140,
        height: 60,
        dpi: 200,
        format: 'JPEG'
      },
      documentFormats: ['PDF', 'JPEG', 'PNG'],
      maxFileSize: 1024 * 1024, // 1MB
      requiredDocuments: [
        'passport_photo',
        'signature',
        '10th_marksheet',
        '12th_marksheet',
        'graduation_certificate',
        'category_certificate',
        'aadhar_card'
      ]
    }
  }
};