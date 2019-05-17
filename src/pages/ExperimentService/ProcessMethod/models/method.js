import {
  getProcessMethodPage,
  getProcessMethodDetail,
  saveProcessMethod,
  submitProcessMethod,
  isActivateProcessMethod,
  deleteProcessMethod,
  updateRoute,
  getProcessesAll,
} from '@/services/experimentServiceApi';
import { message } from 'antd';
export default {
  namespace: 'method',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    initDictObj: {},
    res: {},
    mData: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getProcessMethodPage, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    // 记得切换调用的API 试剂耗材
    *getReagents({ payload }, { call, put }) {
      // const response = yield call(getProcessMethodPage, payload);
      const res = yield call(getProcessMethodPage, payload);
      const response = {
    "errorCode": 0,
    "errMsg": null,
    "timestamp": 1556420157186,
    "data": {
        "dataList": [
            {
                "id": 3,
                "code": "",
                "name": "sample-ui",
                "productCode": "TP0010002",
                "productName": "RNA提取",
                "brand": "PENDING",
                "operateOrderUrl": null,
                "reagents": null,
                "remark": "w",
                "version": null,
                "modifyTime": 1556255320000,
                "modifyPerson": "Default",
                "createPerson": "Default",
                "createTime": 1556255320000,
                "mTargetSampleTypes": [
                    null
                ],
                "fTargetSampleTypeId": 2
            },
            {
                "id": 4,
                "code": "",
                "name": "sample-uippp",
                "productCode": "TP0000102",
                "productName": "RNA提取",
                "state": "PENDING",
                "operateOrderUrl": null,
                "reagents": null,
                "remark": "w",
                "version": null,
                "modifyTime": 1556255341000,
                "brand": "Default",
                "createPerson": "Default",
                "createTime": 1556255341000,
                "mTargetSampleTypes": [
                    null
                ],
                "fTargetSampleTypeId": 2
            },
            {
                "id": 5,
                "code": "",
                "name": "FROM-COACH-PLATFORM",
                "productCode": "TP0000021",
                "productName": "RNAe提取",
                "state": "PENDING",
                "operateOrderUrl": null,
                "reagents": null,
                "remark": "qw",
                "version": null,
                "brand": 1556255553000,
                "modifyPerson": "Default",
                "createPerson": "Default",
                "createTime": 1556255553000,
                "mTargetSampleTypes": [
                    null
                ],
                "fTargetSampleTypeId": 2
            },
            {
                "id": 6,
                "code": "",
                "name": "sample-ui12342",
                "productCode": "TP000r001",
                "productName": "DNweA提取",
                "state": "DRAFT",
                "operateOrderUrl": null,
                "reagents": null,
                "brand": "123",
                "version": null,
                "modifyTime": 1556273091000,
                "modifyPerson": "Default",
                "createPerson": "Default",
                "createTime": 1556273091000,
                "mTargetSampleTypes": [
                    null
                ],
                "fTargetSampleTypeId": 2
            },
            {
                "id": 7,
                "code": "",
                "name": "sample-ui1233342",
                "productCode": "TP0000e01",
                "productName": "DNArr提取",
                "state": "DRAFT",
                "operateOrderUrl": null,
                "reagents": null,
                "brand": "123",
                "version": null,
                "modifyTime": 1556273120000,
                "modifyPerson": "Default",
                "createPerson": "Default",
                "createTime": 1556273120000,
                "mTargetSampleTypes": [
                    null
                ],
                "fTargetSampleTypeId": 2
            }
        ],
        "totalSize": 5,
        "totalPage": 1,
        "pageNum": 1,
        "pageSize": 10,
        "nextPage": 1,
        "prePage": 1,
        "filter": null
    }
  }
      const responseFinish = {
        response,
        key: 'reagents',
      }
      yield put({
        type: 'saveMData',
        payload: responseFinish,
      });
    },
    *getProcessMethodDetailFn({ payload }, { call, put }) {
      const response = yield call(getProcessMethodDetail, payload);
      yield put({
        type: 'saveNo',
        payload: response,
      });
    },
    *saveProcessMethodFn({ payload, callback }, { call, put }) {
      const response = yield call(saveProcessMethod, payload);
      yield put({
        type: 'saveSubmit',
        payload: response,
        callback,
      });
      if (response.errorCode === 0 && callback) callback();
    },
    *submitProcessMethodFn({ payload, callback }, { call, put }) {
      const response = yield call(submitProcessMethod, payload);
      yield put({
        type: 'saveSubmit',
        payload: response,
        callback,
      });
      if (response.errorCode === 0 && callback) callback();
    },
    *isActivateProcessMethodFn({ payload, callback }, { call, put }) {
      const response = yield call(isActivateProcessMethod, payload);
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
    *deleteProcessMethodFn({ payload, callback }, { call, put }) {
      const response = yield call(deleteProcessMethod, payload);
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
    // 字典项
    saveInitDict(state, action) {
      const { response, key } = action.payload;
      const targetData = response.data;
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
      console.log(dictObj, 'weeeee');
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
