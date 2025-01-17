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
    acceptedFiles: ['application/pdf'],
    multipleFiles: true,
    trial: 2,
  },
};

export default LIMITS;
