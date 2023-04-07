// eslint-disable-next-line import/no-cycle
import {
    CREATE_USER,
    CREATE_USER_SUCCESS,
    CREATE_USER_ERROR,
    READ_USER,
    READ_USER_SUCCESS,
    READ_USER_ERROR,
    UPDATE_USER,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_ERROR,
    DELETE_USER,
    DELETE_USER_SUCCESS,
    DELETE_USER_ERROR,
    READ_USERS,
    READ_USERS_SUCCESS,
    READ_USERS_ERROR,
} from './../actions';

export const createUser = (formData: any) => ({
    type: CREATE_USER,
    payload: formData,
});

export const createUserSuccess = (user: any) => ({
    type: CREATE_USER_SUCCESS,
    payload: { user },
});

export const createUserError = (message: any) => ({
    type: CREATE_USER_ERROR,
    payload: { message },
});

export const readUser = (id: any) => ({
    type: READ_USER,
    payload: { id },
});

export const readUserSuccess = (user: any) => ({
    type: READ_USER_SUCCESS,
    payload: { user },
});

export const readUserError = (message: any) => ({
    type: READ_USER_ERROR,
    payload: { message },
});

export const readUsers = () => ({
    type: READ_USERS,
    payload: {},
});

export const readUsersSuccess = (users: any) => ({
    type: READ_USERS_SUCCESS,
    payload: { users },
});

export const readUsersError = (message: any) => ({
    type: READ_USERS_ERROR,
    payload: { message },
});

export const updateUser = (formData: any, id: string) => ({
    type: UPDATE_USER,
    payload: {formData, id},
});

export const updateUserSuccess = (user: any) => ({
    type: UPDATE_USER_SUCCESS,
    payload: { user },
});

export const updateUserError = (message: any) => ({
    type: UPDATE_USER_ERROR,
    payload: { message },
});

export const deleteUser = (id: any) => ({
    type: DELETE_USER,
    payload: { id },
});

export const deleteUserSuccess = (message: any) => ({
    type: DELETE_USER_SUCCESS,
    payload: { message },
});

export const deleteUserError = (message: any) => ({
    type: DELETE_USER_ERROR,
    payload: { message },
});
