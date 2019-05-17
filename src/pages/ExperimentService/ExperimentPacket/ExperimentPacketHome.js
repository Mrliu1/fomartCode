import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import moment from 'moment';
import router from 'umi/router';

import styles from './children.less';

import {packetStateArr} from '@/utils/experimentServiceDict';
import {tableHomeColumns} from './tableColumnsData';
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
const {TextArea} = Input;
const {Option} = Select;

// 创建模态框组件
const CreateForm = Form.create () (props => {
  const {modalVisible, form, dealFn, loading, data, handleModalVisible} = props;
  const okHandle = () => {
    form.validateFields ((err, fieldsValue) => {
      if (err) return;
      form.resetFields ();
      dealFn (fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      width={640}
      title={`请填写${data.transKey == 'disabledExperimentPacket' ? '禁用' : '启用'}原因`}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible ()}
    >
      <Card bordered={false}>
        <strong>提示：</strong>
        {data.transKey == 'disabledExperimentPacket'
          ? '禁用后该检测包，将无法被商品所使用，已经使用该检测包的商品可以继续执行。'
          : '启用后该检测包，可被新增商品所使用。'}

        <p className={styles.fontRed}>
          {data.transKey == 'disabledExperimentPacket' ? '是否继续禁用' : '是否继续启用'}
          所选择检测包：
          {data.packetCode}？
        </p>
      </Card>
      <FormItem
        labelCol={{span: 5}}
        wrapperCol={{span: 15}}
        label={`${data.transKey == 'disabledExperimentPacket' ? '禁用' : '启用'}原因`}
      >
        {form.getFieldDecorator ('reason', {
          rules: [{required: true, message: '请输入内容！'}],
        }) (<TextArea placeholder="请输入" autosize={{minRows: 2, maxRows: 6}} />)}
      </FormItem>
    </Modal>
  );

  // <Table rowSelection={rowSelection} columns={columns} dataSource={data}/>
  // </Modal>
});

/* eslint react/no-multi-comp:0 */
@connect (({packet}) => ({
  packet,
}))
@Form.create ()
class ExperimentPacketHome extends PureComponent {
  constructor (props) {
    super (props);

    this.state = {
      formValues: {},
      expandForm: false,
      modalVisible: false,
      selectedRowKeys: [],
      loading: false,
      transData: {},
    };
  }

  componentDidMount () {
    const {dispatch} = this.props;
    dispatch ({
      type: 'packet/getPacketsPageFn',
    });
  }

  // 跳转到详情
  previewItem = id => {
    router.push (
      `/manufacture/ExperimentService/ExperimentPacket/ExperimentPacketDetail/${id.id}`
    );
  };

  handleChange = (pagination, filtersArg, sorter) => {
    const {dispatch} = this.props;
    const {formValues} = this.state;
    const filters = Object.keys (filtersArg).reduce ((obj, key) => {
      const newObj = {...obj};
      newObj[key] = getValue (filtersArg[key]);
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
    dispatch ({
      type: 'packet/getPacketsPageFn',
      payload: params,
    });
  };

  handleFormReset = () => {
    const {form, dispatch} = this.props;
    form.resetFields ();
    this.setState ({
      formValues: {},
    });
  };

  handleSearch = e => {
    e = e || window.event;
    e.preventDefault ();
    // 成功回调时
    this.handleModalVisible (false);
    const {dispatch, form} = this.props;
    form.validateFields ((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf (),
      };
      this.setState ({
        formValues: values,
      });

      dispatch ({
        type: 'packet/getPacketsPageFn',
        payload: values,
      });
    });
  };

  handleQuery = () => {
    // 成功回调时
    this.handleModalVisible (false);
    const {dispatch, form} = this.props;
    form.validateFields ((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf (),
      };
      this.setState ({
        formValues: values,
      });

      dispatch ({
        type: 'packet/getPacketsPageFn',
        payload: values,
      });
    });
  };

  handleAdd = fields => {
    router.push ({
      pathname: `/manufacture/ExperimentService/ExperimentPacket/ExperimentPacketAdd`,
    });
  };

  deleteFn = obj => {
    const {dispatch} = this.props;
    const modal = Modal.info ();
    Modal.destroyAll ();
    const {id} = obj;
    const params = {id};
    console.log (params, 'params====');
    dispatch ({
      type: 'packet/deletePacketFn',
      payload: params,
      callback: this.handleQuery,
    });
  };

  dealUseAndDisabled = obj => {
    const {dispatch} = this.props;
    const {transData} = this.state;
    Modal.destroyAll ();
    // 这个取一个状态值去区分禁用还是启用
    const {id} = transData;
    const params = {id};
    if (transData.transKey === 'disabledExperimentPacket') {
      dispatch ({
        type: 'packet/disabledPacketFn',
        payload: params,
        callback: this.handleQuery,
      });
      // message.info('禁用申请，提交成功！');
    } else {
      dispatch ({
        type: 'packet/usePacketFn',
        payload: params,
        callback: this.handleQuery,
      });
      // message.info('启用申请，提交成功！');
    }
  };

  // 新增组合
  handleModalVisible = flag => {
    this.setState ({
      modalVisible: !!flag,
    });
  };

  toggleForm = () => {
    const {expandForm} = this.state;
    this.setState ({
      expandForm: !expandForm,
    });
  };

  onSelectChange = selectedRowKeys => {
    this.setState ({selectedRowKeys});
  };

  renderSimpleForm () {
    const {form: {getFieldDecorator}} = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 2, lg: 4, xl: 20}}>
          <Col md={6} sm={24}>
            <FormItem label="检测包编码">
              {getFieldDecorator ('packetCode') (
                <Input placeholder="请输入检测包编码" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="检测包名称">
              {getFieldDecorator ('packetName') (
                <Input placeholder="请输入检测包名称" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem key="packetState" label="检测包状态">
              {getFieldDecorator (
                'packetState',
                {
                  // initialValue: formVals.template,
                }
              ) (
                <Select
                  style={{width: '100%'}}
                  placeholder="请选择检测包状态"
                  showSearch="true"
                  allowClear="true"
                >
                  {packetStateArr.map (item => {
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
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm () {
    return this.renderSimpleForm ();
  }
  
  render () {
    const {packet: {data}, loading} = this.props;

    const {deleteFn} = this;
    const {modalVisible, transData} = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...data.pagination,
    };
    function confirm (obj) {
      Modal.confirm ({
        title: 'Confirm',
        okType: 'danger',
        content: `检测包删除后无法恢复，是否继续删除所选择检测包：${obj.packetCode}？`,
        okText: '确认',
        cancelText: '取消',
        onOk: () => deleteFn (obj),
      });
    }
    const editAndDelete = (key, currentItem) => {
      let value = {titleMsg: '', currentStep: 0};
      if (key === 'editExperimentPacket') {
        // this.handleModalVisible(true, currentItem);
        const params = JSON.stringify (currentItem);
        // const params = currentItem;
        router.push ({
          pathname: `/manufacture/ExperimentService/ExperimentPacket/ExperimentPacketAdd`,
          query: {params},
        });
      }
      if (key === 'deleteExperimentPacket') {
        // this.editConcatFn(currentItem)
        confirm (currentItem);
      }
      // 禁用
      if (key === 'disabledExperimentPacket') {
        // this.editTemplateFn(currentItem)
        const transKey = {transKey: 'disabledExperimentPacket'};
        const transObj = {...currentItem, ...transKey};
        this.setState ({
          transData: transObj,
        });
        this.handleModalVisible (true);
      }
      // 启用
      if (key === 'useExperimentPacket') {
        // this.editTemplateFn(currentItem)
        const transKey = {transKey: 'useExperimentPacket'};
        const transObj = {...currentItem, ...transKey};
        this.setState ({
          transData: transObj,
        });
        this.handleModalVisible (true);
      }
    };
    // 缺少启用和禁用的判断显示逻辑props.state != 'DRAFT'
    const MoreBtn = props => {
      const _props = props.props;
      return (
        <Dropdown
          overlay={
            <Menu onClick={({key}) => editAndDelete (key, _props)}>
              <Menu.Item key="editExperimentPacket">编辑</Menu.Item>
              <Menu.Item
                disabled={_props.packetState !== 'DRAFT'}
                key="deleteExperimentPacket"
              >
                删除
              </Menu.Item>
              {_props.packetState === 'PUBLISHED'
                ? <Menu.Item key="disabledExperimentPacket">
                    禁用
                  </Menu.Item>
                : []}
              {_props.packetState === 'DEACTIVED'
                ? <Menu.Item key="useExperimentPacket">
                    启用
                  </Menu.Item>
                : []}
            </Menu>
          }
        >
          <a>
            更多 <Icon type="down" />
          </a>
        </Dropdown>
      );
    };
    const tableHomeColumnsFormat = tableHomeColumns.map (val => {
      if (val.dataIndex === 'packetName') {
        val['render'] = (text, record) => (
          <a onClick={() => this.previewItem (record)}>{text}</a>
        );
      }
      return val;
    });
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
      message.info ('Click on menu item');
    };
    const handleButtonClick = e => {
      message.info ('Click on left button.');
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
            <div className={styles.tableListForm}>{this.renderForm ()}</div>
            <div className={styles.tableListOperator}>
              <Button
                icon="plus"
                type="primary"
                onClick={() => this.handleAdd ()}
              >
                添加
              </Button>
              <Dropdown overlay={menu}>
                <Button style={{marginLeft: 8}}>
                  导出/导入 <Icon type="down" />
                </Button>
              </Dropdown>
            </div>
            <Table
              scroll={{x: 1300}}
              columns={columns}
              dataSource={data.list}
              // bordered
              size="middle"
              onChange={this.handleChange}
              pagination={paginationProps}
            />
          </div>
          <CreateForm
            {...parentMethods}
            data={transData}
            modalVisible={modalVisible}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ExperimentPacketHome;
