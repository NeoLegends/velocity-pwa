# Velocity PWA

This is an improved version of the e-bike-rental PWA found at https://velocity-aachen.de/menu.

It was rewritten from the ground up in modern React for improved performance and a better user experience. Originally written to be a 1:1 clone of the existing PWA it now has diverged from the official web app to integrate some improvements in regards to the bike booking & rental process and an improved overview over the map.

The PWA contains a service worker (that is currently disabled on iOS) and can be [installed as a Chrome PWA](https://developers.google.com/web/progressive-web-apps/desktop).

## Building

This project uses Create-React-App as its build process & yarn for package management. Compiling is straightforward:

`yarn build`

You will find the minified & bundled sources in the `build` folder. They can be served from any static web server.

## CORS Proxy

Due to CORS restrictions (and for various other reasons), the PWA requires an API proxy to Velocity's backend. During development, the proxy is provided by Create-React-App. For production usage, the app is already configured for a [Netlify](https://netlify.com/) deployment.

If you want to configure the proxy manually, take a look at the [`_redirects`](https://github.com/NeoLegends/velocity-pwa/blob/master/public/_redirects) file. It lists the required rewrite rules in Netlify syntax that should be quite easy to understand & to transfer to a more general proxy solution.

## Bundle Analysis

The build process will generate a bundle analysis of the compiled code at `build/bundle-stats.html`.

## Development

`yarn start`

The web app will by default be served on `localhost:3000`.

## Screenshots

### Mobile

<img width="484" alt="mobile-1-map" src="https://user-images.githubusercontent.com/1683034/54537688-37669280-4993-11e9-8cb1-fcfa9e88dcd4.png">
<img width="484" alt="mobile-2-menu" src="https://user-images.githubusercontent.com/1683034/54537568-fec6b900-4992-11e9-9108-46acfd323be8.png">
<img width="484" alt="mobile-3-popup" src="https://user-images.githubusercontent.com/1683034/54537569-fec6b900-4992-11e9-983e-dcbb4121959b.png">
<img width="484" alt="mobile-4-no-bikes" src="https://user-images.githubusercontent.com/1683034/54537876-8c0a0d80-4993-11e9-9e99-87d937db1e96.png">

### Desktop

<img width="1321" alt="desktop-1-map" src="https://user-images.githubusercontent.com/1683034/54537560-fd958c00-4992-11e9-9b45-792ceff92422.png">
<img width="1321" alt="desktop-2-popup" src="https://user-images.githubusercontent.com/1683034/54537563-fd958c00-4992-11e9-99a9-82687ec96b10.png">
<img width="1321" alt="desktop-3-rent-at-slot" src="https://user-images.githubusercontent.com/1683034/54537566-fec6b900-4992-11e9-90ee-7dff53d107fd.png">
