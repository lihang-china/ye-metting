<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="模式名" prop="equJobCalendarName">
        <el-input
          v-model="queryParams.equJobCalendarName"
          placeholder="请输入模式名"
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
        <el-button
          type="success"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['equipment:jobCalendar:add']"
          >新增</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="24" v-loading="loading">
      <el-col
        :span="4"
        v-for="(calendar, index) in calendarList"
        :key="index"
        style="margin-top: 24px"
      >
        <el-card shadow="hover">
          <div style="padding: 14px">
            <div class="title">
              <font class="fonttext">场景名称：</font>
              {{ calendar.equJobCalendarName }}
            </div>
            <!-- <div class="subtitle">
              <font class="fonttext">位号类型：</font>
              {{channelTypeFormat(calendar.channelType)}}
            </div> -->
            <div class="subtitle">
              <font class="fonttext">重复：</font>
              {{ repeatTimeTypeFormat(calendar.repeatTimeType) }}
            </div>
            <div class="bottom clearfix">
              <el-popover placement="bottom" trigger="click">
                <el-row :gutter="10">
                  <el-col :span="1.5">
                    <el-button
                      type="warning"
                      size="mini"
                      v-show="
                        calendar.repeatTimeType === 4 ||
                        calendar.repeatTimeType === 5
                      "
                      @click="handDateSetting(calendar)"
                      >配置重复时间</el-button
                    >
                  </el-col>
                  <el-col :span="1.5">
                    <el-button
                      type="danger"
                      size="mini"
                      @click="handleSetting(calendar)"
                      >配置时间计划</el-button
                    >
                  </el-col>
                </el-row>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-s-tools"
                  slot="reference"
                  class="button"
                  >配 置</el-button
                >
              </el-popover>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(calendar)"
                class="button"
                v-hasPermi="['equipment:jobCalendar:edit']"
                >修 改</el-button
              >
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改模式管理对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="模式名" prop="equJobCalendarName">
          <el-input
            v-model="form.equJobCalendarName"
            placeholder="请输入模式名"
          />
        </el-form-item>
        <!-- <el-form-item label="位号类型" prop="channelType">
          <el-select v-model="form.channelType" placeholder="请选择位号类型">
            <el-option
              v-for="option in channelTypeOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="重复类型" prop="repeatTimeType">
          <el-select v-model="form.repeatTimeType" placeholder="请选择重复类型">
            <el-option
              v-for="option in repeatTimeTypeOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-loading="loadingRepeat"
      element-loading-text="正在提交"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      title="选择重复时间"
      :visible.sync="openRepeat"
      width="700px"
      :close-on-click-modal="false"
    >
      <div v-show="dateParams.repeatTimeType === 4">
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="weekAll"
          @change="handleCheckAllChange"
          >全选</el-checkbox
        >
        <div style="margin: 15px 0"></div>
        <el-checkbox-group
          v-model="weekChecked"
          @change="handleCheckedWeekChange"
        >
          <el-checkbox
            v-for="week in weekOptions"
            :label="week"
            :key="week.value"
            >{{ week.label }}</el-checkbox
          >
        </el-checkbox-group>
      </div>
      <div v-show="dateParams.repeatTimeType === 5">
        <el-row>
          <el-col :span="24">
            <el-table
              v-loading="loadingYear"
              :data="yearList"
              height="560px"
              ref="yearTable"
            >
              <el-table-column label="序号" align="center" type="index" />
              <el-table-column label="日期" align="center">
                <template slot-scope="scope">
                  <el-date-picker
                    v-model="scope.row.equYearDay"
                    type="date"
                    placeholder="选择日期"
                    format="MM 月 dd 日"
                    value-format="MM-dd"
                  ></el-date-picker>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <span
                    class="el-tag el-tag--mini"
                    style="cursor: pointer"
                    @click="yearDelete(scope.row, scope.$index)"
                    >删除</span
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="24">
            <div
              class="el-table-add-row"
              style="width: 99.2%"
              @click="yearAdd()"
            >
              <span>+ 添加日期</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitRepeat">确 定</el-button>
        <el-button @click="cancelRepeat">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listCalendars,
  getCalendars,
  addCalendars,
  updateCalendars,
  getWeek,
  saveWeek,
  getYear,
  saveYear,
} from "@/api/calendar/calendars";

const weekList = [
  {
    label: "周一",
    value: 1,
  },
  {
    label: "周二",
    value: 2,
  },
  {
    label: "周三",
    value: 3,
  },
  {
    label: "周四",
    value: 4,
  },
  {
    label: "周五",
    value: 5,
  },
  {
    label: "周六",
    value: 6,
  },
  {
    label: "周日",
    value: 7,
  },
];

export default {
  name: "Calendars",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 模式管理表格数据
      calendarList: [],
      // 位号类型字典
      // channelTypeOptions: [
      //   { label: "开关量", value: 0 },
      //   { label: "模拟量", value: 1 },
      //   { label: "字符串", value: 2 },
      // ],
      // 重复类型字典
      repeatTimeTypeOptions: [
        { label: "执行一次", value: 1 },
        { label: "每天", value: 2 },
        { label: "周一至周五", value: 3 },
        { label: "每周", value: 4 },
        { label: "每年", value: 5 },
      ],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        equJobCalendarName: undefined,
        //channelType: undefined,
        repeatTimeType: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        equJobCalendarName: [
          { required: true, message: "请输入模式名", trigger: "blur" },
        ],
        // channelType: [
        //   { required: true, message: "请选择位号类别", trigger: "blur" },
        // ],
        repeatTimeType: [
          { required: true, message: "请选择重复类型", trigger: "blur" },
        ],
      },
      // 配置周
      weekAll: false,
      weekChecked: [],
      weekOptions: weekList,
      isIndeterminate: false,
      //配置年
      loadingYear: false,
      yearList: [],
      // 配置重复时间
      loadingRepeat: false,
      dateParams: {
        equJobCalendarId: undefined,
        repeatTimeType: undefined,
      },
      openRepeat: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询模式管理列表 */
    getList() {
      this.loading = true;
      listCalendars(this.queryParams).then((response) => {
        this.calendarList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 位号类型字典翻译
    // channelTypeFormat(value) {
    //   //(row, column) {
    //   return this.channelTypeOptions.find((t) => t.value === value).label;
    // },
    // 重复类型字典翻译
    repeatTimeTypeFormat(value) {
      //(row, column) {
      return this.repeatTimeTypeOptions.find((t) => t.value === value).label;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        equJobCalendarId: undefined,
        equJobCalendarName: undefined,
        //channelType: undefined,
        repeatTimeType: undefined,
        remark: undefined,
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加模式";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      getCalendars(row.equJobCalendarId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改模式";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.equJobCalendarId != undefined) {
            updateCalendars(this.form.equJobCalendarId, this.form).then(
              (response) => {
                if (response.code === 200) {
                  this.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                } else {
                  this.msgError(response.msg);
                }
              }
            );
          } else {
            addCalendars(this.getFormArray(this.form)).then((response) => {
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
    /** 重置配置周 */
    resetWeek() {
      this.weekAll = false;
      this.weekChecked = [];
      this.isIndeterminate = false;
    },
    /** 重置配置年 */
    resetYear() {
      this.loadingYear = false;
      this.yearList = [];
    },
    /** 打开配置重复时间 */
    handDateSetting(row) {
      // 4-周 5-年
      this.dateParams = row;
      this.openRepeat = false;
      if (this.dateParams.repeatTimeType === 4) {
        this.resetWeek();
        getWeek(this.dateParams.equJobCalendarId).then((response) => {
          response.data.forEach((item) => {
            let week = weekList.find((t) => t.value === item.equWeekDay);
            if (week) {
              this.weekChecked.push(week);
            }
          });
          if (this.weekChecked.length === 7) {
            this.weekAll = true;
          } else if (this.weekChecked.length > 0) {
            this.isIndeterminate = true;
          }
          this.openRepeat = true;
        });
      } else if (this.dateParams.repeatTimeType === 5) {
        this.resetYear();
        this.loadingYear = true;
        getYear(this.dateParams.equJobCalendarId).then((response) => {
          this.yearList = response.data;
          this.loadingYear = false;
          this.openRepeat = true;
        });
      }
    },
    /** 周全选 */
    handleCheckAllChange(val) {
      this.weekChecked = val ? weekList : [];
      this.isIndeterminate = false;
    },
    /** 周单选 */
    handleCheckedWeekChange(value) {
      let checkedCount = value.length;
      this.weekAll = checkedCount === this.weekOptions.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.weekOptions.length;
    },
    /** 删除年配置的日期 */
    yearDelete(row, index) {
      this.yearList.splice(index, 1);
    },
    /** 添加年配置的日期 */
    yearAdd() {
      let data = {
        equYearId: undefined,
        equYearDay: undefined,
        equJobCalendarId: this.dateParams.equJobCalendarId,
      };
      this.yearList.push(data);
      this.$nextTick(() => {
        this.$refs.yearTable.bodyWrapper.scrollTop = this.$refs.yearTable.bodyWrapper.scrollHeight;
      });
    },
    /** 取消配置重复时间 */
    cancelRepeat() {
      this.openRepeat = false;
      if (this.dateParams.repeatTimeType === 4) {
        this.resetWeek();
      } else if (this.dateParams.repeatTimeType === 5) {
      }
    },
    /** 提交配置重复时间 */
    submitRepeat() {
      this.loadingRepeat = true;

      if (this.dateParams.repeatTimeType === 4) {
        let data = [];
        if (this.weekChecked.length > 0) {
          this.weekChecked.forEach((item) => {
            data.push({ equWeekDay: item.value });
          });
        }
        saveWeek(this.dateParams.equJobCalendarId, data).then((response) => {
          this.loadingRepeat = false;
          if (response.code === 200) {
            this.msgSuccess("提交成功");
            this.openRepeat = false;
            this.getList();
          } else {
            this.msgError(response.msg);
          }
        });
      } else if (this.dateParams.repeatTimeType === 5) {
        saveYear(this.dateParams.equJobCalendarId, this.yearList).then(
          (response) => {
            this.loadingRepeat = false;
            if (response.code === 200) {
              this.msgSuccess("提交成功");
              this.openRepeat = false;
              this.getList();
            } else {
              this.msgError(response.msg);
            }
          }
        );
      }
    },
    handleSetting(row) {
      const { equJobCalendarId } = row;
      this.$router.push({
        name: "TimeJob",
        params: { equJobCalendarId: equJobCalendarId },
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
.title {
  font-size: 16px;
  color: #303133;
  margin-bottom: 15px;
}
.subtitle {
  font-size: 13px;
  color: #909399;
  margin-top: 10px;
}
.fonttext {
  font-weight: bold;
}
.bottom {
  margin-top: 13px;
  line-height: 12px;
}
.button {
  padding: 0;
  float: right;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>