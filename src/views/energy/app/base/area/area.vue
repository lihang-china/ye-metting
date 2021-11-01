<template>
  <div class="areaConfig-view">
    <div class="menu-view">
      <div
        class="item-view"
        :class="{ active: queryParams.nhType == 1 }"
        @click="
          queryParams.nhType = 1;
          resetList();
        "
      >
        <img src="@/assets/image/energy/electric.png" />
        <a>电</a>
      </div>
      <div
        class="item-view"
        :class="{ active: queryParams.nhType == 2 }"
        @click="
          queryParams.nhType = 2;
          resetList();
        "
      >
        <img src="@/assets/image/energy/water.png" />
        <a>水</a>
      </div>
      <div
        class="item-view"
        :class="{ active: queryParams.nhType == 3 }"
        @click="
          queryParams.nhType = 3;
          resetList();
        "
      >
        <img src="@/assets/image/energy/air.png" />
        <a>气</a>
      </div>
    </div>

    <div class="left-view">
      <div class="top-view">
        <img src="@/assets/image/tree.png" />
        <a>区域族</a>
      </div>

      <div class="content-view">
        <el-tree
          class="tree-view"
          :data="data"
          :props="defaultProps"
          @node-click="handleNodeClick"
          style="color: white; font-size: 20px; background: none"
          highlight-current
        ></el-tree>
      </div>
    </div>

    <div class="right-view">
      <div class="top-view">
        <div class="item-view">
          <a>区域编码</a>
          <el-input
            class="input"
            v-model="queryParams.areaCode"
            placeholder="请输入你要搜索的区域编码"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </div>
        <div class="item-view">
          <a>区域名称</a>
          <el-input
            class="input"
            v-model="queryParams.areaName"
            placeholder="请输入你要搜索的区域名称"
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
            >查询</el-button
          >
          <el-button
            class="filter-item"
            icon="el-icon-refresh"
            size="mini"
            @click="resetQuery"
            >重置</el-button
          >
        </div>
      </div>

      <div class="bottom-view">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="add()"
              >新增</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" icon="el-icon-edit" size="mini"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini"
              >删除</el-button
            >
          </el-col>
        </el-row>

        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          border
          style="width: 100%; background: none; color: white"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="areaCode" label="区域编码" />
          <el-table-column prop="areaName" label="区域全称" />
          <el-table-column label="下级生成" width="100">
            <template slot-scope="scope">
              {{ scope.row.isSum == 1 ? "是" : "否" }}
            </template>
          </el-table-column>
          <el-table-column
            prop="description"
            label="能耗配置描述"
            show-overflow-tooltip
          />
        </el-table>

        <pagination
          style="background: none"
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { listArea } from "@/api/energy/basic/area";
import { list } from "@/api/energy/app/areaConfig";
import { handleTree } from "@/utils/ruoyi";

export default {
  name: "EnergyAreaConfig",
  data() {
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        //电水气能量
        nhType: 1,
        areaCode: undefined,
        areaName: undefined,
      },
      id: null,
      total: 0,
      data: [],
      defaultProps: {
        children: "children",
        label: "areaName",
      },
      allData: [],
      tableData: [],
      multipleSelection: [],
    };
  },
  created() {
    this.initData();
  },
  methods: {
    add() {
      this.$router.push({
        path: "/energy-app/base/area/add",
        query: {
          nhType: this.queryParams.nhType,
          id: this.id,
        },
      });
    },
    handleQuery() {
      this.resetList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      (this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        //电水气能量
        nhType: 1,
        areaCode: undefined,
        areaName: undefined,
      }),
        this.handleQuery();
    },
    parentName(id) {
      let res = this.allData.find((e) => e.id == id);
      if (res) {
        return res.areaName || "";
      }
      return "";
    },
    initData() {
      listArea().then((res) => {
        this.allData = res.data;
        if (this.data.length == 0) {
          this.data = handleTree(res.data, "id", "parentId");
        }
        this.getList();
      });
    },
    resetList() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    getList() {
      list(this.queryParams).then((res) => {
        this.total = res.total;
        this.tableData = res.rows;
        console.log("collectList", res);
      });
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleNodeClick(data) {
      console.log(data);
    },
  },
};
</script>

<style lang="scss">
@import "~@/assets/styles/common.scss";

.el-table::before {
  height: 0 !important;
}
.areaConfig-view {
  display: flex;
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  .menu-view {
    width: rem(74);
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: rem(13);
    background: #051413;
    .item-view {
      width: rem(40);
      margin-bottom: rem(12);
      height: rem(120);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: rem(29);
      color: white;
      font-size: bold;
      cursor: pointer;
      border-radius: 2px;
      background: linear-gradient(0deg, #3e77c4, #8eb3e8);
      img {
        width: rem(20);
        height: rem(36);
        margin-bottom: rem(16);
      }
    }
    .active {
      background: linear-gradient(0deg, #0066ff, #00c6ff);
    }
  }
  .left-view {
    width: rem(360);
    height: 100%;
    background: #051413;
    .top-view {
      height: rem(30);
      width: 100%;
      display: flex;
      align-items: center;
      padding-left: rem(51);
      background: #031d4f;
      img {
        width: rem(14);
        height: rem(16);
        margin-right: rem(8);
      }
      a {
        font-size: rem(14);
        font-weight: 400;
        color: #cfdce6;
      }
    }
    .content-view {
      padding-left: rem(41);
      padding-bottom: rem(41);
      color: white;
      background: none;
      overflow-y: auto;
      height: 100%;
      .el-tree-node__content:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
      .el-tree-node.is-current > .el-tree-node__content {
        background-color: rgba(255, 255, 255, 0.2) !important;
      }
    }
  }
  .right-view {
    display: flex;
    flex-direction: column;
    margin: rem(15) rem(29) rem(0) rem(18);
    padding-bottom: rem(20);
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    .top-view {
      width: 100%;
      padding: rem(15) rem(12);
      display: flex;
      align-items: center;
      background: rgba(1, 68, 144, 0.5);
      margin-bottom: rem(11);
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
          width: rem(300);
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
      .el-table--border {
        border: none;
        border-top: 1px solid #2a5e96;
        &::after {
          width: 0;
        }
      }
      .el-table {
        margin-top: rem(10);

        tr {
          background: none;
          &:hover td {
            background: rgba(255, 255, 255, 0.3);
          }
          td {
            &:first-child {
              border-left: 1px solid #2a5e96;
            }
          }
        }
        td {
          // border: none;
          border-color: #2a5e96;
        }
        th {
          background: rgba(2, 96, 204, 0.6);
          color: white;
          border-color: #2a5e96;
          &:first-child {
            border-left: 1px solid #2a5e96;
          }
        }
      }
    }
  }
}
</style>
