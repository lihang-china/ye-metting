<template>
    <div class="energyData-view">
        <div class="right-view">
            <div class="top-view">
                <div class="top-left-view">
                <div class="item-view">
                    <a>标准编码</a>
                    <el-input
                        class="input"
                        v-model="queryParams.code"
                        placeholder="请输入你要搜索的标准编码"
                        clearable
                        size="small"
                        @keyup.enter.native="handleQuery"
                    />
                </div>
                <div class="item-view">
                    <a>分期编码</a>
                    <el-input
                        class="input"
                        v-model="queryParams.projectCode"
                        placeholder="请输入你要搜索的分项编码"
                        clearable
                        size="small"
                        @keyup.enter.native="handleQuery"
                    />
                </div>
                <div class="item-view"><a>分项名称</a>
                    <el-input
                    class="input"
                        v-model="queryParams.projectName"
                        placeholder="请输入你要搜索的分项名称"
                        clearable
                        size="small"
                        @keyup.enter.native="handleQuery"
                    />
                </div>
                <div class="item-view">
                    <el-button
                        type="primary"
                        icon="el-icon-search"
                        size="mini"
                        @click="handleQuery"
                    >查询</el-button>
                </div>
                </div>
                <div class="top-right-view">
                    <div class="item-view">
                        <a>执行时间起</a>
                        <el-date-picker
                        class="input"
                            v-model="startDate"
                            type="date"
                            placeholder="选择日期">
                            </el-date-picker>
                        
                    </div>
                    <div class="item-view"><a>执行时间止</a>
                        <el-date-picker
                        class="input"
                            v-model="endDate"
                            type="date"
                            placeholder="选择日期">
                            </el-date-picker>
                    </div>
                </div>
            </div>
            <div class="bottom-view">
                <el-row
                    :gutter="10"
                    class="mb8"
                >
                    <el-col :span="1.5">
                        <el-button
                            type="primary"
                            size="mini"
                            @click="show"
                        >抽取</el-button>
                    </el-col>
                    
                </el-row>
                <el-table
                    :data="tableData"
                    style="width: 100%;background:none;color:white;"
                >
                    <el-table-column
                        prop="date"
                        label="日期"
                        width="180"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="姓名"
                        width="180"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        label="地址"
                    >
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>

</template>
<script>
export default {
  name: "EnergyData",
  data() {
    return {
      queryParams: {},
      data: [
        {
          label: "一级 1",
          children: [
            {
              label: "二级 1-1",
              children: [
                {
                  label: "三级 1-1-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1",
              children: [
                {
                  label: "三级 2-1-1"
                }
              ]
            },
            {
              label: "二级 2-2",
              children: [
                {
                  label: "三级 2-2-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 3",
          children: [
            {
              label: "二级 3-1",
              children: [
                {
                  label: "三级 3-1-1"
                }
              ]
            },
            {
              label: "二级 3-2",
              children: [
                {
                  label: "三级 3-2-1"
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ]
    };
  },
  created() {
    dashboard().then(res => {
      console.log(res);
    });
  },
  methods: {}
};
</script>

<style lang="scss">
@import "~@/assets/styles/common.scss";
.el-table::before {
  height: 0 !important;
}
.energyData-view {
  display: flex;
  height: 100%;
  .right-view {
    display: flex;
    flex-direction: column;
    margin: rem(15) rem(29) rem(0) rem(18);
    width: 100%;
    .top-view {
      width: 100%;
      padding: rem(15) rem(12);
      display: flex;
      justify-content: space-between;
      
      background: rgba(1, 68, 144, 0.5);
      margin-bottom: rem(11);
      .top-left-view{
            display: flex;
            align-items: center;
            height: 100%;
        }
        .top-right-view{
            @extend .top-left-view;
        }
      .item-view {
        display: flex;
        align-items: center;
        margin-left: rem(36);
        &:first-child {
          margin-left: 0;
        }
        a {
          font-size: rem(14);
          font-weight: 400;
          color: #cfdce6;
          margin-right: rem(24);
        }
        .input {
          width: rem(200);
        }
        
      }
    }
    .bottom-view {
      width: 100%;
      height: 100%;
      padding: rem(20) rem(14);
      display: flex;
      flex-direction: column;
      background: rgba(1, 68, 144, 0.5);
      .el-table {
        margin-top: rem(10);
        tr {
          background: none;
          &:hover td {
            background: rgba(255, 255, 255, 0.3);
          }
        }
        td {
          border: none;
        }
        th {
          background: #0260cd;
          color: white;
          border: none;
        }
      }
    }
  }
}
</style>
