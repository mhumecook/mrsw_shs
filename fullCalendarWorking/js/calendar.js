
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
        eventClick: function (event) {
             //opens events in a popup window
            window.open(event.url, 'gcalevent', 'width=700,height=600');
            return false;
        },
        
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
            /* For the insert function*/
            var endTime = moment(event.start);
            myExtendedProperties = {};
            myExtendedProperties.private = {};
            myExtendedProperties.private.staff = [];
            myExtendedProperties.private.notes = [];
            myExtendedProperties.private.extraTasks = [];
            myExtendedProperties.private.confirmed = false;
            myExtendedProperties.private.completed = false;
            myExtendedProperties.private.paid = false;
            myExtendedProperties.private.jobCost = 0.00;
            
            
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
                "extendedProperties": myExtendedProperties
            };

            var request = gapi.client.calendar.events.insert({
                'calendarId': 'primary',
                'resource': resource
            });
            request.execute(function (resp) {
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
            request.execute(function (resp) {
            });
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
                },
                "extendedProperties": {
                    "private": {
                        "staff": ["nobody", "somebody"],
                        "confirmed": false,
                        "completed": false,
                        "paid": false,
                        "jobCost": 0.00,
                        "extraTasks": [],
                        "notes": []
                    },
                    "shared": {}
                }
            };
            var request = gapi.client.calendar.events.update({
                'calendarId': 'primary',
                'eventId': event.id,
                'resource': resource
            });
            request.execute(function (resp) {
                $('#calendar').fullCalendar('refetchEvents');
            });
        },
//        eventClick: function (calEvent, jsEvent, view) {
            // change the border color just for fun
//            $(this).css('border-color', 'red');
//        },
        
        eventRender: function(event, element, view) {
            // Set the display for the various event attributes
            
            //console.log(element.html());
            if(mhcEventIsConfirmed(event)) {
                element.find("div.fc-time").prepend("✔");
            }
            
            if (mhcEventHasStaff(event)) {
                element.find("div.fc-title").append("<img src='icons/head-icon.png' height='12' width='12' align='right'/>");
            }
            
            if (mhcEventIsComplete(event)) {
                element.addClass("fc-event-complete");
            }
            //I need to store the original event attributes
            //in the event that will be rendered, so as to use 
            //that information in the drop function 
            $(element).data('id', event.id);
            $(element).data('start', event.start);
            $(element).data('end', event.end);
            $(element).data('title', event.title);
            $(element).data('location', event.location);
            $(element).data('extendedProperties', event.extendedProperties);
            element.droppable({
                accept: ".fc-staff",
            drop: function (event, ui) {
                var furtherExtendedProperties = $(this).data("extendedProperties");
                if (furtherExtendedProperties == null) {
                    furtherExtendedProperties = {
                        "private": {
                            "staff": []
                        }
                    }
                }
                var staff = furtherExtendedProperties.private.staff;
                var droppedStaffName = ui.draggable.text();  
                
                if (staff == null) {
                    staff = [droppedStaffName];
                } else {
                    if (!mhcArrayContains(staff, droppedStaffName)) {
                    staff.push(droppedStaffName);
                }
                }
                
                var resource = {
                "summary": $(this).data("title"),
                "location": $(this).data("location"),
                "start": {
                    "dateTime": $(this).data("start"),
                    "timeZone": "Australia/Melbourne"
                },
                "end": {
                    "dateTime": $(this).data("end"),
                    "timeZone": "Australia/Melbourne"
                },
                "extendedProperties": furtherExtendedProperties
            };
                var request = gapi.client.calendar.events.update({
                'calendarId': 'primary',
                'eventId': $(this).data("id"),
                'resource': resource
            });
            request.execute(function (resp) {
                //$('#calendar').fullCalendar('refetchEvents');
            });
                
            }
            });
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