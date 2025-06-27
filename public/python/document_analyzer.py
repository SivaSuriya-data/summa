import io
import base64
from PIL import Image
import numpy as np
import re

class DocumentAnalyzer:
    def __init__(self):
        self.document_patterns = {
            "passport_photo": {
                "aspect_ratio_range": (0.6, 0.9),
                "max_width": 500,
                "keywords": ["photo", "passport", "picture"]
            },
            "signature": {
                "aspect_ratio_range": (1.5, 4.0),
                "max_height": 150,
                "keywords": ["signature", "sign", "signed"]
            },
            "aadhar_card": {
                "keywords": ["uidai", "aadhar", "unique identification"],
                "patterns": [r'\b\d{4}\s?\d{4}\s?\d{4}\b']
            },
            "marksheet": {
                "keywords": ["marksheet", "marks", "grade", "certificate", "board", "university"],
                "patterns": [r'10th|12th|ssc|hsc|cbse|icse']
            },
            "certificate": {
                "keywords": ["certificate", "certify", "issued", "authority"]
            }
        }
    
    def analyze_image(self, image_data):
        """Analyze image to determine document type"""
        try:
            # Convert bytes to PIL Image
            image = Image.open(io.BytesIO(image_data))
            width, height = image.size
            aspect_ratio = width / height
            
            # Check for passport photo
            if (0.6 <= aspect_ratio <= 0.9 and width < 500):
                return "passport_photo"
            
            # Check for signature
            if (aspect_ratio > 1.5 and height < 150):
                return "signature"
            
            # Default to document for other images
            return "document"
            
        except Exception as e:
            print(f"Error analyzing image: {e}")
            return "unknown_document"
    
    def analyze_text(self, text):
        """Analyze text content to determine document type"""
        text_lower = text.lower()
        
        # Check for Aadhar card
        if any(keyword in text_lower for keyword in ["uidai", "aadhar", "unique identification"]):
            return "aadhar_card"
        
        # Check for marksheet
        if any(keyword in text_lower for keyword in ["marksheet", "marks", "grade"]):
            if any(pattern in text_lower for pattern in ["10th", "ssc", "secondary"]):
                return "10th_marksheet"
            elif any(pattern in text_lower for pattern in ["12th", "hsc", "higher secondary"]):
                return "12th_marksheet"
            else:
                return "marksheet"
        
        # Check for certificates
        if "certificate" in text_lower:
            if any(keyword in text_lower for keyword in ["community", "caste", "obc", "sc", "st"]):
                return "community_certificate"
            elif "income" in text_lower:
                return "income_certificate"
            elif "birth" in text_lower:
                return "birth_certificate"
            else:
                return "certificate"
        
        # Check for other documents
        if any(keyword in text_lower for keyword in ["passport", "republic of india"]):
            return "passport"
        
        if any(keyword in text_lower for keyword in ["voter", "election", "epic"]):
            return "voter_id"
        
        if any(keyword in text_lower for keyword in ["driving", "license", "dl"]):
            return "driving_license"
        
        return "unknown_document"

# Global analyzer instance
analyzer = DocumentAnalyzer()

def analyze_document(file_data, file_name, file_type=""):
    """Main function to analyze document and return type"""
    try:
        if file_type.startswith('image/') or file_name.lower().endswith(('.jpg', '.jpeg', '.png', '.bmp', '.tiff')):
            return analyzer.analyze_image(file_data)
        else:
            # For non-image files, we'd need OCR or text extraction
            # For now, return generic document type
            return "document"
    except Exception as e:
        print(f"Error in document analysis: {e}")
        return "unknown_document"