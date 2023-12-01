import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';

const localizer = momentLocalizer(moment);

const MyCalendar = (props) => {

    return (
    <div style={{ height: '500px' }}>
      <Calendar
        localizer={localizer}
        events={props.events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={(event) => console.log('Event selected:', event)}
      />
    </div>
  );
};

export default MyCalendar;
