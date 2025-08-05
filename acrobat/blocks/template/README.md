# Template Block

A base block template that provides a hero-style layout with title, subtitle, and CTA buttons.

## Usage

Add the following block structure to your page:

```html
<div class="template">
  <!-- Title -->
  <div>
    <div>Boost your productivity with Adobe today</div>
  </div>

  <!-- Subtitle -->
  <div>
    <div>Description text goes here.</div>
  </div>

  <!-- CTAs -->
  <div>
    <div>
      <a href="#">Primary CTA</a>
      <a href="#">Secondary CTA</a>
    </div>
  </div>
</div>
```

## Structure

1. First div: Title (rendered with `heading-xl`)
2. Second div: Subtitle (rendered with `body-m`)
3. Third div: CTA links (primary uses `con-button blue`, secondary is plain link)

## Classes

- **Adobe Classes**: `heading-xl`, `body-m`, `con-button`, `button-xl`
- **Hero Classes**: `hero-marquee`, `center`, `s-min-height`, `static-links`

## Special Features

- Responsive layout for mobile, tablet, and desktop
- Special handling for commerce links with `checkout-link` attribute
