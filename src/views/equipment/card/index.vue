<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-radio-group v-model="radioType" @change="handleRadio">
            <el-radio-button label="0">分类</el-radio-button>
            <el-radio-button label="1">区域</el-radio-button>
          </el-radio-group>
        </div>
        <div class="head-container" style="margin-top: 20px">
          <el-tree
            :data="radioOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            ref="tree"
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>

      <el-col :span="20" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          label-width="68px"
        >
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
              v-hasPermi="['equipment:card:add']"
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
              v-hasPermi="['equipment:card:edit']"
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
              v-hasPermi="['equipment:card:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="info"
              icon="el-icon-download"
              size="mini"
              @click="handleImport"
              v-hasPermi="['equipment:card:import']"
              >设备导入(不含位号)</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="info"
              icon="el-icon-download"
              size="mini"
              @click="handleImportc"
              v-hasPermi="['equipment:card:import']"
              >设备导入(含位号)</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              icon="el-icon-upload2"
              size="mini"
              @click="handleExport"
              v-hasPermi="['equipment:card:export']"
              >导出</el-button
            >
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="cardList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column
            label="设备编号"
            align="left"
            prop="equCode"
            show-overflow-tooltip
          />
          <el-table-column
            label="设备名称"
            align="left"
            prop="equName"
            show-overflow-tooltip
          />
          <el-table-column
            label="设备分类"
            align="left"
            prop="className"
            show-overflow-tooltip
          />
          <el-table-column
            label="所在区域 "
            align="left"
            prop="areaName"
            show-overflow-tooltip
          />
          <el-table-column
            label="设备使用状态 "
            align="center"
            prop="equStatus"
            :formatter="equStatusFormat"
            width="100"
          />
          <!-- <el-table-column
            label="创建时间"
            align="center"
            prop="createTime"
            width="150"
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column> -->
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
                v-hasPermi="['equipment:card:edit']"
                >修改</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['equipment:card:remove']"
                >删除</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-s-tools"
                @click="handleChannels(scope.row)"
                >位号管理</el-button
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
      </el-col>
    </el-row>

    <!-- 添加或修改设备档案对话框 -->
    <el-dialog
      v-loading="loadingSubmit"
      element-loading-text="正在提交,请稍后！"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :title="title"
      :visible.sync="open"
      width="1200px"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-tabs v-model="activeName" style="height: 500px">
          <el-tab-pane label="基本信息" name="first">
            <!-- <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="设备序号" prop="equNum">
                  <el-input
                    v-model="form.equNum"
                    placeholder="请输入设备序号"
                    :style="{ width: widthl }"
                  />
                </el-form-item>
              </el-col>
            </el-row> -->
            <el-row :gutter="20" v-if="form.equCode">
              <el-col :span="24">
                <el-form-item label="设备编码" prop="equCode">
                  <el-input
                    v-model="form.equCode"
                    :style="{ width: widthl }"
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="设备名称" prop="equName">
                  <el-input
                    v-model="form.equName"
                    placeholder="请输入设备名称"
                    :style="{ width: widthl }"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="所在区域 " prop="areaId">
                  <el-cascader
                    v-model="form.areaId"
                    :options="areaOptions"
                    :props="cascaderProps"
                    placeholder="请选择设备所在区域"
                    clearable
                    :style="{ width: widthl }"
                  ></el-cascader>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="设备分类" prop="classId">
                  <el-cascader
                    v-model="form.classId"
                    :options="classOptions"
                    :props="cascaderProps"
                    placeholder="请选择设备分类"
                    clearable
                    :style="{ width: widthl }"
                  ></el-cascader>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="是否使用设备模板" prop="templetId">
                  <el-radio-group v-model="form.templetId">
                    <el-radio
                      v-for="option in templetOptions"
                      :key="option.value"
                      :label="option.value"
                      >{{ option.label }}</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="设备通信" name="second">
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="所属网关" prop="collectorSerialCode">
                  <el-select
                    v-model="form.collectorSerialCode"
                    filterable
                    clearable
                    placeholder="请选择所属网关"
                    :style="{ width: widthl }"
                  >
                    <el-option
                      v-for="gateway in gatewayOptions"
                      :key="gateway.collectorSerialCode"
                      :label="gateway.gatewayName"
                      :value="gateway.collectorSerialCode"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="能耗区域" prop="serviceAreaId">
                  <el-cascader
                    v-model="form.serviceAreaId"
                    :options="energyAreaList"
                    :props="areaProps"
                    placeholder="请选择能耗区域"
                    clearable
                    :style="{ width: widthl }"
                  ></el-cascader>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="能耗部门" prop="serviceDeptId">
                  <el-cascader
                    v-model="form.serviceDeptId"
                    :options="energyDeptList"
                    :props="deptProps"
                    placeholder="请选择设备分类"
                    clearable
                    :style="{ width: widthl }"
                  ></el-cascader>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="分类分项" prop="energyCode">
                  <el-cascader
                    v-model="form.energyCode"
                    :options="energyItemList"
                    :props="itemProps"
                    placeholder="请选择设备分类"
                    clearable
                    :style="{ width: widthl }"
                  ></el-cascader>
                </el-form-item>
              </el-col>
            </el-row>
            <!-- <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="命名规范" prop="systemId">
                  <el-cascader
                    v-model="form.systemId"
                    :options="ruleOptions"
                    :props="cascaderProps"
                    placeholder="请选择命名规范"
                    clearable
                    :style="{ width: widthl }"
                  ></el-cascader>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="HPID" prop="obid">
                  <el-input
                    v-model="form.obid"
                    placeholder="请输入HPID"
                    :style="{ width: widthl }"
                  />
                </el-form-item>
              </el-col>
            </el-row> -->
          </el-tab-pane>
          <el-tab-pane label="设备档案" name="third">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="合同" prop="contractId">
                  <el-select
                    v-model="form.contractId"
                    filterable
                    clearable
                    placeholder="请选择合同"
                    :style="{ width: width }"
                  >
                    <el-option
                      v-for="contract in contractOptions"
                      :key="contract.conId"
                      :label="contract.conName"
                      :value="contract.conId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="供应商" prop="supplierId">
                  <el-select
                    v-model="form.supplierId"
                    filterable
                    clearable
                    placeholder="请选择设备供应商"
                    :style="{ width: width }"
                  >
                    <el-option
                      v-for="supplier in supplierOptions"
                      :key="supplier.supId"
                      :label="supplier.supName"
                      :value="supplier.supId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="所属部门" prop="deptId">
                  <treeselect
                    v-model="form.deptId"
                    :options="deptOptions"
                    placeholder="请选择所属部门"
                    :style="{ width: width }"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="设备管理员" prop="equAdmin">
                  <el-select
                    v-model="form.equAdmin"
                    filterable
                    placeholder="请选择设备管理员"
                    :style="{ width: width }"
                  >
                    <el-option
                      v-for="user in userOptions"
                      :key="user.userId"
                      :label="user.nickName"
                      :value="user.userId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="设备采购时间" prop="equTime">
                  <el-date-picker
                    v-model="form.equTime"
                    type="date"
                    placeholder="请选择设备采购时间"
                    clearable
                    :style="{ width: width }"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="设备使用年限" prop="equYear">
                  <el-input-number
                    v-model="form.equYear"
                    placeholder="请输入设备使用年限"
                    :style="{ width: width }"
                    :min="1"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="设备使用状态" prop="equStatus">
                  <el-select
                    v-model="form.equStatus"
                    placeholder="请选择设备使用状态"
                    :style="{ width: width }"
                  >
                    <el-option
                      v-for="dict in equStatusOptions"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否特种设备">
                  <el-radio-group v-model="form.equAttribute">
                    <el-radio
                      v-for="dict in sysYesNoOptions"
                      :key="dict.dictValue"
                      :label="dict.dictValue"
                      >{{ dict.dictLabel }}</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="是否需要保养">
                  <el-radio-group v-model="form.equMaintain">
                    <el-radio
                      v-for="dict in sysYesNoOptions"
                      :key="dict.dictValue"
                      :label="dict.dictValue"
                      >{{ dict.dictLabel }}</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否能耗设备">
                  <el-radio-group v-model="form.equEnergy">
                    <el-radio
                      v-for="dict in sysYesNoOptions"
                      :key="dict.dictValue"
                      :label="dict.dictValue"
                      >{{ dict.dictLabel }}</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="备注" prop="remark">
                  <el-input
                    v-model="form.remark"
                    type="textarea"
                    placeholder="请输入备注"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <ImportData
      v-if="uploadOpen"
      :title="upload.title"
      :uploadOpen.sync="uploadOpen"
      :url="upload.url"
      :templateUrl="upload.templateUrl"
      :successBack="getList"
    />
  </div>
</template>

<script>
import {
  listCard,
  getCard,
  delCard,
  addCard,
  updateCard,
  exportCard,
} from "@/api/equipment/card";
import { treeListClass } from "@/api/equipment/class";
import { treeListArea } from "@/api/equipment/area";
import { listContractAll } from "@/api/equipment/contract";
import { listSupplierAll } from "@/api/equipment/supplier";
import { treeselect as deptTreeselect } from "@/api/system/dept";
import { listUserAll as listUser } from "@/api/system/user";
// import { treeListTemplet } from "@/api/equipment/templet";
import { listGateway } from "@/api/equipment/gateway";
import { listArea } from "@/api/energy/basic/area";
import { listDept } from "@/api/energy/basic/dept";
import { listItem } from "@/api/energy/basic/item";
import { treeListRule } from "@/api/gis/rule";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import ImportData from "@/views/components/upload/ImportData";
import { exportCsv } from "@/api/equipment/channel";

const templetList = [
  {
    value: 1,
    label: "否",
  },
  {
    value: 0,
    label: "是",
  },
];

export default {
  name: "Card",
  components: { Treeselect, ImportData },
  data() {
    return {
      //tab
      activeName: "first",
      cascaderProps: {
        emitPath: false,
        value: "id",
      },
      areaProps: {
        emitPath: false,
        value: "id",
        label: "areaName",
      },
      deptProps: {
        emitPath: false,
        value: "id",
        label: "name",
      },
      itemProps: {
        emitPath: false,
        value: "code",
        label: "name",
      },
      // 统一宽度 500px
      widthl: "700px",
      // 统一宽度 300px
      width: "300px",
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
      // 设备档案表格数据
      cardList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 提交遮罩层
      loadingSubmit: false,
      // 设备使用状态 字典
      equStatusOptions: [],
      // 特种属性\保养属性\能耗设备字典
      sysYesNoOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        classId: undefined,
        areaId: undefined,
        equCode: undefined,
        equName: undefined,
      },
      //选择
      radioType: "0",
      //
      defaultProps: {
        children: "children",
        label: "label",
      },
      //radio 列表
      radioOptions: undefined,
      //命名规范
      ruleOptions: [],
      //设备分类列表
      classOptions: [],
      //区域列表
      areaOptions: [],
      //合同
      contractOptions: [],
      //供应商
      supplierOptions: [],
      //部门列表
      deptOptions: undefined,
      // 人员列表
      userOptions: undefined,
      // 设备模板
      templetOptions: templetList,
      // 网关
      gatewayOptions: undefined,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        // equNum: [
        //   { required: true, message: "请输入设备序号", trigger: "blur" },
        // ],
        equName: [
          { required: true, message: "请输入设备名称", trigger: "blur" },
        ],
        areaId: [
          { required: true, message: "请选择所在区域", trigger: "blur" },
        ],
        classId: [
          { required: true, message: "请选择设备分类", trigger: "blur" },
        ],
        templetId: [
          {
            required: true,
            message: "请选择是否使用设备模板",
            trigger: "blur",
          },
        ],
      },
      // 导入参数
      upload: {
        // 弹出层标题
        title: "设备导入",
        // 上传的地址
        url: "/equipment/card/importData",
        // 模板文件地址
        templateUrl: "设备导入模板.xls",
      },
      // 导入组件的开关
      uploadOpen: false,
      //
      energyAreaList: [],
      energyDeptList: [],
      energyItemList: [],
    };
  },
  created() {
    this.getList();
    this.getDicts("equ_status_type").then((response) => {
      this.equStatusOptions = response.data;
    });
    this.getDicts("sys_yes_no").then((response) => {
      this.sysYesNoOptions = response.data;
    });
    this.getRuleList();
    this.getClassList();
    this.getAreaList();
    this.getContractList();
    this.getSupplierList();
    this.getDeptList();
    this.getUserList();
    //this.getTempletList();
    this.getGateWayList();
    this.getEnergyArea();
    this.getEnergyDept();
    this.getEnergyItem();
  },
  methods: {
    //单选事件
    handleRadio() {
      if (this.radioType == "0") {
        this.radioOptions = this.classOptions;
      } else {
        this.radioOptions = this.areaOptions;
      }
    },
    // 节点单击事件
    handleNodeClick(data) {
      if (this.radioType == "0") {
        this.queryParams.classId = data.id;
        this.queryParams.areaId = null;
      } else {
        this.queryParams.classId = null;
        this.queryParams.areaId = data.id;
      }
      this.getList();
    },
    /** 查询设备档案列表 */
    getList() {
      this.loading = true;
      listCard(this.queryParams).then((response) => {
        this.cardList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 设备使用状态 字典翻译
    equStatusFormat(row, column) {
      return this.selectDictLabel(this.equStatusOptions, row.equStatus);
    },
    // 获取系统命名规约
    getRuleList() {
      treeListRule().then((response) => {
        this.ruleOptions = [];
        this.ruleOptions = response.data;
      });
    },
    // 获取设备分类列表
    getClassList() {
      treeListClass().then((response) => {
        this.radioOptions = [];
        this.classOptions = [];
        this.radioOptions = response.data;
        this.classOptions = response.data;
        // const data = { id: 0, label: "顶级节点", children: [] };
        // data.children = response.data;
        // this.radioOptions.push(data);
        // this.classOptions.push(data);
      });
    },
    // 获取区域列表
    getAreaList() {
      treeListArea().then((response) => {
        this.areaOptions = [];
        this.areaOptions = response.data;
        // const data = { id: 0, label: "顶级节点", children: [] };
        // data.children = response.data;
        // this.areaOptions.push(data);
      });
    },
    // 合同
    getContractList() {
      listContractAll().then((response) => {
        this.contractOptions = response.rows;
      });
    },
    // 供应商
    getSupplierList() {
      listSupplierAll().then((response) => {
        this.supplierOptions = response.rows;
      });
    },
    // 获取部门列表
    getDeptList() {
      deptTreeselect().then((response) => {
        this.deptOptions = response.data;
      });
    },
    // 获取用户列表
    getUserList() {
      listUser().then((response) => {
        this.userOptions = response.rows;
      });
    },
    // 获取设备模板列表
    // getTempletList() {
    //   treeListTemplet().then((response) => {
    //     this.templetOptions = response.data;
    //   });
    // },
    // 获取网关
    getGateWayList() {
      listGateway().then((response) => {
        this.gatewayOptions = response.rows;
      });
    },
    getEnergyArea() {
      listArea().then((response) => {
        this.energyAreaList = this.handleTree(response.data, "id", "parentId");
      });
    },
    getEnergyDept() {
      listDept().then((response) => {
        this.energyDeptList = this.handleTree(response.data, "id", "parentId");
      });
    },
    getEnergyItem() {
      listItem().then((response) => {
        this.energyItemList = this.handleTree(
          response.data,
          "code",
          "parentCode"
        );
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
        equId: undefined,
        equNum: undefined,
        equCode: undefined,
        equName: undefined,
        classId: undefined,
        areaId: undefined,
        contractId: undefined,
        supplierId: undefined,
        deptId: undefined,
        equAdmin: undefined,
        equTime: undefined,
        equYear: undefined,
        equStatus: "0",
        equAttribute: "N",
        equMaintain: "Y",
        equEnergy: "Y",
        remark: undefined,
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        templetId: 0,
        collectorSerialCode: undefined,
        systemId: undefined,
        obid: undefined,
        serviceAreaId: undefined,
        servicedeptId: undefined,
        energyCode: undefined,
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
      this.ids = selection.map((item) => item.equId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加设备档案";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const equId = row.equId || this.ids;
      getCard(equId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改设备档案";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loadingSubmit = true;
          if (this.form.equId != undefined) {
            updateCard(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
              this.loadingSubmit = false;
            });
          } else {
            addCard(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
              this.loadingSubmit = false;
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const equIds = row.equId || this.ids;
      let count = row.equId ? 1 : equIds.length;

      this.$confirm('是否确认删除所选择的"' + count + '"条设备数据?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const loading = this.openLoading();
        delCard(equIds)
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
      this.$confirm("是否确认导出所有设备档案数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportCsv({
            equName: queryParams.equName,
            equCode: queryParams.equCode,
          }); //exportCard(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload = {
        // 弹出层标题
        title: "设备导入(不含位号)",
        // 上传的地址
        url: "/equipment/card/importData",
        // 模板文件地址
        templateUrl: "设备导入模板(不含位号).xls",
      };
      this.uploadOpen = true;
    },
    /** 导入按钮操作 */
    handleImportc() {
      this.upload = {
        // 弹出层标题
        title: "设备导入(含位号)",
        // 上传的地址
        url: "/equipment/card/importDataC",
        // 模板文件地址
        templateUrl: "设备导入模板(含位号).xls",
      };
      this.uploadOpen = true;
    },
    /** 位号管理 */
    handleChannels(row) {
      const { equGuid } = row;
      this.$router.push({ name: "Channel", params: { equGuid: equGuid } });
    },
  },
};
</script>