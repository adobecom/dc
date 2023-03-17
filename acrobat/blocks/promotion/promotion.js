export default async function init(el) {
  const locale = 'en-US';
  const promotionName = el.getAttribute('data-promotion');
  const response = await window.fetch(`${locale === 'en-US' ? '' : `/${locale}`}/dc-shared/fragments/short-form-pages/promotions/${promotionName}.plain.html`);
  if (!response.ok) {
    // No valid response
    return;
  }
  const promotionContent = await response.text();
  if (!promotionContent.length) {
    // No content in document
    return;
  }

  el.appendChild(document.createRange()
    .createContextualFragment(promotionContent));
}
