
$(document).ready(function () {


    /* initialize the external events
     -----------------------------------------------------------------*/

    $('#external-events .fc-event').each(function () {
        // store data so the calendar knows to render an event upon drop
        $(this).data('event', {
            title: $.trim($(this).text()), // use the element's text as the event title
            stick: true, // maintain when user navigates (see docs on the renderEvent method)
            appointmentAddress: this.dataset.address, //I really hope I'm taking the "data-event" stuff out of the html here
            jobName: this.dataset.eventTitle,
            customerName: this.dataset.name
        });

        // make the event draggable using jQuery UI
        $(this).draggable({
            zIndex: 999,
            revert: true, // will cause the event to go back to its
            revertDuration: 0, //  original position after the drag
            helper: "clone"
        });
//        $(this).droppable({
//            accept: ".fc-staff",
//            drop: function (event, ui) {
//                alert('Dropped.  Bang!');
//            }
//
//        });
    });
        
    $("#calendar .fc-event").each(function () {
            $(this).droppable({
            accept: ".fc-staff",
            drop: function (event, ui) {
                console.log(event);
                alert('Dropped.  Bang!');
            }
        });
    });

    $('#staff-list .fc-staff').each(function () {
        //$('#staff-list').each(function () {

        // store data so the calendar knows to render an event upon drop
        $(this).data('event', {
            title: $.trim($(this).text()), // use the element's text as the event title
            stick: true // maintain when user navigates (see docs on the renderEvent method)
        });

        // make the event draggable using jQuery UI
        $(this).draggable({
            zIndex: 100,
            cursor: "select",
            revert: true, // will cause the event to go back to its
            revertDuration: 0, //  original position after the drag
            helper: "clone"//,
            //containment: ".gcal-event"
        });

    });


    /* initialize the calendar
     -----------------------------------------------------------------*/

    $('#calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month agendaWeek agendaDay'
        },
        googleCalendarApiKey: "AIzaSyBkvmnEgj1wx-fOlmafvV_hu28RGnA06IA",
        //events: 'mhumecook@gmail.com',
        events: {
            googleCalendarId: 'mhumecook@gmail.com',
            className: 'gcal-event', // an option!
            editable: true //,
            //color: 'yellow',
            //textColor: 'black'
        },
        //eventClick: function (event) {
            // opens events in a popup window
            ///window.open(event.url, 'gcalevent', 'width=700,height=600');
            //return false;
        //},
        minTime: "07:00",
        maxTime: "22:00",
        defaultTimedEventDuration: "01:00:00",
        editable: true,
        defaultView: 'agendaWeek',
        columnFormat: {
            month: 'ddd',
            week: 'ddd D/M',
            day: 'dddd D/M'
        },
        selectable: true,
        selectHelper: true,
        timezone: 'local',
        droppable: true, // this allows things to be dropped onto the calendar
        //dropAccept: '.fc-event,.fc-staff',
        dropAccept: '.fc-event',
        drop: function (date, jsEvent, ui) {
            $('#calendar').fullCalendar('unselect');
        },
        eventReceive: function (event) {
            $('#calendar').fullCalendar('addEvent', event, true);
//            console.log("Event received:");
//            console.log('Location is: ' + event.appointmentAddress);
//            console.log('Job name is: ' + event.jobName);
//            console.log('Customer name is: ' + event.customerName);
            /* For the insert function*/
            var endTime = moment(event.start);
            endTime.add(1, 'hours');
            var resource = {
                "summary": event.jobName,
                "location": event.appointmentAddress,
                "start": {
                    "dateTime": event.start,
                    "timeZone": "Australia/Melbourne"
                },
                "end": {
                    "dateTime": endTime,
                    "timeZone": "Australia/Melbourne"
                },
            };
//            console.log('Event is received: ');
//            console.log(this);

            var request = gapi.client.calendar.events.insert({
                'calendarId': 'primary',
                'resource': resource
            });
            request.execute(function (resp) {
//                console.log('Response to insert:');
//                console.log(resp);
//                console.log(resp.id);
            });
            /* End of insert function */

        },
        eventResize: function (event, delta, revertFunc) {

            var resource = {
                "summary": event.title,
                "location": event.location,
                "start": {
                    "dateTime": event.start,
                    "timeZone": "Australia/Melbourne"
                },
                "end": {
                    "dateTime": event.end,
                    "timeZone": "Australia/Melbourne"
                }
            };
            var request = gapi.client.calendar.events.update({
                'calendarId': 'primary',
                'eventId': event.id,
                'resource': resource
            });
//            request.execute(function (resp) {
//                console.log('Response to update:');
//                console.log(resp);
//                console.log(resp.id);
//            });


        },
        eventDrop: function (event, delta, revertFunc) {

            var resource = {
                "summary": event.title + ' changed by move',
                "location": event.location,
                "start": {
                    "dateTime": event.start,
                    "timeZone": "Australia/Melbourne"
                },
                "end": {
                    "dateTime": event.end,
                    "timeZone": "Australia/Melbourne"
                }
            };
            var request = gapi.client.calendar.events.update({
                'calendarId': 'primary',
                'eventId': event.id,
                'resource': resource
            });
            request.execute(function (resp) {
//                console.log('Response to move:');
//                console.log(resp);
//                console.log(resp.id);
                $('#calendar').fullCalendar('refetchEvents');
            });
        },
        eventClick: function (calEvent, jsEvent, view) {

            alert('Event: ' + calEvent.title);
            //alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
            //alert('View: ' + view.name);
            console.log(this.parentNode);
            console.log(this.parentNode.parentNode);
            console.log($('#calendar'));
            alert(this);

            // change the border color just for fun
            $(this).css('border-color', 'red');

        },
        
        eventRender: function(event, element, view) {
            console.log(event);
            element.droppable({
                accept: ".fc-staff",
            drop: function (event, ui) {
                console.log(event);
                alert('Dropped.  Bang!');
            }
            })
        }

    });

    function dump(obj) {
        var out = '';
        for (var i in obj) {
            out += i + ": " + obj[i] + "\n";
        }

        alert(out);

        // or, if you wanted to avoid alerts...

        var pre = document.createElement('pre');
        pre.innerHTML = out;
        document.body.appendChild(pre);
    }
});