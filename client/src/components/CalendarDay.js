import React from 'react';
import './CalendarDay.scss';
import CalendarEvent from './CalendarEvent';
import { getFormattedTime } from '../functions/util';

class CalendarDay extends React.Component {
    constructor(props) {
        super(props);
        this.state = { events: null };
    }

    componentDidMount() {
        var events = [];
        this.props.events.forEach((e) => {
            events.push(
                <CalendarEvent
                    type={e.type}
                    time={getFormattedTime(e)}
                    club={e.club}
                    name={e.name}
                    key={e.objId}
                    // onClick={() => {
                    //     this.popup.current.activate(e.objId);
                    // }}
                ></CalendarEvent>
            );
        });
        this.setState({ events });
    }

    render() {
        return (
            <div className="CalendarDay">
                <div className="day">{this.props.day}</div>
                <div className="calendar-event">{this.state.events}</div>
            </div>
        );
    }
}

export default CalendarDay;
