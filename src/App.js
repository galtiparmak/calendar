//Calendar
import React, { useState } from 'react';
import './App.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reservations, setReservations] = useState({});

  const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
  const daysToShow = 14;
  const oneDayMs = 24 * 60 * 60 * 1000;

  const getDatesForCalendar = () => {
    const startDate = new Date(currentDate);
    const dates = [];
    for (let i = 0; i < daysToShow; i++) {
      const nextDate = new Date(startDate.getTime() + i * oneDayMs);
      const day = String(nextDate.getDate()).padStart(2, '0');
      const month = String(nextDate.getMonth() + 1).padStart(2, '0');
      const year = nextDate.getFullYear();
      dates.push(`${day}.${month}.${year}`);
    }
    return dates;
  };

  const moveDays = (days) => {
    const newDate = new Date(currentDate.getTime() + days * oneDayMs);
    setCurrentDate(newDate);
  };

  const handleCellClick = (date, hour) => {
    const key = `${date}-${hour}`;
    if (reservations[key]) {
      const isCancel = window.confirm("Silinsin mi?");
      if (isCancel) {
        if (reservations[key].type === 'weekly') {
          const isCancelSubscription = window.confirm("Abonelik silinsin mi?");
          if (isCancelSubscription) {
            cancelWeeklySubscription(date, hour);
          } else {
            cancelSingleReservation(date, hour);
          }
        } else {
          cancelSingleReservation(date, hour);
        }
      }
    } else {
      const isSubscription = window.confirm("Abonelik mi?");
      if (isSubscription) {
        makeWeeklySubscription(date, hour);
      } else {
        makeSingleReservation(date, hour);
      }
    }
  };

  const makeSingleReservation = (date, hour) => {
    const key = `${date}-${hour}`;
    setReservations({
      ...reservations,
      [key]: { type: 'single' }
    });
  };

  const makeWeeklySubscription = (date, hour) => {
    const updatedReservations = { ...reservations };
    const dateParts = date.split('.');

    const startDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);

    for (let i = 0; i < 52; i++) {
      const nextWeekDate = new Date(startDate.getTime() + i * 7 * oneDayMs);
      const nextDateKey = formatDate(nextWeekDate);
      const key = `${nextDateKey}-${hour}`;
      updatedReservations[key] = { type: 'weekly' };
    }
    setReservations(updatedReservations);
  };

  const cancelSingleReservation = (date, hour) => {
    const key = `${date}-${hour}`;
    const updatedReservations = { ...reservations };
    delete updatedReservations[key];
    setReservations(updatedReservations);
  };

  const cancelWeeklySubscription = (date, hour) => {
    const updatedReservations = { ...reservations };
    const dateParts = date.split('.');
    const startDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);

    for (let i = 0; i < 52; i++) {
      const nextWeekDate = new Date(startDate.getTime() + i * 7 * oneDayMs);
      const nextDateKey = formatDate(nextWeekDate);
      const key = `${nextDateKey}-${hour}`;
      delete updatedReservations[key];
    }
    setReservations(updatedReservations);
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const getCellStyle = (date, hour) => {
    const key = `${date}-${hour}`;
    if (reservations[key]) {
      if (reservations[key].type === 'single') {
        return { backgroundColor: '#ADD8E6' };
      } else if (reservations[key].type === 'weekly') {
        return { backgroundColor: 'blue' };
      }
    }
    return {};
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={() => moveDays(-7)}>{'<<'}</button>
        <button onClick={() => moveDays(-1)}>{'<'}</button>
        <button onClick={() => setCurrentDate(new Date())}>{'|'}</button>
        <button onClick={() => moveDays(1)}>{'>'}</button>
        <button onClick={() => moveDays(7)}>{'>>'}</button>
      </div>

      <div className="calendar-grid">
        <div className="calendar-row">
          <div className="empty-cell"></div>
          {getDatesForCalendar().map((date) => (
            <div key={date} className="date-header">{date}</div>
          ))}
        </div>

        {hours.map((hour) => (
          <div key={hour} className="calendar-row">
            <div className="hour-cell">{hour}</div>
            {getDatesForCalendar().map((date, index) => (
              <div
                key={index}
                className="calendar-cell"
                style={getCellStyle(date, hour)}
                onClick={() => handleCellClick(date, hour)}
              >
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
