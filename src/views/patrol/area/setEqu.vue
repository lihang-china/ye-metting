<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="98px">
      <el-form-item label="巡检区域编码">
        <el-input v-model="parea.pareaCode" :disabled="true" size="small" />
      </el-form-item>
      <el-form-item label="巡检区域名称">
        <el-input v-model="parea.pareaName" :disabled="true" size="small" />
      </el-form-item>
      <el-form-item label="设备编号" prop="equCode">
        <el-input
          v-model="queryParams.equCode"
          placeholder="请输入设备编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="设备名称" prop="equName">
        <el-input
          v-model="queryParams.equName"
          placeholder="请输入设备名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="success" icon="el-icon-plus" size="mini" @click="handleAdd">添加</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleRemove"
        >批量移除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="cardList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="设备编号" align="center" prop="equCode" />
      <el-table-column label="设备名称" align="center" prop="equName" />
      <el-table-column label="设备分类" align="center" prop="className" />
      <el-table-column label="所在区域 " align="center" prop="areaName" />
      <el-table-column
        label="设备使用状态 "
        align="center"
        prop="equStatus"
        :formatter="equStatusFormat"
      />
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleRemove(scope.row)"
          >移除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-box"
            @click="handleSelect(scope.row)"
          >选择设备巡检项</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <el-dialog :title="title" :visible.sync="open" width="1200px" :close-on-click-modal="false">
      <div class="app-container">
        <el-form :model="nqueryParams" ref="nqueryForm" :inline="true" label-width="68px">
          <el-form-item label="设备编号" prop="nequCode">
            <el-input
              v-model="nqueryParams.equCode"
              placeholder="请输入设备编号"
              clearable
              size="small"
              @keyup.enter.native="nhandleQuery"
            />
          </el-form-item>
          <el-form-item label="设备名称" prop="nequName">
            <el-input
              v-model="nqueryParams.equName"
              placeholder="请输入设备名称"
              clearable
              size="small"
              @keyup.enter.native="nhandleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="nhandleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="nresetQuery">重置</el-button>
            <el-button
              type="success"
              icon="el-icon-check"
              size="mini"
              :disabled="nmultiple"
              @click="handleSubmit"
            >确认</el-button>
          </el-form-item>
        </el-form>

        <el-table v-loading="nloading" :data="ncardList" @selection-change="nhandleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="设备编号" align="center" prop="equCode" />
          <el-table-column label="设备名称" align="center" prop="equName" />
          <el-table-column label="设备分类" align="center" prop="className" />
          <el-table-column label="所在区域 " align="center" prop="areaName" />
          <el-table-column
            label="设备使用状态 "
            align="center"
            prop="equStatus"
            :formatter="equStatusFormat"
          />
          <el-table-column label="创建时间" align="center" prop="createTime">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="ntotal>0"
          :total="ntotal"
          :page.sync="nqueryParams.pageNum"
          :limit.sync="nqueryParams.pageSize"
          @pagination="ngetList"
        />
      </div>
    </el-dialog>

    <el-dialog
      :title="select.title"
      :visible.sync="select.open"
      width="1000px"
      :close-on-click-modal="false"
    >
      <el-input
        :placeholder="select.placeholder"
        v-model="select.filter"
        style="width: 300px"
        size="small"
      ></el-input>
      <div style="height:560px; overflow: auto; margin-top:20px;">
        <el-tree
          :key="select.key"
          :data="select.options"
          show-checkbox
          default-expand-all
          :node-key="select.nodeKey"
          :props="select.props"
          :filter-node-method="filterSelect"
          :default-checked-keys="select.defaultChecked"
          ref="selectTree"
        >
          <span class="custom-tree-node" slot-scope="{ node }">
            <span>{{ node.label }} &nbsp;&nbsp;</span>
          </span>
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitSelect">确 定</el-button>
        <el-button @click="cancelSelect">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listByParea, listNoByParea } from "@/api/equipment/card";
import { getArea } from "@/api/patrol/area";
import { save, remove, add, getInfo } from "@/api/patrol/areaChildren";
import { listItem } from "@/api/patrol/item";

export default {
  name: "SetEqu",
  data() {
    return {
      //
      parea: {
        pareaId: undefined,
        pareaCode: undefined,
        pareaName: undefined,
      },
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 设备使用状态 字典
      equStatusOptions: [],
      // 遮罩层
      loading: true,
      // 弹出层 遮罩层
      ids: [],
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 设备档案表格数据
      cardList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        pareaId: undefined,
        equCode: undefined,
        equName: undefined,
      },
      // 弹出层 遮罩层
      nloading: true,
      // 弹出层 遮罩层
      nids: [],
      // 弹出层 非多个禁用
      nmultiple: true,
      // 弹出层 总条数
      ntotal: 0,
      // 弹出层 设备档案表格数据
      ncardList: [],
      // 弹出层 查询参数
      nqueryParams: {
        pageNum: 1,
        pageSize: 10,
        pareaId: undefined,
        equCode: undefined,
        equName: undefined,
      },
      //
      select: {},
      //
      equId: undefined,
    };
  },
  created() {
    const { pareaId } = this.$route.params;
    this.getDicts("equ_status_type").then((response) => {
      this.equStatusOptions = response.data;
    });
    getArea(pareaId).then((response) => {
      this.parea = response.data;
      this.getList();
    });
  },
  watch: {
    "select.filter": function (val, oldVal) {
      if (this.$refs.selectTree) {
        this.$refs.selectTree.filter(val);
      }
    },
  },
  methods: {
    // 设备使用状态 字典翻译
    equStatusFormat(row, column) {
      return this.selectDictLabel(this.equStatusOptions, row.equStatus);
    },
    //查询设备列表
    getList() {
      this.cardList = [];
      this.loading = true;
      this.queryParams.pareaId = this.parea.pareaId;
      listByParea(this.queryParams).then((response) => {
        this.cardList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.equId);
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true;
      this.title = "选择设备";
      this.ngetList();
    },
    /** 删除按钮操作 */
    handleRemove(row) {
      const equIds = row.equId || this.ids;
      this.$confirm("是否确定移除所选择的设备?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const loading = this.openLoading("正在移除设备,请稍候......");
        remove(this.parea.pareaId, equIds)
          .then((response) => {
            loading.close();
            if (response.code === 200) {
              this.msgSuccess("移除成功");
              this.getList();
            } else {
              this.msgError("移除失败");
            }
          })
          .catch(() => {
            loading.close();
            this.msgError("生成保养任务失败");
          });
      });
    },
    //查询设备列表
    ngetList() {
      this.ncardList = [];
      this.nloading = true;
      this.nqueryParams.pareaId = this.parea.pareaId;
      listNoByParea(this.nqueryParams).then((response) => {
        this.ncardList = response.rows;
        this.ntotal = response.total;
        this.nloading = false;
      });
    },
    /** 搜索按钮操作 */
    nhandleQuery() {
      this.nqueryParams.pageNum = 1;
    },
    /** 重置按钮操作 */
    nresetQuery() {
      this.resetForm("nqueryForm");
      this.nhandleQuery();
    },
    // 多选框选中数据
    nhandleSelectionChange(selection) {
      this.nids = selection.map((item) => item.equId);
      this.nmultiple = !selection.length;
    },
    handleSubmit() {
      add(this.parea.pareaId, this.nids).then((response) => {
        if (response.code === 200) {
          this.msgSuccess("添加成功");
          this.open = false;
          this.getList();
        } else {
          this.msgError(response.msg);
        }
      });
    },
    resetSelect() {
      this.select = {
        key: false,
        pareaId: undefined,
        title: undefined,
        open: false,
        placeholder: undefined,
        type: undefined,
        filter: undefined,
        options: [],
        nodeKey: undefined,
        props: undefined,
        defaultChecked: [],
      };
    },
    handleSelect(row) {
      this.equId = row.equId;

      this.resetSelect();

      getInfo(this.parea.pareaId, this.equId).then((response) => {
        const children = response.data;
        const checked = response.data.itemIds
          ? response.data.itemIds.split(",")
          : [];

        listItem({ pitemClass: "2" }).then((response) => {
          let data = this.handleTree(response.data, "pitemId", "parentId");
          this.select = {
            key: true,
            pareaId: this.parea.pareaId,
            title: "选取巡检项",
            open: true,
            placeholder: "请输入巡检项名称",
            type: "EI",
            options: data,
            nodeKey: "pitemId",
            props: {
              label: "pitemName",
            },
            defaultChecked: checked, //this.parea.itemIds,
          };
        });
      });
    },
    filterSelect(value, data, node) {
      if (!value) return true;
      return data.pitemName.indexOf(value) !== -1;
    },
    submitSelect() {
      let selectChecked = this.$refs.selectTree.getCheckedKeys();
      //console.log(selectChecked);
      let data = {
        pareaId: this.parea.pareaId,
        type: "EI",
        equId: this.equId,
        itemIds: selectChecked.join(","),
      };
      save(data).then((response) => {
        if (response.code === 200) {
          this.msgSuccess("保存成功");
          this.select.open = false;
          this.getList();
        } else {
          this.msgError(response.msg);
        }
      });
    },
    cancelSelect() {
      this.select.open = false;
      this.select.options = [];
    },
  },
};
</script>