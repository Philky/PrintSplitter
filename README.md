# jQuery PrintSplitter

A jQuery plugin for neatly splitting tables / other content across pages when printing

## Usage & defaults

The print splitter can optionally take values for different sized pages and margins. Defaults to A4.

```
$(target-element).printSplitter({
	paperSize: {
		width: 11.692, // Width in inches, defaults A4
		height: 8.267 // Height in inches, defaults A4
	},
	margins: { // All in inches
		top: 0.39,
		left: 0.39,
		right: 0.39,
		bottom: 0.39
	},
	threshold: 30, // Extra threshold when calculating the break point
	portraitMode: false, // Wether to print in portrait mode
	headerElements: [], // Array of extra elements to include in the calculations on the first page of printing. Useful for table key / headings etc
	callback: function() {} // A callback to run when the print dialog is closed
});
```
