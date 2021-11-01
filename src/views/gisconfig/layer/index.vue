<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="98px"
    >
      <el-form-item label="JS图层编码" prop="layerCodeJs">
        <el-input
          v-model="queryParams.layerCodeJs"
          placeholder="请输入JS图层编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="JS图层名" prop="layerNameJs">
        <el-input
          v-model="queryParams.layerNameJs"
          placeholder="请输入JS图层名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="GIS图层编码" prop="layerCodeGis">
        <el-input
          v-model="queryParams.layerCodeGis"
          placeholder="请输入GIS图层编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['gis:layer:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['gis:layer:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['gis:layer:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['gis:layer:export']"
          >导出</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="layerList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="JS图层编码" align="left" prop="layerCodeJs" />
      <el-table-column label="JS图层名" align="left" prop="layerNameJs" />
      <el-table-column label="GIS图层编码" align="left" prop="layerCodeGis" />
      <el-table-column
        label="含有系统分类"
        align="left"
        prop="systemNames"
        show-overflow-tooltip
      />
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
            v-hasPermi="['gis:layer:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['gis:layer:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改GIS图层管理对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="108px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="JS图层编码" prop="layerCodeJs">
              <el-input
                v-model="form.layerCodeJs"
                placeholder="请输入JS图层编码"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="JS图层名" prop="layerNameJs">
              <el-input
                v-model="form.layerNameJs"
                placeholder="请输入JS图层名"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="GIS图层编码" prop="layerCodeGis">
              <el-input
                v-model="form.layerCodeGis"
                placeholder="请输入GIS图层编码"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="含有系统分类" prop="systemIds">
              <el-cascader
                v-model="form.systemIds"
                :options="ruleOptions"
                :props="cascaderProps"
                placeholder="请选择含有系统分类"
                collapse-tags
                clearable
                style="width: 100%"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-tabs type="border-card" activeName="first">
              <el-tab-pane label="单击事件" name="first" select="tr">
                <el-row>
                  <el-col
                    :span="22"
                    style="height: 50px; margin-top: 10px; margin-left: 45px"
                  >
                    <el-switch
                      style="display: block"
                      v-model="form.clickEvent"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      :active-value="activeValue"
                      :inactive-value="inactiveValue"
                      active-text="开"
                      inactive-text="关"
                      @change="clickEventChange"
                    >
                    </el-switch>
                  </el-col>
                </el-row>
                <template v-if="clickShow">
                  <el-row>
                    <el-col :span="11">
                      <el-form-item label="点击方法" prop="clickFunction">
                        <el-input
                          v-model="form.clickFunction"
                          placeholder="请输入点击方法"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="11">
                      <el-form-item label="弹窗标题" prop="clickWindowTitle">
                        <el-input
                          v-model="form.clickWindowTitle"
                          placeholder="请输入弹窗标题"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="11">
                      <el-form-item label="弹窗宽度" prop="clickWindowW">
                        <el-input
                          v-model="form.clickWindowW"
                          placeholder="请输入弹窗宽度"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="11">
                      <el-form-item label="弹窗高度" prop="clickWindowH">
                        <el-input
                          v-model="form.clickWindowH"
                          placeholder="请输入弹窗高度"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </template>
              </el-tab-pane>
              <el-tab-pane label="框选事件" name="second">
                <el-row>
                  <el-col
                    :span="22"
                    style="height: 50px; margin-top: 10px; margin-left: 45px"
                  >
                    <el-switch
                      style="display: block"
                      v-model="form.circleEvent"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      :active-value="activeValue"
                      :inactive-value="inactiveValue"
                      active-text="开"
                      inactive-text="关"
                      @change="circleEventChange"
                    >
                    </el-switch>
                  </el-col>
                </el-row>
                <template v-if="circleShow">
                  <el-row>
                    <el-col :span="11">
                      <el-form-item label="框选方法" prop="circleFunction">
                        <el-input
                          v-model="form.circleFunction"
                          placeholder="请输入框选调用方法"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="11">
                      <el-form-item label="弹窗标题" prop="circleWindowTitle">
                        <el-input
                          v-model="form.circleWindowTitle"
                          placeholder="请输入弹窗标题"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="11">
                      <el-form-item label="弹窗宽度" prop="circleWindowW">
                        <el-input
                          v-model="form.circleWindowW"
                          placeholder="请输入弹窗宽度"
                        />
                      </el-form-item>
                    </el-col>
                    <el-col :span="11">
                      <el-form-item label="弹窗高度" prop="circleWindowH">
                        <el-input
                          v-model="form.circleWindowH"
                          placeholder="请输入弹窗高度"
                        />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </template>
              </el-tab-pane>
              <el-tab-pane label="飘窗事件" name="third">
                <el-row>
                  <el-col
                    :span="22"
                    style="height: 50px; margin-top: 10px; margin-left: 45px"
                  >
                    <el-switch
                      style="display: block"
                      v-model="form.pop"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      :active-value="activeValue"
                      :inactive-value="inactiveValue"
                      active-text="开"
                      inactive-text="关"
                      @change="popEventChange"
                    >
                    </el-switch>
                  </el-col>
                </el-row>
                <el-row v-show="popShow">
                  <el-col :span="11">
                    <el-form-item label="弹窗宽度" prop="popWindowW">
                      <el-input
                        v-model="form.popWindowW"
                        placeholder="请输入弹窗宽度"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="弹窗高度" prop="popWindowH">
                      <el-input
                        v-model="form.popWindowH"
                        placeholder="请输入弹窗高度"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listLayer,
  getLayer,
  delLayer,
  addLayer,
  updateLayer,
  exportLayer,
} from "@/api/gis/layer";
//import { treeListRule } from "@/api/gis/rule";
import { treeListClass as treeListRule } from "@/api/equipment/class";

export default {
  name: "Layer",
  data() {
    return {
      // 统一宽度
      width: "350px",
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
      // GIS图层管理表格数据
      layerList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        layerCodeJs: undefined,
        layerNameJs: undefined,
        layerCodeGis: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        layerCodeJs: [
          { required: true, message: "请输入JS图层编码", trigger: "blur" },
        ],
        layerNameJs: [
          { required: true, message: "请输入JS图层名", trigger: "blur" },
        ],
        layerCodeGis: [
          { required: true, message: "请输入GIS图层编码", trigger: "blur" },
        ],
        systemIds: [
          { required: true, message: "请选择含有系统分类", trigger: "blur" },
        ],
      },
      // 系统分类
      ruleOptions: [],
      // 联集选择结构
      cascaderProps: {
        emitPath: false,
        multiple: true,
        value: "id",
      },
      activeValue: 1,
      inactiveValue: 0,
      clickShow: false,
      circleShow: false,
      popShow: false,
    };
  },
  created() {
    this.getList();
    this.getRuleList();
  },
  methods: {
    /** 查询GIS图层管理列表 */
    getList() {
      this.loading = true;
      listLayer(this.queryParams).then((response) => {
        this.layerList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 获取系统命名规约
    getRuleList() {
      treeListRule().then((response) => {
        this.ruleOptions = [];
        this.ruleOptions = response.data;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        layerCodeJs: undefined,
        layerCodeGis: undefined,
        layerNameJs: undefined,
        systemIds: undefined,
        clickEvent: 0,
        clickFunction: undefined,
        clickWindowW: undefined,
        clickWindowH: undefined,
        clickWindowTitle: undefined,
        circleEvent: 0,
        circleFunction: undefined,
        circleWindowW: undefined,
        circleWindowH: undefined,
        circleWindowTitle: undefined,
        pop: 0,
        popWindowW: undefined,
        popWindowH: undefined,
        clickFlashW: undefined,
        clickFlashH: undefined,
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
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加GIS图层";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getLayer(id).then((response) => {
        this.form = response.data;
        this.form.systemIds = this.form.systemIds.split(",");
        if (this.form.clickEvent == 1) {
          this.clickShow = true;
        }
        if (this.form.circleEvent == 1) {
          this.circleShow = true;
        }
        if (this.form.pop == 1) {
          this.popShow = true;
        }
        this.open = true;
        this.title = "修改GIS图层";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateLayer({
              ...this.form,
              systemIds: this.form.systemIds.join(","),
            }).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addLayer({
              ...this.form,
              systemIds: this.form.systemIds.join(","),
            }).then((response) => {
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
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除GIS图层编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delLayer(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有GIS图层数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportLayer(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
    /** 处理单击事件开关 */
    clickEventChange(o, id) {
      if (o == 1) {
        this.clickShow = true;
      } else {
        this.clickShow = false;
      }
    },
    /** 处理框选事件开关 */
    circleEventChange(o, id) {
      if (o == 1) {
        this.circleShow = true;
      } else {
        this.circleShow = false;
      }
    },
    /** 处理飘窗事件开关 */
    popEventChange(o, id) {
      if (o == 1) {
        this.popShow = true;
      } else {
        this.popShow = false;
      }
    },
  },
};
</script>