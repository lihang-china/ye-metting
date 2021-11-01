<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="退库编号" prop="returnCode">
        <el-input v-model="queryParams.returnCode" placeholder="请输入退库编号" clearable size="small" />
      </el-form-item>
      <el-form-item label="退库时间" prop="returnDate">
        <el-date-picker
          v-model="dateRangeReturnDate"
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
          v-hasPermi="['warehouse:return:add']"
        >新增</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="returnList">
      <el-table-column label="序号" align="center" type="index" width="60" />
      <el-table-column label="退库编号" align="left" prop="returnCode" />
      <el-table-column label="退库仓库" align="center" prop="roomName" />
      <el-table-column label="退库时间" align="center" prop="returnDate">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.returnDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单据状态" align="center">
        <template slot-scope="scope">{{scope.row.status === '0' ? "未退库" : "已退库" }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row, false)"
            v-hasPermi="['warehouse:return:edit']"
            v-show="scope.row.status === '0'"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['warehouse:return:remove']"
            v-show="scope.row.status === '0'"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-files"
            @click="handleReturn(scope.row)"
            v-show="scope.row.status === '0'"
          >模拟退库</el-button>
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

    <!-- 添加或修改备品备件退库 对话框 -->
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
              <el-form-item label="退库人" prop="returnBy">
                <el-select
                  v-model="form.returnBy"
                  filterable
                  clearable
                  placeholder="请选择退库人"
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
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="退库仓库" prop="roomId">
                <el-select
                  v-model="form.roomId"
                  filterable
                  clearable
                  placeholder="请选择退库仓库"
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
              <el-form-item label="退库时间" prop="returnDate">
                <el-date-picker
                  clearable
                  size="small"
                  v-model="form.returnDate"
                  type="datetime"
                  placeholder="选择退库时间"
                  :style="{ width: width }"
                ></el-date-picker>
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
        <el-divider content-position="center">退库明细</el-divider>
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
        <ReturnView :viewData="form" :key="viewKey" />
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
  listReturn,
  getReturn,
  delReturn,
  addReturn,
  updateReturn,
  exportReturn,
  simulateReturn,
} from "@/api/warehouse/return";
import { listRoomAll } from "@/api/warehouse/room";
import { listUser, getUserProfile } from "@/api/system/user";
import ReturnView from "@/views/components/warehouse/ReturnView";
import SelectSp from "@/views/components/warehouse/SelectSp";

export default {
  name: "Return",
  components: { ReturnView, SelectSp },
  data() {
    return {
      // 统一宽度
      width: "300px",
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 备品备件退库 表格数据
      returnList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        returnCode: undefined,
      },
      // 入库时间
      dateRangeReturnDate: [],
      // 仓库
      roomOptions: [],
      // 人员列表
      userOptions: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        returnBy: [
          { required: true, message: "请选择退库人", trigger: "blur" },
        ],
        roomId: [
          { required: true, message: "请选择退库仓库", trigger: "blur" },
        ],
        returnDate: [
          { required: true, message: "请选择退库时间", trigger: "blur" },
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
      //
      viewKey: +new Date(),
    };
  },
  created() {
    this.getList();
    this.getRoomList();
    this.getUserList();
  },
  methods: {
    /** 查询备品备件退库 列表 */
    getList() {
      this.loading = true;
      const param = this.addDateRange(
        this.queryParams,
        this.dateRangeReturnDate
      );
      listReturn(param).then((response) => {
        this.returnList = response.rows;
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
        returnId: undefined,
        returnGuid: undefined,
        returnCode: undefined,
        returnBy: undefined,
        roomId: undefined,
        returnDate: undefined,
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
      this.dateRangeReturnDate = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      getUserProfile().then((response) => {
        this.user = response.data;
        this.form.returnBy = response.data.userId;
        this.isView = false;
        this.cancelButtonText = "取 消";
        this.open = true;
        this.title = "添加退库单";
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row, isView) {
      this.reset();
      const returnId = row.returnId;
      getReturn(returnId).then((response) => {
        this.form = response.data;
        this.isView = isView;
        this.cancelButtonText = isView ? "关 闭" : "取 消";
        this.open = true;
        this.title = isView ? "查看退库单" : "修改退库单";
        if (isView) {
          this.viewKey = +new Date();
        }
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
          if (this.form.returnId != undefined) {
            updateReturn(this.form).then((response) => {
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
            addReturn(this.form).then((response) => {
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
      this.selectData = {
        type: "use",
        roomId: this.form.roomId,
        useBy: this.form.returnBy,
      };
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
        returnId: undefined,
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
      const returnIds = row.returnId;
      const loading = this.$loading({
        lock: true,
        text: "正在删除,请稍候......",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      this.$confirm(
        '是否确认删除编号为"' + row.returnCode + '"的退库单?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          delReturn(returnIds).then((response) => {
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
    handleReturn(row) {
      const returnIds = row.returnId;
      const loading = this.$loading({
        lock: true,
        text: "正在退库,请稍候......",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      this.$confirm(
        '是否确认模拟退库编号为"' + row.returnCode + '"的退库单?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          simulateReturn(returnIds).then((response) => {
            loading.close();
            if (response.code === 200) {
              this.getList();
              this.msgSuccess("模拟退库成功");
            } else {
              this.msgError("模拟退库失败");
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