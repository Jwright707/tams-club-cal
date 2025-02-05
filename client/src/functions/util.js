import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import { EventInfo } from './entries';
import store from '../redux/store';
import { getSavedVolunteeringList } from '../redux/selectors';
import { getVolunteering } from '../functions/api';
import { setVolunteeringList } from '../redux/actions';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isLeapYear);

/**
 * Gets query parameters
 * @returns {string | null} The value of the query parameter or null if missing
 */
function getParams(query) {
    return new URLSearchParams(window.location.search).get(query);
}

/**
 * Parses a time using dayjs and returns the seconds in milliseconds.
 * See the docs for dayjs: https://day.js.org/docs/en/timezone/timezone
 *
 * @param {string} input String time input for dayjs to parse
 * @param {string} tz Tz database time zone (https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)
 * @returns {number} Milliseconds since Jan 1, 1970 [UTC time]
 */
function parseTimeZone(input, tz) {
    return dayjs.tz(input, tz).valueOf();
}

/**
 * Offsets a millisecond UTC to a dayjs object in the correct timezone
 * See the docs for dayjs: https://day.js.org/docs/en/timezone/timezone
 *
 * @param {string} millis UTC millisecond time
 * @param {string} [tz] Tz database time zone; If left blank, the timezone will be guessed
 * @returns {dayjs.Dayjs} Dayjs object with the correct timezone
 */
function convertToTimeZone(millis, tz) {
    if (tz == undefined) {
        var tz = dayjs.tz.guess();
    }
    return dayjs(Number(millis)).tz(tz);
}

/**
 * Takes a list of sorted events and injects date seperators
 *
 * @param {EventInfo[]} eventList List of events, with an extra dayjs object defined
 */
function divideByDate(eventList) {
    var currDay = '';
    for (var i = 0; i < eventList.length; i++) {
        var day = eventList[i].startDayjs.format('YYYY-MM-DD');
        if (currDay != day) {
            currDay = day;
            eventList.splice(i, 0, {
                isDate: true,
                day,
            });
            i++;
        }
    }
}

/**
 * Converts a date to a readable date section label
 *
 * @param {string} date Date passed in formatted as YYYY-MM-DD
 * @return {string} Readable date section label
 */
function createDateHeader(date) {
    return dayjs(date).format('dddd M/D/YY');
}

/**
 * Gets the starting and ending time display for an event
 *
 * @param {EventInfo} event The event object
 * @return {string} The formatted starting and ending time
 */
function getFormattedTime(event) {
    var formattedDate = event.startDayjs.format('h:mma');
    if (event.type === 'event') return formattedDate + event.endDayjs.format(' - h:mma');
    return formattedDate;
}

function getFormattedDate(event) {
    return event.startDayjs.format('dddd · MMMM D, YYYY');
}

/**
 * Adds dayjs objects an event object
 * @param {EventInfo} event An event object
 */
function addDayjsElement(e) {
    // TODO: Add place to change time zone
    e.startDayjs = convertToTimeZone(e.start, 'America/Chicago');
    if (e.type === 'event') e.endDayjs = convertToTimeZone(e.end, 'America/Chicago');
}

/**
 * Returns a jsx array of filters
 * @param {object} filters List of filters
 * @param {boolean} filters.limited Limited slots
 * @param {boolean} filters.semester Limited slots
 * @param {boolean} filters.setTimes Limited slots
 * @param {boolean} filters.weekly Weekly signups (with time)
 * @param {string} [signupTime] Time that signup will go up, only needed if weekly is true
 * @returns {JSX.IntrinsicElements[]} jsx array
 */
function formatVolunteeringFilters(filters, signupTime) {
    var filterObjects = [];
    if (filters.limited)
        filterObjects.push(
            <div key="0" className="filter f-limited">
                Limited Slots
            </div>
        );
    if (filters.semester)
        filterObjects.push(
            <div key="1" className="filter f-semester">
                Semester Long Commitment
            </div>
        );
    if (filters.setTimes)
        filterObjects.push(
            <div key="2" className="filter f-set-times">
                Set Volunteering Times
            </div>
        );
    if (filters.weekly)
        filterObjects.push(
            <div key="3" className="filter f-weekly">
                Weekly Signups [{signupTime}]
            </div>
        );
    return filterObjects;
}

function getMonthAndYear() {
    return dayjs().format('MMMM YYYY');
}

function calendarDays(currMonth = undefined) {
    const date = dayjs(currMonth).date(1);
    const calendar = [];
    for (let i = 1; i <= date.daysInMonth(); i++) calendar.push(i);
    const previous = [];
    for (let i = date.day(), j = date.subtract(1, 'month').daysInMonth(); i > 0; i--) previous.unshift(j--);
    const after = [];
    for (let i = date.date(date.daysInMonth()).day() + 1, j = 1; i < 7; i++) after.push(j++);
    return { calendar, previous, after, date: date.subtract(1, 'month') };
}

function daysOfWeek() {
    const date = dayjs().day(0);
    const header = [];
    for (let i = 0; i < 7; i++) header.push(date.add(i, 'day').format('ddd'));
    return header;
}

/**
 * Gets volunteering list from store or if null,
 * fetches it and stores it in the store
 * @returns {Promise<Volunteering[]>} List of volunteering events
 */
async function getOrFetchVolList() {
    var volList = getSavedVolunteeringList(store.getState());
    if (volList === null) {
        volList = await getVolunteering();
        store.dispatch(setVolunteeringList(volList));
    }
    return volList;
}

export {
    getParams,
    parseTimeZone,
    convertToTimeZone,
    divideByDate,
    createDateHeader,
    getFormattedTime,
    getFormattedDate,
    addDayjsElement,
    formatVolunteeringFilters,
    getMonthAndYear,
    calendarDays,
    daysOfWeek,
    getOrFetchVolList,
};
