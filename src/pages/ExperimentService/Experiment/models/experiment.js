/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-const */
import {
  getExperimentsPage,
  createExperiment,
  editExperiment,
  getRouteDict,
  getSampleTypes,
  getProcessesAll,
  deleteExperiment,
  disabledExperiment,
  useExperiment,
  getExperimentDetail,
  submitExperiment,
} from '@/services/experimentServiceApi';
import { message } from 'antd';
export default {
  namespace: 'experiment',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    initDictObj: {},
    res: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getExperimentsPage, payload);
      yield put({
        type: 'save', // PageData
        payload: response,
      });
    },
    *getRouteDictFn({ payload }, { call, put }) {
      const response = yield call(getRouteDict, payload);
      const responseFinish = {
        response,
        key: 'routeCode',
      }
      yield put({
        type: 'saveInitDict',
        payload: responseFinish,
      });
    },
    *getSampleTypesFn({ payload }, { call, put }) {
      const response = yield call(getSampleTypes, payload);
      const responseFinish = {
        response,
        key: 'sampleTypes',
      }
      console.log(responseFinish, 'sampleTypes')
      yield put({
        type: 'saveInitDict',
        payload: responseFinish,
      });
    },
    *getProcessesAllFn({ payload }, { call, put }) {
      const response = yield call(getProcessesAll, payload);
      const responseFinish = {
        response,
        key: 'processes',
      }
      yield put({
        type: 'saveInitDict',
        payload: responseFinish,
      });
    },
    *createExperimentFn({ payload, callback }, { call, put }) {
      const response = yield call(createExperiment, payload);
      
      yield put({
        type: 'saveSubmit',
        payload: response,
        callback,
      });
      if (response.errorCode === 0 && callback) callback();
    },
    *editExperimentFn({ payload, callback }, { call, put }) {
      const response = yield call(editExperiment, payload);
      
      yield put({
        type: 'saveSubmit',
        payload: response,
        callback,
      });
      if (response.errorCode === 0 && callback) callback();
    },
    *deleteExperimentFn({ payload, callback }, { call, put }) {
      const response = yield call(deleteExperiment, payload);
      
      yield put({
        type: 'saveSubmit',
        payload: response,
        callback,
      });
      if (response.errorCode === 0 && callback) callback();
    },
    *disabledExperimentFn({ payload, callback }, { call, put }) {
      const response = yield call(disabledExperiment, payload);
      
      yield put({
        type: 'saveSubmit',
        payload: response,
        callback,
      });
      if (response.errorCode === 0 && callback) callback();
    },
    *useExperimentFn({ payload, callback }, { call, put }) {
      const response = yield call(useExperiment, payload);
      
      yield put({
        type: 'saveSubmit',
        payload: response,
        callback,
      });
      if (response.errorCode === 0 && callback) callback();
    },
    *getExperimentDetailFn({ payload, callback }, { call, put }) {
      const response = yield call(getExperimentDetail, payload);
      yield put({
        type: 'saveNo', // Single
        payload: response,
        callback,
      });
    },
    *submitExperimentFn({ payload, callback }, { call, put }) {
      const response = yield call(submitExperiment, payload);
      
      yield put({
        type: 'saveSubmit',
        payload: response,
        callback,
      });
      if (response.errorCode === 0 && callback) callback();
    },
  },

  reducers: {
    // 处理分页的
    save(state, action) {
      const {data} = action.payload;

      const pagination = {
        currentPage: data.pageNum,
        pageSize: data.pageSize,
        showTotal: () => `Total ${data.totalSize} 条`,
        total: data.totalSize || 0,
      };
      return {
        ...state,
        data: {
          pagination,
          list: data.dataList,
        },
      };
    },
    // 字典项
    saveInitDict(state, action) {
      const { response, key } = action.payload;
      const targetData = response.data.dataList ? response.data.dataList : response.data;
      let obj = {};
      let arr = [];
      targetData.forEach(val => {
        let value = {
          key: val.code ? val.code : val.id,
          value: val.name,
        };
        value = Object.assign({}, val, value);
        let _key = val.code ? val.code : val.id;
        obj[_key] = val.name;
        arr.push(value);
      });
      const valueObj = {
        dict: obj,
        dataArr: arr,
      };
      let dictObj = {};
      dictObj[key] = valueObj;
      const { initDictObj } = state;
      return {
        ...state,
        initDictObj: { ...initDictObj, ...dictObj },
      };
    },
    saveInitDict1(state, action) {
      return {
        ...state,
        initDictObj: action.payload,
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
