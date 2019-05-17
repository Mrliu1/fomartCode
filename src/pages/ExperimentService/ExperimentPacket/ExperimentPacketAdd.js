/* eslint-disable no-nested-ternary */
import React, {PureComponent} from 'react';
import {
  Card,
  Button,
  Form,
  Icon,
  Col,
  Row,
  Select,
  Divider,
  Popover,
  Table,
  Modal,
} from 'antd';
import {connect} from 'dva';
import FooterToolbar from '@/components/FooterToolbar';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {getDetailDescDom, getFromDom} from '@/utils/utils';
// import moment from 'moment';
import {sampleModeArr} from '@/utils/experimentServiceDict';
import router from 'umi/router';

// import TableForm from '@/components/GlobalTools/TableForm';
import TableExperimentPacketForm from './TableForm';

import {
  fieldLabelsForm,
  tableAddOmicsColumns,
  tableAddFuncColumns,
  tableAddBioColumns,
  tableAddBoxColumns,
  tableAddOmicsColumnsModel,
  tableAddFuncColumnsModel,
  tableAddBoxColumnsModel,
  modelDetailOmics,
  modelDetailFuncs,
  modelDetailBios,
  modelDetailBoxes,
} from './tableColumnsData';

import styles from './children.less';

const {Option} = Select;
// const { RangePicker } = DatePicker;
const FormItem = Form.Item;

// 创建模态框组件
const CreateForm = Form.create () (props => {
  const {
    modalVisible,
    form,
    loading,
    handleModalVisible,
    modelDetalGlobal,
    modelDetalGlobal: {modelDetail},
  } = props;
  return (
    <Modal
      destroyOnClose
      width={'70vw'}
      title={modelDetalGlobal.title}
      visible={modalVisible}
      footer={[
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => handleModalVisible ()}
        >
          关闭{' '}
        </Button>,
      ]}
    >
      <Card bordered={false}>
        <DescriptionList
          size="large"
          title={modelDetalGlobal.title}
          style={{marginBottom: 32}}
        >
          {getDetailDescDom (
            modelDetail && modelDetail.Arr ? modelDetail.Arr : [],
            modelDetalGlobal
          )}
        </DescriptionList>
        <Divider style={{marginBottom: 32}} />
        <div className={styles.title}>
          {modelDetalGlobal.tableTitle ? modelDetalGlobal.tableTitle : []}
        </div>
        <Table
          style={{marginBottom: 24}}
          pagination={false}
          loading={loading}
          bordered
          dataSource={
            modelDetalGlobal.tableData && modelDetalGlobal.tableData.length > 0
              ? modelDetalGlobal.tableData
              : []
          }
          columns={modelDetail && modelDetail.table ? modelDetail.table : []}
          rowKey="ids"
        />
        {modelDetail && modelDetail.tableOne
          ? <div>
              <div className={styles.title}>
                {modelDetalGlobal.tableTitleOne}
              </div>
              <Table
                style={{marginBottom: 24}}
                pagination={false}
                bordered
                loading={loading}
                dataSource={
                  modelDetalGlobal.tableDataOne &&
                    modelDetalGlobal.tableDataOne.length > 0
                    ? modelDetalGlobal.tableDataOne
                    : []
                }
                columns={modelDetail.tableOne}
                rowKey="id"
              />
            </div>
          : []}
      </Card>
    </Modal>
  );
});

@connect (({loading, packet}) => ({
  ...packet,
  submitting: loading.effects['packet/createPacketFn'],
}))
@Form.create ()
class ExperimentPacketAdd extends PureComponent {
  state = {
    width: '100%',
    transParams: {},
    modalVisible: false,
    homeState: false,
    isAddFalg: true,
    modelDetalGlobal: {},
  };

  componentDidMount () {
    const {dispatch} = this.props;
    const paramsOrign = this.props.location.query.params;
    if (paramsOrign && paramsOrign !== undefined) {
      const params = JSON.parse (paramsOrign);
      this.setState ({
        transParams: params,
        isAddFalg: false,
      });
      const param = {
        id: params.id,
      };
      dispatch ({
        type: 'packet/getPacketDetailFn',
        payload: param,
      });
    } else {
      this.setState ({
        isAddFalg: true,
      });
    }
    window.addEventListener ('resize', this.resizeFooterToolbar, {
      passive: true,
    });
    this.getInitDict ();
  }

  componentWillUnmount () {
    window.removeEventListener ('resize', this.resizeFooterToolbar);
  }

  getInitDict = () => {
    const {dispatch} = this.props;
    dispatch ({
      type: 'packet/getSampleTypesFn',
    });
  };

  goModelDetal = (data, key, parsentKey = '') => {
    let modelDetalGlobal = {};
    const detailKeyArr = ['experimentName', 'packName', 'boxTypeName'];
    if (key === 'experimentName') {
      modelDetalGlobal = {
        title: '组学检测项详情',
        modelDetail: modelDetailOmics,
        ...data,
        tableTitle: '检测流程',
        tableData: data.routeNodes,
      };
    } else if (key === 'packName') {
      if (parsentKey) {
        modelDetalGlobal = {
          title: '生化检测项详情',
          ...data,
          modelDetail: modelDetailBios,
          tableTitle: '检测项目列表',
          tableData: data.routeNodes,
        };
      } else {
        modelDetalGlobal = {
          title: '功能医学检测项详情',
          ...data,
          modelDetail: modelDetailFuncs,
          tableTitle: '检测项目列表',
          tableData: data.routeNodes,
        };
      }
    } else {
      modelDetalGlobal = {
        title: '采样盒类型详情',
        ...data,
        modelDetail: modelDetailBoxes,
        tableTitle: '配套采样器类型信息',
        tableData: data.attachmentType
          ? Array.from (JSON.parse (data.attachmentType))
          : [],
        tableTitleOne: '采样配件信息',
        tableDataOne: data.capacityType ? JSON.parse (data.capacityType) : [],
      };
    }
    this.setState ({
      modelDetalGlobal,
    });
    this.handleModalVisible (true);
  };

  // 查看详情
  handleModalVisible = flag => {
    this.setState ({
      modalVisible: !!flag,
    });
  };

  goExperimentPacketHome = () => {
    router.push ({
      pathname: `/manufacture/ExperimentService/ExperimentPacket/ExperimentPacketHome`,
    });
  };

  goHomeState = () => {
    this.setState ({
      homeState: true,
    });
  };

  getErrorInfo = () => {
    const {form: {getFieldsError}} = this.props;
    const errors = getFieldsError ();
    const errorCount = Object.keys (errors).filter (key => errors[key]).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = fieldKey => {
      const labelNode = document.querySelector (`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView (true);
      }
    };
    const errorList = Object.keys (errors).map (key => {
      if (!errors[key]) {
        return null;
      }
      return (
        <li
          key={key}
          className={styles.errorListItem}
          onClick={() => scrollToField (key)}
        >
          <Icon type="cross-circle-o" className={styles.errorIcon} />
          <div className={styles.errorMessage}>{errors[key][0]}</div>
          <div className={styles.errorField}>{fieldLabelsForm[key]}</div>
        </li>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={trigger => trigger.parentNode}
        >
          <Icon type="exclamation-circle" />
        </Popover>
        {errorCount}
      </span>
    );
  };

  resizeFooterToolbar = () => {
    requestAnimationFrame (() => {
      const sider = document.querySelectorAll ('.ant-layout-sider')[0];
      if (sider) {
        const width = `calc(100% - ${sider.style.width})`;
        const {width: stateWidth} = this.state;
        if (stateWidth !== width) {
          this.setState ({width});
        }
      }
    });
  };

  validate = key => {
    const {transParams, isAddFalg} = this.state;
    const {form: {validateFieldsAndScroll}, dispatch} = this.props;
    const timer = setTimeout (() => {
      const {homeState} = this.state;
      if (homeState) {
        window.clearTimeout (timer);
        this.goExperimentPacketHome ();
      }
    }, 500);
    validateFieldsAndScroll ((error, values) => {
      const valuesObj = JSON.parse (JSON.stringify (values));
      const bios = valuesObj.bios.map (val => {
        const value = {
          mexamPackId: val.id,
          startupType: val.startupType,
        };
        return value;
      });
      const omics = valuesObj.omics.map (val => {
        const value = {
          experimentId: val.id,
          dataSize: val.dataSize,
          startupType: val.startupType,
          triggerSampleType: val.triggerSampleType,
        };
        return value;
      });
      const funcs = valuesObj.funcs.map (val => {
        const value = {
          mexamPackId: val.id,
          startupType: val.startupType,
        };
        return value;
      });
      const boxes = valuesObj.boxes.map (val => {
        const value = {
          boxTypeId: val.id,
          remark: val.remark,
        };
        return value;
      });
      const newParams = {
        bios,
        omics,
        funcs,
        boxes,
      };

      const params = Object.assign ({}, values, newParams);
      if (!error) {
        // submit the values
        if (key === 'PUBLISHED') {
          dispatch ({
            type: 'packet/submitPacketFn',
            payload: Object.assign ({}, params, {id: transParams.id}),
            callback: this.goHomeState,
          });
        } else {
          // 新建
          if (isAddFalg) {
            dispatch ({
              type: 'packet/createPacketFn',
              payload: params,
              callback: this.goHomeState,
            });
          } else {
            dispatch ({
              type: 'packet/editPacketFn',
              payload: Object.assign ({}, params, {id: transParams.id}),
              callback: this.goHomeState,
            });
          }
        }
      }
    });
  };

  handleChange = info => {
    let {fileList} = info;

    // 1. 上传列表数量的限制
    //    只显示最近上传的一个，旧的会被新的顶掉
    fileList = fileList.slice (-2);

    // 2. 读取远程路径并显示链接
    fileList = fileList.map (file => {
      if (file.response) {
        // 组件会将 file.url 作为链接进行展示
        file.url = file.response.url;
      }
      return file;
    });

    // 3. 按照服务器返回信息筛选成功上传的文件
    fileList = fileList.filter (file => {
      if (file.response) {
        return file.response.status === 'success';
      }
      return true;
    });

    this.setState ({fileList});
  };

  queryFn = (type, payload) => {
    const {dispatch} = this.props;
    dispatch ({
      type: type,
      payload: payload,
    });
  };

  render () {
    const {
      form: {getFieldDecorator},
      submitting,
      mData,
      res,
      initDictObj,
    } = this.props;
    const rowSelection = {
      fn: () => {
        console.log ('44');
      },
    };

    const {
      width,
      transParams,
      isAddFalg,
      modelDetalGlobal,
      modalVisible,
    } = this.state;
    const newRes = isAddFalg ? {data: []} : res;
    const {data} = newRes;
    const tableDataOmics = data && data.omics && data.omics.length > 0
      ? data.omics
      : [];
    const tableDataFunc = data && data.funcs && data.funcs.length > 0
      ? data.funcs
      : [];
    const tableDataBio = data && data.bios && data.bios.length > 0
      ? data.bios
      : [];
    const tableDataBox = data && data.boxes && data.boxes.length > 0
      ? data.boxes
      : [];
    const sampleMode = data && data.sampleMode ? data.sampleMode : '';
    const FormDom = getFromDom (fieldLabelsForm, this.props, transParams);

    const formatColumns = (data, parsentKey = '') => {
      const detailKeyArr = ['experimentName', 'packName', 'boxTypeName'];
      return data.map (val => {
        if (detailKeyArr.includes (val.dataIndex)) {
          // 处理详情弹出框
          val['render'] = (text, record) => (
            <a
              onClick={() =>
                this.goModelDetal (record, val.dataIndex, parsentKey)}
            >
              {text}
            </a>
          );

          // val['selectArr'] = initDictObj.sampleTypes ? initDictObj.sampleTypes.dataArr : []
        }
        if (val.dataIndex === 'sampleTypeId') {
          val['selectArr'] = initDictObj.sampleTypes
            ? initDictObj.sampleTypes.dataArr
            : [];
          val['render'] = text => (
            <span>
              {initDictObj.sampleTypes
                ? initDictObj.sampleTypes.dict[text]
                : ''}
            </span>
          );
        }
        if (val.dataIndex === 'routeStartSampleTypes') {
          val['selectArr'] = initDictObj.sampleTypes
            ? initDictObj.sampleTypes.dataArr
            : [];
          val['render'] = text => (
            <span>
              {text.map (
                _val =>
                  initDictObj.sampleTypes
                    ? initDictObj.sampleTypes.dict[_val.sampleTypeId]
                    : ''
              )}
            </span>
          );
        }
        if (val.dataIndex === 'middleSampleTypeId') {
          val['selectArr'] = initDictObj.sampleTypes
            ? initDictObj.sampleTypes.dataArr
            : [];
          val['render'] = text => (
            <span>
              {initDictObj.sampleTypes
                ? initDictObj.sampleTypes.dict[text]
                : ''}
            </span>
          );
        }
        if (val.dataIndex === 'triggerSampleType') {
          val['selectArr'] = initDictObj.sampleTypes
            ? initDictObj.sampleTypes.dataArr
            : [];
          // val['render'] = (text, record) => (<span>{text ? text.split(',').map(_val => {initDictObj.sampleTypes ? initDictObj.sampleTypes.dict[_val] : ''}) : ''}</span>)
          // val['render'] = (text) => <span>{ initDictObj.sampleTypes ? initDictObj.sampleTypes.dict[text] : ''}</span>
        }
        if (val.dataIndex === 'sampleTypes') {
          val['selectArr'] = initDictObj.sampleTypes
            ? initDictObj.sampleTypes.dataArr
            : [];
          val['render'] = (text, record) => (
            <span>
              {text
                ? text.split (',').map (_val => {
                    initDictObj.sampleTypes
                      ? initDictObj.sampleTypes.dict[_val]
                      : '';
                  })
                : ''}
            </span>
          );
        }
        if (val.dataIndex === 'name') {
          val['selectArr'] = initDictObj.processes
            ? initDictObj.processes.dataArr
            : [];
        }
        return val;
      });
    };
    const tableAddOmicsNewColumns = formatColumns (tableAddOmicsColumns);
    const tableAddFuncNewColumns = formatColumns (tableAddFuncColumns);
    const tableAddBioNewColumns = formatColumns (tableAddBioColumns, 'Bio');
    const tableAddBoxNewColumns = formatColumns (tableAddBoxColumns);
    // 组学检测方案添加检测包
    const queryConditionOmics = {
      conditionArr: [
        {
          key: 'experimentCode',
          label: '检测项编码',
        },
        {
          key: 'experimentName',
          label: '检测项名称',
        },
      ],
      type: 'packet/getExperimentsPageFn',
      fn: this.queryFn,
    };
    // 功能医学方案添加检测包
    const queryConditionFuncs = {
      conditionArr: [
        {
          key: 'packCode',
          label: '检测套餐编码',
        },
        {
          key: 'packName',
          label: '检测套餐名称',
        },
      ],
      type: 'packet/getPacksFn',
      fn: this.queryFn,
    }; // 生化检测方案添加检测包
    const queryConditionBios = {
      conditionArr: [
        {
          key: 'packCode',
          label: '检测套餐编码',
        },
        {
          key: 'packName',
          label: '检测套餐名称',
        },
      ],
      type: 'packet/getPacksFnBio',
      fn: this.queryFn,
    }; // 采样方案添加采样盒
    const queryConditionBoxes = {
      conditionArr: [
        {
          key: 'materielCode',
          label: '采样盒类型编码',
        },
        {
          key: 'productName',
          label: '采样盒类型名称',
        },
      ],
      type: 'packet/getSampleBoxTypesFn',
      fn: this.queryFn,
    };
    const parentMethods = {
      modelDetalGlobal,
      handleModalVisible: this.handleModalVisible,
      onSelectChange: this.onSelectChange,
      selectedRowKeys: this.state.selectedRowKeys,
    };
    return (
      <PageHeaderWrapper
        title={`检测包${isAddFalg ? '创建' : '编辑'}`}
        wrapperClassName={styles.advancedForm}
      >
        <Card title="基本信息" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            {FormDom}
          </Form>
        </Card>
        <Row gutter={16}>
          <Col xl={24}>
            <Card title="组学方案" bordered={false}>
              {getFieldDecorator ('omics', {
                initialValue: tableDataOmics,
              }) (
                <TableExperimentPacketForm
                  member="model"
                  queryCondition={queryConditionOmics}
                  addFont="组学方案"
                  rowSelection={rowSelection}
                  mColumns={tableAddOmicsNewColumns}
                  childMColumns={tableAddOmicsColumnsModel}
                  childMData={mData.omics}
                />
              )}
            </Card>
          </Col>
          <Col xl={24}>
            <Card title="功能医学方案" bordered={false}>
              {getFieldDecorator ('funcs', {
                initialValue: tableDataFunc,
              }) (
                <TableExperimentPacketForm
                  member="model"
                  queryCondition={queryConditionFuncs}
                  addFont="功能医学方案"
                  rowSelection={rowSelection}
                  mColumns={tableAddFuncNewColumns}
                  childMColumns={tableAddFuncColumnsModel}
                  childMData={mData.funcs}
                />
              )}
            </Card>
          </Col>
          <Col xl={24}>
            <Card title="生化方案" bordered={false}>
              {getFieldDecorator ('bios', {
                initialValue: tableDataBio,
              }) (
                <TableExperimentPacketForm
                  member="model"
                  queryCondition={queryConditionBios}
                  addFont="生化方案"
                  rowSelection={rowSelection}
                  mColumns={tableAddBioNewColumns}
                  childMColumns={tableAddFuncColumnsModel}
                  childMData={mData.bios}
                />
              )}
            </Card>
          </Col>
          <Col md={24} sm={24} span={8} key="sa" className="formSelect">
            <FormItem key="sampleMode" label="采样方案">
              {getFieldDecorator ('sampleMode', {
                initialValue: sampleMode,
                rules: [{required: true, message: `请填写采样方案`}],
              }) (
                <Select
                  style={{display: 'inline-block', width: '35%'}}
                  placeholder="采样方案"
                  allowClear
                  autoFocus
                >
                  {sampleModeArr.map (sval => {
                    return (
                      <Option key={sval.key} value={sval.key}>
                        {sval.value}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xl={24}>
            <Card bordered={false}>
              {getFieldDecorator ('boxes', {
                initialValue: tableDataBox,
              }) (
                <TableExperimentPacketForm
                  member="model"
                  queryCondition={queryConditionBoxes}
                  addFont="采样方案"
                  rowSelection={rowSelection}
                  mColumns={tableAddBoxNewColumns}
                  childMColumns={tableAddBoxColumnsModel}
                  childMData={mData.boxes}
                />
              )}
            </Card>
          </Col>
        </Row>
        <FooterToolbar style={{width}}>
          {this.getErrorInfo ()}
          <Button onClick={this.goExperimentPacketHome} loading={submitting}>
            取消
          </Button>
          <Button
            type="primary"
            onClick={this.validate.bind (this, 'PUBLISHED')}
            loading={submitting}
          >
            提交
          </Button>
          {isAddFalg || transParams.packetState === 'DRAFT'
            ? <Button
                onClick={this.validate.bind (this, 'DRAFT')}
                loading={submitting}
              >
                保存
              </Button>
            : []}
        </FooterToolbar>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default ExperimentPacketAdd;
