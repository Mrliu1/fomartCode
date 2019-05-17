import React, { Component } from "react";
import { connect } from "dva";
import { Card, Form, Table, Divider, Button, Modal } from "antd";
import DescriptionList from "@/components/DescriptionList";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import { selectArrayToDict, getDetailDescDom } from "@/utils/utils";
import { sampleModeDict } from "@/utils/experimentServiceDict";
import router from "umi/router";
import styles from "./children.less";

import {
  fieldLabelsForm,
  tableAddOmicsColumns,
  tableAddFuncColumns,
  tableAddBioColumns,
  tableAddBoxColumns,
  modelDetailOmics,
  modelDetailFuncs,
  modelDetailBios,
  modelDetailBoxes
} from "./tableColumnsData";

// const { Description } = DescriptionList;
// 创建模态框组件
const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    loading,
    handleModalVisible,
    modelDetalGlobal,
    modelDetalGlobal: { modelDetail }
  } = props;
  return (
    <Modal
      destroyOnClose
      width={"70vw"}
      title={modelDetalGlobal.title}
      visible={modalVisible}
      footer={[
        <Button key="submit" type="primary" loading={loading} onClick={() => handleModalVisible()}>
          关闭
        </Button>
      ]}
    >
      <Card bordered={false}>
        <DescriptionList size="large" title={modelDetalGlobal.title} style={{ marginBottom: 32 }}>
          {getDetailDescDom(modelDetail && modelDetail.Arr ? modelDetail.Arr : [], modelDetalGlobal)}
        </DescriptionList>
        <Divider style={{ marginBottom: 32 }} />
        <div className={styles.title}>{modelDetalGlobal.tableTitle ? modelDetalGlobal.tableTitle : []}</div>
        <Table
          style={{ marginBottom: 24 }}
          pagination={false}
          loading={loading}
          bordered
          dataSource={
            modelDetalGlobal.tableData && modelDetalGlobal.tableData.length > 0 ? modelDetalGlobal.tableData : []
          }
          columns={modelDetail && modelDetail.table ? modelDetail.table : []}
          rowKey="ids"
        />
        {modelDetail && modelDetail.tableOne ? (
          <div>
            <div className={styles.title}>{modelDetalGlobal.tableTitleOne}</div>
            <Table
              style={{ marginBottom: 24 }}
              pagination={false}
              bordered
              loading={loading}
              dataSource={
                modelDetalGlobal.tableDataOne && modelDetalGlobal.tableDataOne.length > 0
                  ? modelDetalGlobal.tableDataOne
                  : []
              }
              columns={modelDetail.tableOne}
              rowKey="id"
            />
          </div>
        ) : (
          []
        )}
      </Card>
    </Modal>
  );
});

@connect(({ packet, experimentDict, loading }) => ({
  packet,
  ...experimentDict,
  loading: loading.effects["packet/getPacketDetailFn"]
}))
class ProcessMethodDetail extends Component {
  state = {
    modalVisible: false,
    modelDetalGlobal: {}
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    const { params } = match;
    const param = {
      id: params.id
    };
    dispatch({
      type: "experimentDict/getSampleTypesFn"
    });
    dispatch({
      type: "packet/getPacketDetailFn",
      payload: param
    });
  }

  // 查看详情
  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag
    });
  };

  // 子方案详情
  goModelDetal = (data, key, parsentKey = "") => {
    let modelDetalGlobal = {};
    const detailKeyArr = ["experimentName", "packName", "boxTypeName"];
    if (key === "experimentName") {
      modelDetalGlobal = {
        title: "组学检测项详情",
        modelDetail: modelDetailOmics,
        ...data,
        tableTitle: "检测流程",
        tableData: data.routeNodes
      };
    } else if (key === "packName") {
      if (parsentKey) {
        modelDetalGlobal = {
          title: "生化检测项详情",
          ...data,
          modelDetail: modelDetailBios,
          tableTitle: "检测项目列表",
          tableData: data.routeNodes
        };
      } else {
        modelDetalGlobal = {
          title: "功能医学检测项详情",
          ...data,
          modelDetail: modelDetailFuncs,
          tableTitle: "检测项目列表",
          tableData: data.routeNodes
        };
      }
    } else {
      modelDetalGlobal = {
        title: "采样盒类型详情",
        ...data,
        modelDetail: modelDetailBoxes,
        tableTitle: "配套采样器类型信息",
        tableData: data.attachmentType ? Array.from(JSON.parse(data.attachmentType)) : [],
        tableTitleOne: "采样配件信息",
        tableDataOne: data.capacityType ? JSON.parse(data.capacityType) : []
      };
    }
    this.setState({
      modelDetalGlobal
    });
    this.handleModalVisible(true);
  };

  // 跳转到详情
  goBackExperimentPacket = () => {
    router.push(`/manufacture/ExperimentService/ExperimentPacket/ExperimentPacketHome`);
  };

  formatColumns = (data, parsentKey = "") => {
    const { initDictObj } = this.props;

    const detailKeyArr = ["experimentName", "packName", "boxTypeName"];
    const sampleTypes = initDictObj && initDictObj.sampleTypes ? initDictObj.sampleTypes : {};
    const detailKeyArrTo = ["sampleTypeId", "middleSampleTypeId", "triggerSampleType"];
    return data.map(val => {
      if (detailKeyArr.includes(val.dataIndex)) {
        // 处理详情弹出框
        val["render"] = (text, record) => (
          <a onClick={() => this.goModelDetal(record, val.dataIndex, parsentKey)}>{text}</a>
        );
      }
      if (val.type === "select" || detailKeyArrTo.includes(val.dataIndex)) {
        val["render"] = text => <span>{selectArrayToDict(val.selectArr)[text]}</span>;
      }
      if (val.dataIndex === "routeStartSampleTypes") {
        val["render"] = text => (
          <span>
            {text.map(_val => (initDictObj.sampleTypes ? initDictObj.sampleTypes.dict[_val.sampleTypeId] : ""))}
          </span>
        );
      }
      if (val.dataIndex === "sampleTypes") {
        val["render"] = text => {
          // const textArr = text ? text.split(',') : []
          console.log(sampleTypes);
          const textArr = text.split(",");
          return (
            <span>{sampleTypes && textArr.length > 0 ? textArr.map(_val => `${sampleTypes.dict[_val]},`) : ""}</span>
          );
        };
      }
      return val;
    });
  };

  render() {
    const {
      packet: { res },
      loading
    } = this.props;
    const { data } = res;

    const { modelDetalGlobal, modalVisible } = this.state;
    const parentMethods = {
      modelDetalGlobal,
      handleModalVisible: this.handleModalVisible
    };
    return data ? (
      <PageHeaderWrapper title="检测包详情" loading={loading}>
        <Card bordered={false}>
          <DescriptionList size="large" title="检测包信息" style={{ marginBottom: 32 }}>
            {getDetailDescDom(fieldLabelsForm, data)}
          </DescriptionList>
          <Divider style={{ marginBottom: 32 }} />
          <div className={styles.title}>组学方案</div>
          <Table
            style={{ marginBottom: 24 }}
            pagination={false}
            size="small"
            loading={loading}
            bordered
            dataSource={data.omics && data.omics.length > 0 ? data.omics : []}
            columns={this.formatColumns(tableAddOmicsColumns)}
            rowKey="id"
          />
          <div className={styles.title}>功能医学方案</div>
          <Table
            style={{ marginBottom: 16 }}
            pagination={false}
            loading={loading}
            size="small"
            bordered
            dataSource={data.funcs && data.funcs.length > 0 ? data.funcs : []}
            columns={this.formatColumns(tableAddFuncColumns)}
          />
          <div className={styles.title}>生化方案</div>
          <Table
            style={{ marginBottom: 16 }}
            pagination={false}
            loading={loading}
            size="small"
            bordered
            dataSource={data.bios && data.bios.length > 0 ? data.bios : []}
            columns={this.formatColumns(tableAddBioColumns)}
          />
          <div className={styles.title}>采样方案：{sampleModeDict[data.sampleMode]}</div>
          <Table
            style={{ marginBottom: 16 }}
            pagination={false}
            loading={loading}
            size="small"
            bordered
            dataSource={data.boxes && data.boxes.length > 0 ? data.boxes : []}
            columns={this.formatColumns(tableAddBoxColumns)}
          />
          <Button onClick={this.goBackExperimentPacket.bind(this)} type="primary">
            返回
          </Button>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    ) : (
      []
    );
  }
}
export default ProcessMethodDetail;
