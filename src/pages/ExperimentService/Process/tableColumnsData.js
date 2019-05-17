// 工序相关页面表头信息

import moment from 'moment';

// 管理页面
export const tableHomeColumns = [
  {
    title: '序号',
    index: 'index',
    render:(text,record,index)=>`${index+1}`,
  },
  {
    title: '工序编码',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: '工序名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '所属环节',
    dataIndex: 'nodeType',
    key: 'nodeType',
    render: val => <span>{nodeTypeDict[val]}</span>,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: val => <span>{nodeTypeDict[val]}</span>,
  },
  {
    title: '交付周期',
    dataIndex: 'handPeriod',
    key: 'handPeriod',
  },
  {
    title: '交付日类型',
    dataIndex: 'handPeriodType',
    key: 'handPeriodType',
    render: val => <span>{handPeriodTypeDict[val]}</span>,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
  },
  {
    title: '最后更新人',
    dataIndex: 'modifyPerson',
    key: 'modifyPerson',
  },
  {
    title: '最后更新时间',
    dataIndex: 'modifyTime',
    key: 'modifyTime',
    render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
  },
  {
    title: '创建人',
    dataIndex: 'createPerson',
    key: 'createPerson',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
  },
];


// 查询条件输入的数据
export const fieldLabelsForm = [
  {
    key: 'code',
    label: '工序编码',
    disabled: true,
    value: '',
    require: false,
    type: 'input',
    selectArr: [],
  },
  {
    key: 'name',
    label: '工序名称',
    disabled: false,
    value: '',
    require: true,
    type: 'input',
    selectArr: [],
  },
  {
    key: 'nodeType',
    label: '所属节点',
    disabled: false,
    value: '',
    require: false,
    mode: 'multiple',
    type: 'select',
    selectArr: nodeTypeDict,
  },
  {
    key: 'state',
    label: '状态',
    disabled: false,
    value: '',
    require: true,
    mode: 'multiple',
    type: 'select',
    selectArr: packetStateDict,
  },
];
