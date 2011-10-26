//BUG: Trello didn't at first load, need a refresh to make it work

setTimeout(ScrumColorize, 2000);

function CountHours(target){
	var total = 0.0;
	console.log(target);
	$(target).each(function(){
		var estimate = $(this).text().match(/\((\d*\.?\d*)H?\)/);
		console.log($(this).text());
		console.log(estimate);
		if( estimate == null ){
			$(this).css('color','#ff284a');
		}else {
			total += parseFloat(estimate[1]);
		}
	})
	return total;
}

function ScrumColorize(){

var total = 0.0;
var done = 0.0;

total = CountHours('div.list h3.list-card-title a');

// Done
$('div.list h2').each( function(){
	//console.log($(this).text().indexOf('Done'));
	if( $(this).text().indexOf('Done') >= 0 ){
		$(this).parent().parent().parent().find('h3.list-card-title a').each( function(){
			var estimate = $(this).text().match(/\((\d*\.?\d*)H?\)/);
			if( estimate != null){
				done += parseFloat( estimate[1] );
			}
		})
	}
})

console.log(total + ' ' + done);
remaining = Math.round(total*10-done*10)/10;
total = Math.round(total*10)/10;
$('.board-title h2').text( $('.board-title h2').text() + ': ' + remaining + '/' + total);
};

