import React, { useState } from "react";
import Header from "./components/header/Header.jsx";
import Calendar from "./components/calendar/Calendar.jsx";
import Modal from "./components/modal/Modal.jsx";

import { getWeekStartDate, generateWeekRange } from "../src/utils/dateUtils.js";

import "./common.scss";
import { createEvent, fetchEvents, removeEvent } from "./gateway/Gateway.js";

const App = () => {
  const [weekStartDate, setWeekStartDate] = useState(new Date());
  const [isShowModal, setIsShowModal] = useState(false);
  const [eventsList, setEventsList] = useState([]);

  const weekDates = generateWeekRange(getWeekStartDate(weekStartDate));

  const goNextWeek = () => {
    setWeekStartDate(
      new Date(weekStartDate.setDate(new Date(weekStartDate).getDate() + 7))
    );
  };

  const goPrevWeek = () => {
    setWeekStartDate(
      new Date(weekStartDate.setDate(new Date(weekStartDate).getDate() - 7))
    );
  };

  const goToday = () => {
    setWeekStartDate(new Date());
  };

  const toggleModal = (e) => {
    const target = e.target;
    if (
      target.classList.contains("create-event-btn") ||
      target.classList.contains("create-event__close-btn") ||
      target.classList.contains("overlay") ||
      target.classList.contains("event-form")
    ) {
      setIsShowModal(!isShowModal);
    }
  };

  const getEvents = () =>
    fetchEvents().then((eventsList) => {
      const updatedList = eventsList.map((event) => {
        return {
          ...event,
          dateFrom: new Date(event.dateFrom),
          dateTo: new Date(event.dateTo),
        };
      });
      setEventsList(updatedList);
    });

  const createEvent = (e, eventData) => {
    e.preventDefault();
    const { date, description, endTime, startTime, title } = eventData;
    const newEvent = {
      title,
      description,
      dateFrom: new Date(`${date} ${startTime}`),
      dateTo: new Date(`${date} ${endTime}`),
    };
    createEvent(newEvent).then(() => getEvents());
  };

  const removeEvent = (id) => {
    removeEvent(id).then(() => getEvents());
  };

  React.useEffect(() => {
    getEvents();
  }, []);

  return (
    <>
      <Header
        weekDates={weekDates}
        goNextWeek={goNextWeek}
        goPrevWeek={goPrevWeek}
        goToday={goToday}
        showModal={toggleModal}
      />
      {isShowModal && (
        <Modal closeModal={toggleModal} onCreateEvent={createEvent} />
      )}
      <Calendar
        weekDates={weekDates}
        eventsList={eventsList}
        removeEvent={removeEvent}
      />
    </>
  );
};

export default App;
