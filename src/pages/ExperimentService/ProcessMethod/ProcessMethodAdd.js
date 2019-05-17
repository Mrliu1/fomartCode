import React, { PureComponent } from 'react';
import {
  Card,
  Button,
  Form,
  Icon,
  Col,
  Row,
  DatePicker,
  TimePicker,
  Input,
  Select,
  Modal,
  Table,
  Popover,
  Upload,
} from 'antd';
import { connect } from 'dva';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TableForm from '@/components/GlobalTools/TableForm';
import moment from 'moment';

import router from 'umi/router';
import styles from './children.less';

import { getFromDom } from '@/utils/utils';
import { fieldLabelsForm, tableAddColumns, tableAddchildMColumns } from './tableColumnsData';


const { Option } = Select;
const { RangePicker } = DatePicker;

const FormItem = Form.Item;


@connect(({ method, experimentDict,loading }) => ({
  ...method,
  experimentDict,
  submitting: loading.effects['form/submitAdvancedForm'],
}))
@Form.create()
class ProcessMethodAdd extends PureComponent {
  state = {
    width: '100%',
    fileList: [],
    modalVisible: false,
    transParams: {},
    isAddFalg: true,
    processName: '',
    temUrl: '',
    homeState: false,
    id: '',
  };

  componentDidMount() {
    const paramsOrign = this.props.location.query.params;
    if (paramsOrign && paramsOrign !== undefined) {
      let params = JSON.parse(paramsOrign);
      params['mTargetSampleTypes'] = params.mTargetSampleTypes ? params.mTargetSampleTypes.map(val => val && val.sampleTypeId ? val.sampleTypeId : '') : []
      this.setState({
        transParams: params,
        isAddFalg: false,
        temUrl: params.operateOrderUrl,
        id: params.id,
        fileList: params.operateOrderUrl ? [{
          uid: '-1',
          name: params.operateOrderUrl,
          status: 'done',
          url: params.operateOrderUrl,
          thumbUrl: params.operateOrderUrl,
        }] : [],
      });
    } else {
      this.setState({
        isAddFalg: true,
      });
    }
    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
    this.getInitDict()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  getInitDict = () => {
    const {dispatch} = this.props
    dispatch({
      type: 'experimentDict/getSampleTypesFn',
    });
    dispatch({
      type: 'experimentDict/getProcessesAllFn',
    });
    dispatch({
      type: 'experimentDict/getUnitsFn',
    });
  }

  getErrorInfo = () => {
    const {
      form: { getFieldsError },
    } = this.props;
    const errors = getFieldsError();
    const errorCount = Object.keys(errors).filter(key => errors[key]).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = fieldKey => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = Object.keys(errors).map(key => {
      if (!errors[key]) {
        return null;
      }
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
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

  goProcessMethodHome = () =>{
    router.push({
      pathname: `/manufacture/ExperimentService/ProcessMethod/ProcessMethodHome`,
    });
  }

  goHomeState = () => {
    this.setState({
      homeState: true
    })
  }

  resizeFooterToolbar = () => {
    requestAnimationFrame(() => {
      const sider = document.querySelectorAll('.ant-layout-sider')[0];
      if (sider) {
        const width = `calc(100% - ${sider.style.width})`;
        const { width: stateWidth } = this.state;
        if (stateWidth !== width) {
          this.setState({ width });
        }
      }
    });
  };

  validate = (state) => {
    const {
      form: { validateFieldsAndScroll },
      dispatch,
    } = this.props;
    const {temUrl, id} = this.state
    const timer = setTimeout(()=> {
      const {homeState} = this.state
      if (homeState) {
        window.clearTimeout(timer);
        this.goProcessMethodHome()
      }
    },500)
    validateFieldsAndScroll((error, values) => {
      const mTargetSampleTypes = values.mTargetSampleTypes ? values.mTargetSampleTypes.map(val => {
        let value = {
          sampleTypeId: val
        }
        return value
      }) : []
      const {
        fTargetSampleTypeId,
        code,
        name,
        processCode,
        processName,
        reagents,
        remark,
      } = values
      const params = {
        id,
        fTargetSampleTypeId,
        code,
        name,
        processCode,
        processName,
        reagents,
        remark,
        mTargetSampleTypes,
        operateOrderUrl: temUrl,
      }
      if (!error) {
        // submit the values
        if (state === 'submit') {
          dispatch({
            type: 'method/submitProcessMethodFn',
            payload: params,
            callback: this.goHomeState,
          });
        }else{
          dispatch({
            type: 'method/saveProcessMethodFn',
            payload: params,
            callback: this.goHomeState,
          });
        }
      }
    });
  };

  // 弹出选择所属工序
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  onChangeSelect =  (key, valKey) => {

    const {experimentDict} = this.props
    const {initDictObj : {processes}} = experimentDict
    const me = this
    if(valKey === 'processCode') {
      this.setState({
          processName: processes.dict[key]
      })
    }
  }

  // 生成表单Dom
 getFromDom = (data, props, transParams) => {
    const {
      form: { getFieldDecorator },
    } = props;
    // const { transParams } = this.state;
    let DomArr = [];
    let newDom = datas => {
      return datas.map(val => {
        if (val.type === 'input') {
          return (
            <Col lg={4} md={8} sm={24}>
              <Form.Item key={val.key} className={val.require? 'antRequired' : ''} label={val.label}>
                {getFieldDecorator(val.key, {
                    initialValue: val.key=='processName' && this.state.processName ? this.state.processName : transParams[val.key] ? transParams[val.key] : '',
                  rules: [{ required: val.require, message: `请输入${val.label}` }],
                })(<Input placeholder={`请输入${val.label}`} disabled={val.disabled} />)}
              </Form.Item>
            </Col>
          );
        } else if (val.type === 'time') {
          return (
            <Col lg={4} md={8} sm={24}>
              <Form.Item label={val.label} key={val.key} className={val.require? 'antRequired' : ''}>
                {getFieldDecorator(val.key, {
                  initialValue: (transParams&&transParams[val.key]) ? moment(transParams[val.key]).format('YYYY-MM-DD HH:mm:ss') : '',
                  rules: [{ required: val.require, message: `请选择${val.label}` }],
                })(
                  val.disabled ? <Input placeholder={`请输入${val.label}`} disabled={val.disabled} /> :
                  <DatePicker
                    showTime
                    placeholder={`请选择${val.label}`}
                  />
                )}
              </Form.Item>
            </Col>
          );
        } else if (val.type === 'select') {
          return (
            <Col lg={4} md={8} sm={24}>
              <Form.Item label={val.label} key={val.key} className={val.require? 'antRequired' : ''}>
                {getFieldDecorator(val.key, {
                  initialValue: transParams ? transParams[val.key] : '',
                  rules: [{ required: val.require, message: `请选择${val.label}` }],
                })(
                  <Select placeholder={`请选择${val.label}`} showSearch="true" onChange={(e)=> this.onChangeSelect(e, val.key)} disabled={val.disabled} allowClear="true"
                  mode={val.mode ? val.mode : ''}>
                    {val.selectArr.length > 0
                      ? val.selectArr.map(sval => {
                          return (<Option key={sval.key} value={sval.key}>{val.childType && val.childType === 'key' ? sval.key : sval.value}</Option>);
                        })
                      : []}
                  </Select>
                )}
              </Form.Item>
            </Col>
          );
        } else if (val.type === 'upload') {
          const props = {
            action: val.action,
            onChange: val.fn,
            multiple: false,
            withCredentials: true,
          };
          return (
            <Col lg={4} md={8} sm={24}>
              <div className="clearfix">
                <Form.Item label={val.label} key={val.key} className={val.require? 'antRequired' : ''}>
                  <Upload {...props} fileList={val.fileList} disabled={val.disabled}>
                    <Button type="ghost">
                      <Icon type="upload" /> 点击上传
                    </Button>
                  </Upload>
                </Form.Item>
              </div>
            </Col>
          );
        }
      });
    };
    for (let i = 0, len = data.length; i < len; i += 6) {
      DomArr.push(<Row gutter={16}>{newDom(data.slice(i, i + 6))}</Row>);
    }
    return DomArr;
  };

  handleChange = info => {
    let me = this
    let fileList = info.fileList;
    // 1. 上传列表数量的限制
    //    只显示最近上传的一个，旧的会被新的顶掉
    fileList = fileList.slice(-1);
    // 2. 读取远程路径并显示链接
    fileList = fileList.map(file => {
      if (file.response) {
        // 组件会将 file.url 作为链接进行展示
        file.url = file.response.data;
        me.setState({
          temUrl: file.response.data
        })
      }
      return file;
    });

    // 3. 按照服务器返回信息筛选成功上传的文件
    fileList = fileList.filter(file => {
      if (file.response) {
        return file.response.errorCode === 0;
      }
      return true;
    });

    this.setState({ fileList });
  };

  handleConfirem = fields => {
    message.success('确定成功');
    this.handleModalVisible();
  };

  childModelHandleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      dispatch({
        type: 'method/getReagents',
        payload: values,
      });
    });
  };

  queryFn = (type, payload)=> {
     const { dispatch } = this.props;
     dispatch({
       type: type,
       payload: payload,
     });
   };

  render() {
    const {
      form: { getFieldDecorator },
      submitting,
      experimentDict: {initDictObj},
      mData,
    } = this.props;
    const { width, modalVisible, transParams, isAddFalg } = this.state;
    const tableData = JSON.stringify(transParams) !== '{}' ? transParams.reagents : [];
    const rowSelection = {
      fn: () => {
        console.log('44');
      },
    };
    const queryCondition = {
      conditionArr: [
        {
          key: 'materielCode',
          label: '物料编码',
        },
        {
          key: 'productName',
          label: '商品名称',
        },
      ],
      type: 'method/getReagents',
      fn: this.queryFn,
    }
    const parentMethods = {
      handleAdd: this.handleConfirem,
      handleModalVisible: this.handleModalVisible,
    };
    let fSampleTypes = initDictObj.sampleTypes ? initDictObj.sampleTypes.dataArr : []
    fSampleTypes.push({'null': '无'})
    const fieldLabelsFormNew =  fieldLabelsForm.map(val => {
      if(val.key === 'mTargetSampleTypes') {
        val['selectArr'] = initDictObj.sampleTypes ?initDictObj.sampleTypes.dataArr : []
      }
      if(val.key === 'fTargetSampleTypeId') {
          val['selectArr'] = fSampleTypes
        }
      if(val.key === 'processCode') {
        val['selectArr'] = initDictObj.processes ? initDictObj.processes.dataArr : []
      }
      if(val.key === 'operateOrderUrl') {
        val['action'] = 'https://boss.icarbonx.com/bosslab/experimentRelations/processMethods/templateFile'
        val['fn'] = this.handleChange
        val['fileList'] = this.state.fileList
      }
      return val
    })
    const  tableAddNewColumns = tableAddColumns.map(val => {
      // if(val.dataIndex === 'unit') {
      //   val['render'] = renderSelect
      // }
      if(val.dataIndex === 'useUnit') {
        val['selectArr'] = initDictObj.units ? initDictObj.units.dataArr : []
          // console.log(initDictObj.units.dataArr,'DASDASAS')
      }
      // if(val.dataIndex === 'name') {
      //   val['selectArr'] = initDictObj.processes ? initDictObj.processes.dataArr : []
      // }
      return val
    })
    const FormDom = this.getFromDom(fieldLabelsFormNew, this.props, transParams);

    return (
      <PageHeaderWrapper title={`工艺方法${isAddFalg ? '创建' : '编辑'}`} wrapperClassName={styles.advancedForm}>
        <Card title="工艺方法详情" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            {FormDom}
          </Form>
        </Card>
        <Card title="试剂耗材管理" bordered={false}>
          {getFieldDecorator('members', {
            initialValue: tableData,
          })(<TableForm member="model" queryCondition={queryCondition} addFont="试剂耗材" rowSelection={rowSelection}
           mColumns={tableAddNewColumns} childMColumns={tableAddchildMColumns}  childMData={mData.reagents}/>)}
        </Card>
        <FooterToolbar style={{ width }}>
          {this.getErrorInfo()}
          <Button  onClick={this.goProcessMethodHome} loading={submitting}>
            取消
          </Button>
          <Button type="primary" onClick={this.validate.bind(this, 'submit')} loading={submitting}>
            提交
          </Button>
          {isAddFalg || transParams.state === 'DRAFT' ? <Button onClick={this.validate.bind(this, 'save')} loading={submitting}>
            保存
          </Button> : []}
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default ProcessMethodAdd;
