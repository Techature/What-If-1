
# README for Shark Tank project #

This is the README file for the Shark Tank project app. It's a great place to write
down some notes about how your app works. For starters, here is some information
about the other files in this folder.

The files in this folder contain everything you need to run your app:

* `applab/applab.js` - This file contains the applab library, which has all the
  javascript that applab uses to run your app.

* `applab/applab.css` - This file contains some default CSS styling for your app.

* `index.html` - This is the html file that you designed in applab using the
  Design tab. It contains all the buttons, text inputs, and other controls for
  your app. Go here to add additional controls to your app.

* `style.css` - This file defines the custom styling for each control in your
  app that you specified under the Design tab. Go here to change the colors,
  positions, dimensions, and other properties of your app's controls.

* `code.js` - This file has all the code you wrote for your app. Go here to add
  new behavior to your app.

HOW TO RUN LOCALLY:

1. Double-click `RUN.bat` (or run: python -m http.server 8080)
2. Open http://localhost:8080/ in your browser.

The app uses `runtime.js` + `code.js` (fast, works offline). The old
`applab/applab-api.js` file is no longer loaded for local preview.

Data (Finders list) is stored in your browser via localStorage.

After editing code.js only — no sync step required for local run.
Use `node sync-code.js` only if you upload the project back to Code.org.

* `assets` - This is a directory with all the asset files (pictures and sounds)
  that you uploaded in applab.
