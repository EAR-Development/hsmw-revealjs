//	Build Deck From Markdown

function template(strings, ...keys) {
	return (function (...values) {
		var dict = values[values.length - 1] || {};
		var result = [strings[0]];
		keys.forEach(function (key, i) {
			var value = Number.isInteger(key) ? values[key] : dict[key];
			result.push(value, strings[i + 1]);
		});
		return result.join('');
	});
}

var make_slide = template`<section data-markdown="${0}/${1}.md" data-separator="^---" data-separator-vertical="^\\n\\n" data-separator-notes="^Note:" data-charset="utf-8"></section>`

$('body').append(`
  	<div class="reveal">
		<div class="slides">
		</div>
	</div
`)

var scripts = document.getElementsByTagName("script"),
	src = scripts[scripts.length - 1].src,
	path = src.substring(0, src.lastIndexOf('/'));

$('.slides').append(make_slide(path, 'title'))
for (slide of SLIDES) {
	$('.slides').append(make_slide('slides', slide))
}
if (THANK_YOU) {
	$('.slides').append(make_slide(path, 'end'))
}

// Initialize RevealJS After building the Deck
Reveal.initialize({
	hash: true,
	width: 1920,
	height: 1080,
	center: false,
	margin: 0,

	pdfMaxPagesPerSlide: 1,

	mathjax: 'https://cdn.jsdelivr.net/gh/mathjax/mathjax@2.7.8/MathJax.js',
	config: 'TeX-AMS_HTML-full',

	plugins: [RevealMarkdown, RevealHighlight, RevealNotes, RevealMath],
	markdown: {
		smartypants: true
	}
});

// Apply Styling to Slides
var date = new Date()
const DATESTRING = date.toLocaleDateString('de-DE', {
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
})
const DEFAULT_TYPE = 'content'
const HEADER_AND_FOOTER = {
	"title": {
		"header": `
            <p class='header-title no-esf'>
			</p>
        `,
		"footer": `
            <p class='footer-title'>
            </p>
        `
	},
	"chapter": {
		"header": `
			<div class="chapter_block chapter_0_0"></div>
			<div class="chapter_block chapter_0_1"></div>
			<div class="chapter_block chapter_0_2"></div>
			<div class="chapter_block chapter_1_0"></div>
			<div class="chapter_block chapter_1_1"></div>
			<div class="chapter_block chapter_1_2"></div>
        `,
		"footer": `
			<div class='footer-chapter'>
    		</div>
        `
	},
	"content": {
		"header": `
	    	<p class='header-content'>
			</p>
        `,
		"footer": `
   			<div class='footer-content'>
   				<div class='left-info'>
   					<div class="pagenumber">2</div>
   					<div class="title"><span class="placeholder-title"></span> | <span
   							class="placeholder-author"></span></div>
   					<div class="copyright">(c) <span class="placeholder-date"></span> Hochschule Mittweida</div>
   				</div>
    			<div class='image-wrapper'>
					<img src="`+ path + `/img/logo.png">
    			</div>
    		</div>
        `
	},
	"end": {
		"header": `
			<p class='header-end'>
			</p>
        `,
		"footer": `
			<p class='footer-end'>
			</p> 
        `
	}
}
HEADER_AND_FOOTER['one_image'] = HEADER_AND_FOOTER['two_image'] = HEADER_AND_FOOTER['three_images'] = HEADER_AND_FOOTER['single'] = HEADER_AND_FOOTER['content']

function detect_slide_style() {
	$('section.default').each(function (_, section) {
		var non_title_objects = $(section).children(':not(h1,h2)').length

		let img_count = $(section).find('img').length

		let all_text = $(section).text().replace(/\s/g, '')
		let header_text = $(section).children('h1').text().replace(/\s/g, '')

		let detected_class = DEFAULT_TYPE

		if (all_text == header_text && img_count == 1) {
			detected_class = 'single'
			// Apply Helper Classes
			$(section).children('p').addClass('single_wrapper')
		}
		if (all_text != header_text && img_count == 1) {
			detected_class = 'one_image'
			// Apply Helper Classes
			$(section).children('p').each(function (_, p) {
				if ($(p).find('img').length == 1) {
					$(p).addClass('one_image_wrapper')
				}
			})
			$(section).children(":not(h1,h2,.one_image_wrapper)").wrap('<p class="one_image_text"></p>')
			// $(section).append('<div class="one_image_bg"></div>')
		}
		if (img_count == 2) {
			detected_class = 'two_images'
		}
		if (img_count == 3) {
			detected_class = 'three_images'
			// Apply Helper Classes
			$(section).children('p').each(function (_, p) {
				if ($(p).find('img').length == 3) {
					$(p).addClass('three_images_wrapper')
				}
			})
			// $(section).append('<div class="bg"></div>')
		}
		if (non_title_objects == 0) {
			detected_class = 'chapter'
		}

		$(section).removeClass('default').addClass(detected_class)
	})
}

function add_image_captions() {
	let images = $("img")
	images.each(function (_, image) {
		let alt = image.alt
		let source_split = alt.split("%src: ")

		// Read Alternative Text
		let caption = source_split[0]
		let source = undefined

		if (source_split.length == 2) {
			source = source_split[1]
		}

		// Create Figure with Caption if necessary
		let description_found = caption.startsWith("%%")


		if (description_found || source !== undefined) {
			wrapper = $(image).wrap("<figure></figure>").parent()
			figure_caption = $("<figurecaption>")
			wrapper.append(figure_caption)
		}

		if (description_found) {
			caption = caption.slice(2).trim()
			console.log("apply caption:", caption)
			let description_caption = $('<p style="margin:0">')
			description_caption.text(caption)
			figure_caption.append(description_caption)
		}

		if (source !== undefined) {
			console.log("apply source: ", source)
			let source_caption = $('<p class="source-tag" style="margin:0">')
			source_caption.text("Source: " + source)
			figure_caption.append(source_caption)
		}
	})
}


function apply_slide_style() {
	// Add Default marker
	$('.slides > section').addClass('default')

	// Remove default marker of type is specified
	for (template in HEADER_AND_FOOTER) {
		$('section.' + template).removeClass('default');
	}

	detect_slide_style()

	// Apply Styles
	for (template in HEADER_AND_FOOTER) {
		$('section.' + template).prepend(HEADER_AND_FOOTER[template]['header']).removeClass('default');
		$('section.' + template).append(HEADER_AND_FOOTER[template]['footer']).removeClass('default');
	}

	// Adjust Elements
	add_image_captions()
}

function apply_acknoledgement(params) {
	if (ESF) {
		$('.no-esf').toggleClass('no-esf').toggleClass('esf')
	}
}

function replace_pagenumber() {
	$('.slides').children().each(function (sectionNumber, section) {
		$(section).find('.pagenumber').text(sectionNumber)
	})
}

function replace_placeholders(replacements) {
	for (fieldname in replacements) {
		$('.placeholder-' + fieldname).each(function (index, placeholder) {
			$(placeholder).text(replacements[fieldname])
		})
	}
}

Reveal.addEventListener('ready', function (event) {
	apply_slide_style()
	apply_acknoledgement()

	replacements = {
		'author': AUTHOR,
		'position': POSITION,
		'email': EMAIL,
		'title': TITLE,
		'subtitle': SUBTITLE,
		'date': DATESTRING
	}
	replace_pagenumber()
	replace_placeholders(replacements)
})