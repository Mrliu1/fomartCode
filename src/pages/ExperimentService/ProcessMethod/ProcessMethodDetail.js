import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Badge, Table, Divider, Button } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './children.less';

import router from 'umi/router';

import { fieldLabelsDetailForm, tableAddColumns } from './tableColumnsData';
import {getDetailDescDom} from '@/utils/utils'
const { Description } = DescriptionList;

@connect(({ method, experimentDict, loading }) => ({
  method,
  experimentDict,
  loading: loading.effects['method/getProcessMethodDetailFn'],
}))
class ProcessMethodDetail extends Component {
  componentDidMount() {
    const { dispatch, match } = this.props;
    const { params } = match;
    const param = {
      id: params.id,
    }
    dispatch({
      type: 'experimentDict/getSampleTypesFn',
    });
    dispatch({
      type: 'method/getProcessMethodDetailFn',
      payload: param,
    });
  }
  
  // 返回首页
  goBackItem = () => {
    router.push(`/manufacture/ExperimentService/ProcessMethod/ProcessMethodHome`);
  };

  render() {
    const { method:{res}, loading,
    experimentDict: {initDictObj}, } = this.props;
    let {data} = res
    if (data && data['mTargetSampleTypes']) {
      data['mTargetSampleTypes'] = data['mTargetSampleTypes'].map(sval => {if(sval && sval.sampleTypeId) {
        return sval.sampleTypeId
      } else {
        return sval
      }})
    }
    let fSampleTypes = initDictObj.sampleTypes ? initDictObj.sampleTypes.dataArr : []
    const fieldLabelsDetailFormNew =  fieldLabelsDetailForm.map(val => {
      if(val.key === 'mTargetSampleTypes') {
        val['selectArr'] = initDictObj.sampleTypes ?initDictObj.sampleTypes.dataArr : []
      }
      if(val.key === 'fTargetSampleTypeId') {
          val['selectArr'] = fSampleTypes
        }
      return val
    })
    return (
      data?<PageHeaderWrapper title="工艺方法详情" loading={loading}>
        <Card bordered={false}>
          <DescriptionList size="large" title="工艺方法信息" style={{ marginBottom: 32 }}>
            {getDetailDescDom(fieldLabelsDetailFormNew, data)}
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title}>试剂耗材：</div>
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            loading={loading}
            size="small" 
            bordered
            dataSource={data.reagents && data.reagents.length > 0 ? data.reagents : []}
            columns={tableAddColumns}
            rowKey="id"
          />
          <Button onClick={this.goBackItem.bind(this)} type="primary">
            返回
          </Button>
        </Card>
      </PageHeaderWrapper>:[]
    );
  }
}
export default ProcessMethodDetail;
