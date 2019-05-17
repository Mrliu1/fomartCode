import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';

import router from 'umi/router';

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
  message,
  Select,
  Icon,
  Menu,
} from 'antd';
import styles from './children.less';
import { packetStateArr } from '@/utils/experimentServiceDict';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { tableHomeColumns } from './tableColumnsData';

const FormItem = Form.Item;
const { TextArea } = Input;
const {Option} = Select;
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
      title={`请填写${data.transKey == 'disabledMethod' ? '禁用' : '启用'}原因`}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Card bordered={false}>
        <strong>提示：</strong>
        {data.transKey === 'disabledMethod'
          ? '禁用后该工艺方法，将无法被新增实验单所使用，已经使用该工艺方法的实验单可以继续执行。'
          : '启用后该工艺方法，可被新增实验单所使用'}

        <p className={styles.fontRed}>
          {data.transKey === 'disabledMethod' ? '是否继续禁用' : '是否继续启用'}，所选择工艺方法:
          {data.code}？
        </p>
      </Card>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label={`${data.transKey == 'disabledMethod' ? '禁用' : '启用'}原因`}
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
@connect(({ method, loading }) => ({
  method,
  loading: loading.models.method,
}))
@Form.create()
class ProcessMethodHome extends PureComponent {
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
      type: 'method/fetch',
    });
  }

  // 跳转到详情
  previewItem = id => {
    router.push(`/manufacture/ExperimentService/ProcessMethod/ProcessMethodDetail/${id.id}`);
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
      type: 'method/fetch',
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

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleSearch = e => {
    e = e || window.event
    e.preventDefault();
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
        type: 'method/fetch',
        payload: values,
      });
    });
  };
  
  handleQuery = () => {
    const { dispatch, form } = this.props;
    
    this.handleModalVisible(false);
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };
      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'method/fetch',
        payload: values,
      });
    });
  };

  handleAdd = () => {
    message.success('添加成功');
    this.handleModalVisible();
  };

  // 弹出删除的model框
  // 新增组合
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  // 新增组合
  handleAddFn = flag => {
    router.push(`/manufacture/ExperimentService/ProcessMethod/ProcessMethodAdd`);
  };

  deleteFn = obj => {
    const { dispatch } = this.props;
    const modal = Modal.info();
    Modal.destroyAll();
    const { id } = obj;
    const params = { id };
    dispatch({
      type: 'method/deleteProcessMethodFn',
      payload: params,
      callback: this.handleQuery,
    });
  };

  // 修改状态
  dealUseAndDisabled = () => {
    const { dispatch } = this.props;
    const { transData } = this.state;
    Modal.destroyAll();
    // 这个取一个状态值去区分禁用还是启用
    const { id, transKey } = transData;
    let isActivate = true
    if (transKey === 'disabledMethod') {
      isActivate = false
    }
    const params = {
      isActivate,
      id };
    dispatch({
      type: 'method/isActivateProcessMethodFn',
      payload: params,
      callback: this.handleQuery
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

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 2, lg: 4, xl: 20 }}>
          <Col md={6} sm={24}>
            <FormItem label="工艺方法编码">
              {getFieldDecorator('code')(<Input placeholder="请输入工艺方法编码" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="工艺方法名称">
              {getFieldDecorator('name')(<Input placeholder="请输入工艺方法名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="所属工序编码">
              {getFieldDecorator('processCode')(<Input placeholder="请输入所属工序编码" />)}
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
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="工艺方法编码">
              {getFieldDecorator('code')(<Input placeholder="请输入工艺方法编码" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="工艺方法名称">
              {getFieldDecorator('name')(<Input placeholder="请输入工艺方法名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="所属工序编码">
              {getFieldDecorator('processCode')(<Input placeholder="请输入所属工序编码" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="所属工序名称">
              {getFieldDecorator('processName')(<Input placeholder="请输入所属工序名称" />)}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem key="state" label="状态">
              {getFieldDecorator('state', {
                // initialValue: formVals.template,
              })(
                <Select mode="multiple" style={{ width: '100%' }} placeholder="请选择状态" showSearch="true" allowClear="true">
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
          <Col lg={6} md={24} sm={24}>
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
      method: { data },
      loading,
    } = this.props;
    const { modalVisible, transData } = this.state;
    const me = this
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...data.pagination,
    };
    function confirm(obj) {
      Modal.confirm({
        title: 'Confirm',
        okType: 'danger',
        content: `工艺方法删除后无法恢复，是否继续删除所选择工艺方法：${obj.code}？`,
        okText: '确认',
        cancelText: '取消',
        onOk: () => me.deleteFn(obj),
      });
    }
    const editAndDelete = (key, currentItem) => {
      const value = { titleMsg: '', currentStep: 0 };
      if (key === 'editMethod') {
        const params = JSON.stringify(currentItem);
        // const params = currentItem;
        router.push({
          pathname: `/manufacture/ExperimentService/ProcessMethod/ProcessMethodAdd`,
          query: { params },
        });
        // this.editTestFn(currentItem)
      }
      if (key === 'deleteMethod') {
        // this.editConcatFn(currentItem)
        confirm(currentItem);
      }
      if (key === 'disabledMethod') {
        // this.editConcatFn(currentItem)
        const transKey = { transKey: 'disabledMethod' };
        const transObj = { ...currentItem, ...transKey };
        this.setState({
          transData: transObj,
        });
        this.handleModalVisible(true);
      }
      if (key === 'useMethod') {
        // this.editTemplateFn(currentItem)
        const transKey = { transKey: 'useMethod' };
        const transObj = { ...currentItem, ...transKey };
        this.setState({
          transData: transObj,
        });
        this.handleModalVisible(true);
      }
    };
    const MoreBtn = props => {
      const _props =props.props;
      return (
        <Dropdown
          overlay={
            <Menu onClick={({ key }) => editAndDelete(key, props.props)}>
              <Menu.Item key="editMethod">编辑</Menu.Item>
              <Menu.Item disabled={_props.state !== 'DRAFT'} key="deleteMethod">删除</Menu.Item>
              {_props.state === 'PUBLISHED' ? 
                <Menu.Item key="disabledMethod">
                  禁用
                </Menu.Item> : []
              }
              {_props.state === 'DEACTIVED' ? 
                <Menu.Item key="useMethod">
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
    }

    const tableHomeColumnsFormat = tableHomeColumns.map(val => {
      if(val.dataIndex === 'name') {
        val.render = (text, record) =>  (<a onClick={() => this.previewItem(record)}>{text}</a>)
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
      // onSelectChange: this.onSelectChange,
      // selectedRowKeys: this.state.selectedRowKeys,
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
              <Button icon="plus" type="primary" onClick={() => this.handleAddFn()}>
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

export default ProcessMethodHome;
