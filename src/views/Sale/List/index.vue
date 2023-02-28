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
      title="详情"
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
import { ElMessage, ElButton, ElPopconfirm, ElMessage as message, ElImage, ElInput } from 'element-plus';
import { saleListAdd, saleListList, saleListChange } from '@/api/sale/list.js';
import { clientList } from '@/api/info/client.js';
import { goodsList } from '@/api/info/goods.js';
import LhDrawer from '@/components/LhDrawer';
import moment from 'moment';
import _ from 'lodash';
import CheckGoods from '../../Goods/List/components/CheckGoods';

const tbHeight = ref(250);
const lhDrawer = ref(null);

onMounted(() => {
  console.log(lhDrawer.value, 'ref-data');
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
    placeholder: '请输入客户',
    value: '',
    label: '客户',
    span: 6
  }
  // {
  //   type: 'input',
  //   placeholder: '请输入供应商名称',
  //   value: '',
  //   label: '供应商名称',
  //   span: 6
  // }
]);
// 表格配置信息
const tableConfig = reactive([
  {
    label: '序号',
    type: 'index',
    width: '80px'
  },
  {
    label: '销售单编号',
    prop: '_id',
    width: '80'
  },
  {
    label: '客户',
    prop: 'clientName',
    width: '80'
  },
  {
    label: '销售类型',
    prop: 'saleType',
    render: (h, { row }) => h('span', ['销售', '批发'][row.saleType])
  },
  {
    label: '发货时间',
    prop: 'time',
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
      return pre + (+next._numberBF ? +next._numberBF : +next._number);
    }, 0))
  },
  {
    label: '退货商品',
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
    label: '优惠总额',
    width: '80',
    render: (h, { row }) => h('span', {
      innerHTML: row.discountList[0].all
    })
  },
  {
    label: '合计金额',
    width: '80',
    prop: 'allPrice'
  },
  {
    label: '实付金额',
    width: '80',
    prop: 'endPrice'
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
    label: '状态',
    prop: 'conclusion',
    render: (h, { row }) => h('span', ['进行中', '已完成', '已作废', '部分退货', '全部退货'][row.conclusion])
  },
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
              console.log(row, 'form');
              dataSet(row);
              configInfo.dialog = true;
            }
          },
          () => '详情'
        ),
        row.conclusion === 0 ? h(
          ElButton,
          {
            link: true,
            type: 'primary',
            onClick: () => {
              const param = {
                conclusion: 1,
                _id: row._id
              };
              saleListChange(param).then(({ code }) => {
                if (code === 200) {
                  return ElMessage.success('修改成功！') && getList();
                }
              });
            }
          },
          () => '已完成'
        ) : '',
        row.conclusion === 0 ? h(
          ElPopconfirm,
          {
            title: '是否确定作废？',
            onConfirm: () => {
              const param = {
                conclusion: 2,
                _id: row._id
              };
              saleListChange(param).then(({ code }) => {
                if (code === 200) {
                  return ElMessage.success('作废完成！') && getList();
                }
              });
            }
          },
          {
            reference: () =>
              h(
                'span',
                {
                  link: true,
                  type: 'danger'
                },
                [
                  h(
                    ElButton,
                    {
                      link: true,
                      type: 'danger'
                    },
                    {
                      default: () => '作废'
                    }
                  )
                ]
              )
          }
        ) : ''
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
// 商品数据
const checkGoodsList = reactive({ list: [] });
// 折扣数据
const discountList = reactive({ list: [
  {
    discount: 100,
    discountQuota: 0,
    otherMoney: 0,
    all: 0
  }
] });
const allPrice = ref(0);
const endPriceR = ref(0);
const updateEndPriceR = () => {
  const number = (allPrice.value - discountList.list[0].all).toFixed(2);
  const priceI = configInfo.info.findIndex(v => v.prop === 'endPrice');
  configInfo.info[priceI].value = number;
  configInfo.info[priceI].input.value = number;
  endPriceR.value = number;
};
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
// 添加
const configInfo = reactive({
  dialog: false,
  edit: '',
  loading: false,
  info: [
    {
      label: '销售类型',
      prop: 'saleType',
      value: '0',
      type: 'select',
      rules: [{ required: true, message: '请选择客户联系人' }],
      select: {
        placeholder: '请选择客户联系人',
        options: [
          {
            label: '销售',
            value: '0'
          },
          {
            label: '批发',
            value: '1'
          }
        ],
        onChange: () => {
          setTimeout(() => {
            const { discount, otherMoney } = discountList.list[0];
            const _allPrice = countAllPrice();
            discountList.list[0].discountQuota = ((1 - (+discount / 100)) * +_allPrice).toFixed(2);
            discountList.list[0].all = (+discountList.list[0].discountQuota + +otherMoney).toFixed(2);
            // 必须两个一起触发
            const priceI = configInfo.info.findIndex(v => v.prop === 'allPrice');
            configInfo.info[priceI].value = _allPrice;
            configInfo.info[priceI].input.value = _allPrice;
            allPrice.value = _allPrice;
            updateEndPriceR();
          }, 200);
        }
      }
    },
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
          const priceI = configInfo.info.findIndex(v => v.prop === 'allPrice');
          const arr = [];
          v.forEach(item => {
            const info = goodsInfo.data.find(val => val._id === item);
            arr.push(info);
          });
          checkGoodsList.list = arr;
          let number = 0;
          checkGoodsList.list.forEach((item) => {
            if (item._number) {
              number += +item._number * +item.purchasePrice;
            }
          });
          // 必须两个一起触发
          configInfo.info[priceI].value = number;
          configInfo.info[priceI].input.value = number;
          allPrice.value = number;
          updateEndPriceR();
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
                  modelValue: row._number || 0,
                  'onUpdate:modelValue': (v) => {
                    row._number = v;
                  },
                  onInput: (v) => {
                    const { discount, otherMoney } = discountList.list[0];
                    const allPrice = countAllPrice();
                    discountList.list[0].discountQuota = ((1 - (+discount / 100)) * +allPrice).toFixed(2);
                    discountList.list[0].all = (+discountList.list[0].discountQuota + +otherMoney).toFixed(2);
                  },
                  onBlur: () => {
                    updateEndPriceR();
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
            configInfo.info[priceI].input.value = number;
            allPrice.value = number;
          }
        });
      }
    },
    {
      label: '总计金额',
      prop: 'allPrice',
      value: allPrice.value,
      type: 'input',
      rules: [{ required: false, message: '请选择商品' }],
      input: {
        disabled: true,
        value: 0
      }
    },
    {
      label: '折扣',
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
                  modelValue: +row.discount || 0,
                  'onUpdate:modelValue': (v) => {
                    row.discount = +v > 100 ? 100 : v;
                  },
                  onInput: (v) => {
                    // 优惠率
                    const value = +v > 100 ? 100 : +v;
                    console.log(value, 'v');
                    const allPrice = countAllPrice();
                    // 优惠额度
                    row.discountQuota = (+allPrice * (1 - (value / 100))).toFixed(2);
                    // 总计优惠
                    row.all = +row.otherMoney + +row.discountQuota;
                  },
                  onBlur: () => {
                    updateEndPriceR();
                  }
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
                  modelValue: +row.otherMoney || 0,
                  'onUpdate:modelValue': (v) => {
                    row.otherMoney = v;
                  },
                  onInput: (v) => {
                    // 总计优惠
                    row.all = +row.otherMoney + +row.discountQuota;
                    updateEndPriceR();
                  },
                  onBlur: () => {
                    updateEndPriceR();
                  }
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
      label: '实收金额',
      prop: 'endPrice',
      value: endPriceR,
      type: 'input',
      rules: [{ required: false, message: '请选择商品' }],
      input: {
        disabled: true,
        value: 0
      }
    },
    {
      label: '客户',
      prop: 'client',
      value: '',
      type: 'select',
      rules: [{ required: true, message: '请选择客户联系人' }],
      select: {
        placeholder: '请选择客户联系人',
        options: [],
        filterable: true
      }
    },
    {
      label: '进货时间',
      prop: 'time',
      value: '',
      type: 'date',
      rules: [{ required: true, message: '请选择进货时间' }],
      date: {
        placeholder: '请选择进货时间',
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
  console.log(form, checkGoodsList.list, 'form');
  if (valid) {
    const haveValue = (val) => [undefined, null, ''].includes(val);
    if (Object.values(configInfo.info).filter(haveValue).length > 0) {
      return ElMessage.warning('请确保你数据填写完整！');
    }
    configInfo.loading = true;
    const param = {
      ...form,
      goodsList: checkGoodsList.list,
      allPrice: allPrice.value
    };
    configInfo.edit ? param._id = configInfo.edit : null;
    param.time ? param.time = moment(param.time).format('YYYY-MM-DD HH:mm:ss') : null;
    delete param.table;
    delete param.tables;
    param.discountList = discountList.list;

    // 获取客户姓名
    const client = configInfo.info.find(v => v.prop === 'client');
    const clientName = client.select.options.find(v => v.value === client.value)?.label;
    clientName ? param.clientName = clientName : null;
    console.log(param, 'pa');
    saleListAdd(param)
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
        if (item.prop === 'saleType') {
          item.value = '0';
        }
        if (item.prop === 'allPrice' || item.prop === 'endPrice') {
          item.input.disabled = true;
        }
        if (item.prop === 'payWay') {
          item.value = 'wechartpay';
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
  const [{ value: client }] = headerInfo;
  const { currentPage: pageNo, pageSize: pageSize } = pageinationInfo;
  const param = {
    pageNo,
    pageSize,
    client
  };
  saleListList(param).then(({ data }) => {
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
  const param = {
  };
  goodsList(param).then(({ data, code, msg }) => {
    if (code !== 200) return message.error(msg);
    goodsInfo.data = data.data;
    const index = configInfo.info.findIndex(v => v.prop === 'goodsList');
    configInfo.info[index].select.options = data.data.map(v => ({
      label: v.goodsName,
      value: v._id
    }));
  });
};
// 客户信息
const supplier = reactive({ data: [] });
const getClientList = () => {
  const param = {};
  clientList(param).then(({ data, code, msg }) => {
    if (code !== 200) return message.error(msg);
    supplier.data = data.data;
    const index = configInfo.info.findIndex(v => v.prop === 'client');
    configInfo.info[index].select.options = data.data.map(v => ({
      label: v.name,
      value: v._id
    }));
  });
};
const init = () => {
  getClientList();
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
