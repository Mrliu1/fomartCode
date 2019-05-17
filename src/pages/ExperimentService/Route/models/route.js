import {
  getRouterPage,
  getSampleTypes,
  getRouterDetail,
  createRoute,
  changeStatusRoute,
  deleteRoute,
  updateRoute,
  getProcessesAll,
} from '@/services/experimentServiceApi';
import { message } from 'antd';
export default {
  namespace: 'route',

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
      const response = yield call(getRouterPage, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchBasic({ payload }, { call, put }) {
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
    *getRouterDetailFn({ payload }, { call, put }) {
      const response = yield call(getRouterDetail, payload);
      yield put({
        type: 'saveNo',
        payload: response,
      });
    },
    *createRouteFn({ payload, callback }, { call, put }) {
      const response = yield call(createRoute, payload);
      yield put({
        type: 'saveSubmit',
        payload: response,
        callback,
      });
      if (response.errorCode === 0 && callback) callback();
    },
    *changeStatusRouteFn({ payload, callback }, { call, put }) {
      const response = yield call(changeStatusRoute, payload);
      yield put({
        type: 'saveSubmit',
        payload: response,
        callback,
      });
      if (response.errorCode === 0 && callback) callback();
    },
    *updateRouteFn({ payload, callback }, { call, put }) {
      const response = yield call(updateRoute, payload);
      yield put({
        type: 'saveSubmit',
        payload: response,
        callback,
      });
      if (response.errorCode === 0 && callback) callback();
    },
    *deleteRouteFn({ payload, callback }, { call, put }) {
      const response = yield call(deleteRoute, payload);
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
      let data = action.payload.data ?  action.payload.data : [];
      let pagination = {
        currentPage: data.pageNum,
        pageSize: data.pageSize,
        showTotal: total => `Total ${data.totalSize} 条`,
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
      const {response, key} = action.payload
      const targetData = response.data
      let obj = {}
      let arr =[]
      targetData.forEach(val => {
        let value = {
          key: val.code ? val.code :  val.id,
          value: val.name
        }
        value = Object.assign({}, val, value)
        let _key = val.code ? val.code :  val.id
        obj[_key] = val.name
        arr.push(value)
      })
      const valueObj = {
        dict: obj,
        dataArr: arr,
      }
      let dictObj = {}
      dictObj[key] = valueObj
      const {initDictObj} = state
      console.log(dictObj, 'weeeee')
      return {
        ...state,
        initDictObj: {...initDictObj, ...dictObj},
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
