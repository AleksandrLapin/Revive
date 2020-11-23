$(document).ready(function(){
	$('.button_burger').click(function(event) {
		$('.button_burger,.header_menu,.reg_box').toggleClass('active');
		$('body').toggleClass('lock');
	});
});