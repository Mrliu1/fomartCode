import { stringify } from 'qs';
import request from '@/utils/request';
const bossApi = 'https://boss.icarbonx.com';
//10. 查询使用单位接口
export async function getUnits() {
  return request(`${bossApi}/bosslab/commontype/SampleUnits`, {
    method: 'GET',
  });
}
