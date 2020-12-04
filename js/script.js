$(document).ready(function(){
	$('.button_burger').click(function(event) {
		$('.button_burger,.block-nav').toggleClass('active');
		$('body').toggleClass('lock');
	});
});