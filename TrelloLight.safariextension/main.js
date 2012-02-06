$(document).ready(function() {

	TrelloLight = ((function () {
		
		return TrelloLight;
		
	})());
	
	function TrelloLight () {
		
		this.config = {
		
			ignoredListNames: ["Backlog"],
			doneListNames: ["Done"],
		
			domEventsIgnoringCount: 0,
			animatesBoardHUDTitleChange: false,
			
			cssNoEstimationCardClass: "trello-light-unestimated-card",
			cssIgnoredListClass: "trello-light-ignored-list",
			cssDoneListClass: "trello-light-done-list",
			cssTitleHUDClass: "trello-light-title-hud"
		
		};
		
	}
	
	TrelloLight.prototype.setUp = function () {
	
		var tlThis = this;

		window.setInterval(function(){
			tlThis.handleDOMSubtreeModified();
		}, 1000);
		
		/*
		$("body")[0].addEventListener('DOMSubTreeModified', function () {
			tlThis.handleDOMSubtreeModified();
		});
		*/
		
		return this;
		
	};
	
	TrelloLight.prototype.beginIgnoringDOMSubtreeModifiedNotification = function () {
		this.config.domEventsIgnoringCount++;
	};
	
	TrelloLight.prototype.endIgnoringDOMSubtreeModifiedNotification = function () {
		this.config.domEventsIgnoringCount--;
	};
	
	TrelloLight.prototype.isIgnoringDOMSubtreeModifiedNotification = function () {
		return !!(+(this.config.domEventsIgnoringCount));
	};
	
	TrelloLight.prototype.handleDOMSubtreeModified = function () {
	
		//	Re-evaluate as the DOM is modified.  This is costly, but it’s all we can do right now
		
		if (this.isIgnoringDOMSubtreeModifiedNotification())
			return;
		
		this.beginIgnoringDOMSubtreeModifiedNotification();		
		
		var tlThis = this;
		var allHours = 0, doneHours = 0, ignoredHours = 0;
	
		$('div.list').each(function(){
		
			var listTitle = $(this).find('.list-title h2').text();
			var listIgnored = tlThis.shouldIgnoreList(listTitle);
			var listDone = tlThis.shouldConsiderItemsInListDone(listTitle);
			
			if (listIgnored) {
				$(this).addClass(tlThis.config.cssIgnoredListClass);
			} else {
				$(this).removeClass(tlThis.config.cssIgnoredListClass);
			}
			
			if (listDone) {
				$(this).addClass(tlThis.config.cssDoneListClass);
			} else {
				$(this).removeClass(tlThis.config.cssDoneListClass);
			}
			
			$(this).find('.list-card').each(function(){
			
				var cardTitle = $(this).find('.list-card-title').text();
				var cardEstimation = tlThis.estimationFromTitle(cardTitle);
				
				console.log(cardTitle, cardEstimation);
				
				if (isNaN(cardEstimation)) {
					
					$(this).addClass(tlThis.config.cssNoEstimationCardClass);
					
				} else {
				
					if (!listIgnored) {
					
						allHours += cardEstimation;
						
						if (listDone)
							doneHours += cardEstimation;
					
					} else {
					
						ignoredHours += cardEstimation;
					
					}
					
					$(this).removeClass(tlThis.config.cssNoEstimationCardClass);
					
				}
				
			});
			
		});
		
		var boardHUD = this.documentBoardHUD();
		//	Probably boardHUD.attr("title", foo)
		
		var toBoardHUDText = " " + doneHours + " / " + allHours + (ignoredHours ? " + " + ignoredHours : "");
		
		if (this.config.animatesBoardHUDTitleChange) {
		
			if (boardHUD.text() != toBoardHUDText) {
				this.beginIgnoringDOMSubtreeModifiedNotification();
				boardHUD.fadeTo(100, 0).text(toBoardHUDText).delay(50).fadeTo(100, 1, function () {
					window.setTimeout(function(){
						tlThis.endIgnoringDOMSubtreeModifiedNotification();
					}, 250);
				});
			}
		
		} else {
		
			boardHUD.text(toBoardHUDText);
		
		}
	
		this.endIgnoringDOMSubtreeModifiedNotification();
		
	};
	
	TrelloLight.prototype.documentBoardHUD = function () {
	
		var boardTitle = $(".board-title h2");
		var foundHUD = boardTitle.find("." + this.config.cssTitleHUDClass);
		
		if (!foundHUD.length) {
			foundHUD = $("<span>").addClass(this.config.cssTitleHUDClass);
			boardTitle.append(foundHUD);
		}
		
		return foundHUD;

	}
	
	var nameMentioned = function (aName, anArray) {
		return -1 != $.inArray(aName.toLowerCase(), $(anArray).map(function(idx, aName){ return aName.toLowerCase(); }));
	};
	
	TrelloLight.prototype.shouldIgnoreList = function (aListName) {
		return nameMentioned(aListName, this.config.ignoredListNames);
	};
	
	TrelloLight.prototype.shouldConsiderItemsInListDone = function (aListName) {
		return nameMentioned(aListName, this.config.doneListNames);
	};
	
	TrelloLight.prototype.estimationFromTitle = function (aTitle) {
		var matches = aTitle.match(/\((\d*\.?\d*)H?\)/);
		return (matches && (matches.length > 1)) ? parseFloat(matches[1], 10) : NaN;
	};
	
	window.trelloLight = (new TrelloLight()).setUp();
	
});
