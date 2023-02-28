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
    <el-drawer
      ref="drawerRef"
      v-model="dialog"
      :title="edit ? '编辑' : '添加'"
      :before-close="handleClose"
      direction="ltr"
      custom-class="demo-drawer"
      size="40%"
    >
      <div class="demo-drawer__content">
        <el-form ref="ruleFormRef" :model="form" :rules="rules">
          <el-form-item
            label="客户名"
            :label-width="formLabelWidth"
            prop="name"
          >
            <el-input
              v-model="form.name"
              autocomplete="on"
              placeholder="请输入客户名称"
            />
          </el-form-item>
          <el-form-item
            label="客户类型"
            :label-width="formLabelWidth"
            prop="type"
          >
            <el-select v-model="form.type" placeholder="请选择客户类型">
              <el-option
                v-for="item in clientType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="地址"
            :label-width="formLabelWidth"
            prop="address"
          >
            <el-input
              v-model="form.address"
              autocomplete="off"
              placeholder="请输入客户地址"
            />
          </el-form-item>
          <el-form-item
            label="联系电话"
            :label-width="formLabelWidth"
            prop="phone"
          >
            <el-input
              v-model="form.phone"
              autocomplete="off"
              placeholder="请输入联系电话"
            />
          </el-form-item>
          <el-form-item
            label="经营项目"
            :label-width="formLabelWidth"
            prop="project"
          >
            <el-input
              v-model="form.project"
              autocomplete="off"
              placeholder="请输入经营项目"
            />
          </el-form-item>
          <el-form-item
            label="经营规模"
            :label-width="formLabelWidth"
            prop="scale"
          >
            <el-select v-model="form.scale" placeholder="请选择经营规模">
              <el-option
                v-for="item in scaleType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="经营开始时间"
            :label-width="formLabelWidth"
            prop="beginTime"
          >
            <el-input
              v-model="form.beginTime"
              autocomplete="off"
              placeholder="请输入经营开始时间"
            />
          </el-form-item>
          <el-form-item
            label="信用级别"
            :label-width="formLabelWidth"
            prop="level"
          >
            <el-select v-model="form.level" placeholder="请选择信用级别">
              <el-option
                v-for="item in 10"
                :key="item"
                :label="`${item}级`"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="付款方式"
            :label-width="formLabelWidth"
            prop="payWay"
          >
            <el-select v-model="form.payWay" placeholder="请选择付款方式">
              <el-option
                v-for="item in payWayType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="所需产品种类"
            :label-width="formLabelWidth"
            prop="needGoodsType"
          >
            <el-select
              v-model="form.needGoodsType"
              placeholder="请选择所需产品种类"
            >
              <el-option
                v-for="item in needGoodsType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="产品月需求量"
            :label-width="formLabelWidth"
            prop="monthlyDemand"
          >
            <el-input
              v-model="form.monthlyDemand"
              autocomplete="off"
              placeholder="请输入客户地址"
            />
          </el-form-item>
          <el-form-item
            label="毛利率标准"
            :label-width="formLabelWidth"
            prop="grossMarginStandard"
          >
            <el-input
              v-model="form.grossMarginStandard"
              autocomplete="off"
              placeholder="请输入毛利率标准"
            />
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button @click="cancelForm">取消</el-button>
          <el-button
            type="primary"
            :loading="loading"
            @click="onClick(ruleFormRef)"
          >{{ loading ? `${loadingWord}中 ...` : loadingWord }}</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { computed, provide, reactive, ref, nextTick } from 'vue';
import { ElMessage, ElButton, ElPopconfirm } from 'element-plus';
import { clientAdd, clientList, clientDelete } from '@/api/info/client.js';

const formLabelWidth = '120px';
const timer = null;
const dialog = ref(false);
const loading = ref(false);
const edit = ref('');
const tbHeight = ref(250);
const ruleFormRef = ref();

const loadingWord = computed(() => {
  return edit.value ? '编辑' : '添加';
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
  pageSize: 10,
  pageSizes: [10, 20, 40, 80, 100]
});
provide('tableInfo', tableInfo);
provide('pageinationInfo', pageinationInfo);
// 头部信息
const headerInfo = reactive([
  {
    type: 'input',
    placeholder: '请输入客户名',
    value: '',
    label: '客户名',
    span: 6
  },
  {
    type: 'input',
    placeholder: '请输入联系电话',
    value: '',
    label: '联系电话',
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
    label: '客户名',
    prop: 'name'
  },
  {
    label: '类别',
    prop: 'type',
    render: (h, { row }) => h('span', clientType[row.type].label)
  },
  {
    label: '地址',
    prop: 'address'
  },
  {
    label: '联系电话',
    prop: 'phone'
  },
  {
    label: '经营项目',
    prop: 'project'
  },
  {
    label: '经营规模',
    prop: 'scale',
    render: (h, { row }) => h('span', scaleType[row.scale]?.label)
  },
  {
    label: '经营时间',
    prop: 'beginTime'
  },
  {
    label: '信用级别',
    prop: 'level',
    render: (h, { row }) => h('span', `${row.level + 1}级`)
  },
  {
    label: '付款方式',
    prop: 'payWay',
    render: (h, { row }) =>
      h(
        'span',
        payWayType.filter((item) => item.value === row.payWay)[0]?.label
      )
  },
  {
    label: '所需产品种类',
    prop: 'needGoodsType',
    render: (h, { row }) => h('span', needGoodsType[row.needGoodsType]?.label)
  },
  {
    label: '产品月需求量',
    prop: 'monthlyDemand'
  },
  {
    label: '毛利率标准',
    prop: 'grossMarginStandard'
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
              edit.value = row._id;
              dialog.value = true;
              console.log(row, 'form');
              Object.keys(form).forEach((key) => {
                form[key] = row[key];
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
              clientDelete({ _id: row._id }).then(({ code }) => {
                if (code === 200) { return ElMessage.success('删除成功！') && getList(); }
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
const form = reactive({
  name: '', // 客户名
  type: '', // 客户类型
  address: '', // 地址
  phone: '', // 电话
  project: '', // 经营项目
  scale: '', // 经营规模
  beginTime: '', // 经营时间
  level: '', // 信用级别
  payWay: '', // 付款方式
  needGoodsType: '', // 所需产品种类
  monthlyDemand: '', // 月需求量
  grossMarginStandard: '' // 毛利率标准
});
const rules = reactive({
  name: [{ required: true, message: '请填写客户名' }], // 客户名
  type: [{ required: true, message: '请选择客户类型' }], // 客户类型
  address: [{ required: true, message: '请填写地址' }], // 地址
  phone: [{ required: true, message: '请填写电话' }], // 电话
  project: [{ required: true, message: '请填写经营项目' }], // 经营项目
  scale: [{ required: true, message: '请选择经营规模' }], // 经营规模
  beginTime: [{ required: true, message: '请填写经营时间' }], // 经营时间
  level: [{ required: true, message: '请选择信用级别' }], // 信用级别
  payWay: [{ required: true, message: '请选择付款方式' }], // 付款方式
  needGoodsType: [{ required: true, message: '请选择所需产品种类' }], // 所需产品种类
  monthlyDemand: [{ required: true, message: '请填写月需求量' }], // 月需求量
  grossMarginStandard: [{ required: true, message: '请填写毛利率标准' }] // 毛利率标准
});
const clientType = [
  {
    label: '理智型客户',
    value: 0
  },
  {
    label: '冲动型客户',
    value: 1
  },
  {
    label: '利益型客户',
    value: 2
  },
  {
    label: '无理取闹型客户',
    value: 3
  },
  {
    label: '习惯型客户',
    value: 4
  },
  {
    label: '情感型客户',
    value: 5
  }
];
const scaleType = [
  {
    label: '特大型',
    value: 4
  },
  {
    label: '大型',
    value: 3
  },
  {
    label: '中型',
    value: 2
  },
  {
    label: '小型',
    value: 1
  },
  {
    label: '微型',
    value: 0
  }
];
// 付款方式
const payWayType = [
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
// 产品种类
const needGoodsType = [
  {
    label: '原材料',
    value: 0
  },
  {
    label: '半成品',
    value: 1
  },
  {
    label: '成品',
    value: 2
  }
];

const handleClose = (done) => {
  done();
};
// 关闭添加编辑弹框
const cancelForm = () => {
  loading.value = false;
  dialog.value = false;
  edit.value = '';
  clearTimeout(timer);
};
const clearForm = () => {
  Object.keys(form).forEach((key) => {
    form[key] = '';
  });
};

const drawerRef = ref();
const onClick = (formEl) => {
  formEl.validate((valid, fields) => {
    if (valid) {
      loading.value = true;
      clientAdd({ ...form, _id: edit.value })
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
  });
};
// 头部组件按钮点击事件
const btnEvent = (info) => {
  switch (info.type) {
    case 'add':
      dialog.value = true;
      Object.keys(form).forEach((key) => {
        form[key] = '';
      });
      break;
    case 'find':
      getList();
      break;
  }
};

const currentChange = (v) => {
  pageinationInfo.currentPage = v;
  getList();
};
const sizeChange = (v) => {
  console.log(v);
  pageinationInfo.pageSize = v;
  pageinationInfo.currentPage = 1;
  getList();
};

const getList = () => {
  const [{ value: name }, { value: phone }] = headerInfo;
  const { currentPage: pageNo, pageSize: pageSize } = pageinationInfo;
  const param = {
    pageNo,
    pageSize,
    name,
    phone
  };
  clientList(param).then(({ data }) => {
    tableInfo.tableData = data.data;
    pageinationInfo.totalNum = data.total;
    nextTick(setTableHeight);
  });
};

// 设置表格初始高度
const setTableHeight = () => {
  console.log(document.querySelector('.table-father').clientHeight);
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
