<template>
  <div class="areaConfig-view">
    <div class="menu-view">
      <div
        class="item-view"
        :class="{ active: nhType == 1 }"
        @click="
          nhType = 1;
          getList();
        "
      >
        <img src="@/assets/image/energy/electric.png" />
        <a>电</a>
      </div>
      <div
        class="item-view"
        :class="{ active: nhType == 2 }"
        @click="
          nhType = 2;
          getList();
        "
      >
        <img src="@/assets/image/energy/water.png" />
        <a>水</a>
      </div>
      <div
        class="item-view"
        :class="{ active: nhType == 3 }"
        @click="
          nhType = 3;
          getList();
        "
      >
        <img src="@/assets/image/energy/air.png" />
        <a>气</a>
      </div>
    </div>

    <div class="right-view">
      <div class="top-view">
        <div class="item-view">
          <a>{{ deviceLabel + "编码" }}</a>
          <el-input
            class="input"
            v-model="queryParams.deviceCode"
            :placeholder="deviceLabel + '编码'"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </div>
        <div class="item-view">
          <a>{{ deviceLabel + "名称" }}</a>
          <el-input
            class="input"
            v-model="queryParams.deviceName"
            :placeholder="deviceLabel + '名称'"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </div>
        <div class="item-view">
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
            >查询</el-button
          >
          <el-button
            class="filter-item"
            icon="el-icon-refresh"
            size="mini"
            @click="resetQuery"
            >重置</el-button
          >
        </div>
      </div>

      <div class="bottom-view">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd()"
              >添加</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleRemove"
              >批量移除</el-button
            >
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="areaConfigList"
          tooltip-effect="dark"
          border
          style="width: 100%; background: none; color: white"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="deviceCode" :label="deviceLabel + '编码'" />
          <el-table-column prop="deviceName" :label="deviceLabel + '名称'" />
          <el-table-column prop="ftxs" label="分摊系数" width="150" />
          <el-table-column
            prop="ftxs"
            label="计算规则"
            width="150"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.ruleFlag == 1 ? "加" : "减" }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="200"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleRemove(scope.row)"
                >移除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog
      title="能耗区域设置"
      :append-to-body="true"
      :visible.sync="open"
      width="60%"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="98px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item :label="deviceLabel" prop="deviceId">
              <el-select
                v-model="form.deviceId"
                filterable
                remote
                reserve-keyword
                :placeholder="'请输入' + deviceLabel + '编码或名称以查询选择'"
                :remote-method="remoteMethod"
                :loading="selectLoading"
                style="width: 700px"
              >
                <el-option
                  v-for="device in deviceOptions"
                  :key="device.equId"
                  :label="device.equName"
                  :value="device.equId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="分摊系数" prop="ftxs">
              <el-input v-model="form.ftxs" placeholder="请输入分摊系数" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="算法规则" prop="ruleFlag">
              <el-radio-group v-model="form.ruleFlag">
                <el-radio
                  v-for="ruleFlag in ruleFlagOptions"
                  :key="ruleFlag.value"
                  :label="ruleFlag.value"
                  >{{ ruleFlag.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="mome">
          <el-input type="textarea" v-model="form.mome" :rows="4"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getArea } from "@/api/energy/basic/area";
import {
  listAreaConfigSetting,
  getAreaConfig,
  delAreaConfig,
  addAreaConfig,
} from "@/api/energy/basic/areaConfig";
import { listNhSetting } from "@/api/equipment/card";

export default {
  name: "AreaSet",
  data() {
    return {
      // 区域Id
      areaId: undefined,
      // 能源类型
      nhType: 1,
      // 设备
      deviceLabel: undefined,
      // 弹窗
      open: false,
      // 总数
      total: undefined,
      // 遮罩
      loading: true,
      // 下拉遮罩
      selectLoading: false,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 数据集
      areaConfigList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        //电水气能量
        nhType: undefined,
        areaId: undefined,
        deviceName: undefined,
        deviceCode: undefined,
      },
      // 设备列表
      deviceOptions: [],
      // 表单数据
      form: {},
      // 表单校验
      rules: {
        deviceId: [{ required: true, message: "请选择设备", trigger: "blur" }],
        ftxs: [{ required: true, message: "请输入分摊系数", trigger: "blur" }],
        ruleFlag: [
          { required: true, message: "请选择算法规则", trigger: "blur" },
        ],
      },
      // 算法规则
      ruleFlagOptions: [
        {
          value: 1,
          label: "加",
        },
        {
          value: 0,
          label: "减",
        },
      ],
    };
  },
  created() {
    this.areaId = this.$route.params.areaId;
    this.getList();
  },
  methods: {
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.deviceName = undefined;
      this.queryParams.deviceCode = undefined;

      this.handleQuery();
    },
    getList() {
      this.loading = true;
      switch (this.nhType) {
        case 1:
          this.deviceLabel = "电表";
          break;
        case 2:
          this.deviceLabel = "水表";
          break;
        default:
          this.deviceLabel = "蒸汽表";
          break;
      }
      this.queryParams.nhType = this.nhType;
      this.queryParams.areaId = this.areaId;
      listAreaConfigSetting(this.queryParams).then((response) => {
        this.areaConfigList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // getDevices() {
    //   listNhSetting({ nhType: this.nhType }).then((response) => {
    //     this.deviceOptions = response.rows;
    //   });
    // },
    remoteMethod(query) {
      if (query !== "") {
        this.selectLoading = true;
        listNhSetting({ nhType: this.nhType, equCode: query }).then(
          (response) => {
            this.deviceOptions = response.rows;
            this.selectLoading = false;
          }
        );
      } else {
        this.deviceOptions = [];
      }
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.multiple = !selection.length;
    },
    resetFrom() {
      this.form = {
        deviceId: undefined,
        areaId: undefined,
        ftxs: undefined,
        bitNo: undefined,
        ruleFlag: 1,
        nhType: undefined,
        description: undefined,
        isSum: 0,
        memo: undefined,
      };
    },
    handleAdd() {
      this.resetFrom();
      //this.getDevices();
      this.open = true;
    },
    handleRemove(row) {
      const ids = row.id || this.ids;
      this.$confirm("是否确定移除所选择的设备?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const loading = this.openLoading("正常移除设备,请稍后......");
          delAreaConfig(ids).then((response) => {
            loading.close();
            if (response.code === 200) {
              this.msgSuccess("移除成功");
              this.getList();
            } else {
              this.msgError("移除失败");
            }
          });
        })
        .catch(() => {
          loading.close();
        });
    },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.nhType = this.nhType;
          this.form.areaId = this.areaId;
          let obj = this.deviceOptions.find(
            (t) => t.equId === this.form.deviceId
          );
          if (obj) {
            this.form.bitNo = obj.equCode;
          }
          console.log(this.form);
          addAreaConfig(this.form).then((response) => {
            if (response.code === 200) {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            } else {
              this.msgError(response.msg);
            }
          });
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.resetFrom();
    },
  },
};
</script>

<style lang="scss">
@import "~@/assets/styles/common.scss";

.el-table::before {
  height: 0 !important;
}
.areaConfig-view {
  display: flex;
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  .menu-view {
    width: rem(74);
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: rem(13);
    background: #051413;
    .item-view {
      width: rem(40);
      margin-bottom: rem(12);
      height: rem(120);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: rem(29);
      color: white;
      font-size: bold;
      cursor: pointer;
      border-radius: 2px;
      background: linear-gradient(0deg, #3e77c4, #8eb3e8);
      img {
        width: rem(20);
        height: rem(36);
        margin-bottom: rem(16);
      }
    }
    .active {
      background: linear-gradient(0deg, #0066ff, #00c6ff);
    }
  }
  .left-view {
    width: rem(360);
    height: 100%;
    background: #051413;
    .top-view {
      height: rem(30);
      width: 100%;
      display: flex;
      align-items: center;
      padding-left: rem(51);
      background: #031d4f;
      img {
        width: rem(14);
        height: rem(16);
        margin-right: rem(8);
      }
      a {
        font-size: rem(14);
        font-weight: 400;
        color: #cfdce6;
      }
    }
    .content-view {
      padding-left: rem(41);
      padding-bottom: rem(41);
      color: white;
      background: none;
      overflow-y: auto;
      height: 100%;
      .el-tree-node__content:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
      .el-tree-node.is-current > .el-tree-node__content {
        background-color: rgba(255, 255, 255, 0.2) !important;
      }
    }
  }
  .right-view {
    display: flex;
    flex-direction: column;
    margin: rem(15) rem(29) rem(0) rem(18);
    padding-bottom: rem(20);
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    .top-view {
      width: 100%;
      padding: rem(15) rem(12);
      display: flex;
      align-items: center;
      background: rgba(1, 68, 144, 0.5);
      margin-bottom: rem(11);
      .item-view {
        display: flex;
        align-items: center;
        margin-left: rem(36);
        &:first-child {
          margin-left: 0;
        }
        a {
          font-size: rem(14);
          font-weight: 400;
          color: #cfdce6;
          margin-right: rem(24);
        }
        .input {
          width: rem(300);
        }
      }
    }
    .bottom-view {
      width: 100%;
      height: 100%;
      padding: rem(20) rem(14);
      display: flex;
      flex-direction: column;
      background: rgba(1, 68, 144, 0.5);
      .el-table--border {
        border: none;
        border-top: 1px solid #2a5e96;
        &::after {
          width: 0;
        }
      }
      .el-table {
        margin-top: rem(10);

        tr {
          background: none;
          &:hover td {
            background: rgba(255, 255, 255, 0.3);
          }
          td {
            &:first-child {
              border-left: 1px solid #2a5e96;
            }
          }
        }
        td {
          // border: none;
          border-color: #2a5e96;
        }
        th {
          background: rgba(2, 96, 204, 0.6);
          color: white;
          border-color: #2a5e96;
          &:first-child {
            border-left: 1px solid #2a5e96;
          }
        }
      }
    }
  }
}
</style>