import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';

import styles from './children.less';

import {
  handPeriodTypeDict,
  packetStateArr,
  qcTypeArr,
  qcTypeDict,
} from '@/utils/experimentServiceDict';
import { tableHomeColumns } from './tableColumnsData';
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
const { TextArea } = Input;
const Option = Select.Option;

// 创建模态框组件
const CreateForm = Form.create()(props => {
  const { modalVisible, form, dealFn, loading, data, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      dealFn(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      width={640}
      title={`请填写${data.transKey == 'disabledTechnical' ? '禁用' : '启用'}原因`}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Card bordered={false}>
        <strong>提示：</strong>
        {data.transKey == 'disabledTechnical'
          ? '禁用后该技术路线，将无法被新增检测项所使用，已经使用该技术路线的检测项可以继续执行。'
          : '启用后该技术路线，可被新增检测项所使用'}

        <p className={styles.fontRed}>
          {data.transKey == 'disabledTechnical' ? '是否继续禁用' : '是否继续启用'}，所选择技术路线：
          {data.code}？
        </p>
      </Card>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label={`${data.transKey == 'disabledTechnical' ? '禁用' : '启用'}原因`}
      >
        {form.getFieldDecorator('reason', {
          rules: [{ required: true, message: '请输入内容！' }],
        })(<TextArea placeholder="请输入" autosize={{ minRows: 2, maxRows: 6 }} />)}
      </FormItem>
    </Modal>

    // <Table rowSelection={rowSelection} columns={columns} dataSource={data}/>
    // </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ route, loading }) => ({
  route,
  loading: loading.models.route,
}))
@Form.create()
class RouteHome extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      formValues: {},
      expandForm: false,
      modalVisible: false,
      selectedRowKeys: [],
      loading: false,
      transData: {},
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'route/fetchBasic',
    });
    dispatch({
      type: 'route/fetch',
    });
  }

  // 跳转到详情
  previewItem = id => {
    router.push(`/manufacture/ExperimentService/Route/RouteDetail/${id.id}`);
  };

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
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'route/fetch',
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
    console.log('进入了吗？')
    e =  e || window.event
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        // updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'route/fetch',
        payload: values,
      });
    });
  };

  handleAdd = fields => {
    router.push({
      pathname: `/manufacture/ExperimentService/Route/RouteAdd`,
    });
  };

  deleteFn = obj => {
    const { dispatch } = this.props;
    console.log(obj, 'obj-------')
    const modal = Modal.info();
    Modal.destroyAll();
    const { id } = obj;
    const params = { id };
    dispatch({
      type: 'route/deleteRouteFn',
      payload: params,
      callback: this.handleSearch
    });
  };

  dealStatusResult = () => {
    this.handleModalVisible(false)
    this.handleSearch()
  };

  dealUseAndDisabled = () => {
    const { dispatch } = this.props;
    const { transData } = this.state;
    Modal.destroyAll();
    // 这个取一个状态值去区分禁用还是启用
    const { id, transKey } = transData;
    const params = { 
      isActivate: transKey === 'useTechnical',
      id };
    dispatch({
      type: 'route/changeStatusRouteFn',
      payload: params,
      callback: this.dealStatusResult,
    });
  };

  // 新增组合
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
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
        <Row gutter={{ md: 2, lg: 4, xl: 20 }}>
          <Col md={6} sm={24}>
            <FormItem label="技术路线编码">
              {getFieldDecorator('code')(<Input placeholder="请输入技术路线编码" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="技术路线名称">
              {getFieldDecorator('name')(<Input placeholder="请输入技术路线名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem key="template" label="状态">
              {getFieldDecorator('state', {
                // initialValue: formVals.template,
              })(
                <Select style={{ width: '100%' }} placeholder="请选择状态" showSearch="true" allowClear="true">
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
            <FormItem key="code" label="技术路线编码">
              {getFieldDecorator('code')(<Input placeholder="请输入技术路线编码" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem key="name" label="技术路线名称">
              {getFieldDecorator('name')(<Input placeholder="请输入技术路线名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem key="state" label="状态">
              {getFieldDecorator('state', {
                // initialValue: formVals.template,
              })(
                <Select style={{ width: '100%' }} placeholder="请选择状态" showSearch="true" allowClear="true">
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
            <FormItem key="qcType" label="质控流程" allowClear="true">
              {getFieldDecorator('qcType', {
                // initialValue: formVals.template,
              })(
                <Select style={{ width: '100%' }} placeholder="请选择质控流程" showSearch="true" mode="multiple">
                  {qcTypeArr.map(item => {
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
      route: { data, initDictObj },
      loading,
    } = this.props;
    const deleteFn = this.deleteFn;
    const { modalVisible, transData } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...data.pagination,
    };
    function confirm(obj) {
      Modal.confirm({
        title: 'Confirm',
        okType: 'danger',
        content: `技术路线删除后无法恢复，是否继续删除所选择技术路线：${obj.code}？`,
        okText: '确认',
        cancelText: '取消',
        onOk: deleteFn,
      });
    }
    const editAndDelete = (key, currentItem) => {
      let value = { titleMsg: '', currentStep: 0 };
      if (key === 'editTechnical') {
        // this.handleModalVisible(true, currentItem);
        const params = JSON.stringify(currentItem);
        // const params = currentItem;
        router.push({
          pathname: `/manufacture/ExperimentService/Route/RouteAdd`,
          query: { params },
        });

        // this.editTestFn(currentItem)
      }
      if (key === 'deleteTechnical') {
        // this.editConcatFn(currentItem)
        confirm(currentItem);
      }
      // 禁用
      if (key === 'disabledTechnical') {
        // this.editTemplateFn(currentItem)
        const transKey = { transKey: 'disabledTechnical' };
        const transObj = { ...currentItem, ...transKey };
        this.setState({
          transData: transObj,
        });
        this.handleModalVisible(true);
      }
      // 启用
      if (key === 'useTechnical') {
        // this.editTemplateFn(currentItem)
        const transKey = { transKey: 'useTechnical' };
        const transObj = { ...currentItem, ...transKey };
        this.setState({
          transData: transObj,
        });
        this.handleModalVisible(true);
      }
    };
    // 缺少启用和禁用的判断显示逻辑props.state != 'DRAFT'
    const MoreBtn = props => {
      const _props = props.props;
      return (
        <Dropdown
          overlay={
            <Menu onClick={({ key }) => editAndDelete(key, _props)}>
              <Menu.Item key="editTechnical">编辑</Menu.Item>
              <Menu.Item disabled={_props.state !== 'DRAFT'} key="deleteTechnical">
                删除
              </Menu.Item>
              {_props.state === 'PUBLISHED' ? 
                <Menu.Item key="disabledTechnical">
                  禁用
                </Menu.Item> : []
              }
              {_props.state === 'DEACTIVED' ? 
                <Menu.Item key="useTechnical">
                  启用
                </Menu.Item> : []}
            </Menu>
          }
        >
          <a>
            更多 <Icon type="down" />
          </a>
        </Dropdown>
      );
    };
    const tableHomeColumnsFormat = tableHomeColumns.map(val => {
      if(val.dataIndex === 'sampleTypeId') {

        val['render'] = (text, record) => {
          let _val = record && record.startSampleTypes && record.startSampleTypes.length > 0 ? record.startSampleTypes[0].sampleTypeId : ''
          return (<span>{ initDictObj.sampleTypes && _val ? initDictObj.sampleTypes.dict[_val] : ''}</span>)
        }
      }


      if(val.dataIndex === 'name') {
        val['render'] = (text, record) =>  (<a onClick={() => this.previewItem(record)}>{text}</a>)
      }
      return val
    })
    const columns = [
      ...tableHomeColumnsFormat,
      {
        title: '操作',
        fixed: 'right',
        align: 'center',
        width: 120,
        render: (text, record) => (
          <Fragment>
            <MoreBtn props={record} />
          </Fragment>
        ),
      },
    ];

    const parentMethods = {
      dealFn: this.dealUseAndDisabled,
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
              <Button icon="plus" type="primary" onClick={() => this.handleAdd()}>
                添加
              </Button>
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

export default RouteHome;
