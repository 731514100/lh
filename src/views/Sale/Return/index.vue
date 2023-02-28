<template>
  <div class="goods-info flex-column">
    <HeaderSearchInfo
      :header-info="headerInfo"
      class="header-info"
      @btnEvent="btnEvent"
    />
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
      :btn-show="!(configInfo.edit)"
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
import { ElMessage, ElButton, ElMessage as message, ElImage, ElInput } from 'element-plus';
import { saleReturnAdd, saleReturnList } from '@/api/sale/return.js';
import { saleListList } from '@/api/sale/list.js';
import LhDrawer from '@/components/LhDrawer';
import moment from 'moment';
import _ from 'lodash';
import CheckGoods from '../../Goods/List/components/CheckGoods';

const tbHeight = ref(250);
const lhDrawer = ref(null);
const params = reactive({});
onMounted(() => {
});
const payWayOptions = [
  {
    label: '支付宝',
    value: 'alipay'
  },
  {
    label: '微信',
    value: 'wechartpay'
  },
  {
    label: '银行卡',
    value: 'bank'
  }
];
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
    placeholder: '请输入销售单编号',
    value: '',
    label: '销售单编号',
    span: 6
  },
  {
    type: 'input',
    placeholder: '请输入客户名称',
    value: '',
    label: '客户名称',
    span: 6
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
    label: '关联销售单',
    prop: 'saleListId',
    width: '80'
  },
  {
    label: '客户名字',
    prop: 'clientName'
  },
  {
    label: '退货时间',
    prop: 'returnTime',
    width: '160'
  },
  // {
  //   label: '经手人',
  //   prop: 'unit'
  // },
  {
    label: '品种数量',
    prop: 'specs',
    width: '80',
    render: (h, { row }) => h('span', row?.goodsList?.length)
  },
  {
    label: '货品总数',
    prop: 'price',
    width: '80',
    render: (h, { row }) => h('span', row?.goodsList.reduce((pre, next) => {
      return pre + +next._number;
    }, 0))
  },
  {
    label: '退货商品',
    prop: 'price',
    render: (h, { row }) => h('span', row?.goodsList.reduce((pre, next) => {
      return pre + next.goodsName + '  ';
    }, ''))
  },
  {
    label: '结算方式',
    prop: 'payWay',
    width: '80',
    render: (h, { row: { payWay }}) => h('span', payWayOptions.find(v => v.value === payWay)?.label)
  },
  {
    label: '合计金额',
    width: '80',
    prop: 'allPrice'
  },
  {
    label: '备注',
    width: '120',
    prop: 'remarks'
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
  // {
  //   label: '操作人员',
  //   prop: 'dateOfManufacture'
  // },
  {
    label: '操作',
    render: (h, { row }) => {
      return h('div', {}, [
        h(
          ElButton,
          {
            link: true,
            type: 'primary',
            onClick: () => {
              configInfo.edit = row._id;
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
    }
    if (item.upload) {
      item.upload.imageUrl = row.img;
      item.upload.disabled = disabled;
    }
    if (item.prop === 'allPrice') {
      item.input.value = row.allPrice;
    }
  });
  allPrice.value = row.allPrice;
  const goodsList_i = configInfo.info.findIndex(v => v.prop === 'goodsList');
  configInfo.info[goodsList_i].value = row.goodsList.map(v => v._id);

  setTimeout(() => {
    checkGoodsList.list = row.goodsList;
  }, 0);
};
const checkGoodsList = reactive({ list: [] });
const allPrice = ref(0);
// type = 0 :wholesalePrice(零售价) 1: retailPrice(批发价)
const getPriceType = () => {
  const saleTypeObj = configInfo.info.find(v => v.prop === 'saleType');
  return ['wholesalePrice', 'retailPrice'][saleTypeObj.value];
};
// 返回总数金额
const countAllPrice = () => {
  console.log(checkGoodsList.list);
  const key = getPriceType();
  return checkGoodsList.list.reduce((pre, next) => {
    console.log(next, 'n');
    if (next._number) pre += +next._number * +next[key];
    return _.isNaN(pre) ? 0 : pre;
  }, 0);
};
// 折扣数据
const discountList = reactive({ list: [
  {
    discount: 100,
    discountQuota: 0,
    otherMoney: 0,
    all: 0
  }
] });
const endPriceR = ref(0);
const updateEndPriceR = () => {
  const number = (allPrice.value - discountList.list[0].all).toFixed(2);
  const priceI = configInfo.info.findIndex(v => v.prop === 'endPrice');
  configInfo.info[priceI].value = number;
  configInfo.info[priceI].input.value = number;
  endPriceR.value = number;
};
// 添加
const configInfo = reactive({
  dialog: false,
  edit: '',
  loading: false,
  info: [
    {
      label: '客户联系人',
      prop: 'clientName',
      value: '',
      rules: [{ required: false, message: '请填写客户联系人' }],
      input: {
        placeholder: '请填写客户联系人'
      }
    },
    {
      label: '销售类型',
      prop: 'saleType',
      value: '0',
      type: 'select',
      rules: [{ required: true, message: '请选择销售类型' }],
      select: {
        placeholder: '请选择销售类型',
        options: [
          {
            label: '销售',
            value: '0'
          },
          {
            label: '批发',
            value: '1'
          }
        ]
      }
    },
    {
      label: '选择销售单',
      prop: 'goodsList',
      value: [],
      type: 'select',
      rules: [{ required: true, message: '选择销售单' }],
      select: {
        placeholder: '请选择销售单',
        filterable: true,
        'reserve-keyword': false,
        'default-first-option': true,
        options: [],
        onChange: (v) => {
          const priceI = configInfo.info.findIndex(v => v.prop === 'allPrice');
          const info = goodsListInfo.data.find(val => val._id === v);
          discountList.list = info.discountList;
          // 销售类型初始化
          const saleTypeI = configInfo.info.findIndex(v => v.prop === 'saleType');
          setTimeout(() => {
            configInfo.info[saleTypeI].value = info.saleType;
          }, 0);
          configInfo.info[saleTypeI].select.value = info.saleType;
          console.log(configInfo.info, saleTypeI, info.saleType, '-');
          // 初始化客户联系人
          const customerContactI = configInfo.info.findIndex(v => v.prop === 'clientName');
          configInfo.info[customerContactI].value = info.clientName;
          configInfo.info[customerContactI].input.value = info.clientName;
          console.log(info, 'info.supplierId');
          // 添加每一行的数量限制
          info.goodsList.forEach((item, i) => {
            info.goodsList[i]._numberBF = item._number;
          });
          checkGoodsList.list = info.goodsList;
          let number = 0;
          checkGoodsList.list.forEach((item) => {
            if (item._number) {
              number += +item._number * +item.purchasePrice;
            }
          });
          // 必须两个一起触发 -总数
          configInfo.info[priceI].value = number;
          configInfo.info[priceI].input.value = number;
          allPrice.value = number;
          // 设置参数
          params.saleListId = info._id;
          params.client = info.client;
          params.clientName = info.clientName;
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
              label: '数量',
              prop: 'number',
              width: '100',
              render: (h, { row }) => {
                return h(ElInput, {
                  disabled: !!configInfo.edit,
                  max: row._number,
                  min: 0,
                  modelValue: row._numberReturn || 0,
                  onInput: (v) => {
                    row._numberReturn = +v >= +row._number ? row._number : +v;
                  }
                });
              }
            },
            {
              label: '单价',
              prop: 'purchasePrice',
              width: '100',
              render: (h, { row }) => {
                const saleTypeObj = configInfo.info.find(v => v.prop === 'saleType');
                const key = ['wholesalePrice', 'retailPrice'][saleTypeObj.value];
                return h('span', {
                  innerHTML: +row[key] || 0
                });
              }
            },
            {
              label: '金额',
              prop: 'price',
              width: '100',
              render: (h, { row }) => {
                const saleTypeObj = configInfo.info.find(v => v.prop === 'saleType');
                const key = ['wholesalePrice', 'retailPrice'][saleTypeObj.value];
                return h('span', {
                  innerHTML: (+row[key] * row._number) || 0
                });
              }
            }
          ],
          onChange: () => {
            const priceI = configInfo.info.findIndex(v => v.prop === 'allPrice');
            const number = countAllPrice();
            // 必须两个一起触发
            configInfo.info[priceI].value = number;
            configInfo.info[priceI].input.max = number;
            allPrice.value = number;
          }
        });
      }
    },
    {
      label: '原折扣额度',
      prop: 'tables',
      value: '',
      rules: [{ required: false }],
      type: 'table',
      render: (h) => {
        return h(CheckGoods, {
          info: discountList.list,
          tableConfig: [
            {
              label: '折扣率（%）',
              prop: 'discount',
              render: (h, { row }) => {
                return h(ElInput, {
                  disabled: true,
                  modelValue: +row.discount || 0
                });
              }
            },
            {
              label: '折扣额度',
              prop: 'discountQuota',
              width: '100',
              render: (h, { row }) => {
                return h('span', {
                  disabled: true,
                  innerHTML: row.discountQuota || 0
                });
              }
            },
            {
              label: '其他费用',
              prop: 'otherMoney',
              width: '100',
              render: (h, { row }) => {
                return h(ElInput, {
                  disabled: true,
                  modelValue: +row.otherMoney || 0
                });
              }
            },
            {
              label: '总计优惠',
              prop: 'all',
              width: '100',
              render: (h, { row }) => {
                return h(ElInput, {
                  disabled: true,
                  modelValue: row.all || 0,
                  'onUpdate:modelValue': (v) => {
                    row._number = v;
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
      label: '退货总计金额',
      prop: 'allPrice',
      value: 0,
      type: 'input',
      rules: [{ required: true, message: '请输入退货总计金额' }],
      input: {
        type: 'number',
        min: 0,
        onInput: (v) => {
          const i = configInfo.info.findIndex(v => v.prop === 'allPrice');
          const max = countAllPrice();
          const number = +v > +max ? +max : +v;
          configInfo.info[i].value = number;
          configInfo.info[i].input.value = number;
          allPrice.value = number;
        }
      }
    },
    {
      label: '退货时间',
      prop: 'returnTime',
      value: '',
      type: 'date',
      rules: [{ required: true, message: '请选择退货时间' }],
      date: {
        placeholder: '请选择退货时间',
        type: 'datetime'
      }
    },
    {
      label: '结算方式',
      prop: 'payWay',
      value: 'wechartpay',
      type: 'select',
      rules: [{ required: true, message: '请选择结算方式' }],
      select: {
        options: payWayOptions
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
        onSuccess: (response, uploadFile) => {
        },
        beforeUpload: () => {

        }
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
  if (valid) {
    const haveValue = (val) => [undefined, null, ''].includes(val);
    if (Object.values(configInfo.info).filter(haveValue).length > 0) {
      return ElMessage.warning('请确保你数据填写完整！');
    }
    configInfo.loading = true;
    const param = { ...form, goodsList: checkGoodsList.list, allPrice: allPrice.value, ...params };
    configInfo.edit ? param._id = configInfo.edit : null;
    param.returnTime ? param.returnTime = moment(param.returnTime).format('YYYY-MM-DD HH:mm:ss') : null;
    allPrice.value ? param.allPrice = allPrice.value : null;
    console.log(param);
    saleReturnAdd(param)
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
      dataSet({ goodsList: [], allPrice: 0 }, false);
      configInfo.info.forEach((item) => {
        item.value = '';
        if (item.prop === 'clientName') {
          item.input.disabled = true;
        }
        if (item.prop === 'payWay') {
          item.value = 'wechartpay';
        }
        if (item.prop === 'saleType') {
          item.select.disabled = true;
          item.select.value = '';
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
  const [{ value: saleListId }, { value: clientName }] = headerInfo;
  const { currentPage: pageNo, pageSize: pageSize } = pageinationInfo;
  const param = {
    pageNo,
    pageSize,
    saleListId,
    clientName
  };
  saleReturnList(param).then(({ data }) => {
    tableInfo.tableData = data.data;
    pageinationInfo.totalNum = data.total;
    nextTick(setTableHeight);
  });
};

// 设置表格初始高度
const setTableHeight = () => {
  tbHeight.value = document.querySelector('.table-father').clientHeight;
};
// 进货单
const goodsListInfo = reactive({ data: [] });
const getGoodsListList = () => {
  const param = {
  };
  saleListList(param).then(({ data, code, msg }) => {
    if (code !== 200) return message.error(msg);

    goodsListInfo.data = data.data;
    const index = configInfo.info.findIndex(v => v.prop === 'goodsList');
    configInfo.info[index].select.options = data.data.map(v => ({
      // label: `${v.client}: ` + v.goodsList.reduce((pre, next) => `${pre ? ',' : ''}${next.goodsName}`, ''),
      label: (v.clientName ? `${v.clientName}: ` : '') + v._id,
      value: v._id
    }));
  });
};

const init = () => {
  getList();
  getGoodsListList();
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
