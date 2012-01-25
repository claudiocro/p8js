(function($) {

	var defaultContentFunction = function(feed) {
		return feed;
	};

	$.widget("ui.p8FeedItem", {
		options : {
			activeCnt : null,
			inactiveCnt : null,
			contentFunc : defaultContentFunction,
			_timeout : null,
			_imageLoadTicket : 0
		},
		_create : function() {
			var self = this;
			var elem = this.element;
			elem.addClass("p8FeedItem");
			// elem.hide(false);

			var p8FeetCont = $('<div></div>').addClass('p8FeetCont').addClass('active');
			p8FeetCont.css({
				position : 'absolute',
				height : '100%',
				width : '100%',
				top : 0,
				left : 0,
				opacity : 0,
				'z-index' : 10
			});
			elem.append(p8FeetCont);

			var p8FeetInactiveCont = $('<div></div>').addClass('p8FeetCont').addClass('inactive');
			p8FeetInactiveCont.css({
				position : 'absolute',
				height : '100%',
				width : '100%',
				top : 0,
				left : 0,
				opacity : 0,
				'z-index' : 9
			});
			elem.append(p8FeetInactiveCont);

			var article = $('<div class="article"></div>').addClass('feedItem');
			if (self.options.activeCnt != null)
				article.append(self.options.activeCnt);
			p8FeetCont.append(article);

			var article = $('<div class="article"></div>').addClass('feedItem');
			if (self.options.inactiveCnt != null)
				article.append(self.options.inactiveCnt);
			p8FeetInactiveCont.append(article);
		},
		_ajustByClass : function() {
			var elem = this.element;
			$(".active", elem).css('z-index', 10);
			$(".inactive", elem).css('z-index', 9);
			$(".active", elem).css('opacity', 1);
			$(".inactive", elem).css('opacity', 0);
		},
		isVisible : function() {
			return $(".active", this.element).css('opacity') != 0 || $(".inactive", this.element).css('opacity') != 0;
		},
		isHidden : function() {
			return $(".active", this.element).css('opacity') == 0 && $(".inactive", this.element).css('opacity') == 0;
		},
		isMoving : function() {
			return $(".active", this.element).css('opacity') != 0 && $(".inactive", this.element).css('opacity') != 0;
		},
		load : function(image, feed) {
			var self = this;
			var elem = this.element;

			if (self.options._timeout != null)
				clearTimeout(self.options._timeout);

			// wait until animation has stopped
			if (self.isMoving()) {
				if (self.options._timeout != null)
					clearTimeout(self.options._timeout);

				self.options._timeout = setTimeout(function() {
					self.options._timeout = null;
					self.load(image, feed);
				}, 80);

				return;
			}

			this.options._imageLoadTicket = this.options._imageLoadTicket + 1;
			var nowTicket = this.options._imageLoadTicket;

			var article = null;
			if (self.isHidden())
				article = $('.active .article', elem);
			else
				article = $('.inactive .article', elem);

			if (image != null) {
				article.data('feedImage', image);
				article.css({
					'background-image' : 'url(' + image + ')'
				});
				var imageToWaitFor = new Image();
				if ($.browser.msie && parseInt($.browser.version, 10) <= 8) {
					setTimeout(function() {
						if (nowTicket == self.options._imageLoadTicket)
							self.switchFeeds();
					}, 350);
				} else {
					imageToWaitFor.onerror = function() {
						if (nowTicket == self.options._imageLoadTicket)
							self.switchFeeds();
					};
					imageToWaitFor.onload = function() {
						setTimeout(function() {
							if (nowTicket == self.options._imageLoadTicket)
								self.switchFeeds();
						}, 250);
					};
					imageToWaitFor.src = image;
				}
				if (feed != null) {
					article.empty().append(self.options.contentFunc(feed));
					article.data("feedItem", feed);
				} else {
					article.data("feedItem", null);
				}
			} else {
				article.data('feedImage', null);
				article.css({
					'background-image' : 'none'
				});
				if (feed != null) {
					article.empty().append(self.options.contentFunc(feed));
					article.data("feedItem", feed);
				} else {
					article.data("feedItem", null);
				}

				setTimeout(function() {
					self.switchFeeds();
				}, 250);
			}

//TODO: remove jTruncate dependency
$(".feedTitle", article).jTruncate({
	length : 40,
	minTrail : 0
});

		},
		switchFeeds : function() {
			var self = this;
			var elem = this.element;

			var moveAway = null;
			var moveIn = null;
			if (self.isHidden()) {
				moveAway = $(".inactive", elem);
				moveIn = $(".active", elem);
			} else {
				moveAway = $(".active", elem);
				moveIn = $(".inactive", elem);
			}

			moveAway.css('z-index', 9);
			moveIn.css('z-index', 10);

			moveAway.animate({
				opacity : .001
			}, {
				duration : 1000,
				queue : true
			});

			moveIn.animate({
				opacity : 1
			}, {
				duration : 1500,
				queue : true,
				complete : function() {

					moveAway.removeClass("active");
					moveIn.removeClass("inactive")
					moveAway.addClass("inactive");
					moveIn.addClass("active");

					self._ajustByClass();
				}
			});
		},
		activeFeedContent : function() {
			return $('.active .article', this.element).html();
		},
		activeFeedItem : function() {
			if ($('.inactive', this.element).css('z-index') == 10)
				return $('.inactive article', this.element).data('feedItem');
			else
				return $('.active .article', this.element).data('feedItem');
		},
		clean : function() {
			var self = this;
			var elem = this.element;

			$('.p8FeetCont', elem).animate({
				opacity : 0
			}, 200);
			$('.article', elem).data('feedItem', null);
			$('.article', elem).data('feedImage', null);
			// $('article', elem).css({'background-image': ''}).empty();
		}
	});

}(jQuery));

(function($) {

	$.widget("ui.p8ImageCont", {
		options : {
			defaultZIndex : 1,
			activeZIndex : 20,
			maxWidth : 1245,
			maxHeight : 615
		},
		_create : function() {
			var self = this;
			var elem = this.element;

			this.isBigContent = false;

			elem.addClass("p8ImageCont");
			elem.append($('<div></div>').addClass('bigimage-content').css({
				opacity : 0,
				"z-index" : self.options.defaultZIndex
			}).append($('<img />')).append($('<div><div class="bigimage-inner-desc"></div></div>').addClass('bigimage-desc').css({
				position : 'absolute',
				bottom : 0,
				right : 0,
				height : '15px',
				opacity : 0
			})));

			elem
			// .css({height:"10px"})
			.hover(function() {
				$('.bigimage-desc', this).stop().animate({
					opacity : .5,
					height : "30px"
				}, {
					duration : 250,
					easing : "easeInSine"
				});
			}, function() {
				$('.bigimage-desc', this).stop().animate({
					opacity : 0,
					height : "15px"
				}, {
					duration : 200
				});
			});

		},
		load : function(image, description) {
			var self = this;
			var elem = this.element;
			var bigImageCnt = $('.bigimage-content', elem);
			var bigimageDesc = $('.bigimage-desc', elem);
			var bigimageInnerDesc = $('.bigimage-inner-desc', elem);
			self.isBigContent = true;

			bigImageCnt.busy({
				img : 'res/images/busy.gif',
				hide : false
			});
			bigimageInnerDesc.empty();

			var imageToWaitFor = new Image();
			imageToWaitFor.onerror = function() {
				imageToWaitFor.onerror = "";
				self.unload();
			}
			imageToWaitFor.onload = function() {
				var imgElem = $('img', elem);

				bigImageCnt.busy("hide");
				imgElem.attr('src', image);
				setTimeout(function() {
					if (!self.isBigContent)
						bigImageCnt.animate({
							opacity : 0
						}, 200);

					var width = imageToWaitFor.naturalWidth;
					var height = imageToWaitFor.naturalHeight;

					if (width == null || height == null) {
						width = imageToWaitFor.width;
						height = imageToWaitFor.height;
					}

					var scaled = $.scaleSize(self.options.maxWidth, self.options.maxHeight, width, height);
					imgElem.attr("width", parseInt(scaled[0])).attr("height", parseInt(scaled[1])).css({
						"margin-top" : parseInt((self.options.maxHeight - scaled[1]) / 2)
					});

					bigImageCnt.animate({
						opacity : 1
					}, 1000).css({
						"z-index" : self.options.activeZIndex
					});

					bigimageDesc.css({
						bottom : parseInt((self.options.maxHeight - scaled[1]) / 2) + 'px',
						right : parseInt((self.options.maxWidth - scaled[0]) / 2) + 'px',
						width : scaled[0]
					});

					bigimageInnerDesc.append(description);

				}, 250);
			};
			imageToWaitFor.src = image;
		},
		unload : function() {
			var self = this;
			var elem = this.element;

			$('.bigimage-content', elem).stop().animate({
				opacity : 0
			}, 600).css({
				"z-index" : self.options.defaultZIndex
			}).busy('hide');
		}
	});

}(jQuery));

(function($) {

	$.widget("ui.p8JsonGallery", {
		options : {
			maxCount : 100,
			requestFunction : null,
			feedLoaderFunction : null
		},
		_init : function() {
			this.currentCount = 0;
			this.ajaxTickedId = 0;
			this.allFeeds = new Array();
			this.feedStreamEnd = false;
			this.isRetrivingFeed = false;
			this.forceMoveForeward = false;
			this.total = this.element.children().size();
		},

		_create : function() {
			this.element.addClass("p8JsonGallery");
			this.element.children().addClass("p8JsonGallery-item");
		},
		reload : function() {
			this.currentCount = 0;
			this.allFeeds = new Array();
			this.feedStreamEnd = false;

			this.moveForwards(true);
		},

		getCurrentCount : function() {
			return this.currentCount;
		},

		getAllFeeds : function() {
			return this.allFeeds;
		},

		canMoveForwards : function() {
			return (this.currentCount <= this.options.maxCount && (this.total * (this.currentCount + 1)) <= this.allFeeds.length);
		},

		moveForwards : function(force) {
			if (this.canMoveForwards() == false && force != true)
				return;

			var self = this;

			// handle navigation busy indicator
			/*if (self.feedStreamEnd != true && self.currentCount < self.options.maxCount && self.allFeeds.length < self.total * (self.currentCount + 4))
				self._trigger('loading', 0, true);
			else if (self.currentCount >= self.options.maxCount)
				self._trigger('loading', 0, false);
			*/

			// preload feed if necessary
			if (self.feedStreamEnd != true && self.allFeeds.length - (self.total * 5) < self.currentCount * self.total && !self.isRetrivingFeed) {
				self.isRetrivingFeed = true;

				self.ajaxTickedId++;

				self.options.requestFunction.call(this);
				self.forceMoveForeward = true;
			}

			// load next available feedItems
			if (self.canMoveForwards()) {
				self.forceMoveForeward = false;
				self._loadNextItems();
				self.currentCount++;
				
				self._trigger('moveForwards');
			}
		},

		canMoveBackwards : function() {
			return (this.currentCount >= 2);
		},

		moveBackwards : function() {
			if (this.canMoveBackwards() == false)
				return;

			var self = this;
			self.forceMoveForeward = false;
			
			self.currentCount--;
			self.currentCount--;
			self._loadNextItems();
			self.currentCount++;

			self._trigger('moveBackwards');
		},

		_loadNextItems: function() {
			var self = this;
			var p8Items = $('.p8JsonGallery-item', this.element);
			for ( var i = this.total * this.currentCount, len = this.allFeeds.length; i < this.total * (this.currentCount + 1) && i < len && i > -1; ++i) {
				self.options.feedLoaderFunction.call(self, $(p8Items.get(i - this.total * this.currentCount)), this.allFeeds[i]);
			}
		},
		
		_preProcessResponse : function() {
			var self = this;
			
			self.isRetrivingFeed = true;
			self._trigger('loading', 0, true);
		},

		_postProcessResponse : function() {
			var self = this;
			
			self.isRetrivingFeed = false;
			self._trigger('loading', 0, false);
			if (self.forceMoveForeward == true) {
				self.moveForwards();
			}
			
			self._trigger('feedItemsChanged');
		}
	});

}(jQuery));

(function($) {

	$.widget("ui.p8SimpleGrid", {
		options : {
			contentSelector : null,
			total : 8,
			totalInRow : 2
		},

		_create : function() {
			if (this.options.contentSelector == null)
				this.options.contentSelector = this.element.children();

			var self = this;
			var elem = this.element;

			elem.addClass('p8SimpleGrid').addClass('gridded-content').css({
				'z-index' : 2
			});

			var currentCol = 0;
			var currentRow = 0;
			var currentColE = null;
			self.options.contentSelector.each(function() {
				if (currentRow == 0) {
					currentColE = $('<div class="grid col col-' + currentCol + '">');
				}
				currentColE.append($(this));

				elem.append(currentColE);
				if (currentRow == self.options.totalInRow - 1) {
					currentCol++;
					currentRow = 0;
				} else {
					currentRow++;
				}
			});
		}
	});

}(jQuery));




(function($) {
	
	var feedLoaderFunction = function(element,data) {
		element.empty().append($(data).clone().show());
	};
	
	var navigationShowHideFunction = function(element, show) {
		if(show == true) {
			$(element).show(200);
		} else {
			$(element).hide(200);
		}
	};
	
	$.fn.p8GalleryCreator = function(poptions) {
		var options = jQuery.extend ({
				datas:						null,
				nextSelector:				null,
				previousSelector:			null,
				requestFunction:			null,
				feedLoaderFunction:			feedLoaderFunction,
				navigationShowHideFunction:	navigationShowHideFunction,
				loadingFunction:			null,
				moveForwards:				null,
				moveBackwards:				null
			},poptions);
		
		var updateNavigation = function() {
			if(options.nextSelector != null)
				options.navigationShowHideFunction(options.nextSelector, $(this).p8JsonGallery('canMoveForwards'));
			
			if(options.previousSelector != null)
				options.navigationShowHideFunction(options.previousSelector, $(this).p8JsonGallery('canMoveBackwards'));
		};
		
		if(options.datas instanceof jQuery) {
			options.datas = options.datas.toArray();
		}
		
		if(options.requestFunction == null) {
			options.requestFunction = function() {
				this._preProcessResponse();
				
				this.allFeeds = this.allFeeds.concat(options.datas);
				this.feedStreamEnd = true;
				this._postProcessResponse();
			};
		}
		
		
		return this.each (function () {
			var self = this;
			
			var moveForwards = function() {
				if($(self).p8JsonGallery('canMoveForwards'))
					$(self).p8JsonGallery('moveForwards');
			};
			
			var moveBackwards = function() {
				if($(self).p8JsonGallery('canMoveBackwards'))
					$(self).p8JsonGallery('moveBackwards');
			};
		
			navigationShowHideFunction(options.nextSelector, false);
			navigationShowHideFunction(options.previousSelector, false);
			options.nextSelector.bind('click',moveForwards);
			options.previousSelector.bind('click',moveBackwards);
			
			
			$(this).p8JsonGallery({
				moveForwards:function(){if(options.moveForwards != null){options.moveForwards.call(this);} updateNavigation.call(this);},
				moveBackwards:function(){if(options.moveForwards != null){options.moveBackwards.call(this);}updateNavigation.call(this);},
				feedLoaderFunction: options.feedLoaderFunction,
				requestFunction: options.requestFunction,
				loading: options.loadingFunction
			});
		
		
			$(this).p8JsonGallery('reload');
			
			return $(this);
		});
	};
	
})(jQuery);


$.extend({
	getUrlVars : function() {
		var vars = [], hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for ( var i = 0; i < hashes.length; i++) {
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	},
	getUrlVar : function(name) {
		return $.getUrlVars()[name];
	}
});

$.extend({
	scaleSize : function(maxW, maxH, currW, currH) {
		var ratio = currH / currW;
		var maxRatio = maxH / maxW;

		if (currW >= maxW && ratio <= maxRatio) {
			currW = maxW;
			currH = currW * ratio;
		} else if (currH >= maxH) {
			currH = maxH;
			currW = currH / ratio;
		}

		return [ currW, currH ];
	}
});
