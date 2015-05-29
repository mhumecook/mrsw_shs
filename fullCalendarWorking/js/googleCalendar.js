$(document).ready(function() {
	
		$('#calendar').fullCalendar({
			googleCalendarApiKey: 'AIzaSyBkvmnEgj1wx-fOlmafvV_hu28RGnA06IA',
		
			events: 'mhumecook@gmail.com',
			
			eventClick: function(event) {
				// opens events in a popup window
				window.open(event.url, 'gcalevent', 'width=700,height=600');
				return false;
			},
			
			loading: function(bool) {
				$('#loading').toggle(bool);
			}
			
		});
		
	});