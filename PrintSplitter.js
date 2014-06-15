(function ($) {

	$.fn.printSplit = function(options) {
		var self = this;

		// Gets dpi of current screen
		var getDpi = function() {
			$('body').append('<div id="printSplitDPI" style="width:1in;height:1in;left:-100%;position:absolute;top:-100%;"></div>');
			var dpi = document.getElementById('printSplitDPI').offsetHeight;
			$('#printSplitDPI').remove();
			return dpi;
		};

		// Initialise passed in variables
		options = $.extend({
			paperSize: {
				width: 11.692, // inches
				height: 8.267, // inches
			},
			threshold: 30,
			portraitMode: false,
			dpi: getDpi(),
			margins: {
				top: 0.39,
				left: 0.39,
				right: 0.39,
				bottom: 0.39
			},
			headerElements: [],
			callback: function() {}
		}, options);

		// Setup calculation height based on page orientation & margins
		var preHeight = (options.portraitMode) ? options.paperSize.width : options.paperSize.height;
		var pageHeight = (preHeight - options.margins.bottom - options.margins.top) * options.dpi;

		// Get the elements for splitting
		var iterElements;
		if ($(self).is('table')) {
			iterElements = $(self).children('tbody').children('tr');
		} else {
			iterElements = $(self).children();
		}

		// Running height reset after each page break
		var walkHeight = 0;
		// Our new tables
		var tmpRows = {};
		// Page counter
		var currPage = 0;

		// Loop each row of the target element, creating a split array for printing
		$.each(iterElements, function(i, row) {
			// Handle optional passed in header elements for the first page
			if (i === 0 && options.headerElements) {
				$.each(options.headerElements, function(j, e) {
					walkHeight += Math.max($(e).outerHeight(true), $(e).offset().top);
				});
			}

			// Grab the current rows height
			var rowHeight = $(row).outerHeight(true);
			// Check if the row goes over the page
			if (walkHeight + rowHeight >= pageHeight - options.threshold) {
				// Row is over threshold, move to next page
				walkHeight = rowHeight;
				currPage++;
			} else {
				walkHeight += rowHeight;
			}

			if (!tmpRows[currPage]) {
				tmpRows[currPage] = [];
			}
			tmpRows[currPage].push($(row).clone());
		});

		// Append a new temporary container to the dom
		$(self).before('<div class="print-split-cont"></div>');

		// // Loop our table rows array creating one per page
		$.each(tmpRows, function(i, tr) {
			var splitCont = $(self).clone().html('');
			if (i > 0) {
				splitCont.css('page-break-before', 'always');
			}
			
			$.each(tr, function(j, r) {
				splitCont.append(r);
			});

			$('.print-split-cont').append(splitCont);
		});

		// Hide the original element
		$(self).hide();

		// Open print dialog
		window.print();
		// This timeout causes the JS to 'pause' when the system print dialog opens.
		// This means that we can reset the dom when the user has finished printing.
		setTimeout(function() {
			// Show the original table
			$(self).show();
			// Remove the split content
			$('.print-split-cont').remove();
			// Run callback
			options.callback();
		}, 100);
	};

	return this;
})(jQuery);