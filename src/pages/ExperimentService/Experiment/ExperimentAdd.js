/* eslint-disable no-else-return */
/* eslint-disable no-lonely-if */
import React, { PureComponent } from 'react';
import {
  Card,
  Button,
  Form,
  Icon,
  Col,
  Row,
  DatePicker,
  Input,
  Select,
  Table,
  Popover,
  Upload,
} from 'antd';
import { connect } from 'dva';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import TableForm from '@/components/GlobalTools/TableForm';

import moment from 'moment';
import {  whetherArr, seqInstrumentArr } from '@/utils/experimentServiceDict';
// import { getFromDom } from '@/utils/utils';
import router from 'umi/router';
import { selectArrayToDict } from '@/utils/utils';


import { fieldLabelsForm, tableAddSampleColumns, tableAddFlowColumns } from './tableColumnsData';


import styles from './children.less';

const { Option } = Select;
const FormItem = Form.Item;
@connect(({ loading, experiment }) => ({
  ...experiment,
  submitting: loading.effects['experiment/createExperimentFn'],
}))
@Form.create()
class ExperimentAdd extends PureComponent {
  state = {
    width: '100%',
    fileList: [],
    transParams: {},
    isAddFalg: true,
    routeName: '',
    routeId: '',
    tableDataSample: [],
    homeState: false,
    seqInstrument: [], // 技术平台在技术路线里面的值
    tableDataFlow: [],
  };

  componentDidMount() {
    const { location } = this.props
    const paramsOrign = location.query.params;
    if (paramsOrign && paramsOrign !== undefined) {
      const params = JSON.parse(paramsOrign)
      this.setState({
        transParams: params,
        isAddFalg: false,
        tableDataSample: params.routeStartSampleTypes, // 样本
        tableDataFlow: params.routeNodes, // 流程
        routeId: params.routeId,
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
      type: 'experiment/getSampleTypesFn',
    });
    dispatch({
      type: 'experiment/getProcessesAllFn',
    });
    dispatch({
      type: 'experiment/getRouteDictFn',
    });
  }

  goExperimentHome = () =>{
    router.push({
      pathname: `/manufacture/ExperimentService/Experiment/ExperimentHome`,
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
    const { routeId, tableDataSample, tableDataFlow, isAddFalg, transParams } = this.state
    const timer = setTimeout(()=> {
      const {homeState} = this.state
      if (homeState) {
        window.clearTimeout(timer);
        this.goExperimentHome()
      }
    },500)
    validateFieldsAndScroll((error, values) => {
      // const nodes = values.nodes ? values.nodes.map(val => {
      //   delete val.key
      //   return val
      // }) : []
      // const startSampleTypes = values.startSampleTypes ? values.startSampleTypes.map(val => {
      //   delete val.key
      //   return val
      // }) : []
      const routeStartSampleTypes = tableDataSample
      const routeNodes = tableDataFlow.map(val => {
        if(!val.outsource || val.outsource === 'undefined') {
          val['outsource'] = 'false'
        }
        return val
      })
      const datas = {
        id: transParams.id,
        routeId,
        routeStartSampleTypes,
        routeNodes,
      }
      const params = Object.assign({}, values, datas)
      if (!error) {
        // submit the values
        if (state === 'submit') {
          dispatch({
            type: 'experiment/submitExperimentFn',
            payload: params,
            callback: this.goHomeState,
          });
        } else {
          if (isAddFalg) {
            dispatch({
              type: 'experiment/createExperimentFn',
              payload: params,
              callback: this.goHomeState,
            });
          } else {
            dispatch({
              type: 'experiment/editExperimentFn',
              payload: params,
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
    fileList = fileList.slice(-2);

    // 2. 读取远程路径并显示链接
    fileList = fileList.map(file => {
      if (file.response) {
        // 组件会将 file.url 作为链接进行展示
        file.url = file.response.url;
      }
      return file;
    });

    // 3. 按照服务器返回信息筛选成功上传的文件
    fileList = fileList.filter(file => {
      if (file.response) {
        return file.response.status === 'success';
      }
      return true;
    });

    this.setState({ fileList });
  };

  onChangeSelect =  (key, val) => {
    const valKey = val.key
    const {
      initDictObj : {routeCode},
      form,
    } = this.props
    const me = this
    if(valKey === 'routeCode') {
      this.setState({
          routeName: routeCode.dict[key],
      })
      routeCode.dataArr.forEach(vals =>{
        if(vals.code === key) {
          form.setFieldsValue({
            seqInstrument: null
          })
          me.setState({
            seqInstrument: vals.seqInstrument,
            routeId: vals.id,
            tableDataSample: vals.startSampleTypes,
            tableDataFlow: vals.nodes,
          })
        }
      })
    }
  }

  getFromDom = data => {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { transParams } = this.state;
    let DomArr = [];
    let newDom = datas => {
      return datas.map(val => {
        if (val.type === 'input') {
          return (
            <Col lg={4} md={8} sm={24}>
              <Form.Item key={val.key} className={val.require? 'antRequired' : ''} label={val.label}>
                {getFieldDecorator(val.key, {
                  // initialValue: transParams[val.key] ? transParams[val.key] : '',
                  initialValue: val.key === 'routeName' && this.state.routeName ? this.state.routeName : transParams[val.key] ? transParams[val.key] : '',
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
                  <Select placeholder={`请选择${val.label}`} showSearch="true" onChange={(e)=> this.onChangeSelect(e, val)} disabled={val.disabled}
                  allowClear="true"
                  mode={val.mode ? val.mode : ''}>
                    {(val.selectArr && val.selectArr.length > 0)
                      ? val.selectArr.map(sval => {
                          return (<Option key={sval.key} value={sval.key}>{sval.key}</Option>);
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
            multiple: true,
          };
          return (
            <Col lg={4} md={8} sm={24}>
              <div className="clearfix">
                <Form.Item label={val.label} key={val.key} className={val.require? 'antRequired' : ''}>
                  <Upload {...props} fileList={this.state.fileList} disabled={val.disabled}>
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

  changeOutsource = (record, text) => {
    record['outsource'] = text
  }

  render() {
    const {
      form: { getFieldDecorator },
      submitting,
      initDictObj,
    } = this.props;
    const { width, transParams, tableDataSample, tableDataFlow, seqInstrument, isAddFalg } = this.state;
    const  fieldLabelsNewForm = fieldLabelsForm.map(val => {
      if(val.key === 'seqInstrument') {
        const selectArr = JSON.parse(JSON.stringify(seqInstrumentArr))
        val.selectArr = selectArr.filter( (_val)=> {
          return seqInstrument.includes(_val.key)
        })
      }
      if(val.key === 'routeCode') {
        val['selectArr'] = initDictObj.routeCode ? initDictObj.routeCode.dataArr : []
      }
      return val
    })
    const FormDom = this.getFromDom(fieldLabelsNewForm, this.props, transParams);
    const  tableAddSampleNewColumns = tableAddSampleColumns.map(val => {
      if (val.type === 'select'){
        if(val.dataIndex === 'sampleTypeId') {
          val['selectArr'] = initDictObj.sampleTypes ?initDictObj.sampleTypes.dataArr : []
        }
        val['render'] = (text) => <span>{selectArrayToDict(val.selectArr)[text]}</span>;
      }
      return val
    })
    // return (
    //   <FormItem style={{ margin: 0 }}>
    //     {getFieldDecorator(`outsource${index}`, {
    //       initialValue:'false',
    //     })( 
    //       <Select style={{ width: '100%' }} placeholder="请选择" showSearch="true" defaultValue="false">
    //         {whetherArr.map(item => {
    //       return (
    //         <Option value={item.key} key={item.key}>
    //           {item.value}
    //         </Option>
    //       );
    //     })}
    //       </Select>)}
    //   </FormItem>
    // )
    const renderSelect = (text, record) => {
      return (
        <Select style={{ width: '100%' }} placeholder="请选择" showSearch="true" onChange={this.changeOutsource.bind(this, record)} defaultValue="false">
          {whetherArr.map(item => {
            return (
              <Option value={item.key} key={item.key}>
                {item.value}
              </Option>
            );
          })}
        </Select>
      )
    }
    const  tableAddFlowNewColumns = tableAddFlowColumns.map((val, index) => {
      if(val.dataIndex === 'middleSampleTypeId') {
        val['selectArr'] = initDictObj.sampleTypes ? initDictObj.sampleTypes.dataArr : []
      }
      if(val.dataIndex === 'name') {
        val['selectArr'] = initDictObj.processes ? initDictObj.processes.dataArr : []
      }
      if (val.type === 'select'){
        val['render'] = (text) => <span>{selectArrayToDict(val.selectArr)[text]}</span>;
      }
      if(val.dataIndex === 'outsource') {
        val['render'] = renderSelect
      }
      return val
    })
    return (
      <PageHeaderWrapper title={`检测项${isAddFalg ? '创建' : '编辑'}`} wrapperClassName={styles.advancedForm}>
        <Card title="基本信息" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            {FormDom}
          </Form>
        </Card>
        <Row gutter={16}>
          <Col xl={24}>
            <FormItem style={{ margin: 0 }}>
              <Card title="启动样本" bordered={false}>
                {getFieldDecorator('routeStartSampleTypes', {
                })(<Table bordered size="small" columns={tableAddSampleNewColumns} dataSource={tableDataSample} />)}
              </Card>
            </FormItem>
          </Col>
          <Col xl={24}>
            <FormItem style={{ margin: 0 }}>
              <Card title="检测流程" bordered={false}>
                {getFieldDecorator('routeNodes', {
                })(<Table bordered size="small" dataSource={tableDataFlow} columns={tableAddFlowNewColumns} />)}
              </Card>
            </FormItem>
          </Col>
        </Row>
        <FooterToolbar style={{ width }}>
          {this.getErrorInfo()}
          <Button onClick={() => this.goExperimentHome()}>
            取消
          </Button>
          <Button type="primary" onClick={this.validate.bind(this, 'submit')} loading={submitting}>
            提交
          </Button>
          {isAddFalg || transParams.experimentState === 'DRAFT' ? <Button onClick={this.validate.bind(this, 'save')} loading={submitting}>
            保存
          </Button> : []}
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default ExperimentAdd;
