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

interface UserState {
    users: any;
    loading: boolean;
    notification: string;
    userInfo: object;
    action: string;
}

const INIT_STATE: UserState = {
    userInfo: {},
    loading: false,
    notification: '',
    action: '',
    users: []
};

export default (state = INIT_STATE, action: { type: string; payload: {
    users: any; message: any; user: any; 
}; }) => {
    switch (action.type) {
        case CREATE_USER:
        case CREATE_USER_SUCCESS:
        case CREATE_USER_ERROR:
            return {
                ...state,
                loading: action.type === CREATE_USER,
                userInfo:
                    action.type === CREATE_USER_SUCCESS
                        ? action.payload.user
                        : state.userInfo,
                notification:
                    action.type === CREATE_USER_SUCCESS
                        ? 'درخواست شما با موفقیت انجام شد'
                        : action.payload.message,
                action: action.type,
            };
        case READ_USER:
        case READ_USER_SUCCESS:
        case READ_USER_ERROR:
            return {
                ...state,
                userInfo:
                    action.type === READ_USER_SUCCESS
                        ? action.payload.user
                        : state.userInfo,
                loading: action.type === READ_USER,
                notification:
                    action.type === READ_USER_SUCCESS
                        ? 'درخواست شما با موفقیت انجام شد'
                        : action.payload.message,
                action: action.type,
            };
        case READ_USERS:
        case READ_USERS_SUCCESS:
        case READ_USERS_ERROR:
            return {
                ...state,
                users:
                    action.type === READ_USERS_SUCCESS
                        ? action.payload.users
                        : state.users,
                loading: action.type === READ_USERS,
                notification:
                    action.type === READ_USERS_SUCCESS
                        ? 'درخواست شما با موفقیت انجام شد'
                        : action.payload.message,
                action: action.type,
            };
        case UPDATE_USER:
        case UPDATE_USER_SUCCESS:
        case UPDATE_USER_ERROR:
            return {
                ...state,
                loading: action.type === UPDATE_USER,
                notification:
                    action.type === UPDATE_USER_SUCCESS
                        ? 'درخواست شما با موفقیت انجام شد'
                        : action.payload.message,
                action: action.type,
            };
        case DELETE_USER:
        case DELETE_USER_SUCCESS:
        case DELETE_USER_ERROR:
            return {
                ...state,
                loading: action.type === DELETE_USER,
                notification:
                    action.type === DELETE_USER_SUCCESS
                        ? 'درخواست شما با موفقیت انجام شد'
                        : action.payload.message,
                action: action.type,
            };
        default:
            return { ...state };
    }
};
