Create an NPM Project
---------------------

Note: the first three steps of this walk-through are bundled into this bitbucket repository.  To bypass some grunt work, skip to the “Compiling and Running” step.  However, the full process is included here for the purpose of documenting these steps.  This approach uses a bare bones npm approach so that all minute configuration details are controlled.  For a faster approach that includes more boiler plate, see the “create-react-app” npm module.

In the project folder run `npm init` to create the project.  This will begin the package creation utility.  Complete each field, leaving fields blank where unnecessary or unknown.  After creating the project, open **package.json.**  Delete the **main** attribute and replace the **scripts** object with the following:

```
"scripts": {
    "start": "Rscript -e 'shiny::runApp(launch.browser=TRUE)'",
    "build": "webpack --mode production"
  }
```

Install Dependencies
--------------------

The following dependencies are recommended.

For React and Front-End Development (some of these are “nice-to-haves”):

*   react
*   react-dom
*   bootstrap
*   reactstrap
*   @fortawesome/fontawesome-svg-core
*   @fortawesome/free-solid-svg-icons
*   @fortawesome/free-regular-svg-icons

For Compiling and Deploying the App:

*   webpack
*   webpack-cli
*   @babel/core
*   @babel/preset-env
*   @babel/preset-react
*   babel-loader
*   css-loader
*   style-loader

To install packages as production dependencies use `npm i -s <package>`.  For the purpose of this setup, no packages are development dependencies.

Create the Directory Structure
------------------------------

The following structure should be used to accommodate both the React and RShiny components of the application.  Other files can and will be added, but these are the necessities:

```
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

```
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

At a minimum, **public/index.html** should include a <div> for the app root and a <script> linking to the webpack-compiled React code:

```
<!DOCTYPE html>
<html lang="en">

<head>
	...
</head>

<body>
  <div id="app" />
  <script src="static/main.js" type="text/javascript"></script>
</body>

</html>
```

The **src/index.js** file should at a minimum include the basic imports and link the React app to the root node in the html:

```
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'
import 'bootstrap/dist/css/bootstrap.css';

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

The **src/App.js** file should contain the application code.  This will be completely dynamic.  But, for the purpose of this walk-through, a hello world example is as follows:

```
import React from 'react'

const App = () => {
  return (
    <h1>Hello World</h1>
  );
}
export default App;
```

Add the following to the **babel.config.json** file:

```
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

Finally, the **webpack.config.js** file should contain all of the configuration needed to compile React and proxy it to the R server:

```
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
  }
}
```

Compiling and Running
---------------------

After creating or cloning the Shiny/React template, the following steps can be taken to build the application and run it locally.  Set-up only requires `npm` and the steps are as follows:

```
npm install
npm run build
npm start
```
