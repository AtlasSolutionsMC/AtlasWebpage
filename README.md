# Atlas Anticheat website

The Atlas Anticheat landing page is built with React, TypeScript and Vite. Its Features, Changlog, Price and Dashbord sections are ready for product information to be added later.

## Local development

```sh
npm install
npm run dev
```

Create a production build with `npm run build`.

## Deployment

Pushing to `main` builds the site and publishes it to GitHub Pages from the `dist` directory. The GitHub repository must use **GitHub Actions** as its Pages publishing source. The Vite `github-pages` mode sets the `/AtlasWebpage/` base path used by the project site.
