export const events = [
    {
        id: '1',
        start: new Date('2022-10-21 13:00:00'),
        end: new Date('2022-10-21 15:00:00'),
        title: "Cumpleaños del Fulano",
        notes: "Hay que comprar algo",

    },
    {
        id: '2',
        start: new Date('2022-10-09 13:00:00'),
        end: new Date('2022-10-09 15:00:00'),
        title: "Cumpleaños del Pepe",
        notes: "Hay que comprar algo",

    }
];

export const initialState = {
    events: [],
    activeEvent: null,
    loading: false
}

export const calendarWithEventsState = {
    events: [...events],
    activeEvent: null,
    loading: false

}


export const calendarWithActiveEventState = {
    events: [...events],
    activeEvent: { ...events[0] },
    loading: false

}