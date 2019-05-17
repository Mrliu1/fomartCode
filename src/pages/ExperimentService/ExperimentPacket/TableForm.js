/* eslint-disable react/sort-comp */
import React, { PureComponent, Fragment } from 'react';
import { Table, Button, Input, message, Popconfirm, Divider, Form, Modal, Select, Row, Col } from 'antd';
import isEqual from 'lodash/isEqual';
import styles from './children.less';
import {selectArrayToDict, changeNumber} from '@/utils/utils';

const FormItem = Form.Item;
const {Option} = Select;
// 创建模态框组件
const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    start,
    childModelHandleSearch,
    childModelHandleFormReset,
    selectedRowKeys,
    mData,
    addFont,
    onSelectChange,
    mColumns,
    queryCondition,
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
  const conditionArr = queryCondition ? queryCondition.conditionArr : []
  return (
    <Modal
      destroyOnClose
      width="70vw"
      title={`创建${addFont}`}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Form onSubmit={(e) => childModelHandleSearch(e)} layout="inline">
        <Row className="queryRow">
          <Col md={18} sm={24} className="queryCol">
            {conditionArr.map(val => {
            return (
              <FormItem label={val.label}>
                {form.getFieldDecorator(val.key, {
                })(<Input placeholder={`请输入${val.label}`} />)}
              </FormItem>
            )
          })}
          </Col>
          <Col md={6} sm={24}>
            <div style={{ marginBottom: 16 }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={(e) => childModelHandleFormReset(e)}>
                重置
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
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

@Form.create()
class TableExperimentPacketForm extends PureComponent {
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
      selectedRows: [],
      isOpenFalg: true,
      childMDataNew: [],
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
    const {selectedRows, data} = this.state
    if (selectedRows.length > 0) {
      // const newArr = Array.from(new Set([...data, ...selectedRows]))
      this.setState({
        data: selectedRows,
      })
    }
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

  childModelHandleSearch = e => {
    e.preventDefault();
    const { form, queryCondition:{type, fn} } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
      };
      fn(type, values)
      this.setState({
        isOpenFalg: false,
      })
    });
  };

  childModelHandleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    const newArr = selectedRows.map(val => {
      const defaultValue = {
        key: `NEW_TEMP_ID_${Math.random()}`,
        editable: true,
        isNew: true,
      }
      const value = Object.assign({},val, defaultValue)
      return value
    })
    this.setState({
      selectedRows: newArr,
      selectedRowKeys,
    })
  };

  getRowByKey(key, newData) {
    const { data } = this.state;
    return (newData || data).filter(item => item.key === key)[0];
  }

  toggleEditable = (e, key) => {
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
    const newData = data ? data.map(item => ({ ...item })) : [];
    let newValue = new Object()
    mColumns.forEach(val => {
      if (val.dataIndex === 'unit') {
        newValue[val.dataIndex] = 'ul'
      }
      newValue[val.dataIndex]
    })
    const defaultValue = {
      key: `NEW_TEMP_ID_${Math.random()}`,
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
      this.setState({
        childMDataNew: [],
        isOpenFalg: true,
      })
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
        let _value = e.target.value; // 输入框的值
        if (val.validateType && val.validateType.indexOf('number') != -1) {
          const indexArr = val.validateType.split('_')
          _value = changeNumber(_value, Number(indexArr[1]))
        }
        target[fieldName] = _value;
      }
      this.setState({ data: newData });
    }
  }

  handSelectInputChange(e, val, record) {
    const fieldName = val.dataIndex
    const {key} = record
    const {selectArr} = val
    let childKeyValue = '' // 关联字段的值
    selectArr.forEach(_val =>{
      const _value = _val.code ? _val.code : _val.id
      if(_value == e) {
        childKeyValue = _val[val.childKey]
      }
    })
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[val.childKey] = childKeyValue
      // if (mode === 'select') { // 当为select下拉选时e就是选中的值
      //   target[fieldName] = e;
      // } else {
      //   target[fieldName] = e.target.value;
      // }
      target[fieldName] = e;
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

  render() {
    const { loading, data, modalVisible, childMDataNew, isOpenFalg } = this.state;
    const { mColumns, addFont, childMColumns, queryCondition, childMData } = this.props;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      onSelectChange: this.onSelectChange,
      selectedRowKeys: this.state.selectedRowKeys,
      childModelHandleSearch: this.childModelHandleSearch,
      childModelHandleFormReset: this.childModelHandleFormReset,
    };
    // 传递给子模态框的值
    const childMDataTrans = isOpenFalg ? childMDataNew : childMData
    const len = mColumns.length + 1
    const newcColumns = mColumns.map(val => {
      let value = {}
      if (val.type === 'input') {
        const inputObj = {
          key: val.dataIndex,
          // width: `${100 / (len + 2)}%`,
          render: (text, record) => {
            if (record.editable && val.dataIndex != 'unit') {
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
              return (
                <Select
                  placeholder={val.title}
                  disabled={val.disabled}
                  allowClear
                  autoFocus
                  value={text}
                  onChange={e => this.handleFieldChange(e, val, record.key, 'select')}
                  mode={val.mode ? val.mode : ''}
                >
                  {val.selectArr.length > 0
                    ? val.selectArr.map(sval => {
                        return (<Option key={sval.key} value={sval.key}>{sval.value}</Option>);
                      })
                    : []}
                </Select>
              );
            }
            return val.mode && val.mode === 'multiple' && text && text.length > 0 ? text.map(valMult => `${selectArrayToDict(val.selectArr)[valMult]} `) : selectArrayToDict(val.selectArr)[text] ;
          },
        }
        value = Object.assign({}, selectObj, val)
      } else if (val.type === 'select-filter' ) {
        const selectObj = {
          key: val.dataIndex,
          // width: `${100 / (len + 2)}%`,
          render: (text, record) => {
            if (record.editable) {
              return (
                <Select
                  placeholder={val.title}
                  disabled={val.disabled}
                  allowClear
                  autoFocus
                  value={text}
                  onChange={e => this.handSelectInputChange(e, val, record)}
                  mode={val.mode ? val.mode : ''}
                >
                  {
                    val.selectArr.length > 0
                    ? val.selectArr.filter(_val => record[val.filterKey] ? record[val.filterKey].map(__val => __val.sampleTypeId).includes(_val.key) : true).map(sval => {
                        return (<Option key={sval.key} value={sval.key}>{sval.value}</Option>);
                      })
                    : []}
                </Select>
              );
            }
            return selectArrayToDict(val.selectArr)[text];
          },
        }
        value = Object.assign({}, selectObj, val)
      }else if (val.type === 'select-input' ) {
        const selectObj = {
          key: val.dataIndex,
          // width: `${100 / (len + 2)}%`,
          render: (text, record) => {
            if (record.editable) {
              return (
                <Select
                  placeholder={val.title}
                  disabled={val.disabled}
                  allowClear
                  autoFocus
                  value={text}
                  onChange={e => this.handSelectInputChange(e, val, record)}
                  mode={val.mode ? val.mode : ''}
                >
                  {val.selectArr.length > 0
                    ? val.selectArr.map(sval => {
                        return (<Option key={sval.key} value={sval.key}>{sval.value}</Option>);
                      })
                    : []}
                </Select>
              );
            }
            return selectArrayToDict(val.selectArr)[text];
          },
        }
        value = Object.assign({}, selectObj, val)
      } else {
        const inputObj = {
          key: val.dataIndex,
          // width: `${100 / (len + 2)}%`,
          render: (text, record) => {
            if (record.editable && val.dataIndex != 'unit') {
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
      }
      return value
    })
    // const MoreBtn = props => {
    //   const _props = props.props;
    //   return (
    //     <Dropdown
    //       overlay={
    //         <Menu onClick={({ key }) => editAndDelete(key, _props)}>
    //           <Menu.Item key="editTechnical">编辑</Menu.Item>
    //           <Menu.Item disabled={_props.state != 'DRAFT'} key="deleteTechnical">
    //             删除
    //           </Menu.Item>
    //           <Menu.Item disabled={_props.state != 'PUBLISHED'} key="disabledTechnical">
    //             禁用
    //           </Menu.Item>
    //           <Menu.Item disabled={_props.state != 'PUBLISHED'} key="useTechnical">
    //             启用
    //           </Menu.Item>
    //         </Menu>
    //       }
    //     >
    //       <a>
    //         更多 <Icon type="down" />
    //       </a>
    //     </Dropdown>
    //   );
    // };
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
          return (
            <span>
              <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          );
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
          mData={childMDataTrans}
          addFont={addFont}
          modalVisible={modalVisible}
          queryCondition={queryCondition}
          mColumns={childMColumns}
        />
      </Fragment>
    );
  }
}

export default TableExperimentPacketForm;
