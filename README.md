Linking React to RShiny
-----------------------

This template is live on RSVP: https://sharedshiny-prod.jnj.com/user/bkeck/react_template

This repository is intended to provide an example for linking RShiny to a React frontend.  RShiny is a simple, easily-deployed server system that lacks a lot of customizability that is often desired when writing web apps.  It is possible to brute-force custom solutions using vanilla HTML, CSS, and JS, however the resulting application is typically very messy.  By offloading URL routing and data management to React (which has tried and tested solutions for these concepts), there is greater potential for writing customized applications in an RShiny environment.

This repo is a step-by-step customization based on the following sources:

*   The reactR library repo, which integrates isolated React widgets into RShiny:  [https://github.com/react-R](https://github.com/react-R)
*   Another example repo from glin, which accomplishes a similar goal but with more testing / development rigor: [https://github.com/glin/shiny-react-example](https://github.com/glin/shiny-react-example)

The following guide will walk through the RShiny / React app setup.  The first three steps of this walk-through are bundled into this repo.  This repo also contains added “nice-to-haves” installed on the npm side and implemented in the application (see dependencies section).  These add some bloat to the overall package, but add a lot of useful functionality if included in the end product.  Regardless, it is possible to clone this repo and skip to the “Compiling and Running” step to avoid this setup if the details are not needed.

Create an NPM Project
---------------------

In the project folder run `npm init` to create the project.  This will begin the package creation utility.  Complete each field, leaving fields blank where unnecessary or unknown.  After creating the project, open **package.json.**  Delete the **main** attribute and replace the **scripts** object with the following:

```javascript
"scripts": {
    "start": "Rscript -e 'shiny::runApp(launch.browser=TRUE)'",
    "build": "webpack --mode production"
  }
```

The template in this repo also includes a custom “frontend” command.  This command is unnecessary but helps with developing the React in a live-updated format that does not require recompiliation with webpack after each update.  To ensure that RShiny errors aren't triggered, Shiny must be dynamically imported and server calls must be ignored while testing.  To add this script, use the following in package.json (along with the additional react-scripts dependency):

```javascript
"frontend": "react-scripts start"
```

To ensure that server calls don't break the logic in “front-end” mode, the following approach is used:

```javascript
// Dynamic Import
let Shiny;
try {
  Shiny = require('shiny'); // Shiny external defined in webpack config
} catch (e) {
  Shiny = null;
}

// Handled server call (Front-End to Back-End)
Shiny && Shiny.setInputValue("example", {data: ...});

// Handled server call (Back-End to Front-End)
Shiny && Shiny.addCustomMessageHandler('example', (data) => {...});
```

Install Dependencies
--------------------

The following dependencies are recommended.

For React and Front-End Development (required):

*   react
*   react-dom

For Compiling and Deploying the App (required):

*   webpack
*   webpack-cli
*   @babel/core
*   @babel/preset-env
*   @babel/preset-react
*   babel-loader
*   css-loader
*   style-loader

Nice-to-haves that are included in the template for this repo, but aren't explicitly necessary:

*   react-scripts
*   react-router-dom
*   framer-motion
*   bootstrap
*   reactstrap
*   @fortawesome/react-fontawesome@latest
*   @fortawesome/fontawesome-svg-core
*   @fortawesome/free-solid-svg-icons
*   @fortawesome/free-regular-svg-icons

To install packages as production dependencies use `npm i -s <packages>`.  For the purpose of this setup, no packages are development dependencies.

Create the Directory Structure
------------------------------

The following structure should be used to accommodate both the React and RShiny components of the application.  Other files can and will be added, but these are the necessities:

```text-plain
project
│	app.R
│	babel.config.json
│	package.json
│	package-lock.json
│	webpack.config.js
│
└───public
│   │   index.html
│   
└───src
    │   App.js
    │   index.js
```

At a minimum, the **app.R** file should include:

```r
# Imports
library(shiny)

# UI
ui <- function() {
  htmlTemplate("public/index.html")
}

# Server
server <- function(input, output, session) {

}

# Serve the bundle at static/main.js
if (dir.exists("dist")) {
  addResourcePath("static", "dist")
}

# Run App
shinyApp(ui, server)
```

At a minimum, **public/index.html** should include a div for the app root and a script linking to the webpack-compiled React code (named “main.js” in this template package - see webpack configuration):

```html
<!DOCTYPE html>
<html lang="en">

<head>
	...
	{{ headContent() }}
</head>

<body>
  <div id="app" />
  <script src="static/main.js" type="text/javascript"></script>
</body>

</html>
```

An important note regarding this setup:

> Note that the combination of  `htmlTemplate("public/index.html")` in the Shiny UI and `{{ headContent() }}` in index.html is vital to loading Shiny within JavaScript for use in React.

The **src/index.js** file should at a minimum include the basic imports and link the React app to the root node in the html:

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

The **src/App.js** file should contain the application code.  This will be completely dynamic.  But, for the purpose of this walk-through, a hello world example is as follows:

```javascript
import React from 'react'

const App = () => {
  return (
    <h1>Hello World</h1>
  );
}
export default App;
```

Add the following to the **babel.config.json** file:

```javascript
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

Finally, the **webpack.config.js** file should contain all of the configuration needed to compile the React app:

```javascript
module.exports = {

  output: {
    // Serve the bundle from /static
    publicPath: '/static/'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },

  externals: {
    'shiny': 'window.Shiny'
  }

}
```

Compiling and Running
---------------------

After creating or cloning the Shiny/React template, the following steps can be taken to build the application and run it locally.  Set-up only requires `npm` and the steps are as follows:

```text-plain
npm install
npm run build
npm start
```

Note that on the RSVP server it is not necessary to run `npm start`.  Once the application is built in the ShinyApps directory, it will automatically deploy just like a typical RShiny application.  As mentioned, the repo contains an additional command which boots only the React front end and enables live-updates without the need to recompile React for RShiny integration:

```text-plain
npm run frontend
```

Remember that this command requires a dynamic import of Shiny on the JavaScript side and explicit handing of R server calls when the server is not running in front-end mode.

Front-End / Back-End Communication
----------------------------------

Shiny contains built-in functionality for processing communication between the front-end and back-end.  This repo uses the webpack configuration to expose ‘window.Shiny’ to React specifically.  This is not necessary, but it is cleaner and adds to traceability.  To import Shiny functions on the JavaScript side, the following import should be included in the React module:

```javascript
// Basic import
import Shiny from 'shiny';

// Dynamic import (for frontend testing)
let Shiny;
try {
  Shiny = require('shiny');
} catch (e) {
  Shiny = null;
}
```

### Front-End to Back-End

Once imported, the Shiny “library” allows communication to the server and the establishment of event handlers to monitor server response.  To send messages from the front-end to the back-end, use the following JavaScript functionality:

```javascript
// Check the Shiny is imported and send a message to the server:
Shiny && Shiny.setInputValue("functionName", { data: {} });
```

where “functionName” is the name of an observeEvent function handled on the Shiny server like so:

```r
observeEvent(input$functionName, {
	...
})
```

### Back-End to Front-End

To send messages from the server to the front-end, first use RShiny session$sendCustomMessage with a “type” corresponding the the front-end function name and a “message” corresponding to the data passed from the server to the front-end:

```r
session$sendCustomMessage(type = "functionName",
	# lists convert nicely to JSON (usually)
	message = list(data = list())
)
```

Handling these events on the front-end are a bit trickier.  Since we need to setup event handlers to monitor back-end responses, a decent solution in React is to use a one-shot useEffect() hook, which monitors the Shiny addCustomMessageHandler function:

```javascript
useEffect(() => {
	Shiny && Shiny.addCustomMessageHandler("functionName", (data) => {
		...
	});
}, []);
```

Final Notes
-----------

Other than communication, this solution works pretty well to solve many of the challenges of using Shiny.  The server calls and “responses” are unique and a little odd to implement, but with a properly designed React app, most of the data manipulation and operation should be manageable in the front-end.  This will keep server communication to a minimum.

It should be noted that the glin repo listed above ([https://github.com/glin/shiny-react-example](https://github.com/glin/shiny-react-example)) does an awesome job of emulating reactives from native Shiny using the JavaScript recharts ([https://recharts.org/](https://recharts.org/)) library.  This implementation seemingly brings everything full-circle such that it is possibly to handle only R analysis on the Shiny side and everything else in React.
