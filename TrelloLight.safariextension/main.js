setTimeout(ScrumColorize, 2000);

function ScrumColorize(){

var remain = 0.0;
var done = 0.0

$('h3.list-card-title a').each(function(){
	var estimate = $(this).text().match(/\((\d*\.?\d*)H?\)/);

	if( estimate == null ){
		//$(this).css('background-color', '#ff284a');
		$(this).css('color','#ff284a');
	}else {
		remain += parseFloat(estimate[1]);
	}

})

// Done
$('h2').each( function(){
	if( $(this).text().indexOf('Done') >= 0 ){
		$(this).parent().parent().parent().find('h3.list-card-title a').each( function(){
			done += parseFloat( $(this).text().match(/\((\d*\.?\d*)H?\)/)[1] );
		})
	}
})

console.log(remain + ' ' + done);
$('.board-title h2').text( $('.board-title h2').text() + ' ' + (remain-done) + '/' + (remain) );
};