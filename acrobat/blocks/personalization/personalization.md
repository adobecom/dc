# Personalization

Allows for content variation depeding on DC Widget usage. The accepted options are: `default`, `2nd conversion` and `upsell`.

## Block Configuration 
Each row in this block is meant to repersent an UX. We currently only support: `defualt`, `2nd conversion` and `upsell`.  Only use rows needed for design.

| personalization   |                      |
|-------------------|----------------------|
| `default`         | Fragment or content  |
| `2nd Conversion`  | Fragment or content  |
| `upsell`          | Fragment or content  |

*Note: Several fragments can be stacked in the same cell.*


## Debug 
Use the following URL query to see all Personaliztion blocks on a page `showAll`. Green is the default UX, Yellow is 2nd conversion and Red is upsell.


| review              |                                                            |
|---------------------|------------------------------------------------------------|
| Review  url         | https:// main -- dc -- adobecom.hlx.page / jpg-to-pdf |
| Title               | Rate your Experience                                       |
| Hide title          | false                                                      |
| Rating verb         | Vote, Votes                                                |
| Rating noun         | Star, Stars                                                |
| Comment placeholder | Please give your feedback                                  |
| Comment field label | Review Feedback                                            |
| Submit text         | Send                                                       |
| Thank  you text     | Thanks for your feedback                                   |
| Tooltips            | Poor, Below Average, Good, Very Good, Outstanding          |
| Tooltip delay       | 5                                                          |
| Initial Value       | 0                                                          |
