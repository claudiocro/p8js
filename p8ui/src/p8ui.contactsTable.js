(function($) {

function contactsTableMatches(regex, data) {
	return(regex.test(data.name) || regex.test(data.email));
}


/*
 * WIDGET
 * CONTACTS TABLE
 * 
 */
	
$.widget("ui.contactsTable", {
	options: {
		displayFirst: 200,
		displayAddition: 50
	},
	_create: function() {
		var self = this;
		var elem =this.element;
		//$(".p8-scroll", this.element).jScrollPane({showArrows:false,animateStep:125,hideFocus:true});
		elem.click(function(e) {
			elem.find('.ui-state-highlight').removeClass('ui-state-highlight');
			
			var target = $(e.target);
			var clicked = target 
			if(!target.hasClass('person-list-cont'))
				clicked = target.parents('.person-list-cont');	
			
			if(clicked.hasClass('loadMore')) {
				self.showNext();
				self.updateScrollpane();
			} else {
				clicked.addClass('ui-state-highlight');
				self._trigger('-uuid-select', 0, clicked.parent().attr('id').substring(8));
			}
			
	   		return false;
		});
		
		$('li', elem).live('mouseover mouseout', function(event){
				if (event.type == 'mouseover') {
		   			$(this).children(':first').addClass('ui-state-hover');
		   		} else {
		   			$(this).children(':first').removeClass('ui-state-hover');
				}
			}
	   	);
		
		elem.data('contactsTable-filter', false);
		elem.data('contactsTable-data', new Array());
		elem.data('contactsTable-dataDisplay', new Array());
		
		this.loadMore = '<li id="contactsTableLoadMore" class="person-list">'+
			'<div class="person-list-cont loadMore">'+
			'<div>'+'loadMore'+'</div>'
			'</div>'+
		'</li>';
	},
	appendContactToList: function(contacts) {
		var data = this.element.data('contactsTable-data');
		var dataDisplay = this.element.data('contactsTable-dataDisplay');
		var filter = this.element.data('contactsTable-filter');
		var filterIndex = this.element.data('contactsTable-filterIndex');
		
		var rows = new Array();
		var regex = null;
		
		if(filter != false)
			regex = new RegExp("\\b"+text, 'gi');
		
		for ( var i=0, len=contacts.length; i<len; i++ ){
			
			var names = $.getContactInfoByGroup('NAME', contacts[i]['contactInfo']);
			var name = '';
			if(names.length > 0) {
				name = names[0]['value'];
		    }
		    
		    var emails = $.getContactInfoByGroup('EMAIL', contacts[i]['contactInfo']);
			var email = '';
			if(emails.length > 0) {
				email = emails[0]['value'];
		    }
			
			var contact = {uuid:contacts[i]['uuid'], name:name, email:email, hasProfileImage:contacts[i]['hasProfileImage']};
			data.push(contact);
			
			if(dataDisplay.length < this.options.displayFirst) {
				if(regex == null || contactsTableMatches(regex, contact)) {
					dataDisplay.push(contact);
					if(filterIndex !== undefined)
						filterIndex.push(data.length-1);
					rows.push(this._createContactRow(contact.uuid, contact.name, contact.email, contacts.hasProfileImage));
				}
			}
		}
		
		this.element.data('contactsTable-data',data);
		this.element.data('contactsTable-dataDisplay',dataDisplay);
		
		this.element.find('#contactsTableLoadMore').remove();
		if(dataDisplay.length < data.length) {
			rows.push(this.loadMore);
		}
		
			
		
		this.element.html(this.element.html()+rows.join(" "));
	},
	showNext: function() {
		var data = this.element.data('contactsTable-data');
		var dataDisplay = this.element.data('contactsTable-dataDisplay');
		var filterIndex = this.element.data('contactsTable-filterIndex');
		
		var rows = new Array();
		var lastDisplayCount = dataDisplay.length;
		
		if(filterIndex === undefined) {
			var idx = lastDisplayCount-1;
			var cnt = 0;
			while(++idx < data.length && cnt < this.options.displayAddition) {
				cnt++;
				dataDisplay.push(data[idx]);
				rows.push(this._createContactRow(data[idx].uuid, data[idx].name, data[idx].email, data[idx].hasProfileImage));
			}
		}
		else {
			var idx = lastDisplayCount-1;
			var cnt = 0;
			while(++idx < filterIndex.length && cnt < this.options.displayAddition) {
				cnt++;
				dataDisplay.push(data[filterIndex[idx]]);
				rows.push(this._createContactRow(data[filterIndex[idx]].uuid, data[filterIndex[idx]].name, data[filterIndex[idx]].email));
			}
		}
		
		
		this.element.data('contactsTable-dataDisplay',dataDisplay);
		
		this.element.find('#contactsTableLoadMore').remove();
		if((filterIndex === undefined && dataDisplay.length < data.length) ||
			(filterIndex !== undefined && dataDisplay.length < filterIndex.length)) {
			rows.push(this.loadMore);
		}
		
		this.element.html(this.element.html()+rows.join(" "));

	},
	filter: function(text) {
		if(text == "" || text === undefined)
			this.clearFilter();
		
		var elem = this.element;
		var regex = new RegExp("\\b"+text, 'gi');
		
		elem.data('contactsTable-filter', text);
		
		var data = this.element.data('contactsTable-data');
		var dataDisplay = this.element.data('contactsTable-dataDisplay');
		
		var filterIndex = data.filterIndex(function(val, id, ref) {
			regex.lastIndex = 0;
			return contactsTableMatches(regex, val);
		});
		this.element.data('contactsTable-filterIndex',filterIndex);
		
		
		dataDisplay = [];
		var rows = new Array();
		for ( var i=0; i<filterIndex.length && dataDisplay.length<this.options.displayFirst; i++ ) {
			dataDisplay.push(data[filterIndex[i]]);
			rows.push(this._createContactRow(data[filterIndex[i]].uuid, data[filterIndex[i]].name, data[filterIndex[i]].email));
		}
		this.element.data('contactsTable-dataDisplay',dataDisplay);
		
		if(dataDisplay.length < filterIndex.length)
			rows.push(this.loadMore);
		
		this.element.html(rows.join(" "));
	},
	clearFilter: function() {
		var elem = this.element;
		var data = this.element.data('contactsTable-data');
		var dataDisplay = this.element.data('contactsTable-dataDisplay');
		
		elem.data('contactsTable-filterIndex',undefined);
		elem.data('contactsTable-filter', false);
		
		dataDisplay = [];
		var rows = new Array();
		for ( var i=0; i<data.length && i<=this.options.displayFirst-1; i++ ) {
			dataDisplay.push(data[i]);
			rows.push(this._createContactRow(data[i].uuid, data[i].name, data[i].email));
		}
		
		this.element.data('contactsTable-dataDisplay',dataDisplay);
		
		if(dataDisplay.length < data.length)
			rows.push(this.loadMore);
		
		this.element.hide();
		this.element.html(rows.join(" "));
		this.element.show();
	},
	accountsDisplay: function(accounts) {
		
	},
	updateScrollpane: function() {
		var jspApi = this.element.parents('.p8-scroll').filter(':first').data('jsp');
		if(jspApi != null)
			jspApi.reinitialise();
	},
	_createContactRow: function(uuid, firstLine, secondLine, hasProfileImage) {
		var personImg;
		if(hasProfileImage)
			personImg = '<img class="person-list-image" border="0" width="48" height="48" src="'+'profile/'+uuid+'.png"/>';
		else
			personImg = '<img class="person-list-image" border="0" width="48" height="48" src="res/images/contact-noimage.png"/>';
		
		var optionCnt = '<div class="person-list-option"><div class="person-list-option-opt"></div></div>';
		var firstLineCnt = '<div class="person-list-first">'+firstLine+'</div>';
		var secondLineCnt = '<div class="person-list-second">'+secondLine+'</div>';
		
		return '<li id="contact-'+uuid+'" class="person-list">'+
					'<div class="person-list-cont"><div class="person-list-innercont">'+
					personImg+
					optionCnt+
					firstLineCnt+
					secondLineCnt+
					'</div></div>'+
				'</li>';
	}
});
	
}(jQuery));