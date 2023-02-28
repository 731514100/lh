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
import { ElMessage, ElButton, ElPopconfirm } from 'element-plus';
import { goodsAdd, goodsList, goodsDelete } from '@/api/info/goods.js';
import LhDrawer from '@/components/LhDrawer';
import moment from 'moment';

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
const notNegative = (rule, value, callback) => {
  if (value < 0) {
    return callback(new Error('不能为负数'));
  } else {
    callback();
  }
};
// 头部信息
const headerInfo = reactive([
  {
    type: 'input',
    placeholder: '请输入商品名称',
    value: '',
    label: '商品名称',
    span: 6
  },
  {
    type: 'input',
    placeholder: '请输入供应商名称',
    value: '',
    label: '供应商名称',
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
    label: '商品名称',
    prop: 'goodsName'
  },
  {
    label: '商品图片',
    prop: 'goodsImg',
    render: (h, { row }) => h('img', {
      src: row.goodsImg,
      style: {
        height: '80px'
      }
    })
  },
  {
    label: '商品编号',
    prop: 'goodsCode'
  },
  {
    label: '供应商',
    prop: 'supplier'
  },
  {
    label: '产地',
    prop: 'address'
  },
  {
    label: '单位',
    prop: 'unit'
  },
  {
    label: '规格',
    prop: 'specs'
  },
  {
    label: '单价',
    prop: 'price'
  },
  {
    label: '数量',
    prop: 'number'
  },
  {
    label: '包装',
    prop: 'packing'
  },
  {
    label: '生产日期',
    prop: 'dateOfManufacture',
    width: 90,
    render: (h, { row }) => h('span', moment(row.dateOfManufacture).format('YYYY-MM-DD'))
  },
  {
    label: '进价',
    prop: 'purchasePrice'
  },
  {
    label: '批发价',
    prop: 'wholesalePrice'
  },
  {
    label: '零售价',
    prop: 'retailPrice'
  },
  {
    label: '备注',
    prop: 'remarks'
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
              configInfo.dialog = true;
              console.log(row, 'form');
              configInfo.info.forEach((item) => {
                item.value = row[item.prop];
              });
            }
          },
          () => '修改'
        ),
        h(
          ElPopconfirm,
          {
            title: '是否确定删除？',
            onConfirm: () => {
              goodsDelete({ _id: row._id }).then(({ code }) => {
                if (code === 200) {
                  return ElMessage.success('删除成功！') && getList();
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
                      default: () => '删除'
                    }
                  )
                ]
              )
          }
        )
      ]);
    }
  }
]);
// 添加
const configInfo = reactive({
  dialog: false,
  edit: '',
  loading: false,
  info: [
    {
      label: '商品名称',
      prop: 'goodsName',
      value: '',
      rules: [{ required: true, message: '请填写商品名称' }],
      input: {
        placeholder: '请填写商品名称'
      }
    },
    {
      label: '商品图片',
      prop: 'goodsImg',
      value: '',
      rules: [{ required: true, message: '商品图片' }],
      type: 'upload',
      upload: {
        imageUrl: '',
        showFileList: false,
        onSuccess: (response, uploadFile) => {
          // configInfo.info[1].upload.imageUrl.value = URL.createObjectURL(uploadFile.raw);
        },
        beforeUpload: () => {

        }
      }
    },
    {
      label: '商品编号',
      prop: 'goodsCode',
      value: '',
      rules: [{ required: true, message: '请填写商品编号' }],
      input: {
        placeholder: '请填写商品编号'
      }
    },
    {
      label: '供应商',
      prop: 'supplier',
      value: '',
      rules: [{ required: true, message: '请填写供应商' }],
      input: {
        placeholder: '请填写供应商'
      }
    },
    {
      label: '产地',
      prop: 'address',
      value: '',
      rules: [{ required: true, message: '请填写产地' }],
      input: {
        placeholder: '请填写产地'
      }
    },
    {
      label: '单位',
      prop: 'unit',
      value: '',
      rules: [{ required: true, message: '请填写单位' }],
      input: {
        placeholder: '请填写单位'
      }
    },
    {
      label: '规格',
      prop: 'specs',
      value: '',
      rules: [{ required: true, message: '规格' }],
      input: {
        placeholder: '规格'
      }
    },
    {
      label: '单价',
      prop: 'price',
      value: '',
      rules: [{ required: true, message: '请填写单价' }, {
        validator: notNegative, trigger: 'blur'
      }],
      input: {
        placeholder: '请填写单价',
        type: 'number'
      }
    },
    {
      label: '数量',
      prop: 'number',
      value: '',
      rules: [{ required: true, message: '请填写数量' }, {
        validator: notNegative, trigger: 'blur'
      }],
      input: {
        placeholder: '请填写数量',
        type: 'number'
      }
    },
    {
      label: '包装',
      prop: 'packing',
      value: '',
      rules: [{ required: true, message: '请填写包装' }],
      input: {
        placeholder: '请填写包装'
      }
    },
    {
      label: '生产日期',
      prop: 'dateOfManufacture',
      type: 'date',
      value: '',
      rules: [{ required: true, message: '请填写生产日期' }],
      date: {
        placeholder: '请选择生产日期',
        type: 'datetime'
      }
    },
    {
      label: '进价',
      prop: 'purchasePrice',
      value: '',
      rules: [{ required: true, message: '请填写进价' }, {
        validator: notNegative, trigger: 'blur'
      }],
      input: {
        placeholder: '请填写进价',
        type: 'number',
        min: 0
      }
    },
    {
      label: '批发价',
      prop: 'wholesalePrice',
      value: '',
      rules: [{ required: true, message: '请填写批发价' }, {
        validator: notNegative, trigger: 'blur'
      }],
      input: {
        placeholder: '请填写批发价',
        type: 'number'
      }
    },
    {
      label: '零售价',
      prop: 'retailPrice',
      value: '',
      rules: [{ required: true, message: '请填写零售价' }, {
        validator: notNegative, trigger: 'blur'
      }],
      input: {
        placeholder: '请填写零售价',
        type: 'number'
      }
    },
    {
      label: '备注',
      prop: 'remarks',
      value: '',
      rules: [{ required: true, message: '请填写备注' }],
      input: {
        placeholder: '请填写备注',
        type: 'textarea'
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
  console.log(form, 'form');
  if (valid) {
    const haveValue = (val) => [undefined, null, ''].includes(val);
    if (Object.values(configInfo.info).filter(haveValue).length > 0) {
      return ElMessage.warning('请确保你数据填写完整！');
    }
    configInfo.loading = true;
    goodsAdd({ ...form, _id: configInfo.edit })
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
      configInfo.info.forEach((item) => {
        item.value = '';
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
  const [{ value: name }, { value: liaisonManPhone }] = headerInfo;
  const { currentPage: pageNo, pageSize: pageSize } = pageinationInfo;
  const param = {
    pageNo,
    pageSize,
    name,
    liaisonManPhone
  };
  goodsList(param).then(({ data }) => {
    tableInfo.tableData = data.data;
    pageinationInfo.totalNum = data.total;
    nextTick(setTableHeight);
  });
};

// 设置表格初始高度
const setTableHeight = () => {
  tbHeight.value = document.querySelector('.table-father').clientHeight;
};

const init = () => {
  getList();
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
