import { Middleware, PayloadAction, configureStore } from "@reduxjs/toolkit";

import usersReducer, { rollbackUser } from "./users/slice";
import { toast } from 'sonner'

/**
 * Persist the data
 * @param store
 * @returns 
 */
const persistanceLocalStorageMiddleware: Middleware = (store) => (next) => (action) => {
    const { type } = action as PayloadAction;
    next(action);
    localStorage.setItem("__redux__state__", JSON.stringify(store.getState()));
    if (type === 'users/addNewUser') {
        fetch(`https://jsonplaceholder.typicode.com/users/`, {
            method: 'POST'
        })
            .then(res => {
                if (res.ok) {
                    toast.success('usuario guardado correctamente')
                }
            })
            .catch(err => {
                console.log(err);

            })

    }
};

const syncDatabaseMiddleware: Middleware = store => next => action => {
    const { type, payload } = action as PayloadAction;
    console.log({ action, state: store.getState() });
    const previousState = store.getState();
    next(action);
    if (type === 'users/deleteUserById') {
        const userToRemove = previousState.users.find((user: { id: void; }) => user.id === payload); // save the user to delete in case there is an error and can do rollback
        fetch(`https://jsonplaceholder.typicode.com/users/${payload}`, {
            method: 'DELETE'
        })
            .then(res => {
                if (res.ok) {
                    toast.success('usuario eliminado correctamente')
                }
            })
            .catch(err => {
                toast.error('el usuario no se pudo eliminar')
                if (userToRemove) {
                    store.dispatch(rollbackUser(userToRemove))
                }
                console.log(err);

            })
    }
};

export const store = configureStore({
    reducer: {
        users: usersReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(persistanceLocalStorageMiddleware, syncDatabaseMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;