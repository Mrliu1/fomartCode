import { stringify } from 'qs';
import request from '@/utils/request';
const bossApi = 'https://boss.icarbonx.com';

// 业务代码
// 工序管理相关接口 1. 分页查询工序列表
export async function getProcessPage(datas = {}) {
  const params = Object.assign(
    {},
    {
      code: '',
      name: '',
      nodeType: '',
      state: '',
      pageNum: '1',
      pageSize: '10',
    },
    datas
  );
  return request(`${bossApi}/bosslab/experimentRelations/processes/page?${stringify(params)}`);
  // return request(`${bossApi}/bossmexam/station/page?stationName=${params.stationName}&projectNames=${params.projectNames}&pageNum=${params.pageNum}&pageSize=${params.pageSize}`);
}

// 工序管理相关接口 2. 查询工序接口
export async function getProcessDetail(datas = {}) {
  const params = Object.assign(
    {},
    {
      id: '',
    },
    datas
  );
  console.log(params);
  return request(`${bossApi}/bosslab/experimentRelations/processes/${params.id}`);
  // return request(`${bossApi}/bossmexam/station/page?stationName=${params.stationName}&projectNames=${params.projectNames}&pageNum=${params.pageNum}&pageSize=${params.pageSize}`);
}

// 工序管理相关接口 3. 提交工序修改接口
export async function submitProcess(datas) {
  const params = Object.assign(
    {},
    {
      id: '',
      handPeriod: '',
      handPeriodType: '',
    },
    datas
  );
  return request(`${bossApi}/bosslab/experimentRelations/process`, {
    method: 'PUT',
    body: params,
  });
}

// 工序管理相关接口 4. 查询工序列表
export async function getProcessesAll() {
  return request(`${bossApi}/bosslab/experimentRelations/processes`, {
    method: 'GET',
  });
}

// 工艺方法相关接口 1. 分页查询工艺方法列表
export async function getProcessMethodPage(datas) {
  const params = Object.assign(
    {},
    {
      code: '',
    },
    datas
  );
  console.log(params)
  return request(`${bossApi}/bosslab/experimentRelations/processMethods/page?${stringify(params)}`, {
    method: 'GET',
  });
}
// 工艺方法相关接口 4. 保存工艺方法接口
export async function saveProcessMethod(datas) {
  const params = Object.assign(
    {},
    {
      name: '',
      processCode: '',
    },
    datas
  );
  return request(`${bossApi}/bosslab/experimentRelations/processMethod`, {
    method: 'POST',
    body: params,
  });
}
// 工艺方法相关接口 5. 提交工艺方法接口
export async function submitProcessMethod(datas) {
  const params = Object.assign(
    {},
    {
      name: '',
      processCode: '',
    },
    datas
  );
  return request(`${bossApi}/bosslab/experimentRelations/processMethod`, {
    method: 'PUT',
    body: params,
  });
}
// 工艺方法相关接口 5. 查询工艺方法接口
export async function getProcessMethodDetail(datas) {
  const params = Object.assign(
    {},
    {
      id: '',
    },
    datas
  );
  return request(`${bossApi}/bosslab/experimentRelations/processMethods/${params.id}`, {
    method: 'GET',
  });
}
// 工艺方法相关接口 6. 启用/禁用工艺方法接口
export async function isActivateProcessMethod(datas) {
  const params = Object.assign(
    {},
    {
      id: '',
      isActivate: '',
    },
    datas
  );
  return request(
    `${bossApi}/bosslab/experimentRelations/processMethods/state/${params.isActivate}/${params.id}`,
    {
      method: 'PUT',
      body: params,
    }
  );
}
// 检测机构管理相关接口 7. 工艺方法删除接口
export async function deleteProcessMethod(datas = {}) {
  const params = Object.assign(
    {},
    {
      id: '',
    },
    datas
  );
  return request(`${bossApi}/bosslab/experimentRelations/processMethods/${params.id}`, {
    method: 'DELETE',
    body: params,
  });
}

// 技术路线相关接口 1.获取样本类型列表
export async function getSampleTypes() {
  return request(`${bossApi}/bosslab/commontype/getSampleTypes`);
}

// 技术路线相关接口 3.获取工序列表
export async function getProcessesRouter() {
  return request(`${bossApi}/bosslab/experimentRelations/processes`);
}
// 技术路线相关接口 4.技术路线列表
export async function getRouterPage(datas = {}) {
  const params = Object.assign(
    {},
    {
      code: '',
    },
    datas
  );
    console.log(params)
  return request(`${bossApi}/bosslab/experimentRelations/route/page?${stringify(params)}`, {
    method: 'GET',
    // body: params,
  });
}
// 技术路线相关接口 1.获取样本类型列表
export async function getRouterDetail(datas) {
  const params = Object.assign(
    {},
    {
      id: '',
    },
    datas
  );
  return request(`${bossApi}/bosslab/experimentRelations/route/${params.id}/detail`);
}
// 技术路线相关接口 6.技术路线新增
export async function createRoute(datas = {}) {
  const params = Object.assign(
    {},
    {
      code: '',
    },
    datas
  );
  return request(`${bossApi}/bosslab/experimentRelations/route`, {
    method: 'POST',
    body: params,
  });
}
// 技术路线相关接口 7.技术路线更新
export async function updateRoute(datas = {}) {
  const params = Object.assign(
    {},
    {
      code: '',
    },
    datas
  );
  return request(`${bossApi}/bosslab/experimentRelations/route`, {
    method: 'PUT',
    body: params,
  });
}
// 技术路线相关接口 8.技术路线删除
export async function deleteRoute(datas = {}) {
  const params = Object.assign(
    {},
    {
      id: '',
    },
    datas
  );
  return request(`${bossApi}/bosslab/experimentRelations/route/${params.id}/delete`, {
    method: 'DELETE',
    body: params,
  });
}
// 技术路线相关接口 9.启用/禁用
export async function changeStatusRoute(datas = {}) {
  const params = Object.assign(
    {},
    {
      isActivate: '',
      id: '',
    },
    datas
  );
  return request(
    `${bossApi}/bosslab/experimentRelations/route/state/${params.isActivate}/${params.id}`,
    {
      method: 'PUT',
      body: params,
    }
  );
}

// 技术路线相关接口 12.得到所有技术路线
export async function getRouteDict() {
  return request(
    `${bossApi}/bosslab/experimentRelations/routes`,
    {
      method: 'GET',
    }
  );
}

// 检测包相关接口文档 1. 分页查询检测包列表
export async function getPacketsPage(datas = {}) {
  const params = Object.assign(
    {},
    {
      packetName: '',
      packetCode: '',
      packetState: '',
    },
    datas
  );
  return request(`${bossApi}/bosslab/experimentRelations/packets/page?${stringify(params)}`, {
    method: 'GET',
    // body: params,
  });
}
// 检测包相关接口文档 2. 新增检测包
export async function createPacket(datas = {}) {
  const params = Object.assign(
    {},
    {
      packetName: '',
      sampleMode: '',
      handPeriod: '',
      handPeriodType: '',
      remark: '',
      bios: [],
      omics: [],
      funcs: [],
      boxes: []
    },
    datas
  );
  return request(`${bossApi}/bosslab/experimentRelations/packet`, {
    method: 'POST',
    body: params,
  });
}
// 检测包相关接口文档 3. 编辑检测包
export async function editPacket(datas = {}) {
  const params = Object.assign(
    {},
    {
      id: '',
      packetName: '',
      sampleMode: '',
      handPeriod: '',
      handPeriodType: '',
      remark: '',
      bios: [],
      omics: [],
      funcs: [],
      boxes: []
    },
    datas
  );
  return request(`${bossApi}/bosslab/experimentRelations/packet`, {
    method: 'PUT',
    body: params,
  });
}
// 检测包相关接口文档 4. 删除检测包
export async function deletePacket(datas = {}) {
  const params = Object.assign(
    {},
    {
      id: '',
    },
    datas
  );
  return request(`${bossApi}/bosslab/experimentRelations/packets/${params.id}`, {
    method: 'DELETE',
    body: params,
  });
}
// 检测包相关接口文档 5. 禁用检测包
export async function disabledPacket(datas = {}) {
  const params = Object.assign(
    {},
    {
      id: '',
    },
    datas
  );
  return request(`${bossApi}/bosslab/experimentRelations/packets/${params.id}/deactivation`, {
    method: 'PUT',
    body: params,
  });
}
// 检测包相关接口文档 6. 启用检测包
export async function usePacket(datas = {}) {
  const params = Object.assign(
    {},
    {
      id: '',
    },
    datas
  );
  return request(`${bossApi}/bosslab/experimentRelations/packets/${params.id}/activation`, {
    method: 'PUT',
    body: params,
  });
}
// 检测包相关接口文档 8. 查看检测包详情
export async function getPacketDetail(datas = {}) {
  const params = Object.assign(
    {},
    {
      id: '',
    },
    datas
  );
  return request(`${bossApi}/bosslab/experimentRelations/packets/${params.id}`, {
    method: 'GET',
    // body: params,
  });
}
// 检测包相关接口文档 10. 查询检验套餐(默认取启用的列表)
export async function getPacks(datas = {}) {
  const params = Object.assign(
    {},
    {
      packName: '',
      packCode: '',
      packState: 'ENABLE'
    },
    datas
  );
  console.log(params,'paramsparamsparams')
  return request(`${bossApi}/bosslab/outer/packs?${stringify(params)}`, {
    method: 'GET',
    // body: params,
  });
}
// 检测包相关接口文档 11. 查询采样盒类型列表
export async function getSampleBoxTypes(datas = {}) {
  const params = Object.assign(
    {},
    {
      boxTypeCode: '',
      boxTypeName: '',
    },
    datas
  );
  return request(`${bossApi}/bosslab/outer/sampleBoxTypes/page?${stringify(params)}`, {
    method: 'GET',
    // body: params,
  });
}
// 检测包相关接口文档 12. 查询采样盒类型详情
export async function getSampleBoxType(datas = {}) {
  const params = Object.assign(
    {},
    {
      boxTypeId: '',
    },
    datas
  );
  return request(`${bossApi}/bosslab/outer/sampleBoxTypes/${param.boxTypeId}`, {
    method: 'GET',
    // body: params,
  });
}
// 检测包相关接口文档 13. 提交检测包
export async function submitPacket(datas = {}) {
  const params = Object.assign(
    {},
    {
      id: '',
      packetName: '',
      sampleMode: '',
      handPeriod: '',
      handPeriodType: '',
      remark: '',
      bios: [],
      omics: [],
      funcs: [],
      boxes: []
    },
    datas
  );
  return request(`${bossApi}/bosslab/experimentRelations/packet/publish`, {
    method: 'PUT',
    body: params,
  });
}
// 检测包相关接口文档 14. 查看检验套餐详情
export async function getPackDetail(datas = {}) {
  const params = Object.assign(
    {},
    {
      packId: '',
    },
    datas
  );
  return request(`${bossApi}/bosslab/outer/packs/${params.packId}`, {
    method: 'GET',
    // body: params,
  });
}


// 检测项相关接口文档1 1. 分页查询检测项列表
export async function getExperimentsPage(datas = {}) {
  const params = Object.assign(
    {},
    {
      experimentName: '',
      experimentCode: '',
      routeName: '',
      routeCode: '',
      experimentState: '',
    },
    datas
  );
  return request(`${bossApi}/bosslab/experimentRelations/experiments/page?${stringify(params)}`, {
    method: 'GET',
    // body: params,
  });
}
// 检测项相关接口文档1 2. 新增检测项
export async function createExperiment(datas = {}) {
  const params = Object.assign(
    {},
    {
      experimentName: '',
      routeId: '',
      outDataType: '',
      seqInstrument: '',
      remark: '',
    },
    datas
  );
  return request(`${bossApi}/bosslab/experimentRelations/experiment`, {
    method: 'POST',
    body: params,
  });
}
// 检测项相关接口文档1 3. 编辑检测项
export async function editExperiment(datas = {}) {
  const params = Object.assign(
    {},
    {
      id: '',
      experimentName: '',
      routeId: '',
      outDataType: '',
      seqInstrument: '',
      remark: '',
    },
    datas
  );
  return request(`${bossApi}/bosslab/experimentRelations/experiment`, {
    method: 'PUT',
    body: params,
  });
}
// 检测项相关接口文档1 4. 删除检测项
export async function deleteExperiment(datas = {}) {
  const params = Object.assign(
    {},
    {
      id: '',
    },
    datas
  );
  return request(`${bossApi}/bosslab/experimentRelations/experiments/${params.id}`, {
    method: 'DELETE',
    body: params,
  });
}
// 检测项相关接口文档1 5. 禁用检测项
export async function disabledExperiment(datas = {}) {
  const params = Object.assign(
    {},
    {
      id: '',
    },
    datas
  );
  return request(
    `${bossApi}/bosslab/experimentRelations/experiments/${params.id}/deactivation`,
    {
      method: 'PUT',
      body: params,
    }
  );
}
// 检测项相关接口文档1 6. 启用检测项
export async function useExperiment(datas = {}) {
  const params = Object.assign(
    {},
    {
      id: '',
    },
    datas
  );
  return request(
    `${bossApi}/bosslab/experimentRelations/experiments/${params.id}/activation`,
    {
      method: 'PUT',
      body: params,
    }
  );
}
// 检测项相关接口文档1 8. 查看检测项详情
export async function getExperimentDetail(datas = {}) {
  const params = Object.assign(
    {},
    {
      id: '',
    },
    datas
  );
  return request(`${bossApi}/bosslab/experimentRelations/experiments/${params.id}`, {
    method: 'GET',
    // body: params,
  });
}
// 检测项相关接口文档1 10. 提交检测项
export async function submitExperiment(datas = {}) {
  const params = Object.assign(
    {},
    {
      id: '',
      experimentName: '',
      routeId: '',
      outDataType: '',
      seqInstrument: '',
      remark: '',
    },
    datas
  );
  return request(`${bossApi}/bosslab/experimentRelations/experiment/publish`, {
    method: 'PUT',
    body: params,
  });
}
