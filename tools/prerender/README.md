# Development Tools

## Local Dev Server

Test an injection of a prerender snippet in a local dev server.

At the project root directory

### Run AEM dev server
```
aem up
```

Local AEM dev server should be running on http://localhost:3000/

### Run the prerender dev server
```
npx wds --node-resolve -c tools/prerender/dev-server.config.mjs 
```
Local prerender dev server should be running on http://localhost:3001/

### Generate Prerender

Run the command line
```
node tools/prerender/prerender.js <URL> --layout <desktop|mobile>
```
e.g.
Generate a preredener for desktop
```
node tools/prerender/prerender.js "https://www.adobe.com/acrobat/online/sign-pdf.html" --layout desktop
```
and for mobile
```
node tools/prerender/prerender.js "https://www.adobe.com/acrobat/online/sign-pdf.html" --layout mobile
```
Prerender is saved as <pagename>_<desktop|mobile>.html and .json in /tools/prerender

### Open a prerender page

Go to the page with a prerender verb-widget on localhost:3001. e.g.
http://localhost:3001/acrobat/online/sign-pdf

Try both desktop and mobile

## EdgeKV

Use the Jypter Notbook `edgekv.ipynb` to test EdgeKV APIs with the EdgeGrid library.

# Production Tools

See the [wiki](	https://wiki.corp.adobe.com/x/6xuwzw).

