const LIMITS = {
  fillsign: {
    maxFileSize: 104857600, // 100 MB
    maxFileSizeFriendly: '100 MB', // 100 MB
    acceptedFiles: ['application/pdf'],
    maxNumFiles: 1,
    multipleFiles: false,
    mobileApp: true,
  },
  'number-pages': {
    maxFileSize: 104857600, // 100 MB
    acceptedFiles: ['application/pdf'],
    maxNumFiles: 1,
    level: 0,
  },
  'split-pdf': {
    maxFileSize: 104857600, // 1 GB
    maxFileSizeFriendly: '1 GB',
    acceptedFiles: ['application/pdf'],
    maxNumFiles: 1,
  },
  'crop-pages': {
    maxFileSize: 104857600, // 100 MB
    maxFileSizeFriendly: '1 MB',
    acceptedFiles: ['application/pdf'],
    maxNumFiles: 1,
    level: 0,
  },
  'add-comment': {
    maxFileSize: 104857600, // 100 MB
    maxFileSizeFriendly: '1 MB',
    acceptedFiles: ['application/pdf'],
    maxNumFiles: 1,
    mobileApp: true,
  },
  'compress-pdf': {
    maxFileSize: 2147483648,
    maxFileSizeFriendly: '2 GB',
    acceptedFiles: [
      'application/pdf',
      'application/msword',
      'application/xml',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/x-tika-ooxml',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/x-tika-msworks-spreadsheet',
      'application/vnd.adobe.form.fillsign',
      'application/illustrator',
      'application/rtf',
      'application/x-indesign',
      'image/jpeg',
      'image/png',
      'image/bmp',
      'image/gif',
      'image/vnd.adobe.photoshop',
      'image/tiff',
      'message/rfc822',
      'text/plain',
    ],
    multipleFiles: true,
    trial: 2,
  },
  'delete-pages': {
    maxFileSize: 104857600, // 100 MB
    acceptedFiles: ['application/pdf'],
    maxNumFiles: 1,
  },
  'insert-pdf': {
    maxFileSize: 104857600, // 100 MB
    acceptedFiles: ['application/pdf'],
    maxNumFiles: 1,
  },
  'extract-pages': {
    maxFileSize: 104857600, // 100 MB
    acceptedFiles: ['application/pdf'],
    maxNumFiles: 1,
  },
  'reorder-pages': {
    maxFileSize: 104857600, // 100 MB
    acceptedFiles: ['application/pdf'],
    maxNumFiles: 1,
  },
  sendforsignature: {
    maxFileSize: 5242880, // 5 MB
    acceptedFiles: ['application/pdf'],
    maxNumFiles: 1,
    mobileApp: true,
  },
  'merge-pdf': {
    // multifile-only or single-hybrid
    uploadType: 'multifile-only',
    multipleFiles: true,
    maxFileSize: 104857600, // 100 MB
    maxFileSizeFriendly: '100 MB',
  },
};

export default LIMITS;
