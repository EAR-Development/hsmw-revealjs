

function template(strings, ...keys) {
    return (function(...values) {
      var dict = values[values.length - 1] || {};
      var result = [strings[0]];
      keys.forEach(function(key, i) {
        var value = Number.isInteger(key) ? values[key] : dict[key];
        result.push(value, strings[i + 1]);
      });
      return result.join('');
    });
  }

make_slide = template`<section data-markdown="${0}/${1}.md" data-separator="^ \\n\\n\\n" data-separator-vertical="^\\n\\n" data-separator-notes="^Note:" data-charset="utf-8"></section>`

$('body').append(`
  	<div class="reveal">
		<div class="slides">
		</div>
	</div
`)

$('.slides').append(make_slide('hsmw-theme', 'title'))
for (slide of SLIDES){
    $('.slides').append(make_slide('slides', slide))
}
$('.slides').append(make_slide('hsmw-theme', 'end'))

Reveal.initialize({
    hash: true,
    width: 1920,
    height: 1080,
    center: false,
	margin: 0,
	
	pdfMaxPagesPerSlide: 1,

    plugins: [RevealMarkdown, RevealHighlight, RevealNotes]
});

HEADER_AND_FOOTER = {
    "title" : {
        "header" : `
            <p class='header-title no-esf'>
			</p>
        `,
        "footer" : `
            <p class='footer-title'>
            </p>
        `
    },
    "content" : {
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
    			<div class="institute-tag">
    				SICIM - Theory and Application
    			</div>
    			<div class='image-wrapper'>
    				<img src="hsmw-theme/img/logo.png">
    			</div>
    		</div>
        `
    },
    "end": {
        "header": `
			<p class='header-end'>
			</p>
        `,
        "footer" : `
			<p class='footer-end'>
			</p> 
        `
    }
}
Reveal.addEventListener('ready', function (event) {
	// header and footer
    for (template in HEADER_AND_FOOTER) {
		$('section.' + template).prepend(HEADER_AND_FOOTER[template]['header']);
	    $('section.' + template).append(HEADER_AND_FOOTER[template]['footer']);
	}
	
	if (ESF){
		$('.no-esf').toggleClass('no-esf').toggleClass('esf')
	}


	// slide numbers
	$('.slides').children().each(function (sectionNumber, section) {
		$(section).find('.pagenumber').text(sectionNumber)
	})
	// author and title
	$('.placeholder-author').each(function (index, placeholder) {
		$(placeholder).text(AUTHOR)
	})
	$('.placeholder-position').each(function (index, placeholder) {
		$(placeholder).text(POSITION)
	})
	$('.placeholder-email').each(function (index, placeholder) {
		$(placeholder).text(EMAIL)
	})
	$('.placeholder-title').each(function (index, placeholder) {
		$(placeholder).text(TITLE)
	})
	$('.placeholder-subtitle').each(function (index, placeholder) {
		$(placeholder).text(SUBTITLE)
	})
	var date = new Date()
	var datestring = date.toLocaleDateString('de-DE', {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	})
	$('.placeholder-date').each(function (index, placeholder) {
		$(placeholder).text(datestring)
	})
})