<template>
  <div class="goods-info flex-column">
    <HeaderSearchInfo :header-info="headerInfo" class="header-info" @btnEvent="btnEvent" />
    <div class="line" />
    <div class="table-father" style="height: 100%">
      <LhTable :table-config="tableConfig" :height="tbHeight" class="table" @current-change="currentChange"
        @size-change="sizeChange" />
    </div>
    <LhDrawer ref="lhDrawer" v-model="configInfo.dialog" :config="configInfo" 
      @submit="onClick" @close="
        configInfo.dialog = false;
        configInfo.loading = false;
      " />
  </div>
</template>

<script setup>
import { provide, reactive, ref, nextTick, onMounted } from 'vue';
import { ElMessage, ElButton, ElPopconfirm, ElMessage as message, ElImage, ElInput, ElSwitch } from 'element-plus';
import { add, page, userUpdate, delUser } from '@/api/user.js';
import LhDrawer from '@/components/LhDrawer';
import moment from 'moment';
import _ from 'lodash';
import { powerList } from '@/utils'

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
    placeholder: '请输入用户名',
    value: '',
    label: '用户名',
    span: 6
  },
  {
    type: 'input',
    placeholder: '请输入手机号',
    value: '',
    label: '手机号',
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
    label: '头像',
    prop: 'img',
    width: '100px',
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
    label: '用户名',
    prop: 'us',
    width: '140px'
  },
  {
    label: '手机号',
    prop: 'phone',
    width: '140px',
  },
  {
    label: '用户权限',
    prop: 'roleId',
    render: (h, { row }) => h('span', powerList
      ?.filter(item => row.roleId.includes(item.value))
      ?.map(v => v.label)
      ?.join('，')
    )
  },
  {
    label: '年龄',
    prop: 'age',
    width: '60',
  },
  {
    label: '备注',
    prop: 'remarks',
    width: '260px'
  },
  {
    label: '启用',
    prop: 'state',
    width: '90px',
    render: (h, { row }) => h(ElSwitch, {
      modelValue: row.state,
      // disabled: row.lhDisabled,
      disabled: true,
      onChange: (v) => {
        row.state = v
        console.log(v)
        row.lhDisabled = true;
        setTimeout(() => {
          row.lhDisabled = false;
        }, 1000);
      }
    })
  },
  {
    label: '操作',
    width: 180,
    render: (h, { row }) => {
      return h('div', {}, [
        h(
          ElButton,
          {
            link: true,
            type: 'primary',
            onClick: () => {
              configInfo.edit = `${row.id}`;
              console.log(row, 'form');
              dataSet(row, true, (item) => {
                if (item.prop === 'ps') {
                  item.rules[0].required = false;
                }
              });
              configInfo.dialog = true;
            }
          },
          () => '编辑'
        ),
        h(
          ElPopconfirm,
          {
            title: '是否确定删除此用户？',
            onConfirm: () => {
              const param = {
                conclusion: 2,
                _id: row._id
              };
              delUser(param).then(({ code }) => {
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
const dataSet = (row, disabled = true.valueOf, cb) => {
  configInfo.info.forEach((item) => {
    item.value = row[item.prop];
    if (item.prop === 'ps') {
      item.input.disabled = disabled;
    }
    if (item.prop === 'roleId') {
      item.value = row[item.prop].split(',')
    }
    if (item.upload) {
      item.upload.imageUrl = row.img;
    }
    cb&&cb(item);
  });
};

const stateRef = ref(true);
// 添加
const configInfo = reactive({
  dialog: false,
  edit: '',
  loading: false,
  info: [
    {
      label: '用户名',
      prop: 'us',
      value: '0',
      rules: [{ required: true, message: '请选择客户联系人' }],
      input: {
        placeholder: '请选择客户联系人'
      }
    },
    {
      label: '密码',
      prop: 'ps',
      value: '',
      rules: [{ required: true, message: '请输入密码' }],
      input: {
        placeholder: '请输入密码',
        type: 'password',
        'show-password': true
      }
    },
    {
      label: '手机号',
      prop: 'phone',
      value: '0',
      rules: [{ required: true, message: '请输入手机号' }],
      input: {
        placeholder: '请输入手机号'
      }
    },
    {
      label: '权限勾选',
      prop: 'roleId',
      value: [],
      type: 'select',
      rules: [{ required: true, message: '请选择权限' }],
      select: {
        placeholder: '请选择权限',
        multiple: true,
        filterable: true,
        'reserve-keyword': false,
        'default-first-option': true,
        style: {
          width: '100%'
        },
        options: powerList,
        onChange: (v) => {
        }
      }
    },
    {
      label: '年龄',
      prop: 'age',
      value: '',
      type: 'input',
      input: {
        placeholder: '请输入年龄'
      }
    },
    {
      label: '启用',
      prop: 'state',
      value: stateRef.value,
      type: 'other',
      render(h) {
        return h(ElSwitch, {
          modelValue: stateRef.value,
          onChange: (v) => {
            // 更新界面展示
            stateRef.value = v;
          }
        })
      },
    },
    {
      label: '头像',
      prop: 'img',
      value: '',
      rules: [{ required: true, message: '请上传头像' }],
      type: 'upload',
      upload: {
        imageUrl: '',
        showFileList: false,
        onSuccess: (response, uploadFile) => {
        },
        beforeUpload: () => {

        }
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
  console.log(form.roleId.join(','))
  if (valid) {
    const haveValue = (val) => [undefined, null, ''].includes(val);
    if (Object.values(configInfo.info).filter(haveValue).length > 0) {
      return ElMessage.warning('请确保你数据填写完整！');
    }
    configInfo.loading = true;
    const param = {
      ...form
    };
    configInfo.edit ? param.id = configInfo.edit : null;

    // 是否启用
    console.log(stateRef.value, '0-=')
    param.state = stateRef.value
    param.roleId = param.roleId.join(',')
    console.log(param, 'pa');
    if (param.id) {
      return userUpdate(param).then(({code, msg}) => {
        if (code === 200) {
          getList();
          clearForm();
          ElMessage({
            message: msg,
            type: 'success'
          });
        }
      }).finally(() => cancelForm())
    };
    add(param)
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
      dataSet({ goodsList: [], allPrice: 0 }, false, (item) => {
        if (item.prop === 'ps') {
          item.rules[0].required = true;
        }
      });
      configInfo.info.forEach((item) => {
        if (item.prop === 'state') {
          item.value = stateRef.value;
        } else {
          item.value = '';
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
  page(param).then(({ data, total }) => {
    tableInfo.tableData = data;
    pageinationInfo.totalNum = total;
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
