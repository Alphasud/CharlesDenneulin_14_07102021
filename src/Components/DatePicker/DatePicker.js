import { useEffect, useState, useRef } from "react";
import './DatePicker.css';

let oneDay = 60 * 60 * 24 * 1000;
let todayTimestamp = Date.now() - (Date.now() % oneDay) + (new Date().getTimezoneOffset() * 1000 * 60);

/* 
    * Custom hook to manage display
*/
function useComponentVisible(initialIsVisible) {
  const [isComponentVisible, setIsComponentVisible] = useState(
    initialIsVisible
  );
  const ref = useRef(null);

  const handleHideDropdown = (event) => {
    if (event.key === "Escape") {
      setIsComponentVisible(false);
    }
  };

  const handleClickOutside = event => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsComponentVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleHideDropdown, true);
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("keydown", handleHideDropdown, true);
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  return { ref, isComponentVisible, setIsComponentVisible };
}
/* 
    * Date Picker component
*/
function DatePicker(props) {

    let inputRef = useRef(null);
    const daysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthMap = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    /* 
    * Functions used to display calendar 
    */

    const getDayDetails = (args) => {
        let date = args.index - args.firstDay; 
        let day = args.index%7;
        let prevMonth = args.month-1;
        let prevYear = args.year;
        if(prevMonth < 0) {
            prevMonth = 11;
            prevYear--;
        }
        let prevMonthNumberOfDays = getNumberOfDays(prevYear, prevMonth);
        let _date = (date < 0 ? prevMonthNumberOfDays+date : date % args.numberOfDays) + 1;
        let month = date < 0 ? -1 : date >= args.numberOfDays ? 1 : 0;
        let timestamp = new Date(args.year, args.month, _date).getTime();
        return {
            date: _date,
            day,
            month, 
            timestamp,
            dayString: daysMap[day]
        }
    }

    const getNumberOfDays = (year, month) => {
        return 40 - new Date(year, month, 40).getDate();
    }

    const getMonthDetails = (year, month) => {
        let firstDay = (new Date(year, month)).getDay();
        let numberOfDays = getNumberOfDays(year, month);
        let monthArray = [];
        let rows = 6;
        let currentDay = null;
        let index = 0; 
        let cols = 7;

        for(let row=0; row<rows; row++) {
            for(let col=0; col<cols; col++) { 
                currentDay = getDayDetails({
                    index,
                    numberOfDays,
                    firstDay,
                    year,
                    month
                });
                monthArray.push(currentDay);
                index++;
            }
        }
        return monthArray;
    }

    const isCurrentDay = (day) => {
        return day.timestamp === todayTimestamp;
    }

    const isSelectedDay = (day) => {
        return day.timestamp === selectedDay;
    }

    const getMonthStr = (month) => monthMap[Math.max(Math.min(11, month), 0)] || 'Month';

    /* State */
    const [date, setDate] = useState(new Date());
    const [year, setYear] = useState(date.getFullYear());
    const [month, setMonth] = useState(date.getMonth());
    const [selectedDay, setSelectedDay] = useState(todayTimestamp);
    const [monthDetails, setMonthDetails] = useState(getMonthDetails(year, month));
    const {
    ref,
    isComponentVisible,
    setIsComponentVisible
    } = useComponentVisible(false);
    
    /* 
    * User updates inside the calendar 
    */

    const onDateClick = (day) =>  {
        setSelectedDay(day.timestamp);
        setDate(new Date(day.timestamp));
        let dateString = new Date(day.timestamp).toLocaleDateString();
        inputRef.current.value = dateString;
        setIsComponentVisible(false);
     }

    const setNewYear = (offset) => {
        let nyear = year + offset;
        let nmonth = month;
        setYear(nyear);
        setMonthDetails(getMonthDetails(nyear, nmonth))
    }

    const setNewMonth = (offset) => {
        let nyear = year;
        let nmonth = month + offset;
        if(nmonth === -1) {
            nmonth = 11;
            nyear--;
        } else if(nmonth === 12) {
            nmonth = 0;
            nyear++;
        }
        setYear(nyear);
        setMonth(nmonth);
        setMonthDetails(getMonthDetails(nyear, nmonth))
    }

    /* 
    * Calendar rendering 
    */
    function renderCalendar() {
        let days = monthDetails.map((day, index)=> {
            return (
                <div className={'calendar-day-container ' + (day.month !== 0 ? ' disabled' : '') + 
                    (isCurrentDay(day) ? ' highlight' : '') + (isSelectedDay(day) ? ' highlight-green' : '')} key={index}>
                    <div className='calendar-day-container__day'>
                        <span onClick={() => {onDateClick(day)}}>
                            {day.date}
                        </span>
                    </div>
                </div>
            )
        })

        return (
            <div className='calendar__container'>
                <div className='calendar__container__head'>
                    {weekdays.map((day,index)=><div key={index} className='calendar__container__name'>{day}</div>)}
                </div>
                <div className='calendar__container__body'>
                    {days}
                </div>
            </div>
        )
    }

    const handleChange = (data) => {
        props.handleResponse(data)
    }

    return (
        <div className='datepicker'>
                <div ref={ref} onClick = {() => setIsComponentVisible(true)}>
                <input className='datepicker__input' type='text' value={date.toLocaleDateString()} readOnly onChange={handleChange(date)} ref={inputRef}/>
                </div>
                {isComponentVisible ? (
                <div ref={ref} className='datepicker__container'>
                    <div className='datepicker__header'>
                            <div className='datepicker__header__button'>
                                <div className='datepicker__header__button__inner' onClick={()=> setNewYear(-10)}>
                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-circle-left" className="svg-inline--fa fa-chevron-circle-left fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 504C119 504 8 393 8 256S119 8 256 8s248 111 248 248-111 248-248 248zM142.1 273l135.5 135.5c9.4 9.4 24.6 9.4 33.9 0l17-17c9.4-9.4 9.4-24.6 0-33.9L226.9 256l101.6-101.6c9.4-9.4 9.4-24.6 0-33.9l-17-17c-9.4-9.4-24.6-9.4-33.9 0L142.1 239c-9.4 9.4-9.4 24.6 0 34z"></path></svg>
                                </div>
                            </div>
                            <div className='datepicker__header__button'>
                                <div className='datepicker__header__button__inner' onClick={()=> setNewYear(-1)}>
                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-double-left" className="svg-inline--fa fa-angle-double-left fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M223.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L319.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L393.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34zm-192 34l136 136c9.4 9.4 24.6 9.4 33.9 0l22.6-22.6c9.4-9.4 9.4-24.6 0-33.9L127.9 256l96.4-96.4c9.4-9.4 9.4-24.6 0-33.9L201.7 103c-9.4-9.4-24.6-9.4-33.9 0l-136 136c-9.5 9.4-9.5 24.6-.1 34z"></path></svg>
                                </div>
                            </div>
                            <div className='datepicker__header__button'>
                                <div className='datepicker__header__button__inner' onClick={()=> setNewMonth(-1)}>
                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-left" className="svg-inline--fa fa-angle-left fa-w-8" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path fill="currentColor" d="M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z"></path></svg>
                                </div>
                            </div>
                            <div className='datepicker__header__container'>
                                <div className='datepicker__header__container__year'>{year}</div>
                                <div className='datepicker__header__container__month'>{getMonthStr(month)}</div>
                            </div>
                            <div className='datepicker__header__button'>
                                <div className='datepicker__header__button__inner' onClick={()=> setNewMonth(1)}>
                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-right" className="svg-inline--fa fa-angle-right fa-w-8" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path fill="currentColor" d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"></path></svg>
                                </div>
                            </div>
                            <div className='datepicker__header__button' onClick={()=> setNewYear(1)}>
                                <div className='datepicker__header__button__inner'>
                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-double-right" className="svg-inline--fa fa-angle-double-right fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34zm192-34l-136-136c-9.4-9.4-24.6-9.4-33.9 0l-22.6 22.6c-9.4 9.4-9.4 24.6 0 33.9l96.4 96.4-96.4 96.4c-9.4 9.4-9.4 24.6 0 33.9l22.6 22.6c9.4 9.4 24.6 9.4 33.9 0l136-136c9.4-9.2 9.4-24.4 0-33.8z"></path></svg>
                                </div>
                            </div>
                            <div className='datepicker__header__button' onClick={()=> setNewYear(10)}>
                                <div className='datepicker__header__button__inner'>
                                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-circle-right" className="svg-inline--fa fa-chevron-circle-right fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8c137 0 248 111 248 248S393 504 256 504 8 393 8 256 119 8 256 8zm113.9 231L234.4 103.5c-9.4-9.4-24.6-9.4-33.9 0l-17 17c-9.4 9.4-9.4 24.6 0 33.9L285.1 256 183.5 357.6c-9.4 9.4-9.4 24.6 0 33.9l17 17c9.4 9.4 24.6 9.4 33.9 0L369.9 273c9.4-9.4 9.4-24.6 0-34z"></path></svg>
                                </div>
                            </div>
                        </div>
                        <div className='datepicker__body'>
                            {renderCalendar()}
                        </div>
                </div>
                ) : ''}
            </div>
    );
}

export default DatePicker;
