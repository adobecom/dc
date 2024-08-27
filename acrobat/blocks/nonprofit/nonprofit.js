/* eslint-disable max-len */
import ReactiveStore from '../../scripts/reactiveStore.js';
import { setLibs } from '../../scripts/utils.js';
import { mockCountries, mockOrganizations, mockRegistries } from './mock.js';

const miloLibs = setLibs('/libs');
const { createTag } = await import(`${miloLibs}/utils/utils.js`);

// #region Constants

const scenarios = Object.freeze({
  FOUND_IN_SEARCH: 'FOUND_IN_SEARCH',
  NOT_FOUND_IN_SEARCH: 'NOT_FOUND_IN_SEARCH',
});

const SEARCH_DEBOUNCE = 500;

// #endregion

// #region Metadata

const metadata = {
  labels: {
    titleSelectNonProfit: "What's your nonprofit organization?",
    subtitleSelectNonProfit:
      "We'll search to see if it's on a list of organisations already verified.",
    titleOrganizationDetails: 'Verify your organization details',
    titleOrganizationAddress: "What's the physical address of your organization?",
    titlePersonalDetails: 'Confirm your details?',
    subtitlePersonalDetails:
      'We need to confirm your name and email in order to finish checking if your organisation is eligible.',

    country: 'Country',
    organizationNameOrId: 'Organization name or ID',
    organizationNameOrIdPlaceholder: 'Enter your organization name',
    organizationNameOrIdSerachPlaceholder: 'Type to search',
    organizationCannotFind: "I can't find my nonprofit. I want to add it.",

    registry: 'Registry',
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
      "Adobe has partnered with <a href='#'>Percent</a>, who will review your application.",
    detail2ApplicationReview:
      "We'll let you know the outcome within 2 - 4 business days by emailing you at john.merrill@gmail.com.",
    done: 'Done',
  },
};

// #endregion

// #region Stores

const nonprofitStore = new ReactiveStore({ step: 1, scenario: scenarios.FOUND_IN_SEARCH }, true);

const organizationsStore = new ReactiveStore([]);

const selectedOrganizationStore = new ReactiveStore();

// #endregion

function renderStepper(tag) {
  const sliderTag = createTag('div', { class: 'np-stepper-slider' });

  let previousStep = 0;

  nonprofitStore.subscribe(({ step, scenario }) => {
    const difference = Math.abs(previousStep - step) || 1;
    const fillMultiplier = scenario === scenarios.FOUND_IN_SEARCH ? 50 : 25;
    previousStep = step;
    sliderTag.style.transition = `width ${difference * 300}ms`;
    sliderTag.style.width = `${step * fillMultiplier}%`;
  });

  tag.append(sliderTag);
}

function renderDescription(tag) {
  const titleTag = createTag('span', { class: 'np-title' });
  const subtitleTag = createTag('span', { class: 'np-subtitle' });

  nonprofitStore.subscribe(({ step, scenario }) => {
    titleTag.textContent = '';
    subtitleTag.textContent = '';
    if (step === 1) {
      titleTag.textContent = metadata.labels.titleSelectNonProfit;
      subtitleTag.textContent = metadata.labels.subtitleSelectNonProfit;
    }
    if (step === 2) {
      if (scenario === scenarios.FOUND_IN_SEARCH) {
        titleTag.textContent = metadata.labels.titlePersonalDetails;
        subtitleTag.textContent = metadata.labels.subtitlePersonalDetails;
      } else {
        titleTag.textContent = metadata.labels.titleOrganizationDetails;
      }
    }
    if (step === 3) {
      titleTag.textContent = metadata.labels.titleOrganizationAddress;
    }
    if (step === 4) {
      titleTag.textContent = metadata.labels.titlePersonalDetails;
      subtitleTag.textContent = metadata.labels.subtitlePersonalDetails;
    }
  });

  tag.append(titleTag, subtitleTag);
}

// #region Render form

function getNonprofitInput(params) {
  const {
    type, name, label, placeholder, required, options,
  } = params;
  const baseParams = { name, placeholder };
  if (required) baseParams.required = 'required';
  const controlTag = createTag('div', { class: 'np-control' });
  const labelTag = createTag('label', { class: 'np-label', for: name }, label);
  let inputTag;
  if (type === 'select') {
    inputTag = createTag('select', { class: 'np-input', ...baseParams });
    options.forEach((option) => {
      const optionTag = createTag(
        'option',
        { class: 'np-option', value: option.value },
        option.label,
      );
      inputTag.append(optionTag);
    });
  } else {
    inputTag = createTag('input', {
      class: 'np-input',
      type,
      ...baseParams,
    });
  }
  controlTag.append(labelTag, inputTag);
  return controlTag;
}

function getOrganizationSelect() {
  const controlTag = createTag('div', { class: 'np-control' });
  const labelTag = createTag(
    'label',
    { class: 'np-label', for: 'organization' },
    metadata.labels.organizationNameOrId,
  );
  const searchTag = createTag('input', {
    class: 'np-input np-organization-select-search',
    name: 'organization',
    type: 'text',
    placeholder: metadata.labels.organizationNameOrIdSerachPlaceholder,
    required: 'required',
  });

  const listContainerTag = createTag('div', { class: 'np-organization-select-list-container' });
  const listTag = createTag('ul', { class: 'np-organization-select-list' });

  const showList = () => {
    listContainerTag.style.display = 'block';
  };

  const hideList = () => {
    listContainerTag.style.display = 'none';
    if (selectedOrganizationStore.data) {
      searchTag.value = selectedOrganizationStore.data.name;
      organizationsStore.update([selectedOrganizationStore.data]);
    }
  };

  let searchTimeout;
  let mockFetchTimeout;

  // Search onChange
  searchTag.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    clearTimeout(mockFetchTimeout);

    if (!searchTag.value) {
      hideList();
      return;
    }

    // const controller = new AbortController();
    // const { signal } = controller;

    searchTimeout = setTimeout(() => {
      organizationsStore.startLoading();
      showList();
      mockFetchTimeout = setTimeout(() => {
        organizationsStore.update(
          mockOrganizations.filter((mo) => mo.name.toLowerCase().includes(searchTag.value.toLowerCase())),
        );
      }, 2000);
    }, SEARCH_DEBOUNCE);
  });

  searchTag.addEventListener('focus', () => {
    if (!searchTag.value) return;
    showList();
  });

  searchTag.addEventListener('keydown', (ev) => {
    if (ev.code !== 'ArrowUp' && ev.code !== 'ArrowDown') return;
    ev.preventDefault();
    if (ev.code === 'ArrowDown') {
      const listItem = document.querySelector('.np-organization-select-item');
      if (listItem) listItem.focus();
    }
  });

  const organizationSelectFocusOut = (ev) => {
    if (!ev.relatedTarget) {
      hideList();
      return;
    }
    const listItem = ev.relatedTarget.closest('.np-organization-select-item');
    // If the newly focused item is a list item, don't hide list
    if (listItem) return;
    hideList();
  };

  searchTag.addEventListener('focusout', organizationSelectFocusOut);

  // Render organization elements
  organizationsStore.subscribe((organizations, loading) => {
    // Empty the list
    listTag.replaceChildren();

    organizations.forEach((organization) => {
      const itemTag = createTag('li', {
        class: 'np-organization-select-item',
        tabindex: -1,
      });

      const nameTag = createTag(
        'span',
        { class: 'np-organization-select-name' },
        organization.name,
      );
      const idTag = createTag('span', { class: 'np-organization-select-id' }, organization.id);

      itemTag.append(nameTag, idTag);

      // Item focus handing
      itemTag.addEventListener('focusout', organizationSelectFocusOut);
      itemTag.addEventListener('keydown', (ev) => {
        if (ev.code !== 'ArrowUp' && ev.code !== 'ArrowDown') return;
        ev.preventDefault();
        let sibling;
        if (ev.code === 'ArrowDown') {
          sibling = ev.target.nextElementSibling;
        }
        if (ev.code === 'ArrowUp') {
          sibling = ev.target.previousElementSibling;
        }
        if (sibling && !sibling.classList.contains('np-organization-select-loader')) {
          sibling.focus();
        }
      });

      // Selection handling
      const selectItem = () => {
        hideList();
        searchTag.value = organization.name;
        selectedOrganizationStore.update(organization);
        organizationsStore.update([organization]);
      };
      itemTag.addEventListener('click', selectItem);
      itemTag.addEventListener('keydown', (ev) => {
        if (ev.code !== 'Enter') return;
        selectItem();
      });

      listTag.append(itemTag);
    });

    if (loading) {
      const loadingTag = createTag(
        'li',
        { class: 'np-organization-select-item np-organization-select-loader' },
        'Loading...',
      );
      listTag.append(loadingTag);
    }
  });

  listContainerTag.append(listTag);

  // Render 'cannot find' link
  const cannotFindTag = createTag('div', { class: 'np-organization-select-cannot-find' });
  const cannotFindLinkTag = createTag('a', { tabindex: 0 }, metadata.labels.organizationCannotFind);
  // Cannot find action handler
  const switchToNotFound = () => {
    nonprofitStore.update({ step: 2, scenario: scenarios.NOT_FOUND_IN_SEARCH });
  };
  cannotFindLinkTag.addEventListener('click', switchToNotFound);
  cannotFindLinkTag.addEventListener('keydown', (ev) => {
    if (ev.code !== 'Enter') return;
    switchToNotFound();
  });

  cannotFindLinkTag.addEventListener('focusout', organizationSelectFocusOut);

  cannotFindTag.append(cannotFindLinkTag);
  listContainerTag.append(cannotFindTag);

  controlTag.append(labelTag, searchTag, listContainerTag);
  return controlTag;
}

function getSelectedOrganization() {
  const containerTag = createTag('div', { class: 'np-selected-organization-container' });

  selectedOrganizationStore.subscribe((organization) => {
    if (!organization) {
      containerTag.replaceChildren();
      containerTag.style.display = 'none';
    }

    const headerTag = createTag('div', { class: 'np-selected-organization-header' });

    const avatarTag = createTag('div', { class: 'np-selected-organization-avatar' });
    // Get initials
    const initialsTag = createTag('span', { class: 'np-selected-organization-initials' });
    const initialWords = organization.name
      .split(' ')
      .filter((word) => Boolean(word))
      .slice(0, 2);
    const initials = initialWords.map((word) => word.substring(0, 1).toUpperCase()).join('');
    initialsTag.textContent = initials;
    avatarTag.append(initialsTag);

    const nameTag = createTag(
      'span',
      { class: 'np-selected-organization-detail' },
      organization.name,
    );
    headerTag.append(avatarTag, nameTag);

    const separatorTag = createTag('div', { class: 'np-selected-organization-separator' });

    const addressTag = createTag(
      'span',
      { class: 'np-selected-organization-detail' },
      organization.address,
    );
    const idTag = createTag('span', { class: 'np-selected-organization-detail' }, organization.id);

    containerTag.replaceChildren(headerTag, separatorTag, addressTag, idTag);
    containerTag.style.display = 'flex';
  });

  return containerTag;
}

// Select non-profit
function renderSelectNonprofit(formTag) {
  const countryTag = getNonprofitInput({
    type: 'select',
    name: 'country',
    label: metadata.labels.country,
    placeholder: metadata.labels.country,
    required: true,
    options: mockCountries.map((country) => ({
      label: country,
      value: country,
    })),
  });

  const organizationTag = getOrganizationSelect();

  const selectedOrganizationTag = getSelectedOrganization();

  formTag.replaceChildren(countryTag, organizationTag, selectedOrganizationTag);
}

// Organization details
function renderOrganizationDetails(formTag) {
  const countryTag = getNonprofitInput({
    type: 'select',
    name: 'country',
    label: metadata.labels.country,
    placeholder: metadata.labels.country,
    required: true,
    options: mockCountries.map((country) => ({
      label: country,
      value: country,
    })),
  });

  const organizationNameIdTag = getNonprofitInput({
    type: 'text',
    name: 'organizationNameId',
    label: metadata.labels.organizationNameOrId,
    placeholder: metadata.labels.organizationNameOrIdPlaceholder,
    required: true,
  });

  const registryTag = getNonprofitInput({
    type: 'select',
    name: 'registry',
    label: metadata.labels.country,
    placeholder: metadata.labels.country,
    required: true,
    options: mockRegistries.map((country) => ({
      label: country,
      value: country,
    })),
  });

  const organizationRegistrationIdTag = getNonprofitInput({
    type: 'text',
    name: 'organizationRegistrationId',
    label: metadata.labels.organizationRegistrationId,
    placeholder: metadata.labels.organizationRegistrationIdPlaceholder,
    required: true,
  });

  const evidenceNonProfitStatusTag = getNonprofitInput({
    type: 'text',
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

  formTag.replaceChildren(
    countryTag,
    organizationNameIdTag,
    registryTag,
    organizationRegistrationIdTag,
    evidenceNonProfitStatusTag,
    websiteTag,
  );
}

// Organization address
function renderOrganizationAddress(formTag) {
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

  formTag.replaceChildren(streetAddressTag, addressDetailsTag, stateTag, cityTag, zipCodeTag);
}

// Personal data
function renderPersonalData(formTag) {
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

  formTag.replaceChildren(firstNameTag, lastNameTag, emailTag, disclaimerTag);
}

function renderForm(formTag) {
  const { step, scenario } = nonprofitStore.data;

  if (step === 1) renderSelectNonprofit(formTag);
  if (step === 2 && scenario === scenarios.FOUND_IN_SEARCH) renderPersonalData(formTag);
  if (step === 2 && scenario === scenarios.NOT_FOUND_IN_SEARCH) renderOrganizationDetails(formTag);
  if (step === 3 && scenario === scenarios.NOT_FOUND_IN_SEARCH) renderOrganizationAddress(formTag);
  if (step === 4 && scenario === scenarios.NOT_FOUND_IN_SEARCH) renderPersonalData(formTag);

  const submitTag = createTag('input', {
    class: 'np-submit',
    type: 'submit',
    value: metadata.labels.continue,
  });

  formTag.append(submitTag);
}

// #endregion

function renderApplicationReview(tag) {
  const container = createTag('div', { class: 'np-application-review-container' });
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
  const doneTag = createTag('button', { class: 'np-done' }, metadata.labels.done);

  container.append(titleTag, detail1Tag, detail2Tag, doneTag);

  tag.replaceChildren(container);
}

// CO-RE
function initStepperController(tag) {
  const containerTag = createTag('div', { class: 'np-controller-container' });

  const scenariosTag = createTag('div', { class: 'np-controller-section' });
  const stepsTag = createTag('div', { class: 'np-controller-section' });

  nonprofitStore.subscribe(() => {
    const { step, scenario } = nonprofitStore.data;

    const foundInSearchTag = createTag(
      'button',
      { class: `np-controller-button${scenario === scenarios.FOUND_IN_SEARCH ? ' selected' : ''}` },
      'Found in search',
    );
    foundInSearchTag.addEventListener('click', () => {
      const newStep = step > 2 ? 1 : step;
      nonprofitStore.update((prev) => ({
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
    notFoundInSearchTag.addEventListener('click', () => nonprofitStore.update((prev) => ({ ...prev, scenario: scenarios.NOT_FOUND_IN_SEARCH })));

    const maxSteps = scenario === scenarios.FOUND_IN_SEARCH ? 2 : 4;

    stepsTag.replaceChildren();
    Array.from({ length: maxSteps })
      .map((_, index) => index + 1)
      .forEach((value) => {
        const stepTag = createTag(
          'button',
          { class: `np-controller-button is-step ${step === value ? ' selected' : ''}` },
          value,
        );
        stepTag.addEventListener('click', () => nonprofitStore.update((prev) => ({ ...prev, step: value })));
        stepsTag.append(stepTag);
      });

    scenariosTag.replaceChildren(foundInSearchTag, notFoundInSearchTag);
  });

  containerTag.append(scenariosTag, stepsTag);

  const bufferTag = createTag('div', { class: 'np-controller-buffer ' });
  tag.append(bufferTag, containerTag);
}

function initNonprofit(element) {
  const containerTag = createTag('div', { class: 'np-container' });
  const stepperTag = createTag('div', { class: 'np-stepper' });
  const descriptionTag = createTag('div', { class: 'np-description' });
  const formTag = createTag('form', { class: 'np-form' });

  formTag.addEventListener('submit', (ev) => {
    ev.preventDefault();
    console.log(ev);
    // formTag.remove();
    renderApplicationReview(containerTag);
  });

  renderStepper(stepperTag);
  renderDescription(descriptionTag);
  nonprofitStore.subscribe(() => renderForm(formTag));

  containerTag.append(stepperTag, descriptionTag, formTag);
  element.append(containerTag);
  // CO-RE
  initStepperController(element);
}

export default function init(element) {
  // Get metadata
  initNonprofit(element);
}
