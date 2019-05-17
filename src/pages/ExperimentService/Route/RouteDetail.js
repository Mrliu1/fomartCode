import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Badge, Table, Divider, Button } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './children.less';

import router from 'umi/router';
import {
  tableAddSampleColumns,
  tableAddFlowColumns,
  fieldLabelsForm,
} from './tableColumnsData';

import {getDetailDescDom, selectArrayToDict} from '@/utils/utils'

const { Description } = DescriptionList;

@connect(({ route, loading, experimentDict }) => ({
  route,
  ...experimentDict,
  loading: loading.effects['route/getRouterDetailFn'],
}))
class RouteDetail extends Component {
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
      type: 'route/getRouterDetailFn',
      payload: param,
    });
  }

  // 返回首页
  goBackItem = () => {
    router.push({
      pathname: `/manufacture/ExperimentService/Route/RouteHome`,
    });
  };

  formatColumns = (data) => {
    const {initDictObj} = this.props
    const detailKeyArr = ['sampleTypeId', 'middleSampleTypeId', 'triggerSampleType']
    return data.map(val => {
      if (val.mode && val.mode === 'multiple') {
        val['render'] = (text) => text && text.length > 0 ? <span>{text.map(cval =>`${selectArrayToDict(val.selectArr)[cval]} `)}</span> : ''
      } else if (val.type === 'select' || detailKeyArr.includes(val.dataIndex)) {
          if(detailKeyArr.includes(val.dataIndex)) {
            val['selectArr'] = initDictObj.sampleTypes ?initDictObj.sampleTypes.dataArr : [];
          }
          val['render'] = (text) => <span>{selectArrayToDict(val.selectArr)[text]}</span>;
       }
      
      return val
    })
  };

  render() {
    const { route:{res}, loading } = this.props;
    const {data} = res
    return (
      data?<PageHeaderWrapper title="技术路线详情" loading={loading}>
        <Card bordered={false}>
          <DescriptionList size="large" title="技术路线信息" style={{ marginBottom: 32 }}>
            {getDetailDescDom(fieldLabelsForm, data)}
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title}>启动样本</div>
          <Table
            bordered
            size="small" 
            style={{ marginBottom: 24 }}
            pagination={false}
            loading={loading}
            dataSource={data.startSampleTypes.length > 0 ? data.startSampleTypes : []}
            columns={this.formatColumns(tableAddSampleColumns)}
            rowKey="id"
          />
          <div className={styles.title}>检测流程</div>
          <Table
            bordered
            size="small" 
            style={{ marginBottom: 16 }}
            pagination={false}
            loading={loading}
            dataSource={data.nodes.length > 0 ? data.nodes : []}
            columns={this.formatColumns(tableAddFlowColumns)}
          />
          <Button onClick={this.goBackItem.bind(this)} type="primary">
            返回
          </Button>
        </Card>
      </PageHeaderWrapper>:[]
    );
  }
}
export default RouteDetail;
