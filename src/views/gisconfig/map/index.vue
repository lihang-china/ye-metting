<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="图层模式" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择图层模式"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
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
          v-hasPermi="['gis:map:add']"
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
          v-hasPermi="['gis:map:edit']"
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
          v-hasPermi="['gis:map:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['gis:map:export']"
          >导出</el-button
        >
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="mapList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column
        label="图层模式"
        align="left"
        prop="type"
        :formatter="typeFormat"
      />
      <el-table-column label="区域编码" align="left" prop="areaCode" />
      <el-table-column label="区域名称" align="left" prop="areaName" />
      <!-- <el-table-column label="初始区域" align="left" prop="buildName" />
      <el-table-column label="初始楼层" align="left" prop="floorName" /> -->
      <el-table-column label="底层地图" align="left" prop="baseLayer" />
      <el-table-column label="初始层级" align="left" prop="initlevel" />
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
            v-hasPermi="['gis:map:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['gis:map:remove']"
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

    <!-- 添加或修改GIS地图管理对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="980px"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="108px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="参照其他地图">
              <el-select
                v-model="copyMapId"
                placeholder="请选择参照地图"
                :style="{ width: width }"
                @change="copyMapChange"
              >
                <el-option
                  v-for="map in mapListCopy"
                  :key="map.id"
                  :label="map.areaName"
                  :value="map.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图层模式" prop="type">
              <el-select
                v-model="form.type"
                placeholder="请选择图层模式"
                :style="{ width: width }"
              >
                <el-option
                  v-for="dict in typeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="区域" prop="initBuild">
              <el-cascader
                v-model="form.initBuild"
                :options="areaOptions"
                :props="cascaderProps"
                placeholder="请选择区域"
                clearable
                :style="{ width: width }"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="底层地图" prop="baseLayer">
              <el-input
                v-model="form.baseLayer"
                placeholder="请输入底层地图"
                :style="{ width: width }"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="初始层级" prop="initlevel">
              <el-input
                v-model="form.initlevel"
                placeholder="请输入初始层级"
                :style="{ width: width }"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="比例尺" prop="scales">
              <el-input v-model="form.scales" placeholder="请输入比例尺" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="最小经度" prop="minlon">
              <el-input
                v-model="form.minlon"
                placeholder="请输入最小经度"
                :style="{ width: width }"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大经度" prop="maxlon">
              <el-input
                v-model="form.maxlon"
                placeholder="请输入最大经度"
                :style="{ width: width }"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="最小纬度" prop="minlat">
              <el-input
                v-model="form.minlat"
                placeholder="请输入最小纬度"
                :style="{ width: width }"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大纬度" prop="maxlat">
              <el-input
                v-model="form.maxlat"
                placeholder="请输入最大纬度"
                :style="{ width: width }"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="中心点X坐标" prop="centerx">
              <el-input
                v-model="form.centerx"
                placeholder="请输入中心点X坐标"
                :style="{ width: width }"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="中心点Y坐标" prop="centery">
              <el-input
                v-model="form.centery"
                placeholder="请输入中心点Y坐标"
                :style="{ width: width }"
              />
            </el-form-item>
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
  listMap,
  getMap,
  delMap,
  addMap,
  updateMap,
  exportMap,
  listMapCopy,
} from "@/api/gis/map";
import { treeListArea } from "@/api/equipment/area";

export default {
  name: "Map",
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
      // GIS地图管理表格数据
      mapList: [],
      // GIS地图管理表格数据参照
      mapListCopy: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 图层模式字典
      typeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        type: [{ required: true, message: "请选择图层模式", trigger: "blur" }],
        initBuild: [{ required: true, message: "请选择区域", trigger: "blur" }],
        baseLayer: [
          { required: true, message: "请输入底层地图", trigger: "blur" },
        ],
        initlevel: [
          { required: true, message: "请输入初始层级", trigger: "blur" },
        ],
      },
      // 参照地图
      copyMapId: undefined,
      // 区域列表
      areaOptions: [],
      // 联集结构
      cascaderProps: {
        emitPath: false,
        value: "id",
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("gis_map_type").then((response) => {
      this.typeOptions = response.data;
    });
  },
  methods: {
    /** 查询GIS地图管理列表 */
    getList() {
      this.loading = true;
      listMap(this.queryParams).then((response) => {
        this.mapList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 查询GIS地图管理列表 参照
    getListCopy() {
      listMapCopy().then((response) => {
        this.mapListCopy = response.rows;
      });
    },
    // 获取区域列表
    getAreaList() {
      treeListArea().then((response) => {
        this.areaOptions = [];
        this.areaOptions = response.data;
      });
    },
    // 图层模式字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.type);
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
        areaCode: undefined,
        areaName: undefined,
        scales: undefined,
        minlon: undefined,
        maxlon: undefined,
        minlat: undefined,
        maxlat: undefined,
        centerx: undefined,
        centery: undefined,
        initlevel: undefined,
        initBuild: undefined,
        initFloor: undefined,
        baseLayer: undefined,
        systemName: undefined,
        systemCode: undefined,
        type: undefined,
      };
      this.resetForm("form");
      this.copyMapId = undefined;
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
      this.getListCopy();
      this.getAreaList();
      this.open = true;
      this.title = "添加地图";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getListCopy();
      this.getAreaList();
      const id = row.id || this.ids;
      getMap(id).then((response) => {
        this.form = { ...response.data, type: response.data.type.toString() };
        this.open = true;
        this.title = "修改地图";
      });
    },
    copyMapChange(value) {
      getMap(value).then((response) => {
        const data = response.data;
        const { id } = this.form;
        this.form = { ...data, id: id, type: data.type.toString() };
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateMap(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addMap(this.form).then((response) => {
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
      this.$confirm('是否确认删除地图编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delMap(ids);
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
      this.$confirm("是否确认导出所有地图数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportMap(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
  },
};
</script>