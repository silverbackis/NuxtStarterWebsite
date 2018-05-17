# Starter Website
## Using NuxtJS, Bulma CSS and Symfony
### DEPRECATED -- This project has moved to [BW Starter Web App](https://github.com/silverbackis/BwStarterWebApp)

[![Known Vulnerabilities](https://snyk.io/test/github/silverbackis/nuxtstarterwebsite/badge.svg)](https://snyk.io/test/github/silverbackis/nuxtstarterwebsite)


## What is this package?
With the creation of NuxtJS, building a VueJS web app with server-side rendering (SSR) has never been easier.
Coupled with an API, this is the next generation of websites and this package aims to give you a starting point.

### DEPRECATED -- This project has moved to [BW Starter Web App](https://github.com/silverbackis/BwStarterWebApp)

## Background
As a developer, for years I've seen websites trying to imitate what this kind of system can now implement. Real-time
loading, component based websites which provides an end-user the best possible experience on mobile devices and computers.

I was building websites using Symfony, which is now the back-end framework used for the API in this project. The idea of this
website is to bring together some of the best frameworks out there to demonstrate how they can work in harmony. I chose
these frameworks for many reasons, but the most modern and exciting part is definitely NuxtJS (and VueJS) which is SO
good.

### DEPRECATED -- This project has moved to [BW Starter Web App](https://github.com/silverbackis/BwStarterWebApp)

## Project Scope
This project is designed for developers and those who will be making websites for others. There are websites out there which
give unlimited customisation options and the ability to add pages, navigation menus and more. This is outside of the scope of
this project, but if you'd like to build on this to create a framework that can do that, it'd be great to see. When I've made
websites in the past, it usually puts too much restriction on design and leaves too much flexibility and complications for
the website admins.

This package consists of the following pages:
- Home page
- About page
- News page (with the ability to add/delete/modify news items + image uploading)
- Contact page

It also has these features:
- Load and display forms from API
- Real-time form validation via API
- Real-time image loading
- Example of external API integration (Twitter feed)
- Content Management with secure login/logout techniques

### DEPRECATED -- This project has moved to [BW Starter Web App](https://github.com/silverbackis/BwStarterWebApp)

## Installation
```bash
$ git clone https://github.com/silverbackis/StarterWebsite.git
$ cd StarterWebsite
$ npm install
```

You should add a `.env` file in your document root - change these values in your production environment as needed.
Remember to host your API on a sub-domain or the same domain as your front-end. This is so cookies and session data can persist.
```
COOKIE_SECRET=A_SECRET_TOKEN
COOKIE_DOMAIN=127.0.0.1
API_BASE_URL=http://127.0.0.1:9000
DB_HOST=127.0.0.1
DB_NAME=YOUR_DB_NAME
DB_USER=USERNAME
DB_PASS=PASSWORD
```

**[Click here for Symfony API installation](https://github.com/silverbackis/NuxtStarterWebsite-SymfonyAPI/blob/master/README.md)**

**Your `api/config/parameters.yml` file should use the same value for `cookie_secret` as `COOKIE_SECRET` in your `.env` file**

**NodeJS sessions are configured to save to a MySQL database - the API also uses a MySQL database. You can make the credentials the same if you'd like to use the same database**

### DEPRECATED -- This project has moved to [BW Starter Web App](https://github.com/silverbackis/BwStarterWebApp)

### Running locally
```bash
$ npm run dev
$ cd api
$ php bin/console server:run 127.0.0.1:9000
```
Visit http://127.0.0.1:8000 to view the website
Visit http://127.0.0.1:9000 for the API
Visit http://127.0.0.1:9000/docs for the API docs (incomplete)

### DEPRECATED -- This project has moved to [BW Starter Web App](https://github.com/silverbackis/BwStarterWebApp)

### Deploying on Plesk
You should **always** Use SSL certificates in live environments - you can install the Let's Encrypt extension

**Your `api/config/parameters.yml` file should use the same value for `cookie_secret` as `COOKIE_SECRET` in your `.env` file**
- Install Git extension and link to repo
- Add a new sub-domain for your main domain and point to the `/GitHub/api/web/` directory
- Install NodeJS extension
- Install API application (composer)
- Visit NodeJS extension page for your domain
- Set document root to your static dir (e.g. `GitHub/static`)
- Set application root (e.g. `/GitHub`)
- Set application startup file (e.g. `build/main.js`)
- Click 'NPM Install' to install dependencies
- Click 'Run script' - Type `build` and then click run (`npm run build`)
- Start/restart server


#### Nginx Reverse Proxy Config
**Additional nginx directives**
_I have put the gzip settings into a template but you can always include it here per domain_
```
gzip on;
gzip_comp_level 3;
gzip_http_version 1.1;
gzip_proxied any;
gzip_min_length 1100;
gzip_buffers 16 8k;
gzip_types text/plain text/css text/js text/xml text/javascript application/javascript application/x-javascript application/json application/xml application/rss+xml image/svg+xml image/x-icon;
# Disable for IE < 6 because there are some known problems
gzip_disable "MSIE [1-6].(?!.*SV1)";
# Add a vary header for downstream proxies to avoid sending cached gzipped files to IE6
gzip_vary on;

proxy_cache NODEJS;
proxy_cache_valid 200 1d;
proxy_set_header X-Forwarded-Proto $scheme;

expires 1M;
add_header Pragma public;
add_header Cache-Control "public, must-revalidate, proxy-revalidate";

# cache.appcache, your document html and data
location ~* \.(?:manifest|appcache|html?|xml)$ {
	expires -1;
}

# json has versioning anyway
location ~* \.(?:json)$ {
	expires 1M;
}

# Media: images, icons, video, audio, HTC
location ~* \.(?:jpg|jpeg|gif|png|ico|cur|gz|svg|svgz|mp4|ogg|ogv|webm|htc)$ {
	expires 1M;
	access_log off;
}

# CSS and Javascript
location ~* \.(?:css|js)$ {
	expires 1y;
	access_log off;
}
```

In Plesk you should also configure your proxy cache
```bash
$ echo 'proxy_cache_path /var/cache/nginx_cache levels=1:2 keys_zone=VUEJS:10m inactive=24h max_size=1g;' >> /etc/nginx/conf.d/proxy_cache.conf
$ systemctl restart nginx
```

### DEPRECATED -- This project has moved to [BW Starter Web App](https://github.com/silverbackis/BwStarterWebApp)
