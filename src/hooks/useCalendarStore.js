import { useDispatch, useSelector } from "react-redux"
import Swal from "sweetalert2";
import calendarApi from "../api/calendarApi";
import { convertToDateEvents } from "../helpers/convertToDateEvents";
import { endLoading, onAddNewEvent, onDeleteEvent, onSetActiveEvent, onSetAllEvents, onUpdateEvent, startLoading } from "../store/calendar/calendarSlice";

export const useCalendarStore = () => {
    const { events, activeEvent } = useSelector(state => state.calendar)
    const { user } = useSelector(state => state.auth)
    const dispatch = useDispatch();

    const setActiveEvent = (calendarEvent) => {
        dispatch(onSetActiveEvent(calendarEvent))
    }

    const startSavingEvent = async (calendarEvent) => {
        try {
            if (calendarEvent.id) {
                //Actualizando
                await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent)

                dispatch(onUpdateEvent({ ...calendarEvent, user }));
            }
            else {
                const { data } = await calendarApi.post('/events', calendarEvent)
                //Creando
                dispatch(onAddNewEvent({ ...calendarEvent, id: data.evento.id, user }));

            }
        } catch (error) {
            Swal.fire('Error al guardar', error.response.data?.msg, 'error')
            dispatch(endLoading());

        }
    }

    const startDeletingEvent = async () => {
        try {

            await calendarApi.delete(`/events/${activeEvent.id}`)

            dispatch(onDeleteEvent());
        } catch (error) {
            Swal.fire('Error al eliminar', error.response.data?.msg, 'error')
            dispatch(endLoading());
        }
    }

    const startLoadingEvents = async () => {
        try {
            dispatch(startLoading());
            const { data } = await calendarApi.get('/events');

            const events = convertToDateEvents(data.eventos);

            dispatch(onSetAllEvents(events));

        } catch (error) {
            dispatch(endLoading());

        }
    }


    return {
        //Properties
        events,
        activeEvent,
        hasEventSelected: !!activeEvent,

        //Methods
        setActiveEvent,
        startSavingEvent,
        startDeletingEvent,
        startLoadingEvents
    }

}