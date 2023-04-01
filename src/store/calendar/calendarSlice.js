import { createSlice } from '@reduxjs/toolkit';

// const tempEvent = {
//     id: new Date().getTime(),
//     title: "Cumpleaños del jefe",
//     notes: "Hay que comprar algo",
//     start: new Date(),
//     end: addHours(new Date(), 2),
//     bgColor: "#fafafa",
//     user: {
//         id: "123",
//         name: "Anthony",
//     },
// }

export const calendarSlice = createSlice({
    name: 'calendar',
    initialState: {
        events: [],
        activeEvent: null,
        loading: false
    },
    reducers: {
        onSetActiveEvent: (state, { payload }) => {
            state.activeEvent = payload;
        },
        onAddNewEvent: (state, { payload }) => {
            state.events.push(payload);
            state.activeEvent = null;
            state.loading = false;
        },
        onUpdateEvent: (state, { payload }) => {
            state.events = state.events.map(event => {
                if (event.id === payload.id)
                    return payload;
                return event
            })
            state.loading = false;
        },
        onDeleteEvent: (state) => {
            if (state.activeEvent) {
                state.events = state.events.filter(event => event.id !== state.activeEvent.id);
                state.activeEvent = null;
                state.loading = false;
            }
        },
        onSetAllEvents: (state, { payload }) => {
            state.loading = false;
            payload.forEach(event => {
                const existe = state.events.some(dbEvent => dbEvent.id === event.id);
                if (!existe) {
                    state.events.push(event)
                }
            });
        },
        startLoading: (state) => {
            state.loading = true;
        },
        endLoading: (state) => {
            state.loading = false;
        },
        cleanState: (state) => {
            state.events = [];
            state.activeEvent = null;
            state.loading = false;
        }
    }
});


// Action creators are generated for each case reducer function
export const {
    onSetActiveEvent,
    onAddNewEvent,
    onUpdateEvent,
    onDeleteEvent,
    onSetAllEvents,
    startLoading,
    endLoading,
    cleanState
} = calendarSlice.actions;