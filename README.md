# MS Tour & Travels

A static, responsive one-page website for MS Tour & Travels, a chauffeur-driven car rental and outstation cab service in Chandigarh.

## Run locally

Open `index.html` directly in a browser. No Node.js, PHP, backend or build step is required. A small local server such as VS Code Live Server can also be used.

## Folder structure

```text
index.html
css/style.css
js/script.js
assets/logo/
assets/cars/
assets/routes/
assets/gallery/
```

## Replacing content and images

- Put the logo at `assets/logo/logo.png` and add an image element in the brand markup if you want to use it. The current text mark works without an image.
- Replace the car files in `assets/cars/` with files using the same names as the existing HTML paths.
- Replace the eight files in `assets/gallery/` with `gallery-01.jpg` through `gallery-08.jpg`.
- Replace route images in `assets/routes/` using the names in `index.html`.
- Edit vehicle names, capacities, service descriptions and route labels directly in `index.html`.

Missing images do not collapse the layout: the CSS fallback artwork remains behind each image slot. For best results, use landscape images for cars and routes, and keep the supplied width/height attributes.

## Contact and map details

The phone number, WhatsApp URL, address, website and Google Business URL are repeated in `index.html` and `js/script.js`. Update every matching instance if the business details change. The quote form opens a pre-filled WhatsApp message using `https://wa.me/917860617625`.

The map button uses the exact Google Maps search URL supplied for Shop 100, Panjab University, Sector 14, Chandigarh, 160014. To use an embed instead, replace the map link in the contact section with a Google Maps iframe embed URL.

## Deployment

This is compatible with GitHub Pages, Netlify, Vercel and standard hosting:

- GitHub Pages: push the project to a repository, then enable Pages for the main branch and root folder.
- Netlify: drag the project folder into Netlify Drop, or connect the repository. No build command is needed.
- Vercel: import the repository, leave the framework preset empty/Other, and use no build command.

Use relative asset paths so the site works from a subdirectory as well as the domain root.
