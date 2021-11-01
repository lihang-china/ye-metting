<template>
  <div class="serviceArea-view">
    <div class="right-view">
      <div class="top-view">
        <div class="item-view">
          <a>区域编码</a>
          <el-input
            class="input"
            v-model="queryParams.areaCode"
            placeholder="请输入区域编码"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </div>
        <div class="item-view">
          <a>区域名称</a>
          <el-input
            v-model="queryParams.areaName"
            placeholder="请输入区域名称"
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
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd()"
            >新增</el-button
          >
        </div>
      </div>
      <div class="bottom-view">
        <el-table
          ref="multipleTable"
          border
          row-key="id"
          :data="areaList"
          tooltip-effect="dark"
          default-expand-all
          style="width: 100%; background: none; color: white"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column prop="areaCode" label="区域编码" />
          <el-table-column prop="areaName" label="区域名称" />
          <el-table-column prop="persons" label="区域人数" />
          <el-table-column prop="area" label="区域面积" />
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-if="scope.row.id != 1"
                >修改</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-if="scope.row.id != 1"
                >删除</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-setting"
                @click="handleSet(scope.row)"
                v-if="scope.row.id != 1"
                >区域设置</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <AreaForm ref="formArea" />
  </div>
</template>

<script>
import AreaForm from "./add";
import { listArea, delArea } from "@/api/energy/basic/area";

export default {
  name: "EnergyDepartment",
  components: { AreaForm },
  data() {
    return {
      loading: true,
      queryParams: {
        areaCode: undefined,
        areaName: undefined,
      },
      areaList: [],
      areaOptions: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      listArea(this.queryParams).then((response) => {
        this.areaList = this.handleTree(response.data, "id", "parentId");
        this.loading = false;
      });
    },
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.areaCode = undefined;
      this.queryParams.areaName = undefined;

      this.handleQuery();
    },
    handleAdd() {
      const _this = this.$refs.formArea;
      listArea().then((response) => {
        this.areaOptions = this.handleTree(response.data, "id", "parentId");
        _this.areaOptions = this.areaOptions;
        _this.form = {
          id: undefined,
          areaCode: undefined,
          areaName: undefined,
          parentId: undefined,
          sort: undefined,
          persons: undefined,
          area: undefined,
          remark: undefined,
        };
        _this.dialog = true;
      });
    },
    handleUpdate(row) {
      const _this = this.$refs.formArea;
      listArea().then((response) => {
        this.areaOptions = this.handleTree(response.data, "id", "parentId");
        _this.areaOptions = this.areaOptions;
        _this.form = { ...row };
        _this.dialog = true;
      });
    },
    handleDelete(row) {
      let arr = [];

      // if (this.multipleSelection.length > 0) {
      //   this.multipleSelection.forEach((e) => {
      //     arr.push(delArea(e.id));
      //   });
      arr.push(delArea(row.id));
      Promise.all(arr).then((res) => {
        this.msgSuccess("删除成功");
        //this.data = [];
        this.getList();
      });
      // }
    },
    handleSet(row) {
      this.$router.push({ name: "AreaSet", params: { areaId: row.id } });
    },
  },
};
</script>

<style lang="scss">
@import "~@/assets/styles/common.scss";

.el-table::before {
  height: 0 !important;
}
.serviceArea-view {
  display: flex;
  width: 100%;
  height: 100%;
  overflow-y: hidden;
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
