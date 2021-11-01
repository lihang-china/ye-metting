<template>
  <div class="project-view">
    <div class="right-view">
      <div class="top-view">
        <div class="item-view">
          <a>分项编码</a>
          <el-input
            class="input"
            v-model="queryParams.code"
            placeholder="请输入你要搜索的分项编码"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </div>
        <div class="item-view">
          <a>分项名称</a>
          <el-input
            class="input"
            v-model="queryParams.name"
            placeholder="请输入你要搜索的分项名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </div>
        <div class="item-view">
          <a>标准编码</a>
          <el-input
            class="input"
            v-model="queryParams.standardCode"
            placeholder="请输入你要搜索的标准编码"
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
              @click="handleAdd()"
              >新增</el-button
            >
          </el-col>
        </el-row>

        <el-table
          ref="multipleTable"
          border
          row-key="code"
          :data="itemList"
          tooltip-effect="dark"
          default-expand-all
          style="width: 100%; background: none; color: white"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column prop="code" label="分项编码" />
          <el-table-column prop="name" label="分项名称" />
          <el-table-column prop="standardCode" label="标准编码" />
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
                >修改</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <ItemForm ref="formItem" />
  </div>
</template>

<script>
import ItemForm from "./add";
import { listItem, delItem } from "@/api/energy/basic/item";

export default {
  name: "EnergyProject",
  components: { ItemForm },
  data() {
    return {
      loading: true,
      queryParams: {
        standardCode: undefined,
        code: undefined,
        name: undefined,
      },
      itemList: [],
      itemOptions: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      listItem(this.queryParams).then((response) => {
        this.itemList = this.handleTree(
          response.data,
          "code",
          "parentCode",
          "children",
          "0"
        );
        this.loading = false;
      });
    },
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.standardCode = undefined;
      this.queryParams.code = undefined;
      this.queryParams.name = undefined;

      this.handleQuery();
    },
    handleAdd() {
      const _this = this.$refs.formItem;
      listItem().then((response) => {
        this.itemOptions = this.handleTree(
          response.data,
          "code",
          "parentCode",
          "children",
          "0"
        );
        const data = { code: "0", name: "顶级节点", children: [] };
        data.children = this.itemOptions;
        _this.itemOptions = [];
        _this.itemOptions.push(data);

        _this.form = {
          id: undefined,
          code: undefined,
          name: undefined,
          parentCode: undefined,
          standardCode: undefined,
          nhType: undefined,
          remark: undefined,
        };
        _this.dialog = true;
      });
    },
    handleUpdate(row) {
      const _this = this.$refs.formItem;
      listItem().then((response) => {
        this.itemOptions = this.handleTree(
          response.data,
          "code",
          "parentCode",
          "children",
          "0"
        );
        const data = { code: "0", name: "顶级节点", children: [] };
        data.children = this.itemOptions;
        _this.itemOptions = [];
        _this.itemOptions.push(data);

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
      arr.push(delItem(row.id));
      Promise.all(arr).then((res) => {
        this.msgSuccess("删除成功");
        //this.data = [];
        this.getList();
      });
      // }
    },
  },
};
</script>

<style lang="scss">
@import "~@/assets/styles/common.scss";
.el-table::before {
  height: 0 !important;
}
.project-view {
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
      &:first-child {
        background: linear-gradient(0deg, #0066ff, #00c6ff);
        border-radius: 2px;
      }
      &:nth-child(2) {
        background: linear-gradient(0deg, #3e77c4, #8eb3e8);
        border-radius: 2px;
      }
      img {
        width: rem(20);
        height: rem(36);
        margin-bottom: rem(16);
      }
    }
  }
  .left-view {
    width: rem(360);
    height: 100%;
    background: rgba(1, 28, 82, 0.8);
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
      justify-content: start;
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
