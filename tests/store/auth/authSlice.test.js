import { authSlice, clearErrorMessage, onLogin, onLogout } from "../../../src/store/auth/authSlice"
import { authenticatedState, initialState, notAuthenticatedState } from "../../fixtures/authState"
import { testUserCredentials } from "../../fixtures/testuser"

describe('Pruebas en authSlice', () => {

    test('debe de regresar el estado por defecto', () => {

        expect(authSlice.getInitialState()).toEqual(initialState)

    })


    test('debe de realiar un login', () => {
        const state = authSlice.reducer(initialState, onLogin(testUserCredentials));

        expect(state).toEqual({
            status: 'authenticated',
            user: testUserCredentials,
            errorMessage: undefined
        });

    })

    test('debe de realiar un logout', () => {
        const state = authSlice.reducer(authenticatedState, onLogout());

        expect(state).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: undefined
        });

    })

    test('debe de realiar un logout con error message', () => {
        const errorMessage = 'Credenciales no validas'
        const state = authSlice.reducer(authenticatedState, onLogout(errorMessage));

        expect(state).toEqual({
            status: 'not-authenticated',
            user: {},
            errorMessage: errorMessage
        });

    })

    test('debe de limpiar el mensaje de error', () => {
        const errorMessage = 'Credenciales no validas'
        const state = authSlice.reducer(authenticatedState, onLogout(errorMessage));
        const newState = authSlice.reducer(state, clearErrorMessage());

        expect(newState.errorMessage).toBe(undefined);

    })
})