import moment from 'moment';
import React from 'react';
import nzh from 'nzh/cn';
import {
  Card,
  Button,
  Form,
  Icon,
  Col,
  Row,
  DatePicker,
  Input,
  Select,
  Upload,
} from 'antd';
import DescriptionList from '@/components/DescriptionList';
import { parse, stringify } from 'qs';
const FormItem = Form.Item;
const Option = Select.Option;

const { Description } = DescriptionList;
export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  const year = now.getFullYear();
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  return nzh.toMoney(n);
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function formatWan(val) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';

  let result = val;
  if (val > 10000) {
    result = Math.floor(val / 10000);
    result = (
      <span>
        {result}
        <span
          style={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export function isAntdPro() {
  return window.location.hostname === 'preview.pro.ant.design';
}

// 将字典转换为数组
export function dictToSelectArray(dict) {
  let dictArray = [];
  if (dict === null || dict.length === 0) {
    return dictArray;
  }
  for (let key of Object.keys(dict)) {
    let dictItem = {};
    dictItem['key'] = key;
    dictItem['value'] = dict[key];
    dictArray.push(dictItem);
  }
  return dictArray;
}
// 将字典转换为数组
export function selectArrayToDict(arr) {
  let dict = {};
  if (arr.length === 0) {
    return dict;
  }
  arr.forEach(val => {
    dict[val.key] = val.value
  })
  return dict;
}
// 格式化菜單緩存對象
export function getMenuSessionData(data) {
  const targetMenuObj = {
    key: data
  }
  const targetMenuObjCopy = JSON.parse(JSON.stringify(targetMenuObj));
  let datas = Array.from(Object.values(targetMenuObjCopy)[0]);
  // datas = Array.from(datas[0].children);
  let newObj = {};
  let mapArr = [];
  const objDeepCopy = (source = []) => {
    let sourceCopy = source instanceof Array ? [] : {};
    for (var item in source) {
      if (typeof source[item] === 'object') {
        sourceCopy[item] = objDeepCopy(source[item]);
      } else {
        // source['path'] = `/${source.id.replace('.', '/')}`
        // sourceCopy['name'] = source.id;
        sourceCopy['path'] = `/${source.id.replace('.', '/')}`;
        sourceCopy[item] = source[item];
      }
    }
    return sourceCopy;
  };
  mapArr = objDeepCopy(datas); // 使用mapArr去比对
  // 传递给路由的缓存
  const dealFn = (data, path = '') => {
    let menuSessionData = {};
    data.forEach(item => {
      let newPath = path? path : '';
      if (item.path) {
        if (item.children && item.children.length > 0) {
          newPath = newPath + item.path;
          item['iframe'] = true;
          menuSessionData[newPath] = dealFn(Array.from(item.children), newPath);
          menuSessionData = { ...menuSessionData, ...menuSessionData[newPath] };
          menuSessionData[newPath] = item;
        } else {
          newPath = path + item.path;
          item['iframe'] = true;
          menuSessionData[newPath] = item;
        }
      }
    });
    return menuSessionData;
  };
  const menuSessionData = dealFn(mapArr);
  return menuSessionData;
}
// 格式化菜單數組
export function getMenuMapArrData(data) {
  if (JSON.stringify(data) === '{}') {
    return []
  }
  const targetMenuObj = {
    key: data
  }
  const targetMenuObjCopy = JSON.parse(JSON.stringify(targetMenuObj));
  let datas = Array.from(Object.values(targetMenuObjCopy)[0]);
  // datas = Array.from(datas[0].children);
  let mapArr = [];
  const objDeepCopy = (source = []) => {
    let sourceCopy = source instanceof Array ? [] : {};
    if(source instanceof Array){
      source = source.filter(fval => fval.dependent == undefined || fval.dependent != true)
    }
    for (var item in source) {
      if (
        (source[item] !== undefined || source[item] !== null || source[item] !== '') &&
        typeof source[item] === 'object'
      ) {
        // delete source[item].children
        sourceCopy['name'] = source.id;
        sourceCopy[item] = objDeepCopy(source[item]);
        if (item == 'children' && source[item] && source[item].length > 0) {
          sourceCopy['routes'] = source.children;
          sourceCopy['routes'] = objDeepCopy(source[item]);
        }
      } else {
        source['path'] = `/${source.id.replace('.', '/')}`;
        source['name'] = source.id;
        sourceCopy['path'] = `/${source.id.replace('.', '/')}`;
        sourceCopy['name'] = source.id;
        sourceCopy[item] = source[item];
        // sourceCopy['component'] = './View/home'
      }
    }
    return sourceCopy;
  };

  // 传递给路由的缓存
  const dealFn = (data, path = '') => {
    let menuSessionData = [];
    data.forEach(item => {
      let newPath = path? path: '';
      if (item.path) {
        if (item.routes && item.routes.length > 0) {
          newPath = newPath + item.path;
          item['path'] = newPath
          dealFn(Array.from(item.routes), newPath);
        } else {
          newPath = path + item.path;
          item['path'] = newPath;
          // menuSessionData[newPath] = item
        }
      }
    });
    menuSessionData = data;
    return menuSessionData;
  };
  let deleteChild = data => {
    for (let val in data) {
      if (typeof data[val] === 'object') {
        if (val === 'children') {
          delete data.children;
        } else if (val === 'routes') {
          data[val] = deleteChild(data.routes);
        }
      } else {
        delete data.children;
      }
    }
    return data;
  };
  mapArr = objDeepCopy(datas); // 使用mapArr去比对
  const dealArr = dealFn(mapArr);
  const transData = deleteChild(dealArr);
  return transData;
}
// 生成详情描述dom
export const getDetailDescDom = (formData, data) => {
  return formData.map(val => {
    if (val.type === 'time') {
      return (
        <Description key={val.key} term={val.label}>{data[val.key] ? moment(data[val.key]).format('YYYY-MM-DD HH:mm:ss') : ''}</Description>
      )
    } else if (val.type === 'upload') {
      return (
        <Description key={val.key} term={val.label}><a href={data[val.key]} target={'_blank'}  download={data[val.key] ? data[val.key].slice(0, 16) : ''}>{data[val.key] ? data[val.key].slice(0, 16) : ''}</a></Description>
      )
    } else if (val.type === 'select') {
      let dict = selectArrayToDict(val.selectArr)
      if (val.maode === 'multiple') {
        return (
          <Description key={val.key} term={val.label}>{data[val.key].map(cval => dict[cval])}</Description>
        )
      } else {
        return (
          <Description key={val.key} term={val.label}>{dict[data[val.key]]}</Description>
        )
      }
    } else {
      return (
        <Description key={val.key} term={val.label}>{data[val.key]}</Description>
      )
    }
  })
}

// 生成表单Dom
export const getFromDom = (data, props, transParams) => {
  const {
    form: { getFieldDecorator },
  } = props;
  // const { transParams } = this.state;
  // 解决编辑和新建的区分
  if (!transParams || JSON.stringify(transParams) === '{}') {
    data = data.filter(val => !val.disabled)
  }

  let DomArr = [];
  let newDom = datas => {
    return datas.map(val => {
      if (val.type === 'input') {
        return (
          <Col lg={4} md={8} sm={24}>
            <Form.Item key={val.key} className={val.require? 'antRequired' : ''} label={val.label}>
              {getFieldDecorator(val.key, {
                initialValue: transParams[val.key] ? transParams[val.key] : val.value,
                rules: [{ required: val.require, message: `请输入${val.label}` }],
              })(<Input placeholder={`请输入${val.label}`} disabled={val.disabled} />)}
            </Form.Item>
          </Col>
        );
      } else if (val.type === 'time') {
        return (
          <Col lg={4} md={8} sm={24}>
            <Form.Item label={val.label} key={val.key} className={val.require? 'antRequired' : ''}>
              {getFieldDecorator(val.key, {
                initialValue: (transParams&&transParams[val.key]) ? moment(transParams[val.key]).format('YYYY-MM-DD HH:mm:ss') : '',
                rules: [{ required: val.require, message: `请选择${val.label}` }],
              })(
                val.disabled ? <Input placeholder={`请输入${val.label}`} disabled={val.disabled} /> :
                <DatePicker
                  showTime
                  placeholder={`请选择${val.label}`}
                />
              )}
            </Form.Item>
          </Col>
        );
      } else if (val.type === 'select') {
        return (
          <Col lg={4} md={8} sm={24}>
            <Form.Item label={val.label} key={val.key} className={val.require? 'antRequired' : ''}>
              {getFieldDecorator(val.key, {
                initialValue: transParams ? transParams[val.key] : val.value,
                rules: [{ required: val.require, message: `请选择${val.label}` }],
              })(
                <Select placeholder={`请选择${val.label}`} disabled={val.disabled} allowClear="true"
                mode={val.mode ? val.mode : ''}>
                  {val.selectArr.length > 0
                    ? val.selectArr.map(sval => {
                        return (<Option key={sval.key} value={sval.key}>{sval.value}</Option>);
                      })
                    : []}
                </Select>
              )}
            </Form.Item>
          </Col>
        );
      } else if (val.type === 'upload') {
        const props = {
          action: val.action,
          onChange: val.fn,
          multiple: true,
        };
        return (
          <Col lg={4} md={8} sm={24}>
            <div className="clearfix">
              <Form.Item label={val.label} key={val.key} className={val.require? 'antRequired' : ''}>
                <Upload {...props} fileList={val.fileList} disabled={val.disabled}>
                  <Button type="ghost">
                    <Icon type="upload" /> 点击上传
                  </Button>
                </Upload>
              </Form.Item>
            </div>
          </Col>
        );
      }
    });
  };
  for (let i = 0, len = data.length; i < len; i += 6) {
    console.log(i);
    DomArr.push(<Row gutter={16}>{newDom(data.slice(i, i + 6))}</Row>);
  }
  return DomArr;
};


// 保留小数校验可以为负
export const changeNumberAll = function (val, number) {
  if (val) {
    if (Number(val).toString() !== 'NaN') {
      if (number === 0) {
        val = parseInt(val)
      }
      val = val.toString()
      let index = val.indexOf('.')
      if (index !== -1) {
        let end = index + number + 1
        let before = val.slice(0, index + 1)
        let afterVal = val.slice(index + 1).toString().replace(/[^\d]/g, '')
        val = before + afterVal + ''
        val = val.slice(0, end)
      } else if (val === '00' || val === '000') {
        val = '0'
      }
    } else {
      val = val.toString()
      let length = val.length
      if (length === 0) {
        val = ''
      } else if (val.toString().indexOf('-') === 0 && val.slice(1, length).toString().indexOf('-') === -1) {
        if (val.toString().indexOf('--') !== -1) {
          val = '-'
        }
      } else {
        // 处理失焦时清除非数字
        val = val.toString().replace(/[^\d]/g, '')
      }
    }
  }
  return val
}

// 保留小数校验
 export const changeNumber = function (val, number) {
  if (val) {
    if (Number(val).toString() !== 'NaN') {
      val = val.toString()
      let index = val.indexOf('.')
      if (index !== -1) {
        let end = index + number + 1
        let before = val.slice(0, index + 1)
        let afterVal = val.slice(index + 1).toString().replace(/[^\d]/g, '')
        val = before + afterVal + ''
        val = val.slice(0, end)
      }
    } else {
      val = val.toString()
      let length = val.length
      if (length === 0) {
        val = ''
      } else {
        val = val.slice(0, length - 1)
      }
      // 处理失焦时清除非数字
      val = val.toString().replace(/[^\d]/g, '')
    }
    val = val.toString().replace('-', '')
  }
  return val
}
