$(document).ready(function(){
	$('.button_burger').click(function(event) {
		$('.button_burger,.reg_box').toggleClass('active');
		$('body').toggleClass('lock');
	});
});
// .header_menu,