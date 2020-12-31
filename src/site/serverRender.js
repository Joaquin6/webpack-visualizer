import fs from 'fs-extra'
import React from 'react'
import ReactDOM from 'react-dom/server'
import App from './app'
import createHTMLString from './index.html.js'

const pageHTML = createHTMLString({
	appHTML: ReactDOM.renderToString(<App />),
})

const pageHTMLFile = fs.createWriteStream('dist-site/index.html')
pageHTMLFile.write(pageHTML)
pageHTMLFile.end()
