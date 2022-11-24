const verbMap = {
  typeMap : {
    "word-to-pdf" : "create_pdf",
    "ppt-to-pdf" : "create_pdf",
    "jpg-to-pdf" : "create_pdf",
    "excel-to-pdf" : "create_pdf",
    "createpdf" : "create_pdf",
    "compress-pdf" : "compress_pdf",
    "pdf-to-excel" : "create_pdf",
    "pdf-to-image" : "create_pdf",
    "pdf-to-ppt" : "create_pdf",
    "pdf-to-word" : "create_pdf",
    "combine-pdf" : "combine_pdf",
    "protect-pdf" : "protect_pdf",
    "delete-pages" : "organize_pdf",
    "reorder-pages" : "organize_pdf",
    "rotate-pages" : "organize_pdf",
    "split-pdf" : "organize_pdf",
    "insert-pdf" : "organize_pdf",
    "extract-pages" : "organize_pdf",
    "L1" : "organize_pdf"
  },
  upsellMap : {
    "word-to-pdf" : "createPDF",
    "ppt-to-pdf" : "createPDF",
    "jpg-to-pdf" : "createPDF",
    "excel-to-pdf" : "createPDF",
    "createpdf" : "createPDF",
    "compress-pdf" : "compressPDF",
    "pdf-to-excel" : "createPDF",
    "pdf-to-image" : "createPDF",
    "pdf-to-ppt" : "createPDF",
    "pdf-to-word" : "createPDF",
    "combine-pdf" : "mergePDF",
    "protect-pdf" : "passwordProtectPDF",
    "delete-pages" : "l1Verbs",
    "reorder-pages" : "l1Verbs",
    "rotate-pages" : "l1Verbs",
    "split-pdf" : "l1Verbs",
    "insert-pdf" : "l1Verbs",
    "extract-pages" : "l1Verbs"
  }
}

export default verbMap;

// L1 Verbs with no real quota 
// fillsign - upload
// sendforsignature  - upload
// add-comment (edit) - upload
// crop-pages - upload
