<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="调拨编号" prop="allotCode">
        <el-input v-model="queryParams.allotCode" placeholder="请输入调拨编号" clearable size="small" />
      </el-form-item>
      <el-form-item label="调拨时间" prop="allotDate">
        <el-date-picker
          v-model="dateRangeAllotDate"
          size="small"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['warehouse:allot:add']"
        >新增</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="allotList">
      <el-table-column label="序号" align="center" type="index" width="60" />
      <el-table-column label="调拨编号" align="left" prop="allotCode" />
      <el-table-column label="调出仓库" align="left" prop="outName" />
      <el-table-column label="调入仓库" align="left" prop="inName" />
      <el-table-column label="调拨时间" align="center" prop="allotDate">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.allotDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单据状态" align="center">
        <template slot-scope="scope">{{scope.row.status === '0' ? "未调拨" : "已调拨" }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row, false)"
            v-hasPermi="['warehouse:allot:edit']"
            v-show="scope.row.status === '0'"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['warehouse:allot:remove']"
            v-show="scope.row.status === '0'"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-files"
            @click="handleAllot(scope.row)"
            v-show="scope.row.status === '0'"
          >模拟调拨</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleUpdate(scope.row, true)"
            v-show="scope.row.status === '1'"
          >查看</el-button>
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

    <!-- 添加或修改备品备件调拨 对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1500px" :close-on-click-modal="false">
      <div v-show="!isView">
        <SelectSp
          v-if="isShow"
          :isShow.sync="isShow"
          :selectData="selectData"
          :key="selectKey"
          @currentRow="handleCurrentRow"
        />
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="调拨人" prop="allotBy">
                <el-select
                  v-model="form.allotBy"
                  filterable
                  clearable
                  placeholder="请选择调拨人"
                  :style="{ width: width }"
                  disabled
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
            <el-col :span="12">
              <el-form-item label="调拨时间" prop="allotDate">
                <el-date-picker
                  clearable
                  v-model="form.allotDate"
                  type="datetime"
                  placeholder="请选择调拨时间"
                  :style="{ width: width }"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="调出仓库" prop="outRoom">
                <el-select
                  v-model="form.outRoom"
                  filterable
                  clearable
                  placeholder="请选择调出仓库"
                  :style="{ width: width }"
                >
                  <el-option
                    v-for="room in roomOptions"
                    :key="room.roomId"
                    :label="room.roomName"
                    :value="room.roomId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="调入仓库" prop="inRoom">
                <el-select
                  v-model="form.inRoom"
                  filterable
                  clearable
                  placeholder="请选择调入仓库"
                  :style="{ width: width }"
                >
                  <el-option
                    v-for="room in roomOptions"
                    :key="room.roomId"
                    :label="room.roomName"
                    :value="room.roomId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input v-model="form.remark" type="textarea" placeholder="请输入备注"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-divider content-position="center">调拨明细</el-divider>
        <el-row>
          <el-col :span="24">
            <el-table :data="form.details" :key="detailsKey" height="320px" ref="detailsTable">
              <el-table-column label="序号" align="center" type="index" width="60" />
              <el-table-column label="备品备件名称" align="left" width="200">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.spId" v-show="false" />
                  <el-input
                    v-model="scope.row.spName"
                    readonly
                    style="width: 190"
                    suffix-icon="el-icon-search"
                    @focus="selectDetail(scope.$index)"
                  />
                </template>
              </el-table-column>
              <el-table-column label="备品备件编码" align="left" width="200">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.spCode" readonly style="width: 190" />
                </template>
              </el-table-column>
              <el-table-column label="规格" align="left" width="200">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.spSpec" readonly style="width: 190" />
                </template>
              </el-table-column>
              <el-table-column label="型号" align="left" width="200">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.spType" readonly style="width: 190" />
                </template>
              </el-table-column>
              <el-table-column label="单位" align="left" width="100">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.spUnit" readonly style="width: 90" />
                </template>
              </el-table-column>
              <el-table-column label="当前数量" align="center" width="100">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.quantity" readonly style="width: 90" />
                </template>
              </el-table-column>
              <el-table-column label="数量" align="center" width="150">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.amount" placeholder="请输入数量" style="width: 140" />
                </template>
              </el-table-column>
              <el-table-column label="备注" align="center" width="150">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.remark"
                    placeholder="请输入备注"
                    clearable
                    style="width: 140"
                  />
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="100">
                <template slot-scope="scope">
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    circle
                    @click="deleteDetail(scope.row, scope.$index)"
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="24">
            <div class="el-table-add-row" style="width: 99.2%;" @click="addDetail()">
              <span>+ 添加明细</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-show="isView">
        <AllotView :viewData="form" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-show="!isView">确 定</el-button>
        <el-button @click="cancel">{{cancelButtonText}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listAllot,
  getAllot,
  delAllot,
  addAllot,
  updateAllot,
  exportAllot,
  simulateAllot,
} from "@/api/warehouse/allot";
import { listRoomAll } from "@/api/warehouse/room";
import { listUser, getUserProfile } from "@/api/system/user";
import AllotView from "@/views/components/warehouse/AllotView";
import SelectSp from "@/views/components/warehouse/SelectSp";

export default {
  name: "Allot",
  components: { AllotView, SelectSp },
  data() {
    return {
      // 统一宽度
      width: "300px",
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 备品备件调拨 表格数据
      allotList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        allotCode: undefined,
      },
      // 时间
      dateRangeAllotDate: [],
      // 仓库
      roomOptions: [],
      // 人员列表
      userOptions: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        allotBy: [{ required: true, message: "请选择调拨人", trigger: "blur" }],
        allotDate: [
          { required: true, message: "请选择调拨时间", trigger: "blur" },
        ],
        outRoom: [
          { required: true, message: "请选择调出仓库", trigger: "blur" },
        ],
        inRoom: [
          { required: true, message: "请选择调入仓库", trigger: "blur" },
        ],
      },
      detailsKey: +new Date(),
      // 明细下标
      index: undefined,
      //选中的备品备件
      currentRow: null,
      //
      isShow: false,
      selectData: undefined,
      selectKey: +new Date(),
      //
      isView: false,
      cancelButtonText: "取 消",
    };
  },
  created() {
    this.getList();
    this.getRoomList();
    this.getUserList();
  },
  methods: {
    /** 查询备品备件调拨 列表 */
    getList() {
      this.loading = true;
      const param = this.addDateRange(
        this.queryParams,
        this.dateRangeAllotDate
      );
      listAllot(param).then((response) => {
        this.allotList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 获取仓库
    getRoomList() {
      listRoomAll().then((response) => {
        this.roomOptions = [];
        this.roomOptions = response.rows;
      });
    },
    // 获取用户
    getUserList() {
      listUser().then((response) => {
        this.userOptions = response.rows;
      });
    },
    // 表单重置
    reset() {
      this.form = {
        allotId: undefined,
        allotGuid: undefined,
        allotCode: undefined,
        allotBy: undefined,
        allotDate: undefined,
        outRoom: undefined,
        inRoom: undefined,
        sumAmount: undefined,
        sumPrice: undefined,
        remark: undefined,
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        details: [],
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
      this.dateRangeAllotDate = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      getUserProfile().then((response) => {
        this.user = response.data;
        this.form.allotBy = response.data.userId;
        this.isView = false;
        this.cancelButtonText = "取 消";
        this.open = true;
        this.title = "添加调拨单";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row, isView) {
      this.reset();
      const allotId = row.allotId;
      getAllot(allotId).then((response) => {
        this.form = response.data;
        this.isView = isView;
        this.cancelButtonText = isView ? "关 闭" : "取 消";
        this.open = true;
        this.title = isView ? "查看调拨单" : "修改调拨单";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: "正在提交,请稍候......",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          if (this.form.allotId != undefined) {
            updateAllot(this.form).then((response) => {
              loading.close();
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addAllot(this.form).then((response) => {
              loading.close();
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
    selectDetail(index) {
      this.index = index;
      this.selectData = { type: "room", roomId: this.form.outRoom };
      this.isShow = true;
      this.selectKey = +new Date();
    },
    handleCurrentRow(value) {
      if (value && this.index > -1) {
        this.form.details[this.index] = value;
        this.index = undefined;
        this.currentRow = null;
        this.detailsKey = +new Date();
      }
    },
    deleteDetail(row, index) {
      this.form.details.splice(index, 1);
    },
    addDetail() {
      let data = {
        id: undefined,
        guid: undefined,
        allotId: undefined,
        spId: undefined,
        spCode: undefined,
        spName: undefined,
        roomId: undefined,
        spSpec: undefined,
        spType: undefined,
        spUnit: undefined,
        amount: undefined,
        sprice: undefined,
        price: undefined,
        remark: undefined,
        delFlag: undefined,
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
      };
      this.form.details.push(data);
      this.$nextTick(() => {
        this.$refs.detailsTable.bodyWrapper.scrollTop = this.$refs.detailsTable.bodyWrapper.scrollHeight;
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const allotIds = row.allotId;
      const loading = this.$loading({
        lock: true,
        text: "正在删除,请稍候......",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      this.$confirm(
        '是否确认删除编号为"' + row.allotCode + '"的调拨单?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          delAllot(allotIds).then((response) => {
            loading.close();
            if (response.code === 200) {
              this.getList();
              this.msgSuccess("删除成功");
            } else {
              this.msgError("删除失败");
            }
          });
        })
        .catch(() => {
          loading.close();
        });
    },
    handleAllot(row) {
      const allotIds = row.allotId;
      const loading = this.$loading({
        lock: true,
        text: "正在调拨,请稍候......",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      this.$confirm(
        '是否确认模拟调拨编号为"' + row.allotCode + '"的调拨单?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          simulateAllot(allotIds).then((response) => {
            loading.close();
            if (response.code === 200) {
              this.getList();
              this.msgSuccess("模拟调拨成功");
            } else {
              this.msgError("模拟调拨失败");
            }
          });
        })
        .catch(() => {
          loading.close();
        });
    },
  },
};
</script>

<style scoped>
.el-table-add-row {
  margin-top: 10px;
  width: 100%;
  height: 34px;
  border: 1px dashed #c1c1cd;
  border-radius: 3px;
  cursor: pointer;
  justify-content: center;
  display: flex;
  line-height: 34px;
}
</style>