import { configureStore } from "@reduxjs/toolkit"
import { act, renderHook, waitFor } from "@testing-library/react"
import { Provider } from "react-redux"
import calendarApi from "../../src/api/calendarApi"
import { useAuthStore } from "../../src/hooks/useAuthStore"
import { authSlice } from "../../src/store/auth/authSlice"
import { initialState, notAuthenticatedState } from "../fixtures/authState"
import { testUserCredentials } from "../fixtures/testuser"

const getMockStore = (initialState) => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer
        },
        preloadedState: {
            auth: {
                ...initialState
            }
        }
    })
}

describe('Pruebas en useAuthStore', () => {

    beforeEach(() => localStorage.clear());

    test('debe de retornar los valores por defecto ', () => {
        const mockStore = getMockStore({ ...initialState })

        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        expect(result.current).toEqual({
            ...initialState,
            startLogin: expect.any(Function),
            startLogout: expect.any(Function),
            startRegister: expect.any(Function),
            checkAuthToken: expect.any(Function),
        })

    });

    test('startLogin debe de realizar el login correctamente', async () => {

        const mockStore = getMockStore({ ...notAuthenticatedState })

        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async () => {
            await result.current.startLogin(testUserCredentials);
        })

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test User', uid: '63c2b42af4c23faf8a31af58' }
        })

        expect(localStorage.getItem('token')).toEqual(expect.any(String));
        expect(localStorage.getItem('token-init-date')).toEqual(expect.any(String));


    })

    test('startLogin debe de fallar la autenticación', async () => {

        const mockStore = getMockStore({ ...notAuthenticatedState })

        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async () => {
            await result.current.startLogin({ email: 'foo@bar.com', password: 'pepe123123' });
        })

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: "Error al realizar el Login",
            status: 'not-authenticated',
            user: {}
        })

        expect(localStorage.getItem('token')).toEqual(null);
        expect(localStorage.getItem('token-init-date')).toEqual(null);


        waitFor(
            () => expect(result.current.errorMessage).toBe(undefined)
        )

    })

    test('startRegister debe de crear un usuario', async () => {

        const newUser = { email: 'foo@bar.com', password: 'pepe123123', name: 'Test User 2' }

        const mockStore = getMockStore({ ...notAuthenticatedState })

        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        const spy = jest.spyOn(calendarApi, 'post').mockReturnValue({
            data: {
                ok: true,
                uid: '123456788990',
                name: newUser.name,
                token: 'ALGUN-TOKEN'

            }
        });

        await act(async () => {
            await result.current.startRegister(newUser);
        })

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: newUser.name, uid: expect.any(String) }
        })

        expect(localStorage.getItem('token')).toEqual(expect.any(String));
        expect(localStorage.getItem('token-init-date')).toEqual(expect.any(String));

        spy.mockRestore();
    })

    test('startRegister debe de fallar', async () => {

        const mockStore = getMockStore({ ...notAuthenticatedState })

        const { result } = renderHook(() => useAuthStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        await act(async () => {
            await result.current.startRegister({ ...testUserCredentials });
        })

        const { errorMessage, status, user } = result.current;

        expect({ errorMessage, status, user }).toEqual({
            errorMessage: 'Error inesperado',
            status: 'not-authenticated',
            user: {}
        })

        expect(localStorage.getItem('token')).toEqual(null);
        expect(localStorage.getItem('token-init-date')).toEqual(null);

    })
})