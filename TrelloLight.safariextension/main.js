//BUG: Trello didn't at first load, need a refresh to make it work

setTimeout(ScrumColorize, 2000);

function CountHours(root){
	var total = 0.0;
	$(root).find('h3.list-card-title a').each(function(){
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


total = CountHours($('div.list div.list-wrapper'));

// Done
$('div.list div.list-wrapper').each( function(){
	//console.log($(this).text().indexOf('Done'));
	if( $(this).find('h2').text().indexOf('Done') >= 0 ){
		done = CountHours($(this));
	}
})

console.log(total + ' ' + done);
remaining = Math.round(total*10-done*10)/10;
total = Math.round(total*10)/10;
$('.board-title h2').text( $('.board-title h2').text() + ': ' + remaining + '/' + total);
};

