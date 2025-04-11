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
node tools/prerender/prerender.js <URL> <desktop|mobile>
```
e.g.
Generate a preredener for desktop
```
node tools/prerender/prerender.js "https://www.adobe.com/acrobat/online/sign-pdf.html" desktop
```
and for mobile
```
node tools/prerender/prerender.js "https://www.adobe.com/acrobat/online/sign-pdf.html" mobile
```
Prerender is saved as <pagename>-<desktop|mobile>.html and .json in /tools/prerender

### Open a prerender page

Go to the page with a prerender verb-widget on localhost:3001. e.g.
http://localhost:3001/acrobat/online/sign-pdf

Try both desktop and mobile