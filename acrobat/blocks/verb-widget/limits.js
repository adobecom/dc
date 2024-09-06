const LIMITS = {
  fillsign: {
    maxFileSize: 100000000, // 1 MB
    maxFileSizeFriendly: '100 MB', // 1 MB
    acceptedFiles: ['application/pdf'],
    maxNumFiles: 1,
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
    maxFileSize: 100000000,
    acceptedFiles: ['application/pdf'],
    maxNumFiles: 1,
  },
};

export default LIMITS;
