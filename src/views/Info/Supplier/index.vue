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
import { supplierAdd, supplierList, supplierDelete } from '@/api/info/supplier.js';
import LhDrawer from '@/components/LhDrawer';

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
    placeholder: '请输入供应商',
    value: '',
    label: '供应商',
    span: 6
  },
  {
    type: 'input',
    placeholder: '请输入联系人电话',
    value: '',
    label: '联系人电话',
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
    label: '供应商',
    prop: 'name'
  },
  {
    label: '邮政编码',
    prop: 'postCode'
  },
  {
    label: '地址',
    prop: 'address'
  },
  {
    label: '电话',
    prop: 'phone'
  },
  {
    label: '联系人',
    prop: 'liaisonMan'
  },
  {
    label: '联系人电话',
    prop: 'liaisonManPhone'
  },
  {
    label: '开户银行',
    prop: 'bank'
  },
  {
    label: '电子邮箱',
    prop: 'email'
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
              supplierDelete({ _id: row._id }).then(({ code }) => {
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
      label: '供应商',
      prop: 'name',
      value: '',
      rules: [{ required: true, message: '请填写供应商' }],
      input: {
        placeholder: '请填写供应商'
      }
    },
    {
      label: '邮政编码',
      prop: 'postCode',
      value: '',
      rules: [{ required: true, message: '请填写邮政编码' }],
      input: {
        placeholder: '请填写邮政编码'
      }
    },
    {
      label: '地址',
      prop: 'address',
      value: '',
      rules: [{ required: true, message: '请填写地址' }],
      input: {
        placeholder: '请填写地址'
      }
    },
    {
      label: '电话',
      prop: 'phone',
      value: '',
      rules: [{ required: true, message: '请填写电话' }],
      input: {
        placeholder: '请填写电话'
      }
    },
    {
      label: '联系人',
      prop: 'liaisonMan',
      value: '',
      rules: [{ required: true, message: '请填写联系人' }],
      input: {
        placeholder: '请填写联系人'
      }
    },
    {
      label: '联系人电话',
      prop: 'liaisonManPhone',
      value: '',
      rules: [{ required: true, message: '请填写联系人电话' }],
      input: {
        placeholder: '请填写联系人电话'
      }
    },
    {
      label: '开户银行',
      prop: 'bank',
      value: '',
      rules: [{ required: true, message: '请填写开户银行' }],
      input: {
        placeholder: '请填写开户银行'
      }
    },
    {
      label: '电子邮箱',
      prop: 'email',
      value: '',
      rules: [{ required: true, message: '请填写电子邮箱' }],
      input: {
        placeholder: '请填写电子邮箱',
        type: 'email'
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
    supplierAdd({ ...form, _id: configInfo.edit })
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
  supplierList(param).then(({ data }) => {
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
