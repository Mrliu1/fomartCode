import {
  getProcessPage,
  getProcessDetail,
  submitProcess,
  getProcessesAll,
} from '@/services/experimentServiceApi';
import { message } from 'antd';
export default {
  namespace: 'process',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    res: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getProcessPage, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchProcessDetail({ payload }, { call, put }) {
      const response = yield call(getProcessDetail, payload);
      yield put({
        type: 'saveNo',
        payload: response,
      });
    },
    *submitProcess({ payload, callback }, { call, put }) {
      const response = yield call(submitProcess, payload);
      console.log(response, 'submit')
      yield put({
        type: 'saveSubmit',
        payload: response,
        callback,
      });
      if (response.errorCode === 0 && callback) callback();
    },
    *getProcessesAll({ payload, callback }, { call, put }) {
      const response = yield call(getProcessesAll, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    // 处理分页的
    save(state, action) {
      let data = action.payload.data;
      let pagination = {
        currentPage: data.pageNum,
        pageSize: data.pageSize,
        showTotal: total => `Total ${data.totalSize} 条`,
        total: data.totalSize,
      };
      return {
        ...state,
        data: {
          pagination,
          list: data.dataList,
        },
      };
    },
    // 处理详情的
    saveNo(state, action) {
      return {
        ...state,
        res: action.payload,
      };
    },
    // 处理提交修改的
    saveSubmit(state, action) {
      if (action.payload.errorCode === 0) {
        message.success('操作成功！');
        if (action.callback) action.callback()
      } else {
        // message.error('操作失败，请稍后重新操作！');
      }
      return {
        ...state,
        res: action.payload,
      };
    },
  },
};
