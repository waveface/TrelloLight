$().ready(function() {
	setTimeout(ScrumColorize, 2000);
});

function CountHours(root, color){
	if( color === undefined ) {
		color = '#ff284a'
	}
	var total = 0.0;
	$(root).find('h3.list-card-title a').each(function(){
		var estimate = $(this).text().match(/\((\d*\.?\d*)H?\)/);
		console.log($(this).text());
		if( estimate == null ){
			$(this).css('color', color);
		}else {
			total += parseFloat(estimate[1]);
		}
	})
	return total;
}

function ScrumColorize(){

var total = 0.0;

total = CountHours($('div.list div.list-wrapper'));

var done = 0.0;
$('div.list div.list-wrapper').each( function(){
	if( $(this).find('h2').text().toLowerCase().indexOf('done') >= 0 ){
		done = CountHours($(this));
	}
})

var exclude = 0.0;
$('div.list div.list-wrapper').each( function(){
	if( $(this).find('h2').text().toLowerCase().indexOf('backlog') >= 0 ){
		exclude = CountHours($(this), '#222');
	}
})

console.log(total + ', ' + done + ', ' + exclude);
total -= exclude;
total = Math.round(total*10)/10;
remaining = Math.round(total*10-done*10)/10;
$('.board-title h2').text( $('.board-title h2').text() + ': ' + remaining + '/' + total);
};

