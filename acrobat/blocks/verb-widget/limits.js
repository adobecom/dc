const LIMITS = {
  fillsign: {
    maxFileSize: 100000000, // 100 MB
    maxFileSizeFriendly: '100 MB', // 100 MB
    acceptedFiles: '.pdf',
    maxNumFiles: 1,
    mobileApp: true,
  },
  'delete-pages': {
    maxFileSize: 100000000, // 1 MB
    acceptedFiles: '.pdf',
    maxNumFiles: 1,
  },
  'number-pages': {
    maxFileSize: 100000000, // 1 MB
    acceptedFiles: '.pdf',
    maxNumFiles: 1,
  },
  'compress-pdf': {
    maxFileSize: 100000000,
    acceptedFiles: '.pdf',
    maxNumFiles: 1,
  },
};

export default LIMITS;
