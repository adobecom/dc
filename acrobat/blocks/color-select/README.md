# Color Select Block

A block that provides a dropdown color selector and displays the chosen color in a 500x500 div.

## Features

- Dropdown menu for selecting from 5 different colors (Red, Blue, Green, Black, White)
- 500x500 pixel color display area that updates in real-time
- Responsive design that adapts to mobile and desktop views

## Usage

Add the following block structure to your page:

```html
<div class="color-select">
  <!-- This block doesn't require any specific inner structure -->
  <!-- The dropdown and color display will be generated automatically -->
</div>
```

The block will automatically generate:
1. A labeled dropdown menu with color options
2. A 500x500 display area that shows the selected color

## Styling

The block uses responsive design that:
- Shows both elements stacked on mobile (with a smaller display area)
- Shows elements side by side on larger screens

## Customization

The block supports the standard Milo block decoration and styling patterns. 
For additional colors or configuration, modify the `colors` array in `index.js`.

## Technical Details

- Utilizes the Milo `createTag` utility for DOM generation
- Follows lazy-loading and hydration patterns
- Provides fallback behavior in case of errors