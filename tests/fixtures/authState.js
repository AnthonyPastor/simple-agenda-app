export const initialState = {
    status: 'not-authenticated',
    user: {},
    errorMessage: undefined,
}

export const authenticatedState = {
    status: 'authenticated',
    user: { uid: 'test', name: 'TestName' },
    errorMessage: undefined,
}

export const notAuthenticatedState = {
    status: 'not-authenticated',
    user: {},
    errorMessage: undefined,
}