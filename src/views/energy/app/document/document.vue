<template>
  <div class="document-view">
    <div class="menu-view">
      <div
        class="item-view"
        :class="{ active: queryParams.nhType == 1 }"
        @click="
          queryParams.nhType = 1;
          getList();
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
          getList();
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
          getList();
        "
      >
        <img src="@/assets/image/energy/air.png" />
        <a>气</a>
      </div>
    </div>

    <div class="left-view">
      <div class="top-view">
        <img src="@/assets/image/tree.png" />
        <a>服务区域族</a>
      </div>
      <div class="content-view">
        <el-tree
          class="tree-view"
          :data="data"
          :props="defaultProps"
          :default-expand-all="true"
          @node-click="handleNodeClick"
          style="color: white; font-size: 20px; background: none"
          highlight-current
        ></el-tree>
      </div>
    </div>

    <div class="right-view">
      <div class="top-view">
        <div class="item-view">
          <a>设备编码</a>
          <el-input
            class="input"
            v-model="queryParams.equCode"
            placeholder="请输入你要搜索的设备编码"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </div>
        <div class="item-view">
          <a>设备名称</a>
          <el-input
            v-model="queryParams.equName"
            placeholder="请输入你要搜索的设备名称"
            clearable
            size="small"
            style="width: 240px"
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
        <el-table
          ref="multipleTable"
          :data="tableData"
          border
          tooltip-effect="dark"
          style="width: 100%; background: none; color: white"
        >
          <el-table-column prop="equCode" label="设备编码" />
          <el-table-column prop="equName" label="设备名称" />
          <el-table-column prop="areaName" label="安装区域" />
          <el-table-column prop="deptName" label="所属部门" />
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
import { collectList } from "@/api/energy/app/collect";
import { handleTree } from "@/utils/ruoyi";
import { listArea } from "@/api/energy/basic/area";
//import { categoryTreeselect } from "@/api/device/category";
import { treeListClass } from "@/api/equipment/class";
//import { listDevice } from "@/api/device/device";
import { listNhSetting } from "@/api/equipment/card";

export default {
  name: "Document",
  data() {
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        nhType: undefined,
        equCode: undefined,
        equName: undefined,
      },
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
    this.getAreaList();
    this.getList();
  },
  methods: {
    getAreaList() {
      listArea().then((res) => {
        if (this.data.length == 0) {
          this.data = handleTree(res.data, "id", "parentId");
        }
      });
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.areaId = data.id;
      this.getList();
    },
    handleQuery() {
      this.resetList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.deviceName = undefined;
      this.queryParams.deviceCode = undefined;
      this.handleQuery();
    },
    getList() {
      listNhSetting(this.queryParams).then((res) => {
        this.tableData = res.rows;
        this.total = res.total;
      });
    },
  },
};
</script>

<style lang="scss">
@import "~@/assets/styles/common.scss";

.el-table::before {
  height: 0 !important;
}
.document-view {
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
