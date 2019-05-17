/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-const */
import {
  getPacketsPage,
  createPacket,
  editPacket,
  deletePacket,
  disabledPacket,
  usePacket,
  getPacketDetail,
  getPacks,
  getSampleBoxType,
  getSampleBoxTypes,
  submitPacket,
  getExperimentsPage,
  getPackDetail,
  getExperimentDetail,
  getSampleTypes,
} from '@/services/experimentServiceApi'
import { message } from 'antd';
export default {
  namespace: 'packet',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    initDictObj: {},
    res: {},
    mData: {}, // 弹出框数组
  },

  effects: {
    *getPacketsPageFn({ payload }, { call, put }) {
      const response = yield call(getPacketsPage, payload);
      yield put({
        type: 'save', // PageData
        payload: response,
      });
    },
    *getSampleTypesFn({ payload }, { call, put }) {
      const response = yield call(getSampleTypes, payload);
      const responseFinish = {
        response,
        key: 'sampleTypes',
      }
      yield put({
        type: 'saveInitDict',
        payload: responseFinish,
      });
    },
    *createPacketFn({ payload, callback }, { call, put }) {
      const response = yield call(createPacket, payload);
      
      yield put({
        type: 'saveSubmit',
        payload: response,
        callback,
      });
      if (response.errorCode === 0 && callback) callback();
    },
    *editPacketFn({ payload, callback }, { call, put }) {
      const response = yield call(editPacket, payload);
      
      yield put({
        type: 'saveSubmit',
        payload: response,
        callback,
      });
      if (response.errorCode === 0 && callback) callback();
    },
    *deletePacketFn({ payload, callback }, { call, put }) {
      const response = yield call(deletePacket, payload);
      
      yield put({
        type: 'saveSubmit',
        payload: response,
        callback,
      });
      if (response.errorCode === 0 && callback) callback();
    },
    *disabledPacketFn({ payload, callback }, { call, put }) {
      const response = yield call(disabledPacket, payload);
      
      yield put({
        type: 'saveSubmit',
        payload: response,
        callback,
      });
      if (response.errorCode === 0 && callback) callback();
    },
    *usePacketFn({ payload, callback }, { call, put }) {
      const response = yield call(usePacket, payload);
      
      yield put({
        type: 'saveSubmit',
        payload: response,
        callback,
      });
      if (response.errorCode === 0 && callback) callback();
    },
    *getPacketDetailFn({ payload }, { call, put }) {
      const response = yield call(getPacketDetail, payload);
      yield put({
        type: 'saveNo', // Single
        payload: response,
      });
    },
    // 功能医学
    *getPacksFn({ payload }, { call, put }) {
      const state = {
        packType: 'FUNC'
      }
      const params = Object.assign({}, payload, state)
      const response = yield call(getPacks, params);
      const responseFinish = {
        response,
        key: 'funcs',
      }
      yield put({
        type: 'saveMData', // PageData
        payload: responseFinish,
      });
    },
    // 血生化
    *getPacksFnBio({ payload }, { call, put }) {
      const state = {
        packType: 'BIO'
      }
      const params = Object.assign({}, payload, state)
      const response = yield call(getPacks, params);
      const responseFinish = {
        response,
        key: 'bios',
      }
      yield put({
        type: 'saveMData', // PageData
        payload: responseFinish,
      });
    },
    *getSampleBoxTypeFn({ payload }, { call, put }) {
      const response = yield call(getSampleBoxType, payload);
      yield put({
        type: 'save', // PageData
        payload: response,
      });
    },
    *getSampleBoxTypesFn({ payload }, { call, put }) {
      const response = yield call(getSampleBoxTypes, payload);
      const responseFinish = {
        response,
        key: 'boxes',
      }
      yield put({
        type: 'saveMData', // PageData
        payload: responseFinish,
      });
    },
    *submitPacketFn({ payload, callback }, { call, put }) {
      const response = yield call(submitPacket, payload);
      
      yield put({
        type: 'saveSubmit',
        payload: response,
        callback,
      });
      if (response.errorCode === 0 && callback) callback();
    },
    *getExperimentsPageFn({ payload }, { call, put }) {
      const response = yield call(getExperimentsPage, Object.assign({}, payload, {experimentState: 'PUBLISHED'}));
      const responseFinish = {
        response,
        key: 'omics',
      }
      yield put({
        type: 'saveMData', // PageData
        payload: responseFinish,
      });
    },
    *getPackDetailFn({ payload }, { call, put }) {
      const response = yield call(getPackDetail, payload);
      yield put({
        type: 'save', // Single
        payload: response,
      });
    },
    *getExperimentDetailFn({ payload }, { call, put }) {
      const response = yield call(getExperimentDetail, payload);
      yield put({
        type: 'save', // Single
        payload: response,
      });
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
    // 处理弹出框查询到的模态框的
    saveMData(state, action) {
      const { response, key } = action.payload;
      const targetData = response.data.dataList ? response.data.dataList : response.data;
      let dictObj = {};
      dictObj[key] = targetData;
      const { mData } = state;
      return {
        ...state,
        mData:  { ...mData, ...dictObj },
      };
    },
    // 处理提交修改的
    saveSubmit(state, action) {
      let {data} = action.payload;
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
