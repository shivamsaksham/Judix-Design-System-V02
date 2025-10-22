import React, { useState } from 'react';

const daysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
};

const firstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
};

const ChevronLeft = () => (
    <img src="./arrow-left.svg" alt="" />);

const ChevronRight = () => (
    <img src="./arrow-left.svg" alt="" />);


// --- Main Calendar Component ---
const Calender = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth(); // 0-indexed (0 for January)

    const monthName = currentDate.toLocaleString('default', { month: 'long' });

    // --- Navigation Handlers ---
    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    // --- Calendar Grid Generation ---
    const renderCalendarGrid = () => {
        const days = [];
        const totalDaysInMonth = daysInMonth(year, month);
        const firstDay = firstDayOfMonth(year, month);

        // Add blank cells for the days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            // Each cell has a 'day-cell' and 'other-month-day' class for styling
            days.push(<div key={`empty-start-${i}`} className="day-cell other-month-day"></div>);
        }

        // Add cells for each day of the current month
        for (let day = 1; day <= totalDaysInMonth; day++) {
            const today = new Date();
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            
            // Add a specific 'today' class if the day is the current date
            const dayCellClasses = `day-cell ${isToday ? 'today' : ''}`;

            days.push(
                <div key={`day-${day}`} className={dayCellClasses}>
                    {/* The 'day-number' class is for styling the number itself */}
                    <span className="day-number">{day}</span>
                </div>
            );
        }

        // Fill the remaining grid cells to ensure a consistent 6-week layout
        const totalCells = 42; // 6 rows * 7 columns
        while (days.length < totalCells) {
             days.push(<div key={`empty-end-${days.length}`} className="day-cell other-month-day"></div>);
        }

        return days;
    };
    
    const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    return (
        <div className="bg-gray-100 flex items-center justify-center min-h-screen font-family-brandprimary p-4">
            {/* This code below has calender */}
            <div className="calendar-container bg-calendar-color-bg border rounded-calendar-border-radius-default border-calendar-color-card_stroke border-calendar-border-radius-default p-4  w-full max-w-md">
                
                {/* The header contains the navigation arrows and the month/year display.
                  Each element has its own class for individual styling.
                */}
                <div className="calendar-header flex items-center justify-between mb-4 p-[6.22px]">
                    {/* Left navigation arrow */}
                    <button onClick={handlePrevMonth} className="nav-button p-2 rounded-full hover:bg-neutral-100"> 
                        <img src="./arrow-left.svg" alt="" />
                    </button>
                    
                    {/* Month and Year Display */}
                    <h2 className="month-year-display text-lg font-semibold text-calendar-color-text-month text-size-body-default box-sizing mt-[3px] mb-[3px]" >
                        {monthName} {year}
                    </h2>

                    {/* Right navigation arrow */}
                    <button onClick={handleNextMonth} className="nav-button p-2 rounded-full hover:bg-neutral-100">
                        <img src="./arrow-right.svg" alt="" />
                    </button>
                </div>

                {/* Container for the days of the week (e.g., SUN, MON).
                  Each day name has a 'weekday-label' class.
                */}
                <div className="weekdays-grid grid grid-cols-7 gap-[3px] text-center text-calendar-color-text-day mb-[10px]">
                    {weekdays.map(day => (
                        <div key={day} className="weekday-label p-2 text-size-label-secondary">{day}</div>
                    ))}
                </div>

                {/* This is the main grid for the dates.
                  It's filled dynamically by the renderCalendarGrid function.
                */}
                <div className="calendar-grid grid grid-cols-7 gap-1 text-center">
                    {renderCalendarGrid()}
                </div>
            </div>
            
        </div>
    );
};

export default Calender;

