<template>
  <div class="goods-info flex-column">
    <HeaderSearchInfo :header-info="headerInfo" class="header-info" @btnEvent="btnEvent" />
    <div class="line" />
    <div class="table-father" style="height: 100%">
      <LhTable
        :table-config="tableConfig"
        :height="tbHeight"
        class="table"
        @current-change="currentChange"
        @size-change="sizeChange"
      />
    </div>
    <LhDrawer
      ref="lhDrawer"
      v-model="configInfo.dialog"
      :config="configInfo"
      :btn-show="!configInfo.edit"
      size="60%"
      :reset="false"
      @submit="onClick"
      @close="
        configInfo.dialog = false;
        configInfo.loading = false;
      "
    />
  </div>
</template>

<script setup>
import { provide, reactive, ref, nextTick, onMounted } from 'vue';
import {
  ElMessage,
  ElButton,
  ElMessage as message,
  ElInput,
  ElImage
} from 'element-plus';
import { stockListAdd, stockListList } from '@/api/stock/list.js';
import { goodsList } from '@/api/info/goods.js';
import LhDrawer from '@/components/LhDrawer';
import moment from 'moment';
import CheckGoods from '../../Goods/List/components/CheckGoods';

const tbHeight = ref(250);
const lhDrawer = ref(null);

onMounted(() => {
  console.log(lhDrawer.value, 'ref-data');
});
// 表格信息
const tableInfo = reactive({
  tableData: [],
  loading: false
});
// 分页信息
const pageinationInfo = reactive({
  currentPage: 1,
  totalNum: 0,
  pageSize: 5,
  pageSizes: [5, 10, 20, 40, 80, 100]
});
provide('tableInfo', tableInfo);
provide('pageinationInfo', pageinationInfo);
// 头部信息
const headerInfo = reactive([
  {
    type: 'input',
    placeholder: '请输入单据编号',
    value: '',
    label: '单据编号',
    span: 6,
    input: {
      disabled: true
    }
  }
]);
// 表格配置信息
const tableConfig = reactive([
  {
    label: '序号',
    type: 'index',
    width: '80px'
  },
  {
    label: '业务日期',
    prop: 'createDate',
    width: '150'
  },
  {
    label: '单据编号',
    prop: '_id',
    width: '200'
  },
  {
    label: '盘点商品',
    prop: 'inventoryGoods',
    render: (h, { row }) => h('span', row.inventoryGoods?.map(item => item.goodsName)?.join('，'))
  },
  {
    label: '盘点状态',
    prop: 'status',
    width: '80',
    render: (h, { row }) => h('span', ['无盈亏', '有盈亏'][row.status])
  },
  {
    label: '盘盈金额',
    prop: 'inventoryProfit',
    width: '80'
  },
  {
    label: '盘亏金额',
    prop: ' inventoryLoss',
    width: 120,
    render: (h, { row }) => h('span', row.inventoryLoss.replace('-', ''))
  },
  {
    label: '图片',
    width: '120',
    render: (h, { row }) => row.img ? h(ElImage, {
      src: row.img,
      style: ` width: 100px;height: 100px`,
      fit: 'cover',
      'z-index': 22200,
      'preview-teleported': true,
      'preview-src-list': [row.img]
    }, {
      error: () => {
        return h('div', {
          style: ` width: 100px;height: 100px;color: red;`,
          class: 'flex-center'
        }, '加载失败');
      }
    }) : h('span', '暂无图片')
  },
  {
    label: '操作',
    width: 90,
    render: (h, { row }) => {
      return h('div', {}, [
        h(
          ElButton,
          {
            link: true,
            type: 'primary',
            onClick: () => {
              configInfo.edit = row._id;
              console.log(row, 'form');
              dataSet(row);
              configInfo.dialog = true;
            }
          },
          () => '详情'
        )
      ]);
    }
  }
]);
const dataSet = (row, disabled = true) => {
  configInfo.info.forEach((item) => {
    item.value = row[item.prop];
    if (item[item.type]) {
      item[item.type].disabled = disabled;
    }
    if (item.input) {
      item.input.disabled = disabled;
      item.input.value = row[item.prop];
    }
    if (item.upload) {
      item.upload.imageUrl = row.img;
      item.upload.disabled = disabled;
    }
  });
  const goodsList_i = configInfo.info.findIndex((v) => v.prop === 'goodsList');
  configInfo.info[goodsList_i].value = row.inventoryGoods?.map((v) => v._id);
  setTimeout(() => {
    checkGoodsList.list = row.inventoryGoods;
  }, 0);
};
// 商品数据
const checkGoodsList = reactive({ list: [] });

const endPriceR = ref(0);

const handleNumber = () => {
  // 账面
  const iABN = configInfo.info.findIndex(v => v.prop === 'allBillNumber');
  // 实时
  const iLAGN = configInfo.info.findIndex(v => v.prop === 'allLossesAndGainsNumber');
  const bNumber = checkGoodsList.list.reduce((pre, next) => pre + parseFloat(next.number || 0), 0);
  const LNumber = checkGoodsList.list.reduce((pre, next) => pre + parseFloat(next._number || next.number || 0), 0);
  configInfo.info[iABN].value = bNumber;
  configInfo.info[iABN].input.value = bNumber;
  configInfo.info[iLAGN].value = LNumber;
  configInfo.info[iLAGN].input.value = LNumber;
};
// 添加
const configInfo = reactive({
  dialog: false,
  edit: '',
  loading: false,
  info: [
    {
      label: '选择商品',
      prop: 'goodsList',
      value: [],
      type: 'select',
      rules: [{ required: true, message: '请选择商品' }],
      select: {
        placeholder: '请选择商品',
        multiple: true,
        filterable: true,
        'reserve-keyword': false,
        'default-first-option': true,
        options: [],
        onChange: (v) => {
          console.log(v, 'v');
          const arr = [];
          v.forEach(item => {
            const info = goodsInfo.data.find(val => val._id === item);
            arr.push(info);
          });
          checkGoodsList.list = arr;
          handleNumber();
        }
      }
    },
    {
      label: '',
      prop: 'table',
      value: '',
      rules: [{ required: false }],
      type: 'table',
      render: (h) => {
        return h(CheckGoods, {
          info: checkGoodsList.list,
          tableConfig: [
            {
              label: '序号',
              type: 'index',
              width: '80px'
            },
            {
              label: '商品名字',
              prop: 'goodsName'
            },
            {
              label: '商品id',
              prop: '_id'
            },
            {
              label: '账面数量',
              prop: 'number'
            },
            {
              label: '实际数量',
              prop: '_number',
              width: '100',
              render: (h, { row }) => {
                return h(ElInput, {
                  disabled: !!configInfo.edit,
                  type: 'number',
                  modelValue: row._number || row.number || 0,
                  'onUpdate:modelValue': (v) => {
                    row._number = v;
                  },
                  onInput: (v) => {
                    handleNumber();
                  },
                  onBlur: () => {
                  }
                });
              }
            },
            {
              label: '单位',
              prop: 'unit',
              width: '100'
            },
            {
              label: '备注',
              prop: 'remarks',
              width: '100',
              render: (h, { row }) => {
                return h(ElInput, {
                  disabled: !!configInfo.edit,
                  modelValue: row._remarks,
                  type: 'textarea',
                  autosize: {
                    minRows: 1,
                    maxRows: 4
                  },
                  'onUpdate:modelValue': (v) => {
                    row._remarks = v;
                  }
                });
              }
            }
          ],
          onChange: () => {
          }
        });
      }
    },
    {
      label: '账面数量合计',
      prop: 'allBillNumber',
      value: endPriceR,
      type: 'input',
      rules: [{ required: false, message: '请选择商品' }],
      input: {
        disabled: true,
        value: 0
      }
    },
    {
      label: '实际数量合计',
      prop: 'allLossesAndGainsNumber',
      value: '',
      type: 'input',
      rules: [{ required: false, message: '请选择商品' }],
      input: {
        disabled: true,
        value: 0
      }
    },
    {
      label: '备注',
      prop: 'remarks',
      value: '',
      rules: [{ required: false }],
      input: {
        placeholder: '请输入备注',
        type: 'textarea'
      }
    },
    {
      label: '图片附件',
      prop: 'img',
      value: '',
      rules: [{ required: false }],
      type: 'upload',
      upload: {
        imageUrl: '',
        showFileList: false,
        onSuccess: (response, uploadFile) => { },
        beforeUpload: () => { }
      }
    }
  ]
});
// 关闭添加编辑弹框
const cancelForm = () => {
  configInfo.loading = false;
  configInfo.dialog = false;
  configInfo.edit = '';
};
const clearForm = () => {
  lhDrawer.value.resetFields();
};
const onClick = ({ valid, form, fields }) => {
  console.log(configInfo.info, form, checkGoodsList.list, 'form');
  if (valid) {
    const haveValue = (val) => [undefined, null, ''].includes(val);
    if (Object.values(configInfo.info).filter(haveValue).length > 0) {
      return ElMessage.warning('请确保你数据填写完整！');
    }
    configInfo.loading = true;
    const param = {
      ...form,
      inventoryGoods: checkGoodsList.list
    };
    configInfo.edit ? (param._id = configInfo.edit) : null;
    // 业务日期
    param.createDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    let surePrice = 0;
    checkGoodsList.list.forEach(item => {
      // 实际数量
      const number = (item._number || item.number || 0) - item.number;
      surePrice += parseFloat(number) * parseFloat(item.purchasePrice);
      if (item._number && item._number !== item.number) {
        // 盘点状态
        param.status = `1`;
      } else {
        param.status = `0`;
      }
    });
    console.log(surePrice, 'surePrice');
    param.inventoryProfit = `0`;
    param.inventoryLoss = `0`;
    if (surePrice > 0) {
      // 盘盈金额
      param.inventoryProfit = `${surePrice}`;
    } else {
      // 盘亏金额
      param.inventoryLoss = `${surePrice}`;
    }
    // 账面
    const iABN = configInfo.info.findIndex(v => v.prop === 'allBillNumber');
    // 实时
    const iLAGN = configInfo.info.findIndex(v => v.prop === 'allLossesAndGainsNumber');
    // 账面数量合计
    param.allBillNumber = configInfo.info[iABN].value;
    // 亏盈数量合计
    param.allLossesAndGainsNumber = configInfo.info[iLAGN].value;

    delete param.goodsList;
    delete param.table;
    console.log(param, 'pa');
    stockListAdd(param)
      .then(({ code, msg }) => {
        if (code === 200) {
          getList();
          clearForm();
          ElMessage({
            message: msg,
            type: 'success'
          });
        }
      })
      .finally(() => cancelForm());
  } else {
    console.log('error submit!', fields);
  }
};
// 头部组件按钮点击事件
const btnEvent = (info) => {
  switch (info.type) {
    case 'add':
      configInfo.dialog = true;
      configInfo.edit = '';
      dataSet({ goodsList: checkGoodsList.list }, false);
      configInfo.info.forEach((item) => {
        item.value = '';
        if (item.prop === 'saleType') {
          item.value = '0';
        }
        if (item.prop === 'payWay') {
          item.value = 'wechartpay';
        }
        if (['allBillNumber', 'allLossesAndGainsNumber'].includes(item.prop)) {
          item.input.disabled = true;
        }
      });
      break;
    case 'find':
      pageinationInfo.currentPage = 1;
      getList();
      break;
  }
};
const currentChange = (v) => {
  pageinationInfo.currentPage = v;
  getList();
};
const sizeChange = (v) => {
  pageinationInfo.pageSize = v;
  pageinationInfo.currentPage = 1;
  getList();
};

const getList = () => {
  const [{ value: _id }] = headerInfo;
  const { currentPage: pageNo, pageSize: pageSize } = pageinationInfo;
  const param = {
    pageNo,
    pageSize,
    _id
  };
  stockListList(param).then(({ data }) => {
    tableInfo.tableData = data.data;
    pageinationInfo.totalNum = data.total;
    nextTick(setTableHeight);
  });
};

// 设置表格初始高度
const setTableHeight = () => {
  tbHeight.value = document.querySelector('.table-father').clientHeight;
};
// 商品信息
const goodsInfo = reactive({ data: [] });
const getGoodsInfo = () => {
  const param = {};
  goodsList(param).then(({ data, code, msg }) => {
    if (code !== 200) return message.error(msg);
    goodsInfo.data = data.data;
    const index = configInfo.info.findIndex((v) => v.prop === 'goodsList');
    configInfo.info[index].select.options = data.data?.map((v) => ({
      label: v.goodsName,
      value: v._id
    }));
  });
};
const init = () => {
  getList();
  getGoodsInfo();
};

init();
</script>

<style lang="scss" scoped>
.goods-info {
  height: 100%;

  :deep(.header-info) {
    background: #fff;
    padding: 10px 10px 0 10px;
  }

  ::v-deep .table {
    background: #fff;
  }

  .line {
    width: 100%;
    height: 20px;
  }
}
</style>
