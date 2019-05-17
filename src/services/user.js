import request from '@/utils/request';
let bossApi = 'https://boss.icarbonx.com';
const bosssampleApi = 'https://boss.icarbonx.com/bosssample';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  // return request(`${bossApi}/bosssample/euasagent-embedded-api/current-user`);
  return request(`${bossApi}/bosssample/euasagent-embedded-api/current-user`);
}

// 修改密码
export async function putPWD(datas) {
  let params = Object.assign(
    {},
    {
      email: '',
    },
    datas
  );
  let param = {
    dto: params.dto,
  };
  return request(`https://euas.icarbonx.cn/server/api/users/${params.email}/change_password`, {
    method: 'PUT',
    body: param.dto,
  });
}
