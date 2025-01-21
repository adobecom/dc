const LIMITS = {
  fillsign: {
    maxFileSize: 104857600, // 100 MB
    maxFileSizeFriendly: '100 MB', // 100 MB
    acceptedFiles: ['application/pdf'],
    maxNumFiles: 1,
    multipleFiles: false,
    mobileApp: true,
  },
  'delete-pages': {
    maxFileSize: 100000000, // 1 MB
    acceptedFiles: ['application/pdf'],
    maxNumFiles: 1,
  },
  'number-pages': {
    maxFileSize: 100000000, // 1 MB
    acceptedFiles: ['application/pdf'],
    maxNumFiles: 1,
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
};

export default LIMITS;
