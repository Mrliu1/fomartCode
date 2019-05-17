import {
  getSampleTypes,
  getProcessesAll,
  getRouteDict,
} from '@/services/experimentServiceApi';
import {
getUnits, } from '@/services/experimentServiceDictApi'
export default {
  namespace: 'experimentDict',

  state: {
    initDictObj: {},
  },

  effects: {

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
    *getUnitsFn({ payload }, { call, put }) {
      const response = yield call(getUnits, payload);
      const responseFinish = {
        response,
        key: 'units',
      }
      yield put({
        type: 'saveInitDict',
        payload: responseFinish,
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
  },

  reducers: {
    // 字典项
    saveInitDict(state, action) {
      const { response, key } = action.payload;
      const targetData = response.data.dataList ? response.data.dataList : response.data;
      let obj = {};
      let arr = [];
      targetData.forEach(val => {
        let value = {
          key: val.code ? val.code : val.id,
          value: val.name ? val.name: val.chineseName,
        };
        value = Object.assign({}, val, value);
        let _key = val.code ? val.code : val.id;
        obj[_key] = val.name ? val.name: val.chineseName;
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
  },
};
