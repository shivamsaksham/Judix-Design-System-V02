import React, { useState } from 'react';

const daysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
};

const firstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
};

// --- Main Calendar Component ---
const Calender = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    // --- New state for selected date ---
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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

    // --- New click handler for day selection ---
    const handleDayClick = (date: Date) => {
        setSelectedDate(date);
    };

    // Get today's date components once for efficiency
    const today = new Date();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    // --- Calendar Grid Generation ---
    const renderCalendarGrid = () => {
        const days = [];
        const totalDaysInMonth = daysInMonth(year, month);
        const firstDay = firstDayOfMonth(year, month);

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-start-${i}`} className="day-cell other-month-day w-8 h-8 p-[3.11px]"></div>);
        }

        // Add cells for each day of the current month
        for (let day = 1; day <= totalDaysInMonth; day++) {
            const fullDayDate = new Date(year, month, day);

            // Check if this day is 'today'
            const isToday = day === todayDate && month === todayMonth && year === todayYear;
            
            // Check if this day is 'selected'
            const isSelected = selectedDate &&
                day === selectedDate.getDate() &&
                month === selectedDate.getMonth() &&
                year === selectedDate.getFullYear();

            const dayCellClasses = `
                day-cell rounded-full cursor-pointer
                flex items-center justify-center  
                w-8 h-8 p-[3.11px] 
                ${isSelected
                    ? 'bg-calendar-color-selected' // Selected style
                    : isToday
                        ? 'today bg-neutral-200' // Today's date style
                        : 'hover:bg-calendar-color-hover' // Default hover
                }
            `;
            
            const dayNumberClasses = `
                day-number calendar-font-date
                ${isSelected
                    ? 'text-calendar-color-text-selected_date' // Selected text color
                    : 'text-calendar-color-text-date' // Default text color
                }
            `;

            days.push(
                <div 
                    key={`day-${day}`} 
                    className={dayCellClasses}
                    onClick={() => handleDayClick(fullDayDate)}
                >
                    <span className={dayNumberClasses}>{day}</span>
                </div>
            );
        }

        // --- (THIS IS THE STABLE LOGIC) ---
        // Always render 42 cells (6 rows) to ensure a stable height
        const totalCells = 42; 
        while (days.length < totalCells) {
             days.push(<div key={`empty-end-${days.length}`} className="day-cell other-month-day w-8 h-8 p-[3.11px]"></div>);
        }

        return days;
    };
    
    const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    return (
        <div className="calendar-container bg-calendar-color-bg border rounded-calendar-border-radius-default border-calendar-color-card_stroke border-calendar-border-radius-default p-4  w-full min-w-[304px] max-w-[352px] font-family-brandprimary">
            
            {/* Header with navigation and month/year */}
            <div className="calendar-header flex items-center justify-between mb-4 p-[6.22px] min-w-[272px] max-w-[350px] min-h-[24px] max-h-[40px]">
                <button onClick={handlePrevMonth} className="nav-button p-2 rounded-full hover:bg-neutral-100 cursor-pointer"> 
                    <img src="./arrow-left.svg" alt="Previous Month" />
                </button>
                
                <h2 className="month-year-display calendar-font-month text-calendar-color-text-month box-sizing mt-[3px] mb-[3px] text-center" >
                    {monthName} {year}
                </h2>

                <button onClick={handleNextMonth} className="nav-button p-2 rounded-full hover:bg-neutral-100 cursor-pointer">
                    <img src="./arrow-right.svg" alt="Next Month" />
                </button>
            </div>

            <div className="calendar-grid grid grid-cols-7 gap-x-[3px] gap-y-[10px] text-center min-w-[272px] max-w-[352px] justify-items-center">
                
                {/* Weekday labels */}
                {weekdays.map(day => (
                    <div key={day} className="weekday-label p-2 calendar-font-day text-calendar-color-text-day text-center">
                        {day}
                    </div>
                ))}

                {/* The date cells (now *always* 42 cells) */}
                {renderCalendarGrid()}
            </div>
        </div>
    );
};

export default Calender;