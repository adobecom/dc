const ENVS = {
  prod: 'https://pdfnow.adobe.io',
  stage: 'https://pdfnow-stage.adobe.io',
  dev: 'https://pdfnow-dev.adobe.io',
};

function getEnv() {
  const { host } = window.location;
  // eslint-disable-next-line compat/compat
  const PAGE_URL = new URL(window.location.href);
  const query = PAGE_URL.searchParams.get('env');

  if (query) return ENVS[query];
  if (host.includes('stage.adobe') || host.includes('corp.adobe') || host.includes('stage')) {
    return ENVS.stage;
  }
  if (host.includes('hlx.page') || host.includes('localhost') || host.includes('hlx.live')) {
    return ENVS.dev;
  }
  return ENVS.prod;
}

const baseApiUrl = getEnv();

const fetchWithAuth = async (url, accessToken, options = {}) => {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    ...options.headers,
  };

  try {
    // eslint-disable-next-line compat/compat
    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error fetching ${url}:`, error);
  }
};

const getAnonymousToken = async () => {
  const url = `${baseApiUrl}/users/anonymous_token`;
  const headers = { Accept: `application/vnd.adobe.dc+json;profile="${baseApiUrl}/schemas/anonymous_token_v1.json"` };

  try {
    // eslint-disable-next-line compat/compat
    const response = await fetch(url, { headers, method: 'POST' });
    if (!response.ok) {
      throw new Error(`Failed to fetch anonymous token: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error fetching ${url}:`, error);
  }
};

export async function initializePdfAssetManager() {
  const anonymousTokenResponse = await getAnonymousToken();
  const { access_token: accessToken, discovery } = anonymousTokenResponse;
  const discoveryResources = discovery.resources;
  return {
    accessToken,
    discoveryResources,
  };
}
export async function uploadAsset(uploadUrl, formData, accessToken) {
  try {
    const response = await fetchWithAuth(uploadUrl, accessToken, {
      method: 'POST',
      body: formData,
    });
    return response;
  } catch (error) {
    throw new Error('Error uploading asset:', error);
  }
}

export const prepareFormData = (file, filename) => {
  const formData = new FormData();
  formData.append('parameters', new Blob([JSON.stringify({
    options: {
      ignore_content_type: true,
      name: filename,
    },
  })], { type: `application/vnd.adobe.dc+json;profile="${baseApiUrl}/schemas/asset_upload_parameters_v1.json"` }));
  formData.append('file', file, filename);
  return formData;
};

export async function createPdf(createPdfUrl, payload, accessToken) {
  try {
    const response = await fetchWithAuth(createPdfUrl, accessToken, {
      method: 'POST',
      headers: { 'Content-Type': `application/vnd.adobe.dc+json;profile="${baseApiUrl}/schemas/createpdf_parameters_v1.json"` },
      body: JSON.stringify(payload),
    });
    return response;
  } catch (error) {
    throw new Error('Error creating PDF:', error);
  }
}

export async function checkJobStatus(jobUri, accessToken, discoveryResources) {
  const jobStatusUrlTemplate = discoveryResources.jobs.status.uri;
  const url = jobStatusUrlTemplate.replace('{?job_uri}', `?job_uri=${encodeURIComponent(jobUri)}`);

  try {
    const statusResult = await fetchWithAuth(url, accessToken);

    if (statusResult.status === 'done') {
      return statusResult;
    }

    if (statusResult.status === 'failed') {
      throw new Error('Job failed');
    }

    const RETRY_INTERVAL = 2000;

    setTimeout(() => {
      checkJobStatus(jobUri, accessToken, discoveryResources)
        .catch((error) => {
          throw new Error('Error checking job status:', error);
        });
    }, statusResult.retry_interval || RETRY_INTERVAL);
  } catch (error) {
    throw new Error('Error checking job status:', error);
  }
  return null;
}
export async function getAssetMetadata(assetUri, accessToken, discoveryResources) {
  const getMetadataUrlTemplate = discoveryResources.assets.get_metadata.uri;
  const url = getMetadataUrlTemplate.replace('{?asset_uri}', `?asset_uri=${encodeURIComponent(assetUri)}`);

  try {
    const response = await fetchWithAuth(url, accessToken);
    return response;
  } catch (error) {
    throw new Error('Error checking job status:', error);
  }
}
const encodeBlobUrl = (blobUrl = {}) => {
  const encodedBlobUrl = btoa(JSON.stringify(blobUrl));
  return encodedBlobUrl.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

export const getAcrobatWebLink = (filename, assetUri, downloadUri) => {
  const blobUrlStructure = { source: 'signed-uri', itemName: filename, itemType: 'application/pdf' };
  const encodedBlobUrl = encodeBlobUrl(blobUrlStructure);
  const acrobatDomain = 'https://acrobat.adobe.com';
  return `${acrobatDomain}/blob/${encodedBlobUrl}?defaultRHPFeature=verb-quanda&x_api_client_location=chat_pdf&pdfNowAssetUri=${assetUri}#${downloadUri}`;
};

export async function getDownloadUri(
  assetUri,
  accessToken,
  discoveryResources,
  makeTicket = false,
  makeDirectStorageUri = false,
) {
  const downloadUriTemplate = discoveryResources.assets.download_uri.uri;
  let url = `${downloadUriTemplate.replace('{?asset_uri,make_direct_storage_uri,action}', '')}?asset_uri=${encodeURIComponent(assetUri)}`;

  if (makeTicket) {
    url += '&make_ticket=true';
  }

  if (makeDirectStorageUri) {
    url += '&make_direct_storage_uri=true';
  }

  try {
    const response = await fetchWithAuth(url.toString(), accessToken);
    return response.uri;
  } catch (error) {
    throw error('Error checking job status:', error);
  }
}
