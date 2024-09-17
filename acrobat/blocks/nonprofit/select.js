/* eslint-disable chai-friendly/no-unused-expressions */
/* eslint-disable max-len */
import ReactiveStore from '../../scripts/reactiveStore.js';

const chevronDownSvg = `<svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M6.64477 6.53455L11.3367 1.84314C11.6931 1.48767 11.6931 0.910519 11.3367 0.554079C10.9807 0.198119 10.4036 0.198119 10.0476 0.554079L6.00025 4.60102L1.95289 0.554079C1.59693 0.198119 1.01978 0.198119 0.663827 0.554079C0.485607 0.732299 0.396736 0.965209 0.396736 1.19861C0.396736 1.43201 0.486097 1.66541 0.663827 1.84314L5.35572 6.53455C5.5337 6.71277 5.76697 6.80164 6.00025 6.80152C6.23353 6.80164 6.46679 6.71277 6.64477 6.53455Z" fill="#222222"/>
</svg>
`;

export default function nonprofitSelect(props) {
  const {
    createTag,
    name,
    label,
    placeholder,
    noOptionsText,
    loadingText = 'Loading...',
    required = true,
    disabled = false,
    withDropdownIcon = true,
    options = [],
    store,
    debounce,
    labelKey = 'label',
    valueKey = 'value',
    renderOption,
    footerTag,
  } = props;

  let onInput;
  let onSelect;

  const optionsStore = store || new ReactiveStore(options);
  let localSelection = null;

  const controlTag = createTag('div', { class: 'np-control' });
  const labelTag = createTag('label', { class: 'np-label', for: name }, label);
  const searchTag = createTag('input', {
    class: 'np-input np-select-search',
    type: 'text',
    placeholder,
  });
  const valueTag = createTag('input', {
    class: 'np-select-value',
    name,
    type: 'hidden',
  });

  if (required) {
    searchTag.setAttribute('required', 'required');
    valueTag.setAttribute('required', 'required');
  }
  if (disabled) {
    searchTag.setAttribute('disabled', 'disabled');
    valueTag.setAttribute('disabled', 'disabled');
  }

  const listContainerTag = createTag('div', { class: 'np-select-list-container' });
  const listTag = createTag('ul', { class: 'np-select-list' });

  let searchTimeout;
  let abortController;

  const showList = () => {
    listContainerTag.style.display = 'block';
  };

  const hideList = () => {
    if (listContainerTag.style.display === 'none') return;
    abortController?.abort();
    listTag.scrollTop = 0;
    listContainerTag.style.display = 'none';

    // Handle loss of focus depending on whether there's a selection
    if (!localSelection) {
      searchTag.value = '';
      if (!store) {
        optionsStore.update(options);
      }
    } else {
      searchTag.value = localSelection[labelKey];
      optionsStore.update([localSelection]);
    }
  };

  let hasNewInput = false;

  // Search onChange
  searchTag.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    abortController?.abort();

    hasNewInput = true;

    abortController = new AbortController();
    searchTimeout = setTimeout(() => {
      onInput && onInput(searchTag.value, abortController);
      if (!store) {
        const filteredOptions = options.filter((option) => option[labelKey].toLowerCase().includes(searchTag.value.toLowerCase()));
        optionsStore.update(filteredOptions);
      }
      showList();
    }, debounce);
  });

  let focusedFromList = false;
  searchTag.addEventListener('focus', () => {
    if (debounce && !searchTag.value) return;
    if (!focusedFromList) searchTag.select();
    else focusedFromList = false;
    showList();
  });

  searchTag.addEventListener('keydown', (ev) => {
    if (ev.code !== 'ArrowDown') return;
    ev.preventDefault();
    if (ev.code === 'ArrowDown') {
      const listItem = listContainerTag.querySelector('.np-select-item');
      if (listItem) listItem.focus();
    }
  });

  const focusOut = (ev) => {
    if (!ev.relatedTarget) {
      hideList();
      return;
    }
    const selectTag = ev.relatedTarget.closest('.np-select-list-tag');
    // If the newly focused item is part of the select, don't hide list
    if (selectTag) return;
    hideList();
  };

  searchTag.addEventListener('focusout', focusOut);

  // Render select elements
  optionsStore.subscribe((storeOptions, loading) => {
    // Empty the list
    listTag.replaceChildren();

    storeOptions.forEach((option) => {
      const itemTag = createTag('li', {
        class: 'np-select-list-tag np-select-item',
        tabindex: -1,
      });

      if (renderOption) {
        renderOption(option, itemTag);
      } else {
        itemTag.textContent = option[labelKey];
      }

      // Keypress handing
      itemTag.addEventListener('keydown', (ev) => {
        if (ev.code !== 'ArrowUp' && ev.code !== 'ArrowDown') {
          focusedFromList = true;
          searchTag.focus();
          return;
        }
        ev.preventDefault();
        let sibling;
        if (ev.code === 'ArrowDown') {
          sibling = ev.target.nextElementSibling;
        }
        if (ev.code === 'ArrowUp') {
          sibling = ev.target.previousElementSibling;
        }
        if (sibling && !sibling.classList.contains('np-select-loader')) {
          sibling.focus();
        }
      });

      // Selection handling
      const selectItem = () => {
        onSelect && onSelect(option);
        searchTag.value = option[labelKey];
        valueTag.value = option[valueKey];
        localSelection = option;
        hasNewInput = false;
        hideList();
      };
      itemTag.addEventListener('click', selectItem);
      itemTag.addEventListener('keydown', (ev) => {
        if (ev.code !== 'Enter') return;
        selectItem();
      });

      listTag.append(itemTag);
    });

    if (!loading && storeOptions.length === 0) {
      const noOptionsTag = createTag(
        'div',
        { class: 'np-select-list-tag np-select-no-options' },
        noOptionsText,
      );
      listTag.append(noOptionsTag);
    }

    if (loading) {
      const loadingTag = createTag(
        'div',
        { class: 'np-select-list-tag np-select-loader' },
        loadingText,
      );
      listTag.append(loadingTag);
    }
  });

  listContainerTag.append(listTag);
  if (footerTag) listContainerTag.append(footerTag);

  // Focus handling
  const selectListTags = listContainerTag.querySelectorAll('.np-select-list-tag');
  selectListTags.forEach((selectListTag) => {
    selectListTag.addEventListener('focusout', focusOut);
  });

  controlTag.append(labelTag, searchTag, valueTag, listContainerTag);
  if (withDropdownIcon) {
    const arrowIconTag = createTag('div', { class: 'np-select-icon' }, chevronDownSvg);
    arrowIconTag.addEventListener('click', () => {
      searchTag.focus();
    });
    controlTag.append(arrowIconTag);
  }

  controlTag.onInput = (handler) => (onInput = handler);
  controlTag.onSelect = (handler) => (onSelect = handler);
  controlTag.onScroll = (handler) => {
    listTag.addEventListener('scroll', (ev) => {
      abortController = new AbortController();
      handler(ev.target, abortController, hasNewInput);
    });
  };

  controlTag.enable = () => {
    searchTag.removeAttribute('disabled');
    valueTag.removeAttribute('disabled');
  };

  controlTag.clear = (withFocus = true) => {
    searchTag.value = '';
    valueTag.value = undefined;
    if (!store) {
      optionsStore.update(options);
    }
    if (withFocus) {
      searchTag.focus();
    }
  };

  controlTag.getValue = () => valueTag.value;

  return controlTag;
}
