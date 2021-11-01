<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
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
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="cardList">
      <el-table-column label="序号" align="center" type="index" />
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
            icon="el-icon-delete-solid"
            @click="handleScrap(scope.row)"
            v-hasPermi="['equipment:card:scrap']"
            v-if="scope.row.scrId == '-1'"
          >报废报损</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleRevoke(scope.row)"
            v-hasPermi="['equipment:card:scrap']"
            v-if="scope.row.scrId != '-1'"
          >撤销</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row.scrId)"
            v-hasPermi="['equipment:card:scrap']"
            v-if="scope.row.scrId != '-1'"
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

    <el-dialog :title="title" :visible.sync="open" width="1200px" :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="设备编号" prop="equCode">
              <el-input v-model="form.equCode" :disabled="true" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备名称" prop="equName">
              <el-input v-model="form.equName" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="view">
          <el-col :span="12">
            <el-form-item label="报废报损编号" prop="scrCode">
              <el-input v-model="form.scrCode" :disabled="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="报废报损原因" prop="scrReason">
              <el-select
                v-model="form.scrReason"
                placeholder="请选择报废报损原因"
                style="width: 80%"
                :disabled.sync="view"
              >
                <el-option
                  v-for="dict in scrReasonOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input
                v-model="form.remark"
                type="textarea"
                placeholder="请输入备注"
                :disabled.sync="view"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-show="!view">确 定</el-button>
        <el-button @click="cancel" v-show="!view">取 消</el-button>
        <el-button @click="cancel" v-show="view">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listCard,
  scrapEqu,
  scrapRevoke,
  getScrap
} from "@/api/equipment/card";

export default {
  name: "CardScrap",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 设备档案表格数据
      cardList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否为查看
      view: false,
      // 设备使用状态 字典
      equStatusOptions: [],
      //报废报损原因
      scrReasonOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        equCode: undefined,
        equName: undefined
      },
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        scrReason: [
          { required: true, message: "请选择报废报损理由", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("equ_status_type").then(response => {
      this.equStatusOptions = response.data;
    });
    this.getDicts("equ_scrap_type").then(response => {
      this.scrReasonOptions = response.data;
    });
  },
  methods: {
    /** 查询设备档案列表 */
    getList() {
      this.loading = true;
      listCard(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.cardList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 设备使用状态 字典翻译
    equStatusFormat(row, column) {
      return this.selectDictLabel(this.equStatusOptions, row.equStatus);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.view = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        equId: undefined,
        equCode: undefined,
        equName: undefined,
        scrReason: undefined,
        remark: undefined
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
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 报废报损按钮操作 */
    handleScrap(row) {
      this.reset();
      this.form.equId = row.equId;
      this.form.equCode = row.equCode;
      this.form.equName = row.equName;
      this.open = true;
      this.view = false;
      this.title = "报废报损";
    },
    /** 撤销按钮操作 */
    handleRevoke(row) {
      const { equId, equCode } = row;
      this.$confirm("是否确认撤销'" + equCode + "'设备的报废报损?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return scrapRevoke(equId);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("撤销成功");
        })
        .catch(function() {});
    },
    /** 查看按钮操作 */
    handleView(scrId) {
      this.reset();
      getScrap(scrId).then(response => {
        this.form = response.data;
        this.open = true;
        this.view = true;
        this.title = "查看";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          scrapEqu(this.form).then(response => {
            if (response.code === 200) {
              this.msgSuccess("报废报损成功");
              this.open = false;
              this.view = false;
              this.getList();
            } else {
              this.msgError(response.msg);
            }
          });
        }
      });
    }
  }
};
</script>