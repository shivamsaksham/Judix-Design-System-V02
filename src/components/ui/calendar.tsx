"use client"
import React, { useState, useRef, useEffect } from 'react'; // <-- 1. IMPORT useRef, useEffect
import { motion, AnimatePresence } from 'framer-motion';

const daysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
};

const firstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
};

interface CalendarProps {
    onDateSelected: Date | null;
    onDateChange: (date: Date) => void;
    initialDisplayDate?: Date;
}

// --- Main Calendar Component ---
const Calender = ({ onDateSelected, onDateChange, initialDisplayDate }: CalendarProps) => {
    
    const [currentDate, setCurrentDate] = useState(initialDisplayDate || onDateSelected || new Date());
    
    const [viewMode, setViewMode] = useState<'calendar' | 'year'>('calendar');
    const [yearRangeStart, setYearRangeStart] = useState(2001);

    // --- 2. ADD STATE AND REF FOR HEIGHT ---
    const calendarGridRef = useRef<HTMLDivElement>(null);
    const [gridHeight, setGridHeight] = useState<number | null>(null);
    // ---

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

    // --- Click handler for day selection ---
    const handleDayClick = (date: Date) => {
        onDateChange(date); 
    };

    // --- Year Picker Handlers ---
    const handleYearClick = () => {
        const currentYear = currentDate.getFullYear();
        setYearRangeStart(currentYear - 12);
        setViewMode('year');
    };

    const handleYearSelect = (selectedYear: number) => {
        setCurrentDate(new Date(selectedYear, month, 1));
        setViewMode('calendar');
    };

    const handlePrevYearRange = () => {
        const newStart = yearRangeStart - 25;
        if (newStart >= 1950) {
            setYearRangeStart(newStart);
        } else {
            setYearRangeStart(1950);
        }
    };

    // Get today's date components once for efficiency
    const today = new Date();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();
    
    const handleNextYearRange = () => {
        const newStart = yearRangeStart + 25;
        const maxYear = todayYear;
        if (newStart <= maxYear) {
            setYearRangeStart(newStart);
        }
    };

    // --- 3. ADD EFFECT TO MEASURE HEIGHT ---
    useEffect(() => {
        if (viewMode === 'calendar' && calendarGridRef.current) {
            if (!gridHeight) {
                setGridHeight(calendarGridRef.current.offsetHeight);
            }
        }
    }, [viewMode, gridHeight]);


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

            const isSelected = onDateSelected &&
                day === onDateSelected.getDate() &&
                month === onDateSelected.getMonth() &&
                year === onDateSelected.getFullYear();

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

        const totalCells = 42;
        while (days.length < totalCells) {
            days.push(<div key={`empty-end-${days.length}`} className="day-cell other-month-day w-8 h-8 p-[3.11px]"></div>);
        }

        return days;
    };

    // --- Year Grid Generation ---
    const renderYearGrid = () => {
        const years = [];
        const maxYear = todayYear;
        const minYear = 1950;
        
        // Generate 25 years (5 rows × 5 columns) like in the image
        for (let i = 0; i < 25; i++) {
            const yearValue = yearRangeStart + i;
            
            // Only render years between 1950 and current year
            if (yearValue >= minYear && yearValue <= maxYear) {
                const isCurrentYear = yearValue === todayYear;
                const isSelectedYear = yearValue === year;

                const yearCellClasses = `
                    year-cell rounded-lg cursor-pointer
                    flex items-center justify-center
                    p-3 min-w-[48px] min-h-[40px]
                    ${isSelectedYear
                        ? 'bg-calendar-color-selected text-calendar-color-text-selected_date'
                        : isCurrentYear
                            ? 'bg-neutral-200 text-calendar-color-text-date'
                            : 'text-calendar-color-text-date hover:bg-calendar-color-hover'
                    }
                `;

                years.push(
                    <div
                        key={yearValue}
                        className={yearCellClasses}
                        onClick={() => handleYearSelect(yearValue)}
                    >
                        <span className="calendar-font-date">{yearValue}</span>
                    </div>
                );
            } else {
                // Empty cell for out-of-range years
                years.push(
                    <div key={`empty-${i}`} className="year-cell min-w-[48px] min-h-[40px]"></div>
                );
            }
        }
        return years;
    };

    const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    // Animation properties
    const viewAnimation = {
        initial: { opacity: 0, scale: 0.98 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.98 },
        transition: { duration: 0.15 }
    };

    return (
        <div className="bg-calendar-color-bg border rounded-calendar-border-radius-default border-calendar-color-card_stroke p-4  w-full min-w-[304px] max-w-[352px] font-family-brandprimary overflow-hidden">
            <div className='flex gap-4 flex-col'>
                {/* <-- 2. WRAP the conditional rendering --> */}
                <AnimatePresence mode="wait">
                    {viewMode === 'calendar' ? (
                        <motion.div
                            key="calendar-view"
                            className='flex gap-4 flex-col'
                            {...viewAnimation}
                        >
                            {/* Header with navigation and month/year */}
                            <div className="calendar-header flex items-center justify-between p-[6.22px] min-w-[272px] max-w-[350px] min-h-[24px] max-h-[40px]">
                                <button onClick={handlePrevMonth} className="nav-button p-2 rounded-full hover:bg-calendar-color-hover cursor-pointer select-none">
                                    <img src="./arrow-left.svg" alt="Previous Month" />
                                </button>

                                <h2 
                                    className="month-year-display calendar-font-month text-calendar-color-text-month box-sizing mt-[3px] mb-[3px] text-center cursor-pointer hover:text-color-text-primary-default px-3 py-1 rounded" 
                                    onClick={handleYearClick}
                                >
                                    {monthName} {year}
                                </h2>

                                <button onClick={handleNextMonth} className="nav-button p-2 rounded-full hover:bg-calendar-color-hover cursor-pointer select-none">
                                    <img src="./arrow-right.svg" alt="Next Month" />
                                </button>
                            </div>

                            {/* --- 4. ADD REF TO CALENDAR GRID --- */}
                            <div 
                                ref={calendarGridRef} 
                                className="calendar-grid grid grid-cols-7 gap-x-[3px] gap-y-[10px] text-center min-w-[272px] max-w-[352px] justify-items-center"
                            >

                                {/* Weekday labels */}
                                {weekdays.map(day => (
                                    <div key={day} className="p-2 calendar-font-day text-calendar-color-text-day text-center">
                                        {day}
                                    </div>
                                ))}

                                {renderCalendarGrid()}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="year-view"
                            className='flex gap-4 flex-col'
                            {...viewAnimation}
                        >
                            {/* Year Picker Header */}
                            <div className="calendar-header flex items-center justify-between p-[6.22px] min-w-[272px] max-w-[350px] min-h-[24px] max-h-[40px]">
                                <button onClick={handlePrevYearRange} className="nav-button p-2 rounded-full hover:bg-calendar-color-hover cursor-pointer select-none">
                                    <img src="./arrow-left.svg" alt="Previous Years" />
                                </button>

                                <h2 className="month-year-display calendar-font-month text-calendar-color-text-month box-sizing mt-[3px] mb-[3px] text-center">
                                    Year
                                </h2>

                                <button onClick={handleNextYearRange} className="nav-button p-2 rounded-full hover:bg-calendar-color-hover cursor-pointer select-none">
                                    <img src="./arrow-right.svg" alt="Next Years" />
                                </button>
                            </div>

                            <div 
                                className="year-grid grid grid-cols-5 gap-x-3 gap-y-[10px] text-center min-w-[272px] max-w-[352px] justify-items-center"
                                style={{ minHeight: gridHeight ? `${gridHeight}px` : 'auto' }}
                            >
                                {renderYearGrid()}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Calender;