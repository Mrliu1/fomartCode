import React, { PureComponent } from 'react';
import {
  Card,
  Button,
  Form,
  Icon,
  Col,
  Row,
  message,
  DatePicker,
  Select,
  Popover,
} from 'antd';
import { connect } from 'dva';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TableForm from '@/components/GlobalTools/TableForm';

// import moment from 'moment';
import { getFromDom } from '@/utils/utils';
import router from 'umi/router';
import TableRouteForm from './TableForm';

import {fieldLabelsForm, tableAddSampleColumns, tableAddFlowColumns} from  './tableColumnsData'

import styles from './children.less';

// const { Option } = Select;
// const { RangePicker } = DatePicker;

@connect(({ loading, route }) => ({
  ...route,
  submitting: loading.effects['route/createRouteFn'],
}))
@Form.create()
class RouteAdd extends PureComponent {
  state = {
    width: '100%',
    fileList: [],
    transParams: {},
    tableDataSample: [],
    tableDataFlow: [],
    isAddFalg: true,
    homeState: false,
  };

  componentDidMount() {
    const paramsOrign = this.props.location.query.params;
    if (paramsOrign && paramsOrign !== undefined) {
      const params = JSON.parse(paramsOrign)
      const nodes = params.nodes.map(val => {
        val['name'] = val.code
        return val
      })
      const paramsNew = Object.assign({}, params, nodes)
      this.setState({
        transParams: paramsNew,
        tableDataSample: paramsNew.startSampleTypes,
        tableDataFlow: paramsNew.nodes,
        isAddFalg: false,
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
      type: 'route/fetchBasic',
    });
    dispatch({
      type: 'route/getProcessesAllFn',
    });
  }

  goRouteHome = () =>{
    router.push({
      pathname: `/manufacture/ExperimentService/Route/RouteHome`,
    });
  }

  goHomeState = () => {
    this.setState({
      homeState: true
    })
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
      initDictObj,
    } = this.props;
    const {isAddFalg, transParams} = this.state
    let timer = setTimeout(()=> {
      const {homeState} = this.state
      if (homeState) {
        window.clearTimeout(timer);
        this.goRouteHome()
      }
    },500)
    validateFieldsAndScroll((error, values) => {
      const dealNodes = JSON.parse(JSON.stringify(values.nodes))
      const nodes = dealNodes.map((val, index) => {
        let value = JSON.parse(JSON.stringify(val))
        delete val.key
        delete val.qcName
        delete val.editable
        val['step'] = index + 1
        val['state'] = 'Pending'
        val['name'] = value.qcName ? value.qcName : initDictObj.processes ? initDictObj.processes.dict[val.code]: ''
        return val
      })
      const dealStartSampleTypes = JSON.parse(JSON.stringify(values.startSampleTypes))
      const startSampleTypes = dealStartSampleTypes.map(val => {
        delete val.key
        delete val.editable
        return val
      })
      if (startSampleTypes.length === 0 && state === 'PUBLISHED') {
        message.error('启动样本，没有添加，请添加后，再提交');
        return
      }
      if (nodes.length === 0 && state === 'PUBLISHED') {
        message.error('检测流程，没有添加，请添加后，再提交');
        return
      }
      const datas = {
        nodes,
        startSampleTypes,
        state,
      }
      const params = Object.assign({}, values, datas)
      console.log(params, '技术路线----')
      if (!error) {
        // submit the values
        if (isAddFalg) {
          dispatch({
            type: 'route/createRouteFn',
            payload: params,
            callback: this.goHomeState,
          });
        } else {
          dispatch({
            type: 'route/updateRouteFn',
            payload: Object.assign({},params, {id: transParams.id}),
            callback: this.goHomeState,
          });
        }
      }
    });
  };

  handleChange = info => {
    let fileList = info.fileList;

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
  // getFromDom = data => {
  //   const {
  //     form: { getFieldDecorator },
  //   } = this.props;
  //   const { transParams } = this.state;
  //   let DomArr = [];
  //   let newDom = datas => {
  //     return datas.map(val => {
  //       console.log(val);
  //       if (val.type === 'input') {
  //         return (
  //           <Col lg={4} md={8} sm={24}>
  //             <Form.Item key={val.key} className={val.require? 'antRequired' : ''} label={val.label}>
  //               {getFieldDecorator(val.key, {
  //                 initialValue: transParams[val.key] ? transParams[val.key] : '',
  //                 rules: [{ required: val.require, message: `请输入${val.label}` }],
  //               })(<Input placeholder={`请输入${val.label}`} disabled={val.disabled} />)}
  //             </Form.Item>
  //           </Col>
  //         );
  //       } else if (val.type === 'time') {
  //         return (
  //           <Col lg={4} md={8} sm={24}>
  //             <Form.Item label={val.label} key={val.key} className={val.require? 'antRequired' : ''}>
  //               {getFieldDecorator(val.key, {
  //                 initialValue: (transParams&&transParams[val.key]) ? moment(transParams[val.key]).format('YYYY-MM-DD HH:mm:ss') : '',
  //                 rules: [{ required: val.require, message: `请选择${val.label}` }],
  //               })(
  //                 val.disabled ? <Input placeholder={`请输入${val.label}`} disabled={val.disabled} /> :
  //                 <DatePicker
  //                   showTime
  //                   placeholder={`请选择${val.label}`}
  //                 />
  //               )}
  //             </Form.Item>
  //           </Col>
  //         );
  //       } else if (val.type === 'select') {
  //         return (
  //           <Col lg={4} md={8} sm={24}>
  //             <Form.Item label={val.label} key={val.key} className={val.require? 'antRequired' : ''}>
  //               {getFieldDecorator(val.key, {
  //                 initialValue: transParams ? transParams[val.key] : '',
  //                 rules: [{ required: val.require, message: `请选择${val.label}` }],
  //               })(
  //                 <Select placeholder={`请选择${val.label}`} disabled={val.disabled} allowClear="true"
  //                 mode={val.mode ? val.mode : ''}>
  //                   {val.selectArr.length > 0
  //                     ? val.selectArr.map(sval => {
  //                         return (<Option key={sval.key} value={sval.key}>{sval.value}</Option>);
  //                       })
  //                     : []}
  //                 </Select>
  //               )}
  //             </Form.Item>
  //           </Col>
  //         );
  //       } else if (val.type === 'upload') {
  //         const props = {
  //           action: '/upload.do',
  //           onChange: this.handleChange,
  //           multiple: true,
  //         };
  //         return (
  //           <Col lg={4} md={8} sm={24}>
  //             <div className="clearfix">
  //               <Form.Item label={val.label} key={val.key} className={val.require? 'antRequired' : ''}>
  //                 <Upload {...props} fileList={this.state.fileList} disabled={val.disabled}>
  //                   <Button type="ghost">
  //                     <Icon type="upload" /> 点击上传
  //                   </Button>
  //                 </Upload>
  //               </Form.Item>
  //             </div>
  //           </Col>
  //         );
  //       }
  //     });
  //   };
  //   for (let i = 0, len = data.length; i < len; i += 6) {
  //     console.log(i);
  //     DomArr.push(<Row gutter={16}>{newDom(data.slice(i, i + 6))}</Row>);
  //   }
  //   return DomArr;
  // };

  render() {
    const {
      form: { getFieldDecorator },
      submitting,
      initDictObj,
    } = this.props;
    const { width, transParams, isAddFalg, tableDataSample, tableDataFlow } = this.state;
    const FormDom = getFromDom(fieldLabelsForm, this.props, transParams);
    const  tableAddSampleNewColumns = tableAddSampleColumns.map(val => {
      if(val.dataIndex === 'sampleTypeId') {
        val['selectArr'] = initDictObj.sampleTypes ?initDictObj.sampleTypes.dataArr : []
      }
      return val
    })
    const  tableAddFlowNewColumns = tableAddFlowColumns.map(val => {
      if(val.dataIndex === 'middleSampleTypeId') {
        val['selectArr'] = initDictObj.sampleTypes ? initDictObj.sampleTypes.dataArr : []
      }
      if(val.dataIndex === 'name') {
        val['selectArr'] = initDictObj.processes ? initDictObj.processes.dataArr : []
      }
      return val
    })
    return (
      <PageHeaderWrapper title={`技术路线${isAddFalg ? '创建' : '编辑'}`} wrapperClassName={styles.advancedForm}>
        <Card title="基本信息" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            {FormDom}
          </Form>
        </Card>
        <Row gutter={16}>
          <Col xl={24}>
            <Card title="启动样本" bordered={false}>
              {getFieldDecorator('startSampleTypes', {
                initialValue: tableDataSample,
              })(<TableForm member="member" addFont="启动样本" mColumns={tableAddSampleNewColumns} />)}
            </Card>
          </Col>
          <Col xl={24}>
            <Card title="检测流程" bordered={false}>
              {getFieldDecorator('nodes', {
                initialValue: tableDataFlow,
              })(<TableRouteForm  morestn="true"  member="member" addFont="检测流程"  mColumns={tableAddFlowNewColumns} />)}
            </Card>
          </Col>
        </Row>
        <FooterToolbar style={{ width }}>
          {this.getErrorInfo()}
          <Button  onClick={this.goRouteHome} loading={submitting}>
            取消
          </Button>
          <Button type="primary" onClick={this.validate.bind(this, 'PUBLISHED')} loading={submitting}>
            提交
          </Button>
          {isAddFalg || transParams.state === 'DRAFT' ? <Button onClick={this.validate.bind(this, 'DRAFT')} loading={submitting}>
            保存
          </Button> : []}
        </FooterToolbar>
      </PageHeaderWrapper>
    );
  }
}

export default RouteAdd;
