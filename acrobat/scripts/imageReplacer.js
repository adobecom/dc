import { createTag } from './miloUtils.js';

const cardImageMappings = [
  { name: 'AMEX_V_MC_D_DU_JCB_PP', filename: 'amex_v_mc_d_du_jcb_pp.jpg' },
  { name: 'AMEX_V_MC_JCB_JPBANK', filename: 'amex_v_mc_jcb_jpbank.png' },
  { name: 'AMEX_V_MC_PP', filename: 'amex_v_mc_pp.jpg' },
  { name: 'AMEX_VISA_MC_D_DU_ELC_PP_BOLETO', filename: 'amex_visa_mc_d_du_elc_pp_boleto.jpg' },
  { name: 'AMEX_VISA_MC_D_DU_JCB_PAYPAL', filename: 'amex_visa_mc_d_du_jcb_paypal.jpg' },
  { name: 'AMEX_VISA_MC_D_PAYPAL', filename: 'amex_visa_mc_d_paypal.jpg' },
  { name: 'AMEX_VISA_MC_JCB_JPBANK_JPSTORE', filename: 'amex_visa_mc_jcb_jpbank_jpstore.png' },
  { name: 'V_MC_DD_PP', filename: 'v_mc_dd_pp.jpg' },
  { name: 'V_MC', filename: 'v_mc.jpg' },
];

export default async function replacePlaceholdersWithImages(documentElement) {
  const paragraphs = documentElement.querySelectorAll('p');
  await createTag.then((tag) => {
    paragraphs.forEach((p) => {
      cardImageMappings.forEach((mapping) => {
        const cardName = p.innerHTML.trim();
        const matchedImage = cardName === mapping.name;
        if (matchedImage) {
          const imagePath = `/acrobat/img/icons/credit-cards-${mapping.filename}`;
          const imgAttributes = {
            src: imagePath,
            loading: 'lazy',
            'data-local': 'credit-cards',
          };
          const imgElement = tag('img', imgAttributes);
          imgElement.onerror = async () => {
            window.lana?.log(`Error loading image for credit-card placeholder: ${cardName}`);
            imgElement.remove();
          };
          p.replaceWith(imgElement);
        }
      });
    });
  });
}
