import { createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";

export type UserId = string;

export interface User {
    name: string;
    email: string;
    github: string;
}

export interface UserWithId extends User {
    id: UserId;
}
const DEFAULT_STATE = [
    {
        id: "1",
        name: "Silvina Muñoz",
        email: "silmunoz22@gmail.com",
        github: "silm22"
    },
    {
        id: "2",
        name: "Juan Muñoz",
        email: "juanmz22@gmail.com",
        github: "juan22"
    },
    {
        id: "3",
        name: "Miguel Angel",
        email: "silmunoz22@gmail.com",
        github: "angel2"
    },
];

const initialState: UserWithId[] = (() => {
    const persistedState = localStorage.getItem("__redux__state__");
    if (persistedState) return JSON.parse(persistedState).users;
    return DEFAULT_STATE;
})();

export const usersSlice: Slice<UserWithId[]> = createSlice({
    name: 'users',
    initialState,
    reducers: {
        deleteUserById: (state, action: PayloadAction<UserId>) => {
            const id = action.payload;
            return state.filter((user) => user.id !== id);
        },
        addNewUser: (state, action: PayloadAction<User>) => {
            const id = crypto.randomUUID();
            state.push({ id, ...action.payload });
            // return [...state, { id, ...action.payload }]
        },
        rollbackUser: (state, action: PayloadAction<UserWithId>) => {
            console.log(action.payload);

            const userIsAlreadyDefined = state.some(user => user.id === action.payload.id);
            if (!userIsAlreadyDefined) {
                state.push(action.payload);
                // return [...state, action.payload]
            }
        }
    }
})

export const { addNewUser, deleteUserById, rollbackUser } = usersSlice.actions;
export default usersSlice.reducer;