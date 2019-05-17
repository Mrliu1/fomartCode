import mockjs from 'mockjs';
let bossApi = 'https://boss.icarbonx.com';

const titles = [
  'Alipay',
  'Angular',
  'Ant Design',
  'iCarbonX',
  'Bootstrap',
  'React',
  'Vue',
  'Webpack',
];
const avatars = [
  'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png', // Alipay
  'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png', // Angular
  'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png', // Ant Design
  'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png', // Ant Design Pro
  'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png', // Bootstrap
  'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png', // React
  'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png', // Vue
  'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png', // Webpack
];

const avatars2 = [
  'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
  'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png',
  'https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png',
  'https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png',
  'https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png',
  'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
  'https://gw.alipayobjects.com/zos/rmsportal/psOgztMplJMGpVEqfcgF.png',
  'https://gw.alipayobjects.com/zos/rmsportal/ZpBqSxLxVEXfcUNoPKrz.png',
  'https://gw.alipayobjects.com/zos/rmsportal/laiEnJdGHVOhJrUShBaJ.png',
  'https://gw.alipayobjects.com/zos/rmsportal/UrQsqscbKEpNuJcvBZBu.png',
];

const covers = [
  'https://gw.alipayobjects.com/zos/rmsportal/uMfMFlvUuceEyPpotzlq.png',
  'https://gw.alipayobjects.com/zos/rmsportal/iZBVOIhGJiAnhplqjvZW.png',
  'https://gw.alipayobjects.com/zos/rmsportal/iXjVmWVHbCJAyqvDxdtx.png',
  'https://gw.alipayobjects.com/zos/rmsportal/gLaIAoVWTtLbBWZNYEMg.png',
];
const desc = [
  '那是一种内在的东西， 他们到达不了，也无法触及的',
  '希望是一个好东西，也许是最好的，好东西是不会消亡的',
  '生命就像一盒巧克力，结果往往出人意料',
  '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
  '那时候我只会想自己想要什么，从不想自己拥有什么',
];

const user = [
  '付小小',
  '曲丽丽',
  '林东东',
  '周星星',
  '吴加好',
  '朱偏右',
  '鱼酱',
  '乐哥',
  '谭小仪',
  '仲尼',
];

function fakeList(count) {
  const list = [];
  for (let i = 0; i < count; i += 1) {
    list.push({
      id: `fake-list-${i}`,
      owner: user[i % 10],
      title: titles[i % 8],
      avatar: avatars[i % 8],
      cover: parseInt(i / 4, 10) % 2 === 0 ? covers[i % 4] : covers[3 - (i % 4)],
      status: ['active', 'exception', 'normal'][i % 3],
      percent: Math.ceil(Math.random() * 50) + 50,
      logo: avatars[i % 8],
      href: 'https://ant.design',
      updatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i),
      createdAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i),
      subDescription: desc[i % 5],
      description:
        '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。',
      activeUser: Math.ceil(Math.random() * 100000) + 100000,
      newUser: Math.ceil(Math.random() * 1000) + 1000,
      star: Math.ceil(Math.random() * 100) + 100,
      like: Math.ceil(Math.random() * 100) + 100,
      message: Math.ceil(Math.random() * 10) + 10,
      content:
        '段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。',
      members: [
        {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png',
          name: '曲丽丽',
          id: 'member1',
        },
        {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png',
          name: '王昭君',
          id: 'member2',
        },
        {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png',
          name: '董娜娜',
          id: 'member3',
        },
      ],
    });
  }

  return list;
}

let sourceData;

function getFakeList(req, res) {
  const params = req.query;

  const count = params.count * 1 || 20;

  const result = fakeList(count);
  sourceData = result;
  return res.json(result);
}

function postFakeList(req, res) {
  const { /* url = '', */ body } = req;
  // const params = getUrlParams(url);
  const { method, id } = body;
  // const count = (params.count * 1) || 20;
  let result = sourceData;

  switch (method) {
    case 'delete':
      result = result.filter(item => item.id !== id);
      break;
    case 'update':
      result.forEach((item, i) => {
        if (item.id === id) {
          result[i] = Object.assign(item, body);
        }
      });
      break;
    case 'post':
      result.unshift({
        body,
        id: `fake-list-${result.length}`,
        createdAt: new Date().getTime(),
      });
      break;
    default:
      break;
  }

  return res.json(result);
}

const getNotice = [
  {
    id: 'xxx1',
    title: titles[0],
    logo: avatars[0],
    description: '那是一种内在的东西，他们到达不了，也无法触及的',
    updatedAt: new Date(),
    member: '科学搬砖组',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx2',
    title: titles[1],
    logo: avatars[1],
    description: '希望是一个好东西，也许是最好的，好东西是不会消亡的',
    updatedAt: new Date('2017-07-24'),
    member: '全组都是吴彦祖',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx3',
    title: titles[2],
    logo: avatars[2],
    description: '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
    updatedAt: new Date(),
    member: '中二少女团',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx4',
    title: titles[3],
    logo: avatars[3],
    description: '那时候我只会想自己想要什么，从不想自己拥有什么',
    updatedAt: new Date('2017-07-23'),
    member: '程序员日常',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx5',
    title: titles[4],
    logo: avatars[4],
    description: '凛冬将至',
    updatedAt: new Date('2017-07-23'),
    member: '高逼格设计天团',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx6',
    title: titles[5],
    logo: avatars[5],
    description: '生命就像一盒巧克力，结果往往出人意料',
    updatedAt: new Date('2017-07-23'),
    member: '骗你来学计算机',
    href: '',
    memberLink: '',
  },
];

const getActivities = [
  {
    id: 'trend-1',
    updatedAt: new Date(),
    user: {
      name: '曲丽丽',
      avatar: avatars2[0],
    },
    group: {
      name: '高逼格设计天团',
      link: 'http://github.com/',
    },
    project: {
      name: '六月迭代',
      link: 'http://github.com/',
    },
    template: '在 @{group} 新建项目 @{project}',
  },
  {
    id: 'trend-2',
    updatedAt: new Date(),
    user: {
      name: '付小小',
      avatar: avatars2[1],
    },
    group: {
      name: '高逼格设计天团',
      link: 'http://github.com/',
    },
    project: {
      name: '六月迭代',
      link: 'http://github.com/',
    },
    template: '在 @{group} 新建项目 @{project}',
  },
  {
    id: 'trend-3',
    updatedAt: new Date(),
    user: {
      name: '林东东',
      avatar: avatars2[2],
    },
    group: {
      name: '中二少女团',
      link: 'http://github.com/',
    },
    project: {
      name: '六月迭代',
      link: 'http://github.com/',
    },
    template: '在 @{group} 新建项目 @{project}',
  },
  {
    id: 'trend-4',
    updatedAt: new Date(),
    user: {
      name: '周星星',
      avatar: avatars2[4],
    },
    project: {
      name: '5 月日常迭代',
      link: 'http://github.com/',
    },
    template: '将 @{project} 更新至已发布状态',
  },
  {
    id: 'trend-5',
    updatedAt: new Date(),
    user: {
      name: '朱偏右',
      avatar: avatars2[3],
    },
    project: {
      name: '工程效能',
      link: 'http://github.com/',
    },
    comment: {
      name: '留言',
      link: 'http://github.com/',
    },
    template: '在 @{project} 发布了 @{comment}',
  },
  {
    id: 'trend-6',
    updatedAt: new Date(),
    user: {
      name: '乐哥',
      avatar: avatars2[5],
    },
    group: {
      name: '程序员日常',
      link: 'http://github.com/',
    },
    project: {
      name: '品牌迭代',
      link: 'http://github.com/',
    },
    template: '在 @{group} 新建项目 @{project}',
  },
];

function getFakeCaptcha(req, res) {
  return res.json('captcha-xxx');
}
const menuListData1 = [
  {
    id: 'dashboardws',
    name: 'Dashboard',
    description: 'Dashboard',
    url: 'https://boss.icarbonx.com/lims-ui/baselab/qcScheme/qcPrograms',
    component: './View/home',
    children: [],
  },
  {
    id: 'knowledge',
    name: 'Knowledge Platform',
    component: './View/home',
    url: null,
    children: [
      {
        id: 'gene',
        name: 'Gene',
        component: './View/home',
        url: 'https://boss.icarbonx.com/lims-ui/baselab/qcPaths/qualityProjectQuery',
        children: null,
      },
      {
        id: 'phenotype',
        name: 'Phenotype',
        component: './View/home',
        url: 'https://boss.icarbonx.com/lims-ui/baselab/qcPaths/exception',
        children: null,
      },
      {
        id: 'blood',
        component: './View/home',
        name: '得分22',
        description: 'Blood biochemistry',
        url: 'https://boss.icarbonx.com/lims-ui/baselab/qcPaths/sendInspectionCreate',
        children: null,
      },
      {
        id: 'microbes',
        name: 'Microorganism',
        component: './View/home',
        url: 'https://boss.icarbonx.com/lims-ui/baselab/qcPaths/qcSamplesCheck',
        children: null,
      },
    ],
  },
  {
    id: 'indicatorww',
    name: 'Index Platform',
    url: 'https://boss.icarbonx.com/lims-ui/baselab/qcScheme/qcSamples',
    children: [],
  },
  {
    id: 'report',
    name: 'Report Platform',
    url: 'https://boss.icarbonx.com/lims-ui/baselab/qcScheme/qcSamples',
    children: [],
  },
];
const menuListData =[
    {
        "url": "https://euas.icarbonx.cn?system_id=lims_webio",
        "name": "权限管理",
        "id": "euasmgm",
        "type": "menu",
        dependent: 'true',
    },
    {
        "children": [
            {
                "children": [
                    {
                        "url": "/sample/viewSamples",
                        "name": "样本列表",
                        "id": "samplelist",
                        dependent: 'true',
                        "type": "menu"
                    },
                    {
                        "url": "/sample/viewSampleTypes",
                        "name": "样本类型",
                        "id": "sampletype",
                        dependent: 'true',
                        "type": "menu"
                    },
                    {
                        "url": "/sample/viewSampleUnits",
                        "name": "样本单位",
                        "id": "sampleunit",
                        "type": "menu"
                    },
                    {
                        "url": "/sample/viewSampleDerives",
                        "name": "样本分装",
                        "id": "samplesplit",
                        "type": "menu"
                    },
                    {
                        "url": "/sample/viewSampleDeriveStencils",
                        "name": "样本分装模板",
                        "id": "packingtemplate",
                        "type": "menu"
                    },
                    {
                        "url": "/sample/viewSampleLogs",
                        "name": "样本操作记录",
                        "id": "sampleoptlog",
                        "type": "menu"
                    },
                    {
                        "url": "/sample/viewStockOuts",
                        "name": "出库单",
                        "id": "outboundorder",
                        "type": "menu"
                    },
                    {
                        "url": "/sample/viewStockOutLogs",
                        "name": "出库单操作记录",
                        "id": "outboundlog",
                        "type": "menu"
                    },
                    {
                        "url": "/gdea/godownentryapplication",
                        "name": "样本入库申请",
                        "id": "inboundapplication",
                        "type": "menu"
                    },
                    {
                        "url": "/outsidersaccount/outsidersaccount.do",
                        "name": "微伴用户管理",
                        "id": "usermanage",
                        "type": "menu"
                    },
                    {
                        "url": "/stockIn/viewStockIns",
                        "name": "入库单",
                        "id": "inboundorder",
                        "type": "menu"
                    },
                    {
                        "url": "/log/viewLogs",
                        "name": "样本库操作记录",
                        "id": "samplemanageoptlog",
                        "type": "menu"
                    },
                    {
                        "url": "/sample/viewStockOutSampleManage",
                        "name": "出库样本管理",
                        "id": "outboundsamplemgm",
                        "type": "menu"
                    },
                    {
                        "url": "/stockInException/viewStockInExceptions",
                        "name": "入库异常管理",
                        "id": "inbounderror",
                        "type": "menu"
                    },
                    {
                        "url": "/lims-ui/basesample/sampleManage/sampleHqndover",
                        "name": "样本交接",
                        "id": "samplehandover",
                        "type": "menu"
                    }
                ],
                "url": "\"\"",
                "name": "样本管理",
                "id": "samplemanage",
                "type": "menu"
            },
            {
                "children": [
                    {
                        "url": "/destroyApplication/viewDestroyApplications",
                        "name": "销毁申请",
                        "id": "destroyapplication",
                        "type": "menu"
                    },
                    {
                        "url": "/destroySample/viewDestroySamples",
                        "name": "销毁记录",
                        "id": "destroyrecord",
                        "type": "menu"
                    }
                ],
                "url": "\"\"",
                "name": "销毁管理",
                "id": "sampledestroy",
                dependent: 'true',
                "type": "menu"
            },
            {
                "children": [
                    {
                        "url": "/box/trace",
                        "name": "样本回寄跟踪",
                        "id": "samplereturntrack",
                        "type": "menu"
                    },
                    {
                        "url": "/parcels/view",
                        "name": "包裹接收登记",
                        "id": "signinparcelregister",
                        "type": "menu"
                    },
                    {
                        "url": "/parcelBox/unHandle/viewParcelBoxes",
                        "name": "审核异常采样盒",
                        "id": "verifyunnormalsamplebox",
                        "type": "menu"
                    },
                    {
                        "url": "/parcelBox/viewParcelBoxes",
                        "name": "采样盒接收管理",
                        "id": "signinsamplebox",
                        "type": "menu"
                    },
                    {
                        "url": "/parcelSampling/viewParcelSamplings",
                        "name": "现场采样接收管理",
                        "id": "fieldsamplingrecivemgm",
                        "type": "menu"
                    },
                    {
                        "url": "/boxTrace/viewBoxTraces",
                        "name": "采样盒痕迹",
                        "id": "sampleboxmark",
                        "type": "menu"
                    },
                    {
                        "url": "/parcelCE/viewParcelCollectorExceptions",
                        "name": "异常采集器管理",
                        "id": "unnormalsamplermgm",
                        "type": "menu"
                    },
                    {
                        "url": "/parcels/viewSimpleParcels",
                        "name": "包裹签收",
                        "id": "signinparcel",
                        "type": "menu"
                    },
                    {
                        "url": "/parcelC/viewParcelCollectors",
                        "name": "采集器接收记录",
                        "id": "signinsamplerlog",
                        "type": "menu"
                    },
                    {
                        "url": "/parcelBoxRecord/viewParcelBoxRecords",
                        "name": "采样盒接收记录",
                        "id": "signinsampleboxlog",
                        "type": "menu"
                    },
                    {
                        "url": "/receiveManage/page",
                        "name": "接收管理",
                        "id": "receivemgm",
                        "type": "menu"
                    }
                ],
                "url": "\"\"",
                "name": "样本接收",
                "id": "samplereceive",
                "type": "menu"
            },
            {
                "children": [
                    {
                        "url": "/equipment/viewFreezeBoxes",
                        "name": "冻存盒管理",
                        "id": "frozenbox",
                        "type": "menu"
                    },
                    {
                        "url": "/equipment/viewFreezeShelves",
                        "name": "冻存架管理",
                        "id": "frozenshelf",
                        "type": "menu"
                    },
                    {
                        "url": "/equipment/viewIceboxes",
                        "name": "冰箱管理",
                        "id": "refrigerator",
                        "type": "menu"
                    },
                    {
                        "url": "/equipment/viewSampleStorerooms",
                        "name": "库房管理",
                        "id": "storeroom",
                        "type": "menu"
                    },
                    {
                        "url": "/equipment/viewFreezeShelfTypes",
                        "name": "冻存架类型",
                        "id": "frozenshelftype",
                        "type": "menu"
                    },
                    {
                        "url": "/equipment/viewIceboxModes",
                        "name": "冰箱型号",
                        "id": "refrigeratormodel",
                        "type": "menu"
                    },
                    {
                        "url": "/equipment/viewFreezeBoxTypes",
                        "name": "冻存盒类型",
                        "id": "frozenboxtype",
                        "type": "menu"
                    },
                    {
                        "url": "/sampleTubeType/viewSampleTubeTypes",
                        "name": "样本管类型",
                        "id": "sampletubetype",
                        "type": "menu"
                    },
                    {
                        "url": "/porePlateType/viewPorePlateTypes",
                        "name": "孔板类型",
                        "id": "orificeplatetype",
                        "type": "menu"
                    },
                    {
                        "url": "/porePlate/viewPorePlates",
                        "name": "孔板管理",
                        "id": "orificeplate",
                        "type": "menu"
                    }
                ],
                "url": "/equipment/viewContainers",
                "name": "容器管理",
                "id": "samplecontainer",
                "type": "menu"
            },
            {
                "children": [
                    {
                        "url": "/tempBox/viewFreezeBoxTemporarys",
                        "name": "暂存盒管理",
                        "id": "cacheboxmgm",
                        "type": "menu"
                    },
                    {
                        "url": "/tempBoxSample/viewTempBoxSamples",
                        "name": "暂存样本记录",
                        "id": "cachesamplemgm",
                        "type": "menu"
                    }
                ],
                "url": "\"\"",
                "name": "暂存管理",
                "id": "samplecache",
                "type": "menu"
            }
        ],
        "url": "\"\"",
        "name": "样本库",
        "id": "samplestore",
        "type": "menu"
    }
]

export default {
  'GET /api/project/notice': getNotice,
  'GET /api/activities': getActivities,
  'POST /api/forms': (req, res) => {
    res.send({ message: 'Ok' });
  },
  'GET /api/bosslab/euasagent-embedded-api/menu-tree': menuListData,
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }],
  }),
  'GET /api/fake_list': getFakeList,
  'POST /api/fake_list': postFakeList,
  'GET /api/captcha': getFakeCaptcha,
};
