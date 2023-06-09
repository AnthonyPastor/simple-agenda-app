import { useDispatch, useSelector } from "react-redux";
import calendarApi from "../api/calendarApi";
import { clearErrorMessage, onChecking, onLogin, onLogout } from "../store/auth/authSlice";
import { cleanState } from "../store/calendar/calendarSlice";

export const useAuthStore = () => {

    const { status, user, errorMessage } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const startLogin = async ({ email, password }) => {
        dispatch(onChecking());

        try {
            const { data } = await calendarApi.post('/auth', { email, password });

            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());

            dispatch(onLogin({
                name: data.name,
                uid: data.uid
            }))

        } catch (error) {
            dispatch(onLogout('Error al realizar el Login'))
            setTimeout(() => {
                dispatch(clearErrorMessage())
            }, 10)
        }

    }

    const startLogout = async () => {
        dispatch(onLogout());
        dispatch(cleanState());
    }

    const startRegister = async ({ name, email, password }) => {
        dispatch(onChecking());

        try {
            const { data } = await calendarApi.post('/auth/new', { name, email, password });

            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());

            dispatch(onLogin({
                name: data.name,
                uid: data.uid
            }))

        } catch (error) {
            dispatch(onLogout('Error inesperado'))
        }
    }

    const checkAuthToken = async () => {
        const token = localStorage.getItem('token');
        if (!token) return dispatch(onLogout());

        try {
            const { data } = await calendarApi.get('auth/renew');

            localStorage.setItem('token', token);
            localStorage.setItem('token-init-date', new Date().getTime());

            dispatch(onLogin({
                name: data.name,
                uid: data.uid
            }))

        } catch (error) {
            localStorage.clear();
            dispatch(onLogout());
        }
    }


    return {
        //Properties
        status,
        user,
        errorMessage,
        //Methods

        startLogin,
        startLogout,
        startRegister,
        checkAuthToken
    }

}
