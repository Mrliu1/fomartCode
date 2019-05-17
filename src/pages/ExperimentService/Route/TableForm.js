import React, { PureComponent, Fragment } from 'react';
import { Table, Button, Input, message, Popconfirm, Divider, Form, Modal, Select, Dropdown, Icon,
Menu } from 'antd';
import isEqual from 'lodash/isEqual';
import styles from './children.less';
import {selectArrayToDict, changeNumber} from '@/utils/utils';

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
    selectedRowKeys,
    mData,
    onSelectChange,
    mColumns,
  } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  return (
    <Modal
      destroyOnClose
      width={'70vw'}
      title="创建组合项目"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="组合名称">
        {form.getFieldDecorator('name', {
          rules: [{ required: true, message: '请输入至少五个字符的规则描述！', min: 5 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
        {form.getFieldDecorator('remark')(<Input placeholder="请输入" />)}
      </FormItem>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => start()} disabled={!hasSelected} loading={loading}>
          Reload
        </Button>
        <span style={{ marginLeft: 8 }}>
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
        </span>
      </div>
      <Table
        rowSelection={rowSelection}
        columns={mColumns}
        size="small"
        bordered
        dataSource={mData}
      />
    </Modal>

    // <Table rowSelection={rowSelection} columns={columns} dataSource={data}/>
    // </Modal>
  );
});

class TableRouteForm extends PureComponent {
  index = 0;

  cacheOriginData = {};

  constructor(props) {
    super(props);

    this.state = {
      data: props.value,
      loading: false,
      /* eslint-disable-next-line react/no-unused-state */
      value: props.value,
      modalVisible: false,
      selectedRowKeys: [],
      qcName: ''
    };
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (isEqual(nextProps.value, preState.value)) {
      return null;
    }
    return {
      data: nextProps.value,
      value: nextProps.value,
    };
  }

  // 新增组合
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    message.success('添加成功');
    this.handleModalVisible();
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

  onSelectChange = (selectedRowKeys, fn) => {
    this.setState({ selectedRowKeys });
  };

  getRowByKey(key, newData) {
    const { data } = this.state;
    return (newData || data).filter(item => item.key === key)[0];
  }

  toggleEditable = (e, key) => {
    e = e ? e : window.event
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  };

  newSingleValue = () => {
    const { member, mColumns } = this.props;
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    let newValue = new Object()
    mColumns.forEach(val => {
      if (val.dataIndex === 'unit') {
        newValue[val.dataIndex] = 'ul'
      }
      newValue[val.dataIndex]
    })
    const defaultValue = {
      key: `NEW_TEMP_ID_${this.index}`,
      editable: true,
      isNew: true,
    }
    newValue = Object.assign({},newValue, defaultValue)

    if (member === 'member') {
      newData.push(newValue);
      this.index += 1;
      this.setState({ data: newData });
    } else {
      this.handleModalVisible(true);
    }
  };

  remove(key) {
    const { data } = this.state;
    const { onChange } = this.props;
    const newData = data.filter(item => item.key !== key);
    this.setState({ data: newData });
    onChange(newData);
  }

  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  handleFieldChange(e, val, key, mode) {
    const fieldName = val.dataIndex
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      if (mode === 'select') { // 当为select下拉选时e就是选中的值
        target[fieldName] = e;
      } else {
        // 输入框前置校验
        let _value = e.target.value; //输入框的值
        if (val.validateType && val.validateType.indexOf('number') != -1) {
          let indexArr = val.validateType.split('_')
          _value = changeNumber(_value, Number(indexArr[1]))
        }
        target[fieldName] = _value;
      }
      this.setState({ data: newData });
    }
  }

  handSelectInputChange(e, val, record) {
    const fieldName = val.dataIndex
    const key = record.key
    const selectArr = val.selectArr
    let childKeyValue = '' // 关联字段的值
    let handPeriodTypeValue = ''
    let qcName = ''
    let nodeTypeValue = ''
    selectArr.forEach(_val =>{
      let _value = _val.code ? _val.code : _val.id
      if(_value == e) {
        if (_val.handPeriodType) {
          handPeriodTypeValue = _val.handPeriodType
        }
        if (_val.nodeType) {
          nodeTypeValue = _val.nodeType
        }
        childKeyValue = _val[val.childKey]
        qcName = _val.name
        this.setState({
          qcName,
        })
      }
    })
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[val.childKey] = childKeyValue
      target['qcName'] = qcName
      target['handPeriodType'] = handPeriodTypeValue
      target['nodeType'] = nodeTypeValue
      // 当所选工序为QC工序时，展示该字段，否则不展示
        if (fieldName == 'name') {
          target['code'] = e
        }
       // if (fieldName == 'name' && qcName.indexOf('QC') === -1) {
       if (fieldName == 'name') {
         target['qcExamContent'] = []
       }
      target[fieldName] = e;
      console.log(newData, target, 'target')
      this.setState({ data: newData });
    }
  }

  saveRow(e, key) {
    e.persist();
    this.setState({
      loading: true,
    });
    const {mColumns} = this.props
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      let flag = true
      mColumns.forEach(val => {
        if (!target[val.dataIndex] && val.require) {
          flag = false
        }
        if(val.dataIndex === 'qcExamContent' && target['qcName'] && target['qcName'].toString().indexOf('QC') !== -1){
          if (target[val.dataIndex].length === 0) {
            flag = false
          }
        }
      })
      if (!flag) {
        message.error('请填写完整信息。');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      delete target.isNew;
      this.toggleEditable(e, key);
      const { data } = this.state;
      const { onChange } = this.props;
      onChange(data);
      this.setState({
        loading: false,
      });
    }, 500);
  }

  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      delete this.cacheOriginData[key];
    }
    target.editable = false;
    this.setState({ data: newData });
    this.clickedCancel = false;
  }

  // 上移
  moveUpFn(key){
    const { data } = this.state;
    const { onChange } = this.props;
    data.forEach((val, index) => {
      if (val.key === key && index !== 0) {
        let value = val
        data[index] = data[index - 1]
        data[index - 1] = value
      }
    })
    const newData = data;
    this.setState({ data: newData });
    onChange(newData);
  }

  // 下移
  moveDownFn(key){
    const { data } = this.state;
    const { onChange } = this.props;
    const dataLen = data.length - 1
    data.forEach((val, index) => {
      if (val.key === key && index !== dataLen) {
        let value = val
        data[index] = data[index + 1]
        data[index + 1] = value
      }
    })
    const newData = data;
    this.setState({ data: newData });
    onChange(newData);
  }

  render() {
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      onSelectChange: this.onSelectChange,
      selectedRowKeys: this.state.selectedRowKeys,
    };

    const { loading, data, modalVisible, qcName } = this.state;
    const { mColumns, addFont, morestn } = this.props;
    const len = mColumns.length + 1
    const newcColumns = mColumns.map(val => {
      let value = {}
      if (val.type === 'input') {
        const inputObj = {
          key: val.dataIndex,
          // width: `${100 / (len + 2)}%`,
          render: (text, record) => {
            if ((record.editable && val.dataIndex != 'unit')) {
              return (
                <Input
                  value={text}
                  autoFocus
                  disabled={val.disabled}
                  onChange={e => this.handleFieldChange(e, val, record.key)}
                  onKeyPress={e => this.handleKeyPress(e, record.key)}
                  placeholder={val.title}
                />
              );
            }
            return text;
          },
        }
        value = Object.assign({}, inputObj, val)
      } else if (val.type === 'select' ) {
        const selectObj = {
          key: val.dataIndex,
          // width: `${100 / (len + 2)}%`,
          render: (text, record) => {
            if (record.editable) {
               if(val.dataIndex === 'qcExamContent' && qcName.toString().indexOf('QC') === -1) {
                  return (<span>{text}</span>);
               } else {
                 return (
                   <Select placeholder={val.title} disabled={val.disabled} allowClear={true}
                   autoFocus
                   value={text}
                   onChange={e => this.handleFieldChange(e, val, record.key, 'select')}
                   mode={val.mode ? val.mode : ''}>
                     {val.selectArr.length > 0
                       ? val.selectArr.map(sval => {
                           return (<Option key={sval.key} value={sval.key}>{sval.value}</Option>);
                         })
                       : []}
                   </Select>
                 );
               }
            }
            return val.mode && val.mode === 'multiple' && text && text.length > 0 ? text.map(valMult => `${selectArrayToDict(val.selectArr)[valMult]} `) : selectArrayToDict(val.selectArr)[text] ;
          },
        }
        value = Object.assign({}, selectObj, val)
      } else if (val.type === 'select-input' ) {
        const selectObj = {
          key: val.dataIndex,
          // width: `${100 / (len + 2)}%`,
          render: (text, record) => {
            if (record.editable) {
              return (
                <Select placeholder={val.title} disabled={val.disabled} allowClear={true}
                autoFocus
                value={text}
                onChange={e => this.handSelectInputChange(e, val, record)}
                mode={val.mode ? val.mode : ''}>
                  {val.selectArr.length > 0
                    ? val.selectArr.map(sval => {
                        return (<Option key={sval.key} value={sval.key}>{sval.value}</Option>);
                      })
                    : []}
                </Select>
              );
            }
            return val.mode && val.mode === 'multiple' ? text.map(valMult => selectArrayToDict(val.selectArr)[valMult]) : selectArrayToDict(val.selectArr)[text] ;
          },
        }
        value = Object.assign({}, selectObj, val)
      }
      return value
    })
    const editAndDelete = (key, currentItem) => {
      if (key === 'edit') {
        let ev = window.event
        this.toggleEditable(ev, currentItem.key)
      }
      if (key === 'delete') {
        // this.remove(currentItem.key)
      }
      // 上移
      if (key === 'moveUp') {
        this.moveUpFn(currentItem.key)
      }
      // 下移
      if (key === 'moveDown') {
        this.moveDownFn(currentItem.key)
      }
    };
    const MoreBtn = props => {
      const _props = props.props;
      return (
        <Dropdown
          overlay={
            <Menu onClick={({ key }) => editAndDelete(key, _props)}>
              <Menu.Item key="edit">编辑</Menu.Item>
              <Menu.Item  key="delete">
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(_props.key)}>
                <a>删除</a>
              </Popconfirm>
              </Menu.Item>
              <Menu.Item key="moveUp">
                上移
              </Menu.Item>
              <Menu.Item key="moveDown">
                下移
              </Menu.Item>
            </Menu>
          }
        >
          <a>
            更多 <Icon type="down" />
          </a>
        </Dropdown>
      );
    };
    const actionColumns = [
      {
        title: '操作',
        key: 'action',
        width: '100px',
        render: (text, record) => {
          const { loading } = this.state;
          if (!!record.editable && loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, record.key)}>添加</a>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                    <a>删除</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.key)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.key)}>取消</a>
              </span>
            );
          }
          if (morestn && morestn === 'true') {
            return (
              <Fragment>
                <MoreBtn props={record} />
              </Fragment>
            )
          } else {
            return (
              <span>
                <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
                <Divider type="vertical" />
                <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                  <a>删除</a>
                </Popconfirm>
              </span>
            );
          }
        },
      },
    ];
    const indexColumns = [{
      title: '序号',
      index: 'index',
      // fixed: 'left',
      render:(text,record,index)=>`${index+1}`,
    }]
    const columns = [...indexColumns, ...newcColumns, ...actionColumns]

    return (
      <Fragment>
        <Table
          className="tableFormSelf"
          loading={loading}
          columns={columns}
          bordered
          dataSource={data}
          pagination={false}
          rowClassName={record => (record.editable ? styles.editable : '')}
        />
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newSingleValue}
          icon="plus"
        >
          {addFont}
        </Button>
        <CreateForm
          {...parentMethods}
          mData={data.list}
          modalVisible={modalVisible}
          mColumns={mColumns}
        />
      </Fragment>
    );
  }
}

export default TableRouteForm;
