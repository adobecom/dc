const verbMap = {
  typeMap: {
    'word-to-pdf': 'create_pdf',
    'ppt-to-pdf': 'create_pdf',
    'jpg-to-pdf': 'create_pdf',
    'png-to-pdf': 'create_pdf',
    'excel-to-pdf': 'create_pdf',
    createpdf: 'create_pdf',
    'compress-pdf': 'compress_pdf',
    'pdf-to-excel': 'export_pdf',
    'pdf-to-image': 'export_pdf',
    'pdf-to-ppt': 'export_pdf',
    'pdf-to-word': 'export_pdf',
    'combine-pdf': 'combine_pdf',
    'protect-pdf': 'protect_pdf',
    'delete-pages': 'organize_pdf',
    'reorder-pages': 'organize_pdf',
    'rotate-pages': 'organize_pdf',
    'split-pdf': 'organize_pdf',
    'insert-pdf': 'organize_pdf',
    'extract-pages': 'organize_pdf',
    L1: 'organize_pdf',
    'ocr-pdf': 'ocr_pdf',
    'chat-pdf': 'create_pdf',
  },
  upsellMap: {
    'word-to-pdf': 'createPDF',
    'ppt-to-pdf': 'createPDF',
    'jpg-to-pdf': 'createPDF',
    'png-to-pdf': 'createPDF',
    'excel-to-pdf': 'createPDF',
    createpdf: 'createPDF',
    'compress-pdf': 'compressPDF',
    'pdf-to-excel': 'exportPDF',
    'pdf-to-image': 'exportPDF',
    'pdf-to-ppt': 'exportPDF',
    'pdf-to-word': 'exportPDF',
    'combine-pdf': 'mergePDF',
    'protect-pdf': 'passwordProtectPDF',
    'delete-pages': 'l1Verbs',
    'reorder-pages': 'l1Verbs',
    'rotate-pages': 'l1Verbs',
    'split-pdf': 'l1Verbs',
    'insert-pdf': 'l1Verbs',
    'extract-pages': 'l1Verbs',
    'ocr-pdf': 'ocrPDF',
    'chat-pdf': 'createPDF',
  },
};

export default verbMap;

// L1 Verbs with no real quota
// fillsign - upload
// sendforsignature  - upload
// add-comment (edit) - upload
// crop-pages - upload
