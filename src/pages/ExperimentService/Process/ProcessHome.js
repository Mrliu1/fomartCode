import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';

import moment from 'moment';
import router from 'umi/router';

import styles from './children.less';
import {
  nodeTypeArr,
  nodeTypeDict,
  packetStateArr,
  packetStateDict,
  handPeriodTypeDict,
  handPeriodTypeArr,
} from '@/utils/experimentServiceDict';

import {
  Modal,
  Card,
  Table,
  Input,
  Button,
  Form,
  Row,
  Col,
  Dropdown,
  Divider,
  message,
  Select,
  Icon,
  Menu,
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
const FormItem = Form.Item;
const Option = Select.Option;

// 创建模态框组件
const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    loading,
    handleModalVisible,
    start,
    data,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      width={640}
      title="编辑工序详情"
      okText="保存"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Card bordered={false}>
        <Col md={11} sm={22}>
          <FormItem label="工序编码">
            {form.getFieldDecorator('code', {
              initialValue: data.code,
              rules: [{ required: false, message: '请输入工序编码！' }],
            })(<Input placeholder="请输入" disabled />)}
          </FormItem>
          <FormItem label="所属环节">
            {form.getFieldDecorator('nodeType', {
              initialValue: nodeTypeDict[data.nodeType],
              rules: [{ required: false, message: '请输入所属环节！' }],
            })(<Input placeholder="请输入" disabled />)}
          </FormItem>
          <FormItem label="交付周期">
            {form.getFieldDecorator('handPeriod', {
              initialValue: data.handPeriod,
              rules: [
                { required: true, message: '请输入交付周期！' },
                {
                  pattern: /^(\d+)((?:\.\d{1})?)$/,
                  message: '请输入合法交付周期数字',
                },
              ],
            })(<Input placeholder="请输入" />)}
          </FormItem>
        </Col>
        <Col md={11} sm={22} offset={2}>
          <FormItem label="工序名称">
            {form.getFieldDecorator('name', {
              initialValue: data.name,
              rules: [{ required: false, message: '请输入工序名称！' }],
            })(<Input placeholder="请输入" disabled />)}
          </FormItem>
          <FormItem label="备注">
            {form.getFieldDecorator('remark', {
                initialValue: data.remark,
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem label="交付日类型">
            {form.getFieldDecorator('handPeriodType', {
              initialValue: 'WORKING_DAY',
              rules: [{ required: true, message: '请选择交付日类型！' }],
            })(
              <Select style={{ width: '100%' }} placeholder="请选择交付日类型" showSearch="true" allowClear>
                {handPeriodTypeArr.map(item => {
                  return (
                    <Option value={item.key} key={item.key}>
                      {item.value}
                    </Option>
                  );
                })}
              </Select>
            )}
          </FormItem>
        </Col>
      </Card>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ process, loading }) => ({
  process,
  loading: loading.models.process,
}))
@Form.create()
class ProcessHome extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      formValues: {},
      expandForm: false,
      modalVisible: false,
      selectedRowKeys: [],
      loading: false,
      homeState: false,
      transData: {}, // 编辑时传递的数据
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'process/fetch',
    });
  }

  handleChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      pageNum: pagination.current,
      // currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'process/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
  };

  handleSearch = e => {
    e = e ? e : window.event
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'process/fetch',
        payload: values,
      });
    });
  };

  goHandleSearch = () => {
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'process/fetch',
        payload: values,
      });
    });
  };

  goHomeState = () => {
    this.setState({
      homeState: true
    })
  }

  handleAdd = fields => {
    const { dispatch } = this.props;
    const {
      transData: { id },
    } = this.state;
    let timer = setTimeout(()=> {
      const {homeState} = this.state
      if (homeState) {
        window.clearTimeout(timer);
        this.goHandleSearch()
      }
    },500)
    const { handPeriod, handPeriodType, remark } = fields;
    const params = {
      id,
      handPeriod,
      handPeriodType,
      remark,
    };
    dispatch({
      type: 'process/submitProcess',
      payload: params,
      callback: this.goHomeState,
    });
    this.handleModalVisible();
     // this.handleSearch()
    // const ev = window.event
  };

  // 新增组合
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  start = () => {
    this.setState({ loading: true });
    // ajax request after empty completing
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 2, lg: 4, xl: 20 }} key={`row${Math.random()*100}`}>
          <Col md={6} sm={24}  key={`Col${Math.random()*100}`}>
            <FormItem key="code" label="工序编码">
              {getFieldDecorator('code')(<Input placeholder="请输入工序编码" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24} key={`Col${Math.random()*100}`}>
            <FormItem key="name" label="工序名称">
              {getFieldDecorator('name')(<Input placeholder="请输入工序名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24} key={`Col${Math.random()*100}`}>
            <FormItem key="nodeType" label="所属环节">
              {getFieldDecorator('nodeType', {
                // initialValue: formVals.template,
              })(
                <Select style={{ width: '100%' }} placeholder="请选择所属环节" allowClear>
                  {nodeTypeArr.map(item => {
                    return (
                      <Option value={item.key} key={item.key}>
                        {item.value}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24} key={`Col${Math.random()*100}`}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 2, lg: 4, xl: 6 }}>
          <Col md={6} sm={24}>
            <FormItem key="code" label="工序编码">
              {getFieldDecorator('code')(<Input placeholder="请输入工序编码" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem key="name" label="工序名称">
              {getFieldDecorator('name')(<Input placeholder="请输入工序名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem key="nodeType" label="所属环节">
              {getFieldDecorator('nodeType', {
                // initialValue: formVals.template,
              })(
                <Select style={{ width: '100%' }} placeholder="请选择所属环节">
                  {nodeTypeArr.map(item => {
                    return (
                      <Option value={item.key} key={item.key}>
                        {item.value}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem key="state" label="状态">
              {getFieldDecorator('state', {
                // initialValue: formVals.template,
              })(
                <Select style={{ width: '100%' }} placeholder="请选择状态" allowClear>
                  {packetStateArr.map(item => {
                    return (
                      <Option value={item.key} key={item.key}>
                        {item.value}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>

          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                收起 <Icon type="up" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      process: { data },
      loading,
    } = this.props;
    const { modalVisible, transData } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...data.pagination,
    };
    const editFn = (currentItem) => {
      let value = { titleMsg: '', currentStep: 0 };
      this.handleModalVisible(true, currentItem);
      this.setState({
        transData: currentItem,
      });
    };
    const columns = [
      {
        title: '序号',
        index: 'index',
        render: (text, record, index) => `${index + 1}`,
      },
      {
        title: '工序编码',
        dataIndex: 'code',
      },
      {
        title: '工序名称',
        dataIndex: 'name',
      },
      {
        title: '所属环节',
        dataIndex: 'nodeType',
        render: text => {
          return <span>{nodeTypeDict[text]}</span>;
        },
      },
      {
        title: '状态',
        dataIndex: 'state',
        render: val => <span>{packetStateDict[val]}</span>,
      },
      {
        title: '交付周期',
        dataIndex: 'handPeriod',
      },
      {
        title: '交付日类型',
        dataIndex: 'handPeriodType',
        render: val => <span>{handPeriodTypeDict[val]}</span>,
      },
      {
        title: '备注',
        dataIndex: 'remark',
      },
      {
        title: '最后更新人',
        dataIndex: 'modifyPerson',
      },
      {
        title: '最后更新时间',
        dataIndex: 'modifyTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '创建人',
        dataIndex: 'createPerson',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '操作',
        fixed: 'right',
        align: 'center',
        width: 120,
        render: (text, record) => (
          <Button
            disabled={!['DRAFT', 'PUBLISHED'].includes(record.state)}
            onClick={() => editFn(record)}
            size="small"
          >
            编辑
          </Button>
        ),
      },
    ];

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const handleMenuClick = e => {
      message.info('Click on menu item');
    };
    const handleButtonClick = e => {
      message.info('Click on left button.');
    };
    const menu = (
      <Menu onClick={handleMenuClick}>
        <Menu.Item key="1">
          <Icon type="arrow-down" />
          导出
        </Menu.Item>
        <Menu.Item key="2">
          <Icon type="arrow-up" />
          导入
        </Menu.Item>
        <Menu.Item key="3">
          <Icon type="export" />
          导出模板
        </Menu.Item>
      </Menu>
    );
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Dropdown overlay={menu}>
                <Button style={{ marginLeft: 8 }}>
                  导出/导入 <Icon type="down" />
                </Button>
              </Dropdown>
            </div>
            <Table
              scroll={{ x: 1300 }} 
              columns={columns}
              dataSource={data.list}
              // bordered
              size="middle"
              onChange={this.handleChange}
              pagination={paginationProps}
            />
          </div>
          <CreateForm {...parentMethods} data={transData} modalVisible={modalVisible} />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ProcessHome;
