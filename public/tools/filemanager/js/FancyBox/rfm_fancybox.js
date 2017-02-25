$(document).ready(function() {

	/* Load FancyBox script for Thumbnail image preview */
	
	$("a[rel^='fancybox']").fancybox({
		helpers : {
			title: { type: 'inside'}
		},
		afterLoad: function(){
			this.title = this.title + ' ' + $(this.element).find('img').attr('alt');
		}
	});
	
});