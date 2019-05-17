import { getMenuList } from '@/services/api';
import { getMenuSessionData, getMenuMapArrData } from '@/utils/utils.js';
const bossApi = 'https://boss.icarbonx.com/bosssample';
export default {
  namespace: 'views',

  state: {
    datas: [],
    urlValues: '',
    urlDatas: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getMenuList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *changeurl2({ payload }, {put }) {
      console.log(payload,'sssssssssss')
      yield put({
        type: 'change',
        payload: payload,
      });
    },
    *changeurl({ payload }, {call, put }) {
      const {urlDatas, url} = payload
      console.log(payload,'AAAAAAAAAAAAAAAAAA')
      const len = Object.keys(urlDatas).length
      if (len > 0){
        yield put({
          type: 'change',
          payload: url,
        });
      } else {
        const response = yield call(getMenuList, payload);
        const resFinish = {
          response,
          url
        }
        yield put({
          type: 'saveChange',
          payload: resFinish,
        });
      }
    },
  },

  reducers: {
    save(state, action) {
      console.log('111111111111')
      return {
        ...state,
        datas: getMenuMapArrData(action.payload),
        // datas: action.payload,
        urlDatas: getMenuSessionData(action.payload),
      };
    },
    saveChange(state, action) {
      const {response} = action.payload
      const urlDatas = getMenuSessionData(response)
      const url = `${action.payload.url}`;
      let urlValues = '';
      if (urlDatas[url].url.indexOf('https://') != -1) {
        window.open(urlDatas[url].url);
      } else {
        if (urlDatas[url].url.indexOf('lims-ui') !== -1) {
          urlValues = urlDatas ? `https://boss.icarbonx.com${urlDatas[url].url}` : '';
        } else {
          urlValues = urlDatas ? `https://boss.icarbonx.com/bosssample${urlDatas[url].url}` : '';
        }
      }
      const datas = getMenuMapArrData(response)
      return {
        ...state,
        datas,
        // datas: action.payload,
        urlDatas,
        urlValues,
      };
    },
    change(state, action) {
      const url = `${action.payload}`;
      const {urlDatas} = state
      let urlValues = '';
      const len = Object.keys(urlDatas).length
      console.log(urlDatas,state, 'state.urlDatas')
      if (len > 0) {
        if (urlDatas[url]) {
          if (urlDatas[url].url.indexOf('https://') != -1) {
            window.open(urlDatas[url].url);
          } else {
            if (urlDatas[url].url.indexOf('lims-ui') !== -1) {
              urlValues = urlDatas ? `https://boss.icarbonx.com${urlDatas[url].url}` : '';
            } else {
              urlValues = urlDatas ? `https://boss.icarbonx.com/bosssample${urlDatas[url].url}` : '';
            }
          }
        }
      }
      return {
        ...state,
        urlValues,
      };
    },
  },
};
