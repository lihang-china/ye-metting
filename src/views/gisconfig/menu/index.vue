<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="菜单编码" prop="menuType">
        <el-input
          v-model="queryParams.menuType"
          placeholder="请输入菜单编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="菜单名称" prop="menuName">
        <el-input
          v-model="queryParams.menuName"
          placeholder="请输入菜单名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button
          class="filter-item"
          icon="el-icon-refresh"
          size="mini"
          @click="resetQuery"
          >重置</el-button
        >
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['gis:menu:add']"
          >新增</el-button
        >
        <el-button
          type="danger"
          icon="el-icon-guide"
          size="mini"
          @click="getExpends"
          >展开/折叠
        </el-button>
      </el-form-item>
    </el-form>

    <el-table
      ref="table"
      v-loading="loading"
      :data="menuList"
      row-key="id"
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column label="菜单编码" align="left" prop="menuType" />
      <el-table-column label="菜单名称" align="left" prop="menuName" />
      <el-table-column
        label="显示顺序"
        align="center"
        prop="orderNum"
        width="150"
      />
      <!-- <el-table-column label="区域" align="left">
        <template slot-scope="scope">
          {{
            scope.row.menuClass === "L"
              ? scope.row.areaName + "(" + scope.row.areaCode + ")"
              : ""
          }}
        </template>
      </el-table-column> -->
      <el-table-column
        label="图层模式"
        align="center"
        prop="layerModel"
        :formatter="layerModelFormat"
        width="150"
      />
      <el-table-column
        label="图层"
        align="center"
        prop="layout"
        :formatter="layoutFormat"
        width="150"
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
            v-hasPermi="['gis:menu:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['gis:menu:add']"
            >新增</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['gis:menu:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改菜单图层管理对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="980px"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="98px">
        <!-- <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="上级菜单" prop="parentId">
              <treeselect
                v-model="form.parentId"
                :options="menuOptions"
                :normalizer="normalizer"
                placeholder="请选择上级菜单"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="菜单类型" prop="menuClass">
              <el-radio-group v-model="form.menuClass">
                <el-radio
                  v-for="options in classOptions"
                  :key="options.value"
                  :label="options.value"
                  >{{ options.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col> 
          <el-col :span="12">
            <el-form-item label="显示顺序" prop="orderNum">
              <el-input-number
                v-model="form.orderNum"
                controls-position="right"
                :min="1"
              />
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="菜单类型" prop="menuClass">
              <el-radio-group v-model="form.menuClass">
                <el-radio
                  v-for="options in classOptions"
                  :key="options.value"
                  :label="options.value"
                  >{{ options.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="菜单编码" prop="menuType">
              <el-input
                v-model="form.menuType"
                placeholder="请输入菜单编码"
                :style="{ width: width }"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input
                v-model="form.menuName"
                placeholder="请输入菜单名称"
                :style="{ width: width }"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="菜单图标" prop="icon">
              <el-input
                v-model="form.icon"
                placeholder="请输入菜单图标"
                :style="{ width: width }"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示顺序" prop="orderNum">
              <el-input-number
                v-model="form.orderNum"
                controls-position="right"
                :min="1"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="form.menuClass === 'M'">
          <el-col :span="24">
            <el-form-item label="初始区域" prop="initBuild">
              <el-cascader
                v-model="form.initBuild"
                :options="areaOptions"
                :props="cascaderProps"
                placeholder="请选择初始区域"
                clearable
                :style="{ width: width }"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="form.menuClass === 'M'">
          <el-col :span="24">
            <el-form-item label="GIS图层" prop="layer">
              <SelectLayer
                ref="selectMenuLayer"
                :value="layer"
                @returnBack="callBack"
                v-if="form.menuClass === 'M' && open"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="form.menuClass === 'M'">
          <el-col :span="12">
            <el-form-item label="图层模式" prop="layerModel">
              <el-select
                v-model="form.layerModel"
                placeholder="请选择图层模式"
                :style="{ width: width }"
              >
                <el-option
                  v-for="dict in layerModelOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图层" prop="layout">
              <el-select
                v-model="form.layout"
                placeholder="请选择图层"
                :style="{ width: width }"
              >
                <el-option
                  v-for="dict in layoutOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          :gutter="20"
          v-if="form.menuClass === 'M' && form.layout === '2'"
        >
          <el-col :span="24">
            <el-form-item label="左url" prop="leftUrl">
              <el-input v-model="form.leftUrl" placeholder="请输入左url" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="form.menuClass === 'U'">
          <el-col :span="24">
            <el-form-item label="外部连接" prop="url">
              <el-input v-model="form.url" placeholder="请输入外部连接地址" />
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
  listMenu,
  getMenu,
  delMenu,
  addMenu,
  updateMenu,
  exportMenu,
} from "@/api/gis/menu";
import { treeListArea } from "@/api/equipment/area";
import SelectLayer from "@/views/components/gis/SelectLayer";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

const classList = [
  {
    label: "目录",
    value: "M",
  },
  {
    label: "外部链接",
    value: "U",
  },
];

export default {
  name: "GisMenu",
  components: { Treeselect, SelectLayer },
  data() {
    return {
      //展开
      expand: false,
      // 统一宽度
      width: "350px",
      // 遮罩层
      loading: true,
      // 菜单图层管理表格数据
      menuList: [],
      // 菜单图层集合
      menuOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        menuType: undefined,
        menuName: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        // parentId: [
        //   { required: true, message: "请选择上级菜单", trigger: "blur" },
        // ],
        orderNum: [
          { required: true, message: "请输入显示顺序", trigger: "blur" },
        ],
        menuType: [
          { required: true, message: "请输入菜单编码", trigger: "blur" },
        ],
        menuName: [
          { required: true, message: "请输入菜单名称", trigger: "blur" },
        ],
        icon: [{ required: true, message: "请输入菜单图标", trigger: "blur" }],
        initBuild: [
          { required: true, message: "请选择初始区域", trigger: "blur" },
        ],
        layerModel: [
          { required: true, message: "请选择图层模式", trigger: "blur" },
        ],
        layout: [{ required: true, message: "请选择图层", trigger: "blur" }],
        url: [
          { required: true, message: "请输入外部连接地址", trigger: "blur" },
        ],
      },
      // 图层模式
      layerModelOptions: [],
      // 图层
      layoutOptions: [],
      // 区域列表
      areaOptions: [],
      // 联集结构
      cascaderProps: {
        emitPath: false,
        value: "id",
      },
      // GIS图层
      layer: [],
      // 菜单类型集合
      classOptions: classList,
    };
  },
  created() {
    this.getList();
    this.getDicts("gis_layerModel_type").then((response) => {
      this.layerModelOptions = response.data;
    });
    this.getDicts("gis_layout_type").then((response) => {
      this.layoutOptions = response.data;
    });
    this.getAreaList();
  },
  methods: {
    /** 查询菜单图层管理列表 */
    getList() {
      this.loading = true;
      listMenu(this.queryParams).then((response) => {
        this.menuList = this.handleTree(response.data, "id", "parentId");
        this.loading = false;
      });
    },
    /** 转换菜单图层数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.menuName,
        children: node.children,
      };
    },
    getTreeselect() {
      listMenu().then((response) => {
        this.menuOptions = [];
        const data = { id: 0, menuName: "顶级节点", children: [] };
        data.children = this.handleTree(response.data, "id", "parentId");
        this.menuOptions.push(data);
      });
    },
    // 图层模式字典翻译
    layerModelFormat(row, column) {
      return this.selectDictLabel(this.layerModelOptions, row.layerModel);
    },
    // 图层字典翻译
    layoutFormat(row, column) {
      return this.selectDictLabel(this.layoutOptions, row.layout);
    },
    // 获取区域列表
    getAreaList() {
      treeListArea().then((response) => {
        this.areaOptions = [];
        this.areaOptions = response.data;
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
        menuType: undefined,
        layerModel: "1",
        systemCode: undefined,
        modelType: 2,
        layout: "1",
        leftUrl: undefined,
        initBuild: undefined,
        initFloor: undefined,
        flashId: undefined,
        menuName: undefined,
        systemId: undefined,
        parentId: undefined,
        fullName: undefined,
        menuClass: "M",
        orderNum: undefined,
        icon: undefined,
        url: undefined,
        gisMenuLayerDisplays: [],
      };
      this.resetForm("form");
      this.layer = [];
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
    /** 展开/折叠 */
    getExpends() {
      this.expand = this.expand ? false : true;
      this.menuList.forEach((item) => {
        this.$refs.table.toggleRowExpansion(item, this.expand);
      });
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      //this.getTreeselect();
      if (row != null) {
        this.form.parentId = row.id;
      }
      this.open = true;
      this.title = "添加菜单图层";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      //this.getTreeselect();
      const id = row.id;
      getMenu(id).then((response) => {
        if (response.data.menuClass === "M") {
          this.form = {
            ...response.data,
            layerModel: response.data.layerModel.toString(),
            layout: response.data.layout.toString(),
          };
          this.layer = [...response.data.gisMenuLayerDisplays];
        } else {
          this.form = { ...response.data };
        }
        this.open = true;
        this.title = "修改菜单图层";
      });
    },
    callBack(val) {
      //console.log(val);
      let arr = val.map((item) => {
        return {
          display: item.display,
          gisLayerId: item.id,
        };
      });
      this.form.gisMenuLayerDisplays = [...arr];
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateMenu(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addMenu(this.form).then((response) => {
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
      const ids = row.id;
      this.$confirm(
        '是否确认删除菜单图层编号为"' + ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delMenu(ids);
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
      this.$confirm("是否确认导出所有菜单图层数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportMenu(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
  },
};
</script>