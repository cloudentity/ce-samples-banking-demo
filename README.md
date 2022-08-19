Banking sample application that includes
mock services
front end react app
front end react app + backend for front end

## Quickstart and customization guide for NodeJS API server app

**Minimum requirements:**

- NodeJS 16.x
- NPM 8.x

**To install dependencies:**

```bash
# Make sure you are in the correct app directory
cd banking-demo-services-nodejs

npm install
```

**To start the dev server:**

```bash
npm start
```

**To generate the JWKS public/private keys, and get the public key:**

Generate the JWKS public/private keys (this will create a git-ignored file called `keys.json` in the `banking-demo-services-nodejs` directory)

Do this once; re-run the command only if you want a fresh set of keys, as it will overwrite the current ones.

```bash
npm run generate-keys
```

Get the public JWKS data to add to your ACP trusted OAuth client settings

```bash
curl http://localhost:5002/api/jwks
```

**To configure the environment**

Open the `.env` file in the `banking-demo-services-nodejs` directory, and edit the environment variables with the workspace and ACP clients you're using.

You can leave `ACP_PORT` blank if you're using ACP SaaS.

By default, the app runs at http://localhost:5002. This can be changed by adding a `PORT` variable to the `.env` file, like the example below:

```
PORT="9002"
```

Note: Changes to the `.env` file require the server to be stopped and restarted to pick up, but otherwise, it's not necessary to stop and restart the server after making code changes. Because the app runs with `nodemon`, changes you make to the code while the app is running will cause the server to refresh.

By default, REST endpoints have the prefix `/api`. You can change this by opening `src/index.js` and changing the line below to your desired prefix. Change it to an empty string to serve all endpoints without a prefix.

```js
const apiPrefix = '/api';
```


## Quickstart and customization guide for React frontend demo app

**Minimum requirements:**

- NodeJS 16.x
- NPM 8.x

**To install dependencies:**

```bash
# Make sure you are in the correct app directory
cd banking-demo-ui-react

npm install
```

**To start the dev server:**

```bash
npm start
```

By default, the app runs at http://localhost:3000.

**How to change the proxy for the API server**

By default, the React app proxies API calls to the NodeJS API server located in this project, which runs by default on http://localhost:5002.

This proxy is configured in the `package.json` of the React app (line 5, `"proxy": "http://localhost:5002",`). Change this value to use your own API server. See the mock data in the directory `banking-demo-services-nodejs/src/data` to create your mock data model to work seamlessly with the React UI without any code changes.

Note: make sure you enable CORs in your custom API server; otherwise you will get a CORs error when the React UI app makes API requests.

**How to change the default theme color**

By default, the UI uses a soft pastel green color (`#36C6AF`) as the default primary theme color.

It's possible to change this color everywhere by opening `banking-demo-ui-react/src/theme.js` and changing the `palette.primary.main` value to the hex code of your choice:

```js
{
  // ...
  palette: {
    primary: {
      main: '#36C6AF',
    },
    secondary: {
      main: '#1F2D48',
    },
  }
  // ...
}
```

**How to use your own logo image**

By default, the logo is a plain text value, "1st Demo Bank."

To use a custom logo image, first add an SVG or PNG to the directory `banking-demo-ui-react/src/assets`.

Then, in `banking-demo-ui-react/src/components/common/PageToolbar.js`, in the imports section, find the following block and follow the directions in the comments:

```js
// Uncomment and change the line below to point to your own logo image
// import logoImage from '../../assets/logo-example.svg';
```

Then in the same file, in the JSX section, find the following block and follow the directions in the comments:

```jsx
{/* <img alt="logo image" src={logoImage} /> */}
{/* To use your own logo, uncomment the line above (after editing the 'logoImage' import declaration to point to your own image)... */}
{/* ...and remove the div block directly below */}
<div className={classes.textLogo}>
  <Typography variant="h5" component="h1">1st Demo Bank</Typography>
</div>
```
