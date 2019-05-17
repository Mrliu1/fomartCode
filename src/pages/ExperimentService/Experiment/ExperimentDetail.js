import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Table, Divider, Button } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './children.less';

import router from 'umi/router';

import { fieldLabelsFormDetail, tableAddSampleColumns, tableAddFlowColumns } from './tableColumnsData';
import {getDetailDescDom, selectArrayToDict} from '@/utils/utils'

@connect(({ experiment, loading }) => ({
  experiment,
  loading: loading.effects['experiment/getExperimentDetailFn'],
}))
class ExperimentDetail extends Component {
  componentDidMount() {
    const { dispatch, match } = this.props;
    const { params } = match;
    const param = {
      id: params.id,
    }
    dispatch({
      type: 'experiment/getExperimentDetailFn',
      payload: param,
    });
    dispatch({
      type: 'experiment/getSampleTypesFn',
    });
  }

  // 返回首页
  goBackExperiment = () => {
    router.push(`/manufacture/ExperimentService/Experiment/ExperimentHome`);
  };

  formatColumns = (data) => {
    const {initDictObj} = this.props
    const detailKeyArr = ['sampleTypeId', 'middleSampleTypeId', 'triggerSampleType']
    return data.map(val => {
      if(val.type === 'select' || detailKeyArr.includes(val.dataIndex)) {
        val['render'] = (text) => <span>{selectArrayToDict(val.selectArr)[text]}</span>
      }
      if(val.dataIndex === 'routeStartSampleTypes') {
        val['render'] = (text) => <span>{text.map(_val =>  initDictObj.sampleTypes ?initDictObj.sampleTypes.dict[_val.sampleTypeId] : '')}</span>
      }
      if(val.dataIndex === 'sampleTypes') {
        val['render'] = (text, record) => (<span>{text ? text.split(',').map(_val => {initDictObj.sampleTypes ? initDictObj.sampleTypes.dict[_val] : ''}): ''}</span>)
      }
      return val
    })
  }

  render() {
    const { experiment:{res}, loading } = this.props;
    const {data} = res
    return ( data?
      <PageHeaderWrapper title="检测项详情" loading={loading}>
        <Card bordered={false}>
          <DescriptionList size="large" title="检测项信息" style={{ marginBottom: 32 }}>
            {getDetailDescDom(fieldLabelsFormDetail, data)}
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title}>启动样本</div>
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            size="small" 
            bordered
            loading={loading}
            dataSource={data.routeStartSampleTypes.length > 0 ? data.routeStartSampleTypes : []}
            columns={this.formatColumns(tableAddSampleColumns)}
            rowKey="id"
          />
          <div className={styles.title}>检测流程</div>
          <Table
            style={{ marginBottom: 16 }}
            pagination={false}
            size="small" 
            bordered
            loading={loading}
            dataSource={data.routeNodes.length > 0 ? data.routeNodes : []}
            columns={this.formatColumns(tableAddFlowColumns)}
          />
          <Button onClick={() => {this.goBackExperiment()}} type="primary">
            返回
          </Button>
        </Card>
      </PageHeaderWrapper>:[]
    );
  }
}
export default ExperimentDetail;
