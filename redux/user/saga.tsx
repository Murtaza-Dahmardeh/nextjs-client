import { all, call, fork, put } from 'redux-saga/effects';
import * as Eff from 'redux-saga/effects'
import axios from 'axios';
import {
  CREATE_USER,
  READ_USER,
  UPDATE_USER,
  DELETE_USER,
  READ_USERS,
} from './../actions';

import {
  createUserSuccess,
  createUserError,
  readUserSuccess,
  readUserError,
  updateUserSuccess,
  updateUserError,
  deleteUserSuccess,
  deleteUserError,
  readUsersSuccess,
  readUsersError,
} from './actions';

const API_PRIVATE_BASE_URL = 'http://localhost:8000/api';
const takeEvery: any = Eff.takeEvery;

interface UserPayload {
  id: string;
  name: string;
  email: string;
  // add any other properties here as needed
}

function* createUser({ payload }: { payload: any }): Generator<any, void, any> {
  try {
    const response = yield call(() => axios.post('http://localhost:8000/api/users', payload));

    const item = { ...response.data };
    yield put(createUserSuccess(item.data));
  } catch (error: any) {
    yield put(
      createUserError(
        error.response === undefined ? error.message : error.response.data.message
      )
    );
  }
}

function* watchCreateUser() {
  yield takeEvery(CREATE_USER, createUser);
}

function* readUser({ payload }: { payload: any }): Generator<any, void, any> {
  try {
    const response = yield call(() => axios.get(`http://localhost:8000/api/users/${payload.id}`));

    const item = { ...response.data };
    yield put(readUserSuccess(item));
  } catch (error: any) {
    yield put(
      readUserError(
        error.response === undefined ? error.message : error.response.data.message
      )
    );
  }
}

function* watchReadUser() {
  yield takeEvery(READ_USER, readUser);
}

function* readUsers(): Generator<any, void, any> {
  try {
    const response = yield call(() => axios.get('http://localhost:8000/api/users'));

    const item = response.data.users;
    yield put(readUsersSuccess(item));
  } catch (error: any) {
    yield put(
      readUsersError(
        error.response === undefined ? error.message : error.response.data.message
      )
    );
  }
}

function* watchReadUsers() {
  yield takeEvery(READ_USERS, readUsers);
}

function* updateUser({ payload }: { payload: any }): Generator<any, void, any> {
  try {
    const response = yield call(() => axios.post(`http://localhost:8000/api/update/${payload.id}`, payload.formData));

    const item = { ...response.data };
    yield put(updateUserSuccess(item.data));
  } catch (error: any) {
    yield put(
      createUserError(
        error.response === undefined ? error.message : error.response.data.message
      )
    );
  }
}

function* watchUpdateUser() {
  yield takeEvery(UPDATE_USER, updateUser);
}

function* deleteUser({ payload }: { payload: any }): Generator<any, void, any> {
  try {
    console.log(payload)
    const response = yield call(() => axios.delete(`http://localhost:8000/api/users/${payload.id}`));

    const item = { ...response.data.message };
    yield put(deleteUserSuccess(item));
  } catch (error: any) {
    yield put(
      deleteUserError(
        error.response === undefined ? error.message : error.response.data.message
      )
    );
  }
}

function* watchDeleteUser() {
  yield takeEvery(DELETE_USER, deleteUser);
}

export default function* rootSaga() {
  yield all([
    fork(watchCreateUser),
    fork(watchReadUser),
    fork(watchUpdateUser),
    fork(watchDeleteUser),
    fork(watchReadUsers),
  ]);
}
