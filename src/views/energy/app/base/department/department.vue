<template>
  <div class="department-view">
    <div class="right-view">
      <div class="top-view">
        <div class="item-view">
          <a>部门编码</a>
          <el-input
            class="input"
            v-model="queryParams.code"
            placeholder="请输入部门编码"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </div>
        <div class="item-view">
          <a>部门名称</a>
          <el-input
            v-model="queryParams.name"
            placeholder="请输入部门名称"
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
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd()"
              >新增</el-button
            >
          </el-col>
        </el-row>

        <el-table
          ref="multipleTable"
          border
          row-key="id"
          :data="deptList"
          tooltip-effect="dark"
          default-expand-all
          style="width: 100%; background: none; color: white"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column prop="code" label="部门编码" />
          <el-table-column prop="name" label="部门名称" />
          <el-table-column prop="persons" label="部门人数" />
          <el-table-column prop="area" label="部门面积" />
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
    <DeptFrom ref="formDept" />
  </div>
</template>

<script>
import DeptFrom from "./add";
import { listDept, delDept } from "@/api/energy/basic/dept";

export default {
  name: "EnergyDepartment",
  components: { DeptFrom },
  data() {
    return {
      loading: true,
      queryParams: {
        code: undefined,
        name: undefined,
      },
      deptList: [],
      deptOptions: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      listDept(this.queryParams).then((response) => {
        this.deptList = this.handleTree(response.data, "id", "pid");
        this.loading = false;
      });
    },
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.code = undefined;
      this.queryParams.name = undefined;

      this.handleQuery();
    },
    handleAdd() {
      const _this = this.$refs.formDept;
      listDept().then((response) => {
        this.deptOptions = this.handleTree(response.data, "id", "pid");
        _this.deptOptions = this.deptOptions;
        _this.form = {
          id: undefined,
          code: undefined,
          name: undefined,
          pid: undefined,
          sort: undefined,
          peopleNum: undefined,
          area: undefined,
          remark: undefined,
        };
        _this.dialog = true;
      });
    },
    handleUpdate(row) {
      const _this = this.$refs.formDept;
      listDept().then((response) => {
        this.deptOptions = this.handleTree(response.data, "id", "pid");
        _this.deptOptions = this.deptOptions;
        _this.form = { ...row };
        _this.dialog = true;
      });
    },
    handleDelete(row) {
      let arr = [];

      // if (this.multipleSelection.length > 0) {
      //   this.multipleSelection.forEach((e) => {
      //     arr.push(delDept(e.id));
      //   });
      arr.push(delDept(row.id));
      Promise.all(arr).then((res) => {
        this.msgSuccess("删除成功");
        //this.data = [];
        this.getList();
      });
      // }
    },
    handleSet(row) {
      this.$router.push({ name: "DeptSet", params: { deptId: row.id } });
    },
  },
};
</script>

<style lang="scss">
@import "~@/assets/styles/common.scss";

.el-table::before {
  height: 0 !important;
}
.department-view {
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
