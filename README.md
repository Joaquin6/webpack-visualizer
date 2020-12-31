# Webpack Visualizer

Visualize and analyze your Webpack bundle to see which modules are taking up space and which might be duplicates.

## Site Usage

Upload your stats JSON file to the site: [joaquin6.github.io/webpack-visualizer/](http://joaquin6.github.io/webpack-visualizer/)

## Plugin Usage

```sh
npm install webpack-visualizer-plugin
```

```javascript
const Visualizer = require('webpack-visualizer-plugin');

//...
plugins: [new Visualizer()],
//...
```

This will output a file named `stats.html` in your output directory. You can modify the name/location by passing a `filename` parameter into the constructor.

```javascript
const Visualizer = require('webpack-visualizer-plugin');

//...
plugins: [new Visualizer({ filename: './statistics.html' })],
//...
```
