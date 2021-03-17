This module contains a component which presents as a button on the page.

When pressed iot will convert the entire Flow page on screen to a PDF and push it to the browser as a download file.


The latest version can be included in your player from this location: -

```
https://files-manywho-com.s3.amazonaws.com/e1dbcceb-070c-4ce6-95b0-ba282aaf4f48/pdf.js
https://files-manywho-com.s3.amazonaws.com/e1dbcceb-070c-4ce6-95b0-ba282aaf4f48/pdf.css
```


## Functionality

Required the ability to render an entire Flow page to a PDF in a graphically correct way.

You place this component on a page and it shows a simple button which when pressed will convert the page or part to a PDF file.

It uses html2canvas to render the page as an image then jsPDF to put that image into a4 pages.

Background images are converted to data uris on the fly to avoid cors issues in html2canvas.

## Component Settings

width and height if spacified control the component's dimensions - in pixels.


## Component Attributes

### classes

Like all components, adding a "classes" attribute will cause that string to be added to the base container's class value

### SelectorClass

If specified then the component will find the first element on the page with this class and use that as the base of the pdf.

If not specified then the <body> tag is used

### icon

The glyphicon name to display

### display

Controls the display, optional, defaults to just the label text.

options are : - icon, iconandtext, text







