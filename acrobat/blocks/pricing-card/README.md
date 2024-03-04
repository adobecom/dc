# Pricing card

## Content Contract

```
| pricing-card                                                                                                                                  |
|---------------------------------------------------------------------------------------------------------------------------------------------- |
| title         | Text that will be shown in header of card Text styled as H1 will have font size 24h, and other text will have font size 20px |
| optionN       |  Options from 1 to N that will be listed as radio buttons in middle section of the pricing card                               |
| priceN        | Prices from 1 to N that will be displayed below the card title, when corresponding option is selected                         |
| ctaN          | Button/buttons group from 1 to N  that will be displayed in the footer of the card, when corresponding option is selected     |
| disclaimerN   | Disclaimer text from 1 to N that will be displayed below the price, when corresponding option is selected                     |
| initialOption | Optional. Name of option that will be selected by default. If not defined, option1 will be used as default..                                                                              |
| promotionText | Optional property. If defined, card will have yellow border and yellow box in top right corner, with promotion text.          |
|               | Text styled as H1 inside promotion text will be bold with font-size:14px, and the rest of text will have font-size:12px       |

```

Pricing cards should be defined inside one section, with section-metadata (style "pricing-card-columns"). For example.:

---
|pricing-card|
|...         |

|pricing-card|
|...         |

|pricing-card|
|...         |

| section-metadata              |
| style | pricing-card-columns  |

---
Example of document ( 2 pricing cards are defined inside one section ):

<img width="273" alt="Example-pricing-card" src="https://github.com/adobecom/dc/assets/32739655/6d5cd699-c5b1-4af8-ab53-55178058a436">


Card width can be configured for whole section, by using w-470 or w-400 style, for example:

| section-metadata                    |
| style | pricing-card-columns, w-470 |

or
| section-metadata                    |
| style | pricing-card-columns, w-400 |


## Features
- Pricing card elements are styled and positioned in correct places based on listed options
- Toggle content based on selected radio option
- Promotion text can be added optionally

## User Experience

<img width="1221" alt="pricing-card-width-470" src="https://github.com/adobecom/dc/assets/32739655/fc0802bc-ed53-4cbf-8e51-09842897f560">

<img width="1334" alt="pricing-card-width-400" src="https://github.com/adobecom/dc/assets/32739655/c5dd1043-2261-4c98-8d08-b717c29e2a8d">

