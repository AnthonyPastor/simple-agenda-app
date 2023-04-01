import React, { useState } from "react";
import { Calendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { Navbar } from "../components/Navbar";
import { getMessagesES, localizer } from "../../helpers";
import { CalendarEvent, FabAddNew, FabDelete } from "../components";
import { CalendarModal } from "../components";
import { useAuthStore, useUiStore } from "../../hooks";
import { useCalendarStore } from "../../hooks";

export const CalendarPage = () => {
	const { openDateModal } = useUiStore();

	const { events, setActiveEvent } = useCalendarStore();
	const { user } = useAuthStore();

	const [lastView, setLastView] = useState(
		localStorage.getItem("lastView") || "week"
	);

	const eventStyleGetter = (event, start, end, isSelected) => {
		const isMyEvent =
			user.uid === event.user._id || user.uid === event.user.uid;

		const style = {
			backgroundColor: isMyEvent ? "#347CF7" : "#465660",
			borderRadius: "0px",
			opacity: 0.8,
			color: "white",
		};
		return {
			style,
		};
	};

	const onDoubleClick = (event) => {
		openDateModal();
		setActiveEvent(event);
	};

	const onSelect = (event) => {
		setActiveEvent(event);
	};

	const onViewChanged = (event) => {
		localStorage.setItem("lastView", event);
		setLastView(event);
	};

	return (
		<>
			<Navbar />

			<Calendar
				localizer={localizer}
				culture='es'
				events={events}
				startAccessor='start'
				defaultView={lastView}
				endAccessor='end'
				style={{ height: "calc(100vh - 80px)" }}
				messages={getMessagesES()}
				eventPropGetter={eventStyleGetter}
				components={{
					event: CalendarEvent,
				}}
				onDoubleClickEvent={onDoubleClick}
				onSelectEvent={onSelect}
				onView={onViewChanged}
			/>

			<CalendarModal />
			<FabAddNew />
			<FabDelete />
		</>
	);
};
