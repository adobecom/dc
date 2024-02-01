//subtle object
export const mock_crypto_subtle_digest = jest.fn();
export const mock_crypto_subtle_importKey = jest.fn();
export const mock_crypto_subtle_encrypt = jest.fn();
export const mock_crypto_subtle_decrypt = jest.fn();
export const mock_crypto_subtle_sign = jest.fn();
export const mock_crypto_subtle_verify = jest.fn();

const Subtle = jest.fn().mockImplementation(() => {
  return {
    digest: mock_crypto_subtle_digest,
    importKey: mock_crypto_subtle_importKey,
    encrypt: mock_crypto_subtle_encrypt,
    decrypt: mock_crypto_subtle_decrypt,
    sign: mock_crypto_subtle_sign,
    verify: mock_crypto_subtle_verify,
  };
});

//crypto object
export const mock_crypto_getRandomValues = jest.fn();

const Crypto = jest.fn().mockImplementation(() => {
  return {
    getRandomValues: mock_crypto_getRandomValues,
    subtle: new Subtle(),
  };
});

export const crypto = new Crypto();

//are not property of either crypto or subtle
export const mock_pem2ab = jest.fn();
export const pem2ab = mock_pem2ab;
