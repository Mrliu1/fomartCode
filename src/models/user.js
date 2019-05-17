import { query as queryUsers, queryCurrent, putPWD } from '@/services/user';
import { message }from 'antd';
export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {
      name: '',
      systemId: '',
      phoneEnding: '',
    },
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    *putPwd({payload}, {call, put}) {
      const response = yield call(putPWD, payload);
      console.log(response)
      yield put({
        type: 'success',
      })
    },
  },

  reducers: {
    success (state, action) {
      message.success('修改成功');
      return  {
        ...state
      }
    },
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || state.currentUser ,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
