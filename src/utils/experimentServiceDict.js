import { dictToSelectArray } from './utils.js';
// 状态
export const stationStateDict = {
  ENABLED: '已启用',
  DISABLED: '已禁用',
};

// 状态
export const stationStateDataArr = dictToSelectArray(stationStateDict);
// 样本来源
export const sampleSourceDict = {
  LOCAL: '本地',
  NONLOCAL: '非本地',
};
// 样本来源
export const sampleSourceDataArr = dictToSelectArray(sampleSourceDict);

// 交付日类型
export const handPeriodTypeDict = {
  WORKING_DAY: '工作日',
  NATURAL_DAY: '自然日',
};
// 交付日类型
export const handPeriodTypeArr = dictToSelectArray(handPeriodTypeDict);
// 所属环节
export const nodeTypeDict = {
  Isolation: '制备',
  Outsource: '外包',
  Library: '建库',
  Sequence: '上机',
  MassSpectra: '质谱',
  SequencePooling: '上机Pooling',
  HybPooling: '杂交Pooling',
  QC: 'QC',
  LibPrePooling: '建库Pooling',
  PCR: '建库PCR',
  NGS: '上机测序',
  None: '无',
  NoSeqOutSource: '非测序外包',
};
// 所属环节
export const nodeTypeArr = dictToSelectArray(nodeTypeDict);
// 检测包状态
export const packetStateDict = {
  DRAFT: '草稿',
  PENDING: '待审批',
  PUBLISHED: '已发布',
  DEACTIVED: '已停用',
};
// 检测包状态
export const packetStateArr = dictToSelectArray(packetStateDict);

// 检测项状态
export const experimentStateDict = {
  DRAFT: '草稿',
  PENDING: '待审批',
  PUBLISHED: '已发布',
  DEACTIVED: '已停用',
};
// 检测项状态
export const experimentStateArr = dictToSelectArray(experimentStateDict);

// 采样方式
export const sampleModeDict = {
  LIVE: '现场采样',
  BY_SELF: '自采样',
  LIVE_AND_BYSELF: '现场采样及自采样',
};
// 采样方式
export const sampleModeArr = dictToSelectArray(sampleModeDict);
// 启动管型
export const startCollectorTypeDict = {
  OriginCollector: '原始管',
  DerivedCollector: '分装管',
};
// 启动管型
export const startCollectorTypeArr = dictToSelectArray(startCollectorTypeDict);

// 启动模式
export const startupTypeDict = {
  MANUAL: '手动',
  AUTO: '自动',
};
// 启动模式
export const startupTypeArr = dictToSelectArray(startupTypeDict);

// 质控流程
export const qcTypeDict = {
  FDTC: 'FD验证',
  // NONE: '无',
};
export const qcTypeArr = dictToSelectArray(qcTypeDict);

//技术平台
export const seqInstrumentDict = {
  Fluidigm: 'Fluidigm',
  HiSeqX10: 'HiSeqX10',
  HiSeq2500: 'HiSeq2500',
  MiSeq: 'MiSeq',
  HiSeq4000: 'HiSeq4000',
  Nova: 'Nova',
  MGISeq2000: 'MGISeq2000',
};
export const seqInstrumentArr = dictToSelectArray(seqInstrumentDict);

// 下机数据类型
export const outDataTypeDict = {
  Fluidigm: 'Fluidigm',
  _16S: '16S',
  _1K: '1K芯片',
  WES: 'WES',
  WGS: '全基因组',
  META: 'META',
  WGBS: '全基因组甲基化',
  TargetedBisulfite: '目标区域捕获甲基化',
  DGE: '数字基因表达谱:mRNA',
  mRNA: 'mRNA',
  lncRNA: 'lnc RNA',
  MicroRNA: 'Micro RNA',
  Immune: '免疫组库',
  Transcriptome: '转录组',
  SmallRNA: 'SmallRNA',
  UrineMetabolism: '尿液代谢',
  SerumMetabonomics: '代谢组-全谱:血清',
  SerumHealthTell: 'HealthTell:血清',
  SerumSomaScan: 'SomaScan:血清',
  Lipidome: '脂质组',
  Proteomics: '蛋白组',
  MetaBolome: '代谢组',
  MassSpectra: '质谱',
  PCR: 'PCR',
  QPCR: '端粒定量',
  WTBS: 'WTBS',
  BloodRoutineExamination: '血常规',
  Metabonomics: '代谢组',
  Metabonomics_37A: '代谢组-37种氨基酸',
  Metabonomics_12V: '代谢组-12种维生素',
  Metabonomics_15H: '代谢组-15种荷尔蒙',
  Microelement: '微量元素',
  HeavyMetal: '重金属',
  AminoAcid: '氨基酸',
  Hormone: '激素',
  Estrogen: '雌激素代谢健康评估:尿液',
  Wegene: '微基因',
  Vitamine: '维生素',
  MicroElement_HeavyMetals: '微量元素+重金属',
  cfDNA: 'cfDNA完整性',
  Mexam: '临检',
};
export const outDataTypeArr = dictToSelectArray(outDataTypeDict);

// 是否应用数组
export const whetherDict = {
  true: '是',
  false: '否',
};
export const whetherArr = dictToSelectArray(whetherDict);

// 检测项类别
export const experimentTypeDict = {
  GENE_OMICS: '基因组学',
};
export const experimentTypeArr = dictToSelectArray(experimentTypeDict);
// 11.qc 检测内容
export const experimentContentDict = {
  Qbit: 'Qubit',
  Nanodrop: 'Nanodrop',
  Qpcr: 'QPCR',
  _2100: '2100',
  MicroplateReader: '酶标仪',
  GelElectrophore: '凝胶电泳',
  Concentration: '质量浓度',
};
export const experimentContentArr = dictToSelectArray(experimentContentDict);
