const LIMITS = {
  fillsign: {
    maxFileSize: 100000000, // 1 MB
    maxFileSizeFriendly: '1 MB', // 1 MB
    acceptedFiles: ['application/pdf'],
    maxNumFiles: 1,
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
