import { stringify } from 'qs';
import request from '@/utils/request';
const bossApi = 'https://boss.icarbonx.com';
const bosssampleApi = 'https://boss.icarbonx.com/bosssample';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    body: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile(id) {
  return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}

// 业务代码
// 检测项目管理相关接口 1分页查询检测机构列表（这个是测试接口正式接口时要修改）
export async function getProjectSearch(datas = {}) {
  let params = Object.assign(
    {},
    {
      stationName: '',
      projectNames: '',
      pageNum: '1',
      pageSize: '10',
    },
    datas
  );
  return request(`${bossApi}/bossmexam/station/page?${stringify(params)}`);
  // return request(`${bossApi}/bossmexam/station/page?stationName=${params.stationName}&projectNames=${params.projectNames}&pageNum=${params.pageNum}&pageSize=${params.pageSize}`);
}

// 检测机构管理相关接口 1分页查询检测机构列表
export async function getStationSearch(datas = {}) {
  let params = Object.assign(
    {},
    {
      stationName: '',
      projectNames: '',
      pageNum: '1',
      pageSize: '10',
    },
    datas
  );
  console.log(params);
  return request(`${bossApi}/bossmexam/station/page?${stringify(params)}`);
  // return request(`${bossApi}/bossmexam/station/page?stationName=${params.stationName}&projectNames=${params.projectNames}&pageNum=${params.pageNum}&pageSize=${params.pageSize}`);
}
// 检测机构管理相关接口 2. 查询所有可用的检测机构列表
export async function getStationEnables(datas = {}) {
  return request(`${bossApi}/bossmexam/station/enables`);
}
// 检测机构管理相关接口 3. 新增检测机构
export async function addStation(datas) {
  let params = Object.assign(
    {},
    {
      stationName: '',
      remark: '',
      sampleSource: '',
    },
    datas
  );
  return request(`${bossApi}/bossmexam/station`, {
    method: 'POST',
    body: params,
  });
}
// 检测机构管理相关接口 4. 启用检测机构
export async function useStation(datas) {
  let params = Object.assign(
    {},
    {
      stationId: '',
    },
    datas
  );
  return request(`${bossApi}/bossmexam/stations/${params.stationId}/enable`, {
    method: 'PUT',
  });
}
// 检测机构管理相关接口 5. 禁用检测机构
export async function disableStation(datas) {
  let params = Object.assign(
    {},
    {
      stationId: '',
    },
    datas
  );
  return request(`${bossApi}/bossmexam/stations/${params.stationId}/disable`, {
    method: 'PUT',
  });
}
// 检测机构管理相关接口 6. 配置检测机构上传模板
export async function templateStation(datas) {
  let params = Object.assign(
    {},
    {
      organStationId: '',
      templeteIndex: '',
    },
    datas
  );
  return request(`${bossApi}/bossmexam/station/template`, {
    method: 'PUT',
    body: params,
  });
}
// 检测机构管理相关接口 7. 获取检测机构上传模板
export async function getTemplateStation(datas) {
  let params = Object.assign(
    {},
    {
      organStationId: '',
      templeteIndex: '',
    },
    datas
  );
  return request(`${bossApi}/bossmexam/stations/{stationId}/template`, {
    method: 'PUT',
    body: params,
  });
}
// 检测机构管理相关接口 8. 下载上传检测项模板
export async function getProjectTemplat(datas = {}) {
  return request(`${bossApi}/bossmexam/station/project/templat`);
}
// 检测机构管理相关接口 9. 读取检测项文件
export async function getProjectFile(datas = {}) {
  let params = Object.assign(
    {},
    {
      file: '',
    },
    datas
  );
  return request(`${bossApi}/bossmexam/station/project/file`, {
    method: 'POST',
    body: params,
  });
}
// 检测机构管理相关接口 10. 保存检测项列表
export async function saveStationProjects(datas = {}) {
  let params = Object.assign(
    {},
    {
      stationId: '',
      projects: [],
    },
    datas
  );
  return request(`${bossApi}/bossmexam/station/projects`, {
    method: 'POST',
    body: params,
  });
}

// 登出接口
export async function fakeAccountLoginOut(datas = {}) {
  // let params = Object.assign({}, {
  // }, datas)
  return request(`https://euas.icarbonx.cn/server/logout`);
  // return request(`${bossApi}/bossmexam/station/page?stationName=${params.stationName}&projectNames=${params.projectNames}&pageNum=${params.pageNum}&pageSize=${params.pageSize}`);
}
// 获取当前用户可显示菜单
export async function getMenuList(datas = {}) {
  // let params = Object.assign({}, {
  // }, datas)
  return request(`${bosssampleApi}/euasagent-embedded-api/menu-tree`);
  // return request(`bossApi/bosssample/euasagent-embedded-api/menu-tree`);
  // return request(`/api/bosslab/euasagent-embedded-api/menu-tree`);
}
