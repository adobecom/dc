/* eslint-disable no-underscore-dangle */
/* eslint-disable compat/compat */
/* eslint-disable max-len */
import ReactiveStore from '../../scripts/reactiveStore.js';
import { setLibs } from '../../scripts/utils.js';
import { countries } from './constants.js';
import nonprofitSelect from './select.js';

const miloLibs = setLibs('/libs');
const { createTag } = await import(`${miloLibs}/utils/utils.js`);

// #region Constants

const scenarios = Object.freeze({
  FOUND_IN_SEARCH: 'FOUND_IN_SEARCH',
  NOT_FOUND_IN_SEARCH: 'NOT_FOUND_IN_SEARCH',
});
const SEARCH_DEBOUNCE = 500;
const FETCH_ON_SCROLL_OFFSET = 100; // px

// #endregion

// #region Metadata

const metadata = {
  labels: {
    step: {
      1: 'Find your nonprofit',
      2: 'Confirm your details',
      3: 'Verification',
    },

    titleSelectNonProfit: "What's your nonprofit organization?",
    subtitleSelectNonProfit:
      "To add your nonprofit and verify eligibility, we partner with <a href='#'>Percent</a> - a leading technology platform for nonprofits. Your information will be used in accordance with Adobe's <a href='#'>privacy policy</a>.",
    titleOrganizationDetails: 'Verify your organization details',
    titleOrganizationAddress: "What's the physical address of your organization?",
    titlePersonalDetails: 'Confirm your details?',
    subtitlePersonalDetails:
      'We need to confirm your name and email in order to finish checking if your organisation is eligible.',

    country: 'Country',
    countryPlaceholder: 'Select country',
    organizationNameOrId: 'Organization name or ID',
    organizationNameOrIdPlaceholder: 'Enter your organization name',
    organizationNameOrIdSerachPlaceholder: 'Type to search',
    organizationCannotFind: "I can't find my nonprofit. I want to add it.",

    registry: 'Registry',
    registryPlaceholder: 'Select registry',
    organizationRegistrationId: 'Organization registration ID',
    organizationRegistrationIdPlaceholder: 'Enter your organization registration ID',
    evidenceNonProfitStatus: 'Evidence of your official non-profit status',
    evidenceNonProfitStatusPlaceholder: 'Enter your evidence of your official non-profit status',
    website: 'Website',
    websitePlaceholder: 'Enter your website',

    streetAddress: 'Street address',
    streetAddressPlaceholder: 'Enter street address',
    addressDetails: 'Unit, suite, building, etc. (optional)',
    addressDetailsPlaceholder: 'Enter unit, suite, building, etc.',
    state: 'State (optional)',
    statePlaceholder: 'Enter state',
    city: 'City',
    cityPlaceholder: 'Enter city',
    zipCode: 'ZIP / Postal code',
    zipCodePlaceholder: 'Enter ZIP / Postal code',

    firstName: 'First name',
    firstNamePlaceholder: 'Enter your first name',
    lastName: 'Last name',
    lastNamePlaceholder: 'Enter your last name',
    email: 'Email',
    emailPlaceholder: 'Enter your email',
    personalDataDisclaimer:
      "By entering your information, you agree to Adobe's <a href='#'>Terms of Use</a> and acknowledge our <a href='#'>Privacy Policy</a>, which explains how we handle personal information and how to exercise privacy rights.",
    continue: 'Continue',

    titleApplicationReview: 'Your application is being reviewed',
    detail1ApplicationReview:
      'Your application is now being reviewed with our partners at <a href="#">Percent</a>.',
    detail2ApplicationReview:
      "We'll email you at <strong>john.merrill@gmail.com</strong> with the outcome in 2-4 business days.",
    returnToAcrobatForNonprofits: 'Return to Acrobat for nonprofits',

    noSearchResultFound: 'No search result found',
  },
};

// #endregion

const nonprofitFormData = JSON.parse('{}');

// #region Stores

const stepperStore = new ReactiveStore({ step: 1, scenario: scenarios.FOUND_IN_SEARCH });

const organizationsStore = new ReactiveStore([]);

const registriesStore = new ReactiveStore([]);

const selectedOrganizationStore = new ReactiveStore();

// #endregion

// #region Percent API integration

// function testSandbox() {
//   fetch('https://sandbox-validate.poweredbypercent.com/adobe-acrobat', {
//     method: 'POST',
//     headers: { Authorization: 'Bearer sandbox_pk_8b320cc4-5950-4263-a3ac-828c64f6e19b' },
//   })
//     .then((response) => {
//       console.log('response: ', response);
//       return response.json();
//     })
//     .then((result) => {
//       console.log('result: ', result);
//     })
//     .catch((error) => {
//       console.log('error: ', error);
//     });
// }

let nextPageUrl;

function fetchOrganizations(search, countryCode, abortController) {
  organizationsStore.startLoading(true);
  fetch(
    `https://sandbox-api.poweredbypercent.com/v1/organisations?countryCode=${countryCode}&query=${search}`,
    {
      cache: 'force-cache',
      signal: abortController.signal,
      headers: { Authorization: 'sandbox_pk_8b320cc4-5950-4263-a3ac-828c64f6e19b' },
    },
  )
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      nextPageUrl = result._links.next;
      organizationsStore.update(result.data);
    })
    .catch((error) => {
      console.log(error);
    });
}

function fetchNextOrganizations(abortController) {
  if (!nextPageUrl) return;
  organizationsStore.startLoading();
  fetch(nextPageUrl, {
    cache: 'force-cache',
    signal: abortController.signal,
    headers: { Authorization: 'sandbox_pk_8b320cc4-5950-4263-a3ac-828c64f6e19b' },
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      nextPageUrl = result._links.next;
      organizationsStore.update((prev) => [...prev, ...result.data]);
    })
    .catch((error) => {
      console.log(error);
    });
}

function fetchRegistries(countryCode, abortController) {
  registriesStore.startLoading(true);
  fetch(`https://sandbox-api.poweredbypercent.com/v1/registries?countryCode=${countryCode}`, {
    cache: 'force-cache',
    signal: abortController.signal,
    headers: { Authorization: 'sandbox_pk_8b320cc4-5950-4263-a3ac-828c64f6e19b' },
  })
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      registriesStore.update(result.data);
    })
    .catch((error) => {
      console.log(error);
    });
}

async function sendOrganizationData() {
  // todo
  console.log(nonprofitFormData);
}

// #endregion

// UI

function renderStepper(containerTag) {
  const getStepTag = (number) => {
    const stepContainerTag = createTag('div', { class: 'np-step-container' });
    const stepIconTag = createTag('span', { class: 'np-step-icon' }, number);
    const stepNameTag = createTag('span', { class: 'np-step-name' }, metadata.labels.step[number]);
    stepContainerTag.append(stepIconTag, stepNameTag);
    return stepContainerTag;
  };

  const step1 = getStepTag(1);
  const step2 = getStepTag(2);
  const step3 = getStepTag(3);

  stepperStore.subscribe(({ step, scenario }) => {
    // Reset steps
    step1.classList.remove('is-cleared', 'is-active');
    step2.classList.remove('is-cleared', 'is-active');
    step3.classList.remove('is-cleared', 'is-active');

    if (step === 1) {
      step1.classList.add('is-active');
    }
    if (step === 2) {
      step1.classList.add('is-cleared');
      step2.classList.add('is-active');
    }
    if (step === 3) {
      if (scenario === scenarios.FOUND_IN_SEARCH) {
        step1.classList.add('is-cleared');
        step2.classList.add('is-cleared');
        step3.classList.add('is-active');
      } else {
        step1.classList.add('is-cleared');
        step2.classList.add('is-active');
      }
    }
    if (step === 4) {
      step1.classList.add('is-cleared');
      step2.classList.add('is-active');
    }
    if (step === 5) {
      step1.classList.add('is-cleared');
      step2.classList.add('is-cleared');
      step3.classList.add('is-active');
    }
  });

  const separatorTag = createTag('div', { class: 'np-step-separator' });

  containerTag.append(step1, separatorTag.cloneNode(), step2, separatorTag.cloneNode(), step3);
}

// #region Render form

function getDescriptionTag(title, subtitle) {
  const descriptionTag = createTag('div', { class: 'np-description' });
  const titleTag = createTag('span', { class: 'np-title' }, title);

  descriptionTag.append(titleTag);

  if (subtitle) {
    const subtitleTag = createTag('span', { class: 'np-subtitle' }, subtitle);

    descriptionTag.append(subtitleTag);
  }

  return descriptionTag;
}

function getSubmitTag() {
  return createTag('input', {
    class: 'np-button',
    type: 'submit',
    value: metadata.labels.continue,
  });
}

function getNonprofitInput(params) {
  const { type, name, label, placeholder, required } = params;
  const baseParams = { name, placeholder };
  if (required) baseParams.required = 'required';
  const controlTag = createTag('div', { class: 'np-control' });
  const labelTag = createTag('label', { class: 'np-label', for: name }, label);
  const inputTag = createTag('input', {
    class: 'np-input',
    type,
    ...baseParams,
  });
  controlTag.append(labelTag, inputTag);
  return controlTag;
}

function getSelectedOrganizationTag() {
  const containerTag = createTag('div', { class: 'np-selected-organization-container' });

  const headerTag = createTag('div', { class: 'np-selected-organization-header' });

  const avatarTag = createTag('div', { class: 'np-selected-organization-avatar' });
  // Get initials
  const initialsTag = createTag('span', { class: 'np-selected-organization-initials' });
  avatarTag.append(initialsTag);

  const nameTag = createTag('span', { class: 'np-selected-organization-detail' });
  headerTag.append(avatarTag, nameTag);

  const separatorTag = createTag('div', { class: 'np-selected-organization-separator' });

  const addressTag = createTag('span', { class: 'np-selected-organization-detail' });
  const idTag = createTag('span', { class: 'np-selected-organization-detail' });

  const clearTag = createTag('img', {
    class: 'np-selected-organization-clear',
    src: '/acrobat/blocks/nonprofit/icons/close.svg',
  });

  containerTag.append(headerTag, separatorTag, addressTag, idTag, clearTag);

  selectedOrganizationStore.subscribe((organization) => {
    if (!organization) {
      containerTag.style.display = 'none';
      return;
    }
    const initialWords = organization.name
      .split(' ')
      .filter((word) => Boolean(word))
      .slice(0, 2);
    const initials = initialWords.map((word) => word.substring(0, 1).toUpperCase()).join('');
    initialsTag.textContent = initials;

    nameTag.textContent = organization.name;

    addressTag.textContent = organization.address;
    idTag.textContent = organization.id;

    containerTag.style.display = 'flex';
  }, false);

  containerTag.onClear = (handler) => {
    clearTag.addEventListener('click', handler);
  };

  return containerTag;
}

// Select non-profit
function renderSelectNonprofit(containerTag) {
  // Description
  const descriptionTag = getDescriptionTag(
    metadata.labels.titleSelectNonProfit,
    metadata.labels.subtitleSelectNonProfit,
  );

  // Form
  const formTag = createTag('form', { class: 'np-form' });

  const countryTag = nonprofitSelect({
    createTag,
    name: 'country',
    label: metadata.labels.country,
    placeholder: metadata.labels.countryPlaceholder,
    noOptionsText: metadata.labels.noSearchResultFound,
    options: countries,
    labelKey: 'name',
    valueKey: 'code',
  });

  // #region Organization select

  const organizationTag = nonprofitSelect({
    createTag,
    name: 'organization',
    label: metadata.labels.organizationNameOrId,
    placeholder: metadata.labels.organizationNameOrIdPlaceholder,
    noOptionsText: metadata.labels.noSearchResultFound,
    debounce: SEARCH_DEBOUNCE,
    store: organizationsStore,
    disabled: true,
    withDropdownIcon: false,
    clearable: true,
    labelKey: 'name',
    valueKey: 'id',
    renderOption: (option, itemTag) => {
      const nameTag = createTag('span', { class: 'np-organization-select-name' }, option.name);
      const idTag = createTag('span', { class: 'np-organization-select-id' }, option.id);

      itemTag.append(nameTag, idTag);
    },
    footerTag: (() => {
      const cannotFindTag = createTag('div', { class: 'np-select-list-tag np-select-cannot-find' });
      const cannotFindLinkTag = createTag(
        'a',
        { tabindex: 0 },
        metadata.labels.organizationCannotFind,
      );
      // Cannot find action handler
      const switchToNotFound = () => {
        stepperStore.update({ step: 2, scenario: scenarios.NOT_FOUND_IN_SEARCH });
      };
      cannotFindLinkTag.addEventListener('click', switchToNotFound);
      cannotFindLinkTag.addEventListener('keydown', (ev) => {
        if (ev.code !== 'Enter') return;
        switchToNotFound();
      });

      cannotFindTag.append(cannotFindLinkTag);

      return cannotFindTag;
    })(),
  });

  organizationTag.onInput((value, abortController) => {
    if (!value) return;
    fetchOrganizations(value, countryTag.getValue(), abortController);
  });

  organizationTag.onSelect((option) => {
    selectedOrganizationStore.update(option);
  });

  organizationTag.onScroll((listTag, abortController, hasNewInput) => {
    if (
      (Boolean(selectedOrganizationStore.data) && !hasNewInput)
      || organizationsStore.loading
      || !nextPageUrl
    ) return;
    if (listTag.scrollTop + listTag.clientHeight + FETCH_ON_SCROLL_OFFSET >= listTag.scrollHeight) {
      fetchNextOrganizations(abortController);
    }
  });

  countryTag.onSelect(() => {
    organizationTag.enable();
  });

  // #endregion

  const selectedOrganizationTag = getSelectedOrganizationTag();

  selectedOrganizationTag.onClear(() => {
    organizationTag.clear();
    selectedOrganizationStore.update(null);
  });

  const submitTag = getSubmitTag();

  formTag.append(countryTag, organizationTag, selectedOrganizationTag, submitTag);

  formTag.addEventListener('submit', (ev) => {
    ev.preventDefault();

    const formData = new FormData(formTag);
    nonprofitFormData.country = formData.get('country');
    nonprofitFormData.organizationId = formData.get('organizationId');

    stepperStore.update({ scenario: scenarios.FOUND_IN_SEARCH, step: 2 });
  });

  containerTag.replaceChildren(descriptionTag, formTag);
}

// Organization details
function renderOrganizationDetails(containerTag) {
  // Description
  const descriptionTag = getDescriptionTag(metadata.labels.titleOrganizationDetails);

  // Form
  const formTag = createTag('form', { class: 'np-form' });

  let abortController;

  const countryTag = nonprofitSelect({
    createTag,
    name: 'country',
    label: metadata.labels.country,
    placeholder: metadata.labels.countryPlaceholder,
    noOptionsText: metadata.labels.noSearchResultFound,
    options: countries,
    labelKey: 'name',
    valueKey: 'code',
  });

  countryTag.onSelect((option) => {
    abortController?.abort();
    abortController = new AbortController();
    fetchRegistries(option.code, abortController);
  });

  const organizationNameIdTag = getNonprofitInput({
    type: 'text',
    name: 'organizationNameId',
    label: metadata.labels.organizationNameOrId,
    placeholder: metadata.labels.organizationNameOrIdPlaceholder,
    required: true,
  });

  const registryContainerTag = createTag('div');

  registriesStore.subscribe((registries, loading) => {
    const registryTag = nonprofitSelect({
      createTag,
      name: 'registry',
      label: metadata.labels.registry,
      placeholder: loading ? 'Loading...' : metadata.labels.registryPlaceholder,
      noOptionsText: metadata.labels.noSearchResultFound,
      options: registries,
      labelKey: 'name',
      valueKey: 'id',
      disabled: !countryTag.getValue(),
    });

    registryContainerTag.replaceChildren(registryTag);
  });

  const organizationRegistrationIdTag = getNonprofitInput({
    type: 'text',
    name: 'organizationRegistrationId',
    label: metadata.labels.organizationRegistrationId,
    placeholder: metadata.labels.organizationRegistrationIdPlaceholder,
    required: true,
  });

  const evidenceNonProfitStatusTag = getNonprofitInput({
    type: 'file',
    name: 'evidenceNonProfitStatus',
    label: metadata.labels.evidenceNonProfitStatus,
    placeholder: metadata.labels.evidenceNonProfitStatusPlaceholder,
    required: true,
  });

  const websiteTag = getNonprofitInput({
    type: 'text',
    name: 'website',
    label: metadata.labels.website,
    placeholder: metadata.labels.websitePlaceholder,
    required: true,
  });

  const submitTag = getSubmitTag();

  formTag.append(
    countryTag,
    organizationNameIdTag,
    registryContainerTag,
    organizationRegistrationIdTag,
    evidenceNonProfitStatusTag,
    websiteTag,
    submitTag,
  );

  formTag.addEventListener('submit', (ev) => {
    ev.preventDefault();

    const formData = new FormData(formTag);
    nonprofitFormData.country = formData.get('country');
    nonprofitFormData.organizationNameId = formData.get('organizationNameId');
    nonprofitFormData.registry = formData.get('registry');
    nonprofitFormData.organizationRegistrationId = formData.get('organizationRegistrationId');
    nonprofitFormData.evidenceNonProfitStatus = formData.get('evidenceNonProfitStatus');
    nonprofitFormData.website = formData.get('website');

    stepperStore.update({ scenario: scenarios.NOT_FOUND_IN_SEARCH, step: 3 });
  });

  containerTag.replaceChildren(descriptionTag, formTag);
}

// Organization address
function renderOrganizationAddress(containerTag) {
  // Description
  const descriptionTag = getDescriptionTag(metadata.labels.titleOrganizationAddress);

  // Form
  const formTag = createTag('form', { class: 'np-form' });

  const streetAddressTag = getNonprofitInput({
    type: 'text',
    name: 'streetAddress',
    label: metadata.labels.streetAddress,
    placeholder: metadata.labels.streetAddressPlaceholder,
    required: true,
  });

  const addressDetailsTag = getNonprofitInput({
    type: 'text',
    name: 'addressDetails',
    label: metadata.labels.addressDetails,
    placeholder: metadata.labels.addressDetailsPlaceholder,
    required: true,
  });

  const stateTag = getNonprofitInput({
    type: 'text',
    name: 'state',
    label: metadata.labels.state,
    placeholder: metadata.labels.statePlaceholder,
    required: true,
  });

  const cityTag = getNonprofitInput({
    type: 'text',
    name: 'city',
    label: metadata.labels.city,
    placeholder: metadata.labels.cityPlaceholder,
    required: true,
  });

  const zipCodeTag = getNonprofitInput({
    type: 'text',
    name: 'zipCode',
    label: metadata.labels.zipCode,
    placeholder: metadata.labels.zipCodePlaceholder,
    required: true,
  });

  const submitTag = getSubmitTag();

  formTag.append(streetAddressTag, addressDetailsTag, stateTag, cityTag, zipCodeTag, submitTag);

  formTag.addEventListener('submit', (ev) => {
    ev.preventDefault();

    const formData = new FormData(formTag);
    nonprofitFormData.streetAddress = formData.get('streetAddress');
    nonprofitFormData.addressDetails = formData.get('addressDetails');
    nonprofitFormData.state = formData.get('state');
    nonprofitFormData.city = formData.get('city');
    nonprofitFormData.zipCode = formData.get('zipCode');

    stepperStore.update({ scenario: scenarios.NOT_FOUND_IN_SEARCH, step: 4 });
  });

  containerTag.replaceChildren(descriptionTag, formTag);
}

// Personal data
function renderPersonalData(containerTag) {
  // Description
  const descriptionTag = getDescriptionTag(
    metadata.labels.titlePersonalDetails,
    metadata.labels.subtitlePersonalDetails,
  );

  // Form
  const formTag = createTag('form', { class: 'np-form' });

  const firstNameTag = getNonprofitInput({
    type: 'text',
    name: 'firstName',
    label: metadata.labels.firstName,
    placeholder: metadata.labels.firstNamePlaceholder,
    required: true,
  });

  const lastNameTag = getNonprofitInput({
    type: 'text',
    name: 'lastName',
    label: metadata.labels.lastName,
    placeholder: metadata.labels.lastNamePlaceholder,
    required: true,
  });

  const emailTag = getNonprofitInput({
    type: 'text',
    name: 'email',
    label: metadata.labels.email,
    placeholder: metadata.labels.emailPlaceholder,
    required: true,
  });

  const disclaimerTag = createTag(
    'span',
    { class: 'np-personal-data-disclaimer' },
    metadata.labels.personalDataDisclaimer,
  );

  const submitTag = getSubmitTag();

  formTag.append(firstNameTag, lastNameTag, emailTag, disclaimerTag, submitTag);

  formTag.addEventListener('submit', async (ev) => {
    ev.preventDefault();

    const formData = new FormData(formTag);
    nonprofitFormData.firstName = formData.get('firstName');
    nonprofitFormData.lastName = formData.get('lastName');
    nonprofitFormData.email = formData.get('email');

    await sendOrganizationData();

    stepperStore.update((prev) => ({ ...prev, step: 5 }));
  });

  containerTag.replaceChildren(descriptionTag, formTag);
}

function renderApplicationReview(containerTag) {
  const applicationReviewTag = createTag('div', { class: 'np-application-review-container' });

  const titleTag = createTag('span', { class: 'np-title' }, metadata.labels.titleApplicationReview);
  const detail1Tag = createTag(
    'span',
    { class: 'np-application-review-detail' },
    metadata.labels.detail1ApplicationReview,
  );
  const detail2Tag = createTag(
    'span',
    { class: 'np-application-review-detail' },
    metadata.labels.detail2ApplicationReview,
  );

  applicationReviewTag.append(titleTag, detail1Tag, detail2Tag);

  const returnToAcrobatForNonprofitsTag = createTag(
    'button',
    { class: 'np-button' },
    metadata.labels.returnToAcrobatForNonprofits,
  );

  containerTag.replaceChildren(applicationReviewTag, returnToAcrobatForNonprofitsTag);
}

function renderStepContent(containerTag) {
  stepperStore.subscribe(({ step, scenario }) => {
    if (step === 1) renderSelectNonprofit(containerTag);
    if (step === 2 && scenario === scenarios.FOUND_IN_SEARCH) renderPersonalData(containerTag);
    if (step === 2 && scenario === scenarios.NOT_FOUND_IN_SEARCH) renderOrganizationDetails(containerTag);
    if (step === 3 && scenario === scenarios.FOUND_IN_SEARCH) renderApplicationReview(containerTag);
    if (step === 3 && scenario === scenarios.NOT_FOUND_IN_SEARCH) renderOrganizationAddress(containerTag);
    if (step === 4 && scenario === scenarios.NOT_FOUND_IN_SEARCH) renderPersonalData(containerTag);
    if (step === 5 && scenario === scenarios.NOT_FOUND_IN_SEARCH) renderApplicationReview(containerTag);
  });
}

// #endregion

// CO-RE
function initStepperController(tag) {
  const containerTag = createTag('div', { class: 'np-controller-container' });

  const titleTag = createTag(
    'span',
    { class: 'np-controller-title' },
    'Stepper controller (for testing)',
  );

  const scenariosTag = createTag('div', { class: 'np-controller-section' });
  const stepsTag = createTag('div', { class: 'np-controller-section' });

  stepperStore.subscribe(() => {
    const { step, scenario } = stepperStore.data;

    const foundInSearchTag = createTag(
      'button',
      { class: `np-controller-button${scenario === scenarios.FOUND_IN_SEARCH ? ' selected' : ''}` },
      'Found in search',
    );
    foundInSearchTag.addEventListener('click', () => {
      const newStep = step > 3 ? 1 : step;
      stepperStore.update((prev) => ({
        ...prev,
        step: newStep,
        scenario: scenarios.FOUND_IN_SEARCH,
      }));
    });
    const notFoundInSearchTag = createTag(
      'button',
      { class: `np-controller-button${scenario === scenarios.NOT_FOUND_IN_SEARCH ? ' selected' : ''}` },
      'Not found in search',
    );
    notFoundInSearchTag.addEventListener('click', () => stepperStore.update((prev) => ({ ...prev, scenario: scenarios.NOT_FOUND_IN_SEARCH })));

    const maxSteps = scenario === scenarios.FOUND_IN_SEARCH ? 3 : 5;

    stepsTag.replaceChildren();
    Array.from({ length: maxSteps })
      .map((_, index) => index + 1)
      .forEach((value) => {
        const stepTag = createTag(
          'button',
          { class: `np-controller-button is-step ${step === value ? ' selected' : ''}` },
          value,
        );
        stepTag.addEventListener('click', () => stepperStore.update((prev) => ({ ...prev, step: value })));
        stepsTag.append(stepTag);
      });

    scenariosTag.replaceChildren(foundInSearchTag, notFoundInSearchTag);
  });

  containerTag.append(titleTag, scenariosTag, stepsTag);

  const bufferTag = createTag('div', { class: 'np-controller-buffer ' });
  tag.append(bufferTag, containerTag);
}

function initNonprofit(element) {
  const containerTag = createTag('div', { class: 'np-container' });
  const stepperContainerTag = createTag('div', { class: 'np-stepper-container' });
  const contentContainerTag = createTag('div', { class: 'np-content-container' });

  renderStepper(stepperContainerTag);
  renderStepContent(contentContainerTag);

  containerTag.append(stepperContainerTag, contentContainerTag);
  element.append(containerTag);
  // CO-RE
  initStepperController(element);
}

export default function init(element) {
  // Get metadata
  initNonprofit(element);
}
