import { calendarSlice, cleanState, onAddNewEvent, onDeleteEvent, onSetActiveEvent, onSetAllEvents, onUpdateEvent } from "../../../src/store/calendar/calendarSlice"
import { calendarWithActiveEventState, calendarWithEventsState, events, initialState } from "../../fixtures/calendarStates"

describe('Pruebas en calendarSlice', () => {

    test('debe de retornar el estado por defecto', () => {

        expect(calendarSlice.getInitialState()).toEqual(initialState)

    });

    test('onSetActiveEvent debe de activar el evento', () => {

        const state = calendarSlice.reducer(calendarWithEventsState, onSetActiveEvent(events[0]));

        expect(state).toEqual(calendarWithActiveEventState)
    });

    test('onAddNewEvent debe de agregar el evento', () => {

        const newEvent = {
            id: '3',
            start: new Date('2022-10-10 13:00:00'),
            end: new Date('2022-10-10 15:00:00'),
            title: "Cumpleaños del Test",
            notes: "Hay que comprar algo",
        }

        const state = calendarSlice.reducer(initialState, onAddNewEvent(newEvent));

        expect(state.events).toContain(newEvent);
    });

    test('onUpdateEvent debe de actualizar el evento', () => {

        const updatedEvent = {
            id: '1',
            start: new Date('2022-10-10 13:00:00'),
            end: new Date('2022-10-10 15:00:00'),
            title: "Cumpleaños del algo actualizado",
            notes: "Hay que comprar algo actualizado",
        }

        const state = calendarSlice.reducer(calendarWithEventsState, onUpdateEvent(updatedEvent));

        expect(state.events).toContain(updatedEvent);
    });

    test('onDeleteEvent debe de eliminar el evento activo', () => {

        const activeEvent = calendarWithActiveEventState.activeEvent;

        const state = calendarSlice.reducer(calendarWithActiveEventState, onDeleteEvent());

        expect(state.events.includes(activeEvent)).toBeFalsy();
    });

    test('onSetAllEvents debe guardar un el array de eventos', () => {

        const state = calendarSlice.reducer(initialState, onSetAllEvents(events));

        expect(state.events).toEqual(events);
    });

    test('cleanState debe resetear el state', () => {

        const state = calendarSlice.reducer(calendarWithActiveEventState, cleanState());

        expect(state).toEqual({ ...initialState });
    });

})