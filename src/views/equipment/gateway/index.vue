<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="网关名称" prop="gatewayName">
        <el-input
          v-model="queryParams.gatewayName"
          placeholder="请输入网关名称"
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
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="gwList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="网关名称" align="left" prop="gatewayName" width="200" />
      <el-table-column label="IP" align="center" prop="ip" width="200" />
      <el-table-column label="端口号" align="center" prop="port" width="150" />
      <el-table-column label="用户名" align="center" prop="ecAuthName" width="200" />
      <el-table-column
        label="token"
        align="center"
        prop="ecAuthToken"
        width="300"
        show-overflow-tooltip
      />
      <el-table-column label="状态" align="center" prop="status" width="150">
        <template slot-scope="scope">{{scope.row.status === 0 ? "离线" : "在线"}}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-if="scope.row.status === 0"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-if="scope.row.status === 0"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-arrow-up"
            @click="handleOperate(scope.row, 'Login')"
            v-if="scope.row.status === 0"
          >登录</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-arrow-down"
            @click="handleOperate(scope.row, 'Logout')"
            v-if="scope.row.status === 1"
          >登出</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-order"
            @click="handleOperate(scope.row, 'GetDevice')"
            v-if="scope.row.status === 1"
          >查询设备</el-button>
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

    <!-- 添加或修改网关对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="网关名称" prop="gatewayName">
          <el-input v-model="form.gatewayName" placeholder="请输入网关名称" />
        </el-form-item>
        <el-form-item label="IP" prop="ip">
          <el-input v-model="form.ip" placeholder="请输入IP" />
        </el-form-item>
        <el-form-item label="端口号" prop="port">
          <el-input v-model="form.port" placeholder="请输入端口号" />
        </el-form-item>
        <el-form-item label="用户名" prop="ecAuthName">
          <el-input v-model="form.ecAuthName" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="token" prop="ecAuthToken">
          <el-input v-model="form.ecAuthToken" placeholder="请输入token" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="设备" :visible.sync="openDev" width="60%" :close-on-click-modal="false">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="warning"
            icon="el-icon-upload"
            size="mini"
            :disabled="devSelectCount <=0 "
            @click="handleSyn"
          >同步{{ " (" + devSelectCount + "/" + devCount + ") " }}</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            icon="el-icon-upload"
            size="mini"
            :disabled="devCount <= 0"
            @click="handleSyn('all')"
          >全部同步</el-button>
        </el-col>
      </el-row>

      <el-table :data="devList" @selection-change="handleSelectionChangeDev" height="560px">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-table :data="scope.row.equChannels">
              <el-table-column type="index" width="55" align="center" />
              <el-table-column label="位号名称" align="left" prop="channelName" />
              <el-table-column label="位号编码" align="left" prop="channelCode" />
              <el-table-column label="位号类型" align="left" prop="channelType" />
              <el-table-column label="读写状态" align="left" prop="channelRw" />
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="设备名称" align="left" prop="equName" />
        <el-table-column label="设备编码" align="left" prop="equCode" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {
  listGW,
  getGW,
  delGW,
  addGW,
  updateGW,
  operateGW,
  syncDevices,
} from "@/api/equipment/gateway";

export default {
  name: "GateWay",
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
      // 网关表格数据
      gwList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 设备弹出层
      openDev: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        gatewayName: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        gatewayName: [
          { required: true, message: "请输入网关名称", trigger: "blur" },
        ],
        ip: [{ required: true, message: "请输入IP", trigger: "blur" }],
        port: [{ required: true, message: "请输入端口号", trigger: "blur" }],
        ecAuthName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        ecAuthToken: [
          { required: true, message: "请输入token", trigger: "blur" },
        ],
      },
      // 设备列表
      devList: [],
      // 设备同步选择列表
      devSelectList: [],
      // 全部设备数
      devCount: 0,
      // 已选择的设备数
      devSelectCount: 0,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询网关列表 */
    getList() {
      this.loading = true;
      listGW(this.queryParams).then((response) => {
        this.gwList = response.rows;
        this.total = response.total;
        this.loading = false;
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
        gatewayEcId: undefined,
        gatewayName: undefined,
        protocolName: undefined,
        ip: undefined,
        port: undefined,
        ecAuthName: undefined,
        ecAuthToken: undefined,
        collectorName: undefined,
        collectorSerialCode: undefined,
        status: "0",
        heartbeatLastTime: undefined,
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
      this.ids = selection.map((item) => item.gatewayEcId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加网关";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const gatewayEcId = row.gatewayEcId || this.ids;
      getGW(gatewayEcId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改网关";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.gatewayEcId != undefined) {
            updateGW(this.form.gatewayEcId, this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addGW(this.getFormArray(this.form)).then((response) => {
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
      const gatewayEcIds = row.gatewayEcId || this.ids;
      this.$confirm(
        '是否确认删除网关编号为"' + gatewayEcIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        const loading = this.openLoading();
        delGW(gatewayEcIds)
          .then((respons) => {
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
    /** 操作设备 */
    handleOperate(row, operate) {
      let params = {
        Action: operate,
        GatewayId: row.gatewayEcId,
      };

      // 登录 登出
      if (operate.indexOf("Log") > -1) {
        let text = operate === "Login" ? "登录" : "登出";
        this.$confirm(
          "是否确认" + text + '名称为"' + row.gatewayName + '"的网关',
          "警告",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).then(() => {
          const loading = this.openLoading("正在" + text + "网关,请稍后......");
          operateGW(params)
            .then((response) => {
              loading.close();
              if (response.code === 200) {
                this.msgSuccess(text + "成功");
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            })
            .catch(() => {
              loading.close();
            });
        });
      }

      // 查询设备
      if (operate === "GetDevice") {
        params.Index = 1;
        params.Count = -1;
        const loading = this.openLoading("正在查询设备,请稍后......");
        this.openDev = false;
        this.devCount = 0;
        this.devSelectCount = 0;
        operateGW(params)
          .then((response) => {
            loading.close();
            if (response.code === 200) {
              this.devList = response.data.rows;
              this.devCount = response.data.total;
              this.openDev = true;
            } else {
              this.msgError(response.msg);
            }
          })
          .catch(() => {
            loading.close();
          });
      }
    },
    /** 设备同步选择 */
    handleSelectionChangeDev(selection) {
      this.devSelectList = selection;
      this.devSelectCount = selection.length;
    },
    /** 同步按钮 */
    handleSyn(type) {
      let devSyncList = type === "all" ? this.devList : this.devSelectList;
      const loading = this.openLoading("正在同步设备,请稍后......");
      syncDevices("1", devSyncList)
        .then((response) => {
          loading.close();
          if (response.code === 200) {
            this.msgSuccess("同步成功");
            this.openDev = false;
            this.getList();
          } else {
            this.msgError(response.code);
          }
        })
        .catch(() => {
          loading.close();
        });
    },
  },
};
</script>