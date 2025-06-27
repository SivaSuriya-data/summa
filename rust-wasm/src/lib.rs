use wasm_bindgen::prelude::*;
use web_sys::console;
use serde::{Deserialize, Serialize};
use image::{ImageBuffer, RgbImage, DynamicImage, ImageFormat};
use std::io::Cursor;

// Macro for console.log
macro_rules! log {
    ( $( $t:tt )* ) => {
        console::log_1(&format!( $( $t )* ).into());
    }
}

#[derive(Serialize, Deserialize)]
pub struct PhotoRequirements {
    pub width: u32,
    pub height: u32,
    pub dpi: u32,
    pub format: String,
}

#[derive(Serialize, Deserialize)]
pub struct SignatureRequirements {
    pub width: u32,
    pub height: u32,
    pub dpi: u32,
    pub format: String,
}

#[derive(Serialize, Deserialize)]
pub struct ExamRequirements {
    #[serde(rename = "photoSize")]
    pub photo_size: PhotoRequirements,
    #[serde(rename = "signatureSize")]
    pub signature_size: SignatureRequirements,
    #[serde(rename = "documentFormats")]
    pub document_formats: Vec<String>,
    #[serde(rename = "maxFileSize")]
    pub max_file_size: u32,
    #[serde(rename = "requiredDocuments")]
    pub required_documents: Vec<String>,
}

#[derive(Serialize, Deserialize)]
pub struct ExamFormat {
    pub id: String,
    pub name: String,
    pub requirements: ExamRequirements,
}

#[wasm_bindgen]
pub fn convert_document(
    file_data: &[u8],
    file_name: &str,
    document_type: &str,
    exam_format_json: &str,
) -> Result<Vec<u8>, JsValue> {
    log!("Converting document: {} of type: {}", file_name, document_type);
    
    let exam_format: ExamFormat = serde_json::from_str(exam_format_json)
        .map_err(|e| JsValue::from_str(&format!("Failed to parse exam format: {}", e)))?;
    
    // Load image from bytes
    let img = image::load_from_memory(file_data)
        .map_err(|e| JsValue::from_str(&format!("Failed to load image: {}", e)))?;
    
    let converted_img = match document_type {
        "passport_photo" => convert_passport_photo(img, &exam_format.requirements.photo_size)?,
        "signature" => convert_signature(img, &exam_format.requirements.signature_size)?,
        _ => convert_generic_document(img)?,
    };
    
    // Convert to bytes
    let mut buffer = Vec::new();
    let mut cursor = Cursor::new(&mut buffer);
    
    converted_img.write_to(&mut cursor, ImageFormat::Jpeg)
        .map_err(|e| JsValue::from_str(&format!("Failed to encode image: {}", e)))?;
    
    log!("Document converted successfully");
    Ok(buffer)
}

fn convert_passport_photo(img: DynamicImage, requirements: &PhotoRequirements) -> Result<DynamicImage, JsValue> {
    log!("Converting passport photo to {}x{}", requirements.width, requirements.height);
    
    // Resize image to exact requirements
    let resized = img.resize_exact(
        requirements.width,
        requirements.height,
        image::imageops::FilterType::Lanczos3
    );
    
    // Enhance image quality
    let enhanced = enhance_image_quality(resized);
    
    Ok(enhanced)
}

fn convert_signature(img: DynamicImage, requirements: &SignatureRequirements) -> Result<DynamicImage, JsValue> {
    log!("Converting signature to {}x{}", requirements.width, requirements.height);
    
    // Convert to grayscale first for better signature processing
    let gray = img.grayscale();
    
    // Resize to requirements
    let resized = gray.resize_exact(
        requirements.width,
        requirements.height,
        image::imageops::FilterType::Lanczos3
    );
    
    // Apply signature-specific enhancements
    let enhanced = enhance_signature(resized);
    
    Ok(enhanced)
}

fn convert_generic_document(img: DynamicImage) -> Result<DynamicImage, JsValue> {
    log!("Converting generic document");
    
    // Apply general document enhancements
    let enhanced = enhance_document(img);
    
    Ok(enhanced)
}

fn enhance_image_quality(img: DynamicImage) -> DynamicImage {
    // Apply brightness and contrast adjustments
    let adjusted = img.brighten(10);
    
    // Apply sharpening filter
    let sharpened = apply_sharpen_filter(adjusted);
    
    sharpened
}

fn enhance_signature(img: DynamicImage) -> DynamicImage {
    // Increase contrast for signatures
    let contrasted = img.adjust_contrast(20.0);
    
    // Apply threshold to make signature more prominent
    apply_threshold(contrasted, 128)
}

fn enhance_document(img: DynamicImage) -> DynamicImage {
    // General document enhancement
    let adjusted = img.brighten(5);
    let contrasted = adjusted.adjust_contrast(10.0);
    
    contrasted
}

fn apply_sharpen_filter(img: DynamicImage) -> DynamicImage {
    // Simple sharpening kernel
    let kernel = [-1.0, -1.0, -1.0,
                  -1.0,  9.0, -1.0,
                  -1.0, -1.0, -1.0];
    
    // For simplicity, return the original image
    // In a full implementation, you would apply the convolution
    img
}

fn apply_threshold(img: DynamicImage, threshold: u8) -> DynamicImage {
    let mut img_buffer = img.to_rgb8();
    
    for pixel in img_buffer.pixels_mut() {
        let gray = (pixel[0] as f32 * 0.299 + pixel[1] as f32 * 0.587 + pixel[2] as f32 * 0.114) as u8;
        let new_value = if gray > threshold { 255 } else { 0 };
        pixel[0] = new_value;
        pixel[1] = new_value;
        pixel[2] = new_value;
    }
    
    DynamicImage::ImageRgb8(img_buffer)
}

#[wasm_bindgen(start)]
pub fn main() {
    log!("WASM module initialized");
}