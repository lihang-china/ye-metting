<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="98px">
      <el-form-item label="巡检区域编码" prop="pareaCode">
        <el-input v-model="queryParams.pareaCode" placeholder="请输入巡检区域编码" clearable size="small" />
      </el-form-item>
      <el-form-item label="巡检区域名称" prop="pareaName">
        <el-input v-model="queryParams.pareaName" placeholder="请输入巡检区域名称" clearable size="small" />
      </el-form-item>
      <el-form-item label="巡检区域状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择巡检区域状态" clearable size="small">
          <el-option label="启用" value="0"></el-option>
          <el-option label="停用" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['patrol:area:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['patrol:area:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['patrol:area:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['patrol:area:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-check"
          size="mini"
          :disabled="multiple"
          @click="handleStatus(undefined, '0')"
        >启用</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-close"
          size="mini"
          :disabled="multiple"
          @click="handleStatus(undefined, '1')"
        >停用</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="areaList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" width="60" />
      <el-table-column label="巡检区域编码" align="center" sortable prop="pareaCode" width="250" />
      <el-table-column label="巡检区域名称" align="center" sortable prop="pareaName" width="250" />
      <el-table-column label="创建时间" align="center" sortable prop="createTime" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="200">
        <template slot-scope="scope">{{ scope.row.status === '1'? "停用" : "启用" }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <div v-if="scope.row.status === '1'">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['patrol:area:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['patrol:area:remove']"
            >删除</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-box"
              @click="handleSelect(scope.row, 'EN')"
            >选择环境巡检项</el-button>
            <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-s-order"
            @click="handleSelect(scope.row, 'E')"
            >选择巡检设备</el-button>-->
            <el-button
              size="mini"
              type="text"
              icon="el-icon-s-order"
              @click="handleEqu(scope.row)"
            >选择巡检设备</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-check"
              @click="handleStatus(scope.row, '0')"
            >启用</el-button>
          </div>
          <div v-else>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-box"
              @click="handleItem(scope.row)"
            >查看环境巡检项</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-s-order"
              @click="handleEquView(scope.row)"
            >查看巡检设备</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-close"
              @click="handleStatus(scope.row, '1')"
            >停用</el-button>
          </div>
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

    <!-- 添加或修改巡检区域对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="108px">
        <el-form-item label="巡检区域编码" prop="pareaCode">
          <el-input v-model="form.pareaCode" placeholder="请输入巡检区域编码" />
        </el-form-item>
        <el-form-item label="巡检区域名称" prop="pareaName">
          <el-input v-model="form.pareaName" placeholder="请输入巡检区域名称" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
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
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }} &nbsp;&nbsp;</span>
            <span v-if="select.type === 'E'">{{ data.equCode }}&nbsp;&nbsp;{{ data.areaName }}</span>
          </span>
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitSelect">确 定</el-button>
        <el-button @click="cancelSelect">取 消</el-button>
      </div>
    </el-dialog>

    <ItemView
      v-if="isShowI"
      :title="titleI"
      :isShow.sync="isShowI"
      :pareaId="pareaIdI"
      :key="viewKeyI"
    />

    <EquipmentView
      v-if="isShowE"
      :title="titleE"
      :isShow.sync="isShowE"
      :pareaId="pareaIdE"
      :key="viewKeyE"
    />
  </div>
</template>

<script>
import {
  listArea,
  getArea,
  delArea,
  addArea,
  updateArea,
  exportArea,
  changeAreaStatus,
} from "@/api/patrol/area";
import { listCard } from "@/api/equipment/card";
import { listItem } from "@/api/patrol/item";
import { save } from "@/api/patrol/areaChildren";
import ItemView from "@/views/components/patrol/ItemView";
import EquipmentView from "@/views/components/patrol/EquipmentView";

export default {
  name: "Area",
  components: {
    ItemView,
    EquipmentView,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 巡检区域表格数据
      areaList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        pareaCode: undefined,
        pareaName: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        pareaCode: [
          { required: true, message: "请输入巡检区域编码", trigger: "blur" },
        ],
        pareaName: [
          { required: true, message: "请输入巡检区域名称", trigger: "blur" },
        ],
      },
      //
      select: {},
      //
      isShowI: false,
      pareaIdI: undefined,
      titleI: false,
      viewKeyI: +new Date(),
      //
      isShowE: false,
      pareaIdE: undefined,
      titleE: false,
      viewKeyE: +new Date(),
    };
  },
  created() {
    this.getList();
  },
  watch: {
    "select.filter": function (val, oldVal) {
      if (this.$refs.selectTree) {
        this.$refs.selectTree.filter(val);
      }
    },
  },
  methods: {
    /** 查询巡检区域列表 */
    getList() {
      this.loading = true;
      listArea(this.queryParams).then((response) => {
        this.areaList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 表单重置
    reset() {
      this.form = {
        pareaId: undefined,
        pareaGuid: undefined,
        pareaCode: undefined,
        pareaName: undefined,
        pareaScan: undefined,
        status: undefined,
        remark: undefined,
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
      };
      this.resetForm("form");
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
      this.ids = selection.map((item) => item.pareaId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加巡检区域";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const pareaId = row.pareaId || this.ids;
      getArea(pareaId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改巡检区域";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.pareaId != undefined) {
            updateArea(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addArea(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const pareaIds = row.pareaId || this.ids;
      this.$confirm("是否确认删除选中的巡检区域", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const loading = this.openLoading();
        delArea(pareaIds)
          .then((response) => {
            loading.close();
            if (response.code === 200) {
              this.msgSuccess("删除成功");
              this.getList();
            } else {
              this.msgError(response.msg);
            }
          })
          .catch(() => {
            loading.close();
          });
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有巡检区域数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportArea(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
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
    handleSelect(row, type) {
      const pareaId = row.pareaId;
      getArea(pareaId).then((response) => {
        let parea = response.data;

        this.resetSelect();
        this.select.pareaId = parea.pareaId;
        this.select.type = type;

        if (type === "EN") {
          listItem({ pitemClass: "1" }).then((response) => {
            let data = this.handleTree(response.data, "pitemId", "parentId");
            this.select = {
              key: true,
              pareaId: parea.pareaId,
              title: "选取巡检项",
              open: true,
              placeholder: "请输入巡检项名称",
              type: type,
              options: data,
              nodeKey: "pitemId",
              props: {
                label: "pitemName",
              },
              defaultChecked: parea.itemIds,
            };
          });
        } else if (type === "E") {
          listCard().then((response) => {
            let data = {
              equId: 0,
              equName: "巡检设备",
              equCode: "",
              children: [],
            };
            data.children = response.rows;
            this.select = {
              key: true,
              pareaId: parea.pareaId,
              title: "选取巡检设备",
              open: true,
              placeholder: "请输入设备编码或名称",
              type: type,
              options: [],
              nodeKey: "equId",
              props: {
                label: "equName",
              },
              defaultChecked: parea.equIds,
            };
            this.select.options.push(data);
          });
        }
      });
    },
    filterSelect(value, data, node) {
      if (!value) return true;
      if (this.select.type === "E") {
        return (
          data.equName.indexOf(value) !== -1 ||
          data.equCode.indexOf(value) !== -1
        );
      } else {
        return data.pitemName.indexOf(value) !== -1;
      }
    },
    submitSelect() {
      let selectChecked = this.$refs.selectTree.getCheckedKeys();
      //console.log(selectChecked);
      let data = {
        pareaId: this.select.pareaId,
        type: this.select.type,
        equIds: this.select.type === "E" ? selectChecked : null,
        itemIds: this.select.type === "EN" ? selectChecked.join(",") : "",
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
    handleEqu(row) {
      const { pareaId } = row;
      this.$router.push({ name: "SetEqu", params: { pareaId: pareaId } });
    },
    handleStatus(row, status) {
      const pareaIds = row ? row.pareaId : this.ids;
      let text = status === "0" ? "启用" : "停用";
      this.$confirm("是否确认" + text + "选中的巡检区域", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const loading = this.openLoading(
          "正在" + text + "巡检任务,请稍候......"
        );
        changeAreaStatus(pareaIds, status)
          .then((response) => {
            loading.close();
            if (response.code === 200) {
              this.msgSuccess(text + "成功!");
              this.getList();
            } else {
              this.msgError(text + "失败!");
            }
          })
          .catch(() => {
            loading.close();
          });
      });
    },
    handleItem(row) {
      this.isShowI = true;
      this.pareaIdI = row.pareaId;
      this.titleI = row.pareaName + " - 环境巡检项";
      this.viewKeyI = +new Date();
    },
    handleEquView(row) {
      this.isShowE = true;
      this.pareaIdE = row.pareaId;
      this.titleE = row.pareaName + " - 巡检设备";
      this.viewKeyE = +new Date();
    },
  },
};
</script>