<template>
  <div class="costAccounting-view">
    <div class="right-view">
      <div class="top-view">
        <div class="item-view">
          <a>区域</a>
          <treeselect
            style="width: 200px"
            v-model="queryParams.pid"
            :options="data"
            :normalizer="normalizer"
            placeholder="请选择区域"
          />
        </div>
        <div class="item-view">
          <el-checkbox v-model="checked" style="color: white"
            >是否通过下级区域汇总生成</el-checkbox
          >
        </div>
      </div>
      <div class="bottom-view">
        <div class="result-content">
          <div class="top">
            <div class="left" id="left">
              <div class="table-container">
                <div class="table-title">
                  <div class="title">能耗配置</div>
                  <div class="add-row" @click="addDevice('left')"></div>
                </div>
                <div class="table-bordered bg-change">
                  <div class="ui-table-scoll">
                    <el-table
                      ref="rightTable"
                      border
                      :data="tableData"
                      tooltip-effect="dark"
                      style="width: 100%; background: none; color: white"
                    >
                      <el-table-column
                        :label="deviceName + '编码'"
                        prop="deviceCode"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="deviceName"
                        :label="deviceName + '名称'"
                      >
                      </el-table-column>
                      <el-table-column prop="area" label="安装位置">
                      </el-table-column>
                      <el-table-column label="分摊系数">
                        <template slot-scope="scope">
                          <el-input
                            v-model="input"
                            placeholder="请输入系数"
                          ></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column label="操作">
                        <template slot-scope="scope">
                          <el-button
                            type="danger"
                            icon="el-icon-delete"
                            circle
                          ></el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </div>
              </div>
              <div class="icon">
                <span>减去</span>
                <div class="icon-minus"></div>
              </div>
              <div class="table-container">
                <div class="table-title">
                  <div class="title">能耗配置</div>
                  <div class="add-row" @click="addDevice('right')"></div>
                </div>
                <div class="table-bordered bg-change">
                  <el-table
                    ref="leftTable"
                    border
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width: 100%; background: none; color: white"
                  >
                    <el-table-column
                      :label="deviceName + '编码'"
                      prop="deviceCode"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="deviceName"
                      :label="deviceName + '名称'"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="area"
                      label="安装位置"
                    ></el-table-column>
                    <el-table-column label="分摊系数">
                      <template slot-scope="scope">
                        <el-input
                          v-model="input"
                          placeholder="请输入系数"
                        ></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <el-button
                          type="danger"
                          icon="el-icon-delete"
                          circle
                        ></el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
            <div class="middle" id="middle">
              <span>等于</span>
              <div class="icon-equals"></div>
            </div>
            <div class="right" id="right">
              <div class="title">能耗配置描述</div>
              <div class="content">
                <!-- <textarea readonly id="description">
                  {{ areaConfig.description }}
                </textarea> -->
                {{ areaConfig.description }}
              </div>
            </div>
          </div>
          <div class="bottom">
            <div class="left">
              <div class="title">备注</div>
              <div class="text-area">
                <textarea
                  v-model="areaConfig.memo"
                  maxlength="100"
                  placeholder="最多可输入100个字"
                  name="memo"
                ></textarea>
              </div>
            </div>
            <div class="right">
              <div class="button cancel" onclick="reply()">取消</div>
              <div class="button save" onclick="save()">保存</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <aForm ref="forma" />
  </div>
</template>

<script>
import aForm from "./select";
import { listDept } from "@/api/energy/basic/dept";
import { listArea } from "@/api/energy/basic/area";
import { costAccountingList } from "@/api/energy/app/cost";
import { handleTree } from "@/utils/ruoyi";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import moment from "moment";

export default {
  name: "EnergyCostAccounting",
  components: { Treeselect, aForm },
  data() {
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      data: [],
      tableData: [],
      checked: false,
      deviceName: "",
      areaConfig: {},
    };
  },
  created() {
    this.initData();
    switch (this.$route.query.nhType) {
      case 1:
        this.deviceName = "电表";
        break;
      case 2:
        this.deviceName = "水表";
        break;
      case "1":
        this.deviceName = "电表";
        break;
      case "2":
        this.deviceName = "水表";
        break;
      default:
        this.deviceName = "蒸汽表";
        break;
    }
  },
  methods: {
    addDevice(type) {
      const _this = this.$refs.forma;
      _this.dialog = true;
      _this.getList();
    },
    /** 转换系统命名规约数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.areaName,
        children: node.children,
      };
    },
    initData() {
      // listDept({ ...this.queryParams, pageNum: 1, pageSize: 9999 }).then(
      //   (res) => {
      //     this.data = this.handleTree(res.rows, "id", "pid");
      //   }
      // );
      // console.log(this.$route.query.energyType, this.$route.query.id);
      listArea().then((response) => {
        this.data = this.handleTree(response.data, "id", "parentId");
      });
    },
  },
};
</script>

<style lang="scss">
@import "~@/assets/styles/common.scss";

.el-table::before {
  height: 0 !important;
}
.costAccounting-view {
  display: flex;
  height: 100%;
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
      color: white;
      background: none;
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
    width: 100%;
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
          // border: none;
        }
      }
      .result-content {
        padding: 34px 22px;
        background-color: rgba(2, 17, 50, 0.5);
        box-shadow: 0 0 20px inset rgba(6, 33, 89, 1);
      }
      .result-content .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .result-content .top .left .table-container {
        display: flex;
        color: white;
      }
      .result-content .top .left .table-container .table-title {
        width: 40px;
        height: 255px;
        background-image: url("~@/assets/image/energy/eidt-table-title-bg-blue.png");
        background-size: 100% 100%;
      }
      .result-content .top .left .table-container .table-title .title {
        padding: 45px 12px;
        color: #cfdce6;
        font-size: 16px;
      }
      .result-content .top .left .table-container .table-title .add-row {
        width: 22px;
        height: 23px;
        background-image: url("~@/assets/image/energy/edit.png");
        background-size: 100%;
        margin: 15px auto 0;
        cursor: pointer;
      }
      .bg-change {
        /*background-color: rgba(5,20,19,0.5) !important;*/
        height: 255px;
        width: 800px;
        border: none !important;
        overflow-y: auto;
      }
      .select-list li {
        color: #cfdce6 !important;
      }
      .table-bordered table thead {
        background-color: rgba(2, 17, 50, 0.5) !important;
      }
      .table-bordered .table > thead > tr > th,
      .table-bordered .table > tbody > tr > th,
      .table-bordered .table > thead:first-child > tr:first-child > th,
      .bootstrap-table .table:not(.table-condensed),
      .bootstrap-table .table:not(.table-condensed) > tbody > tr > td,
      .bootstrap-table .table:not(.table-condensed) > tbody > tr > th,
      .bootstrap-table .table:not(.table-condensed) > tfoot > tr > td,
      .bootstrap-table .table:not(.table-condensed) > tfoot > tr > th,
      .bootstrap-table .table:not(.table-condensed) > thead > tr > td {
        border-color: rgba(208, 237, 254, 0.2) !important;
      }
      .table-bordered .table,
      .fixed-table-container,
      table,
      .table-bordered .table,
      .table > thead > tr > th,
      .table > tbody > tr > th,
      .table > tfoot > tr > th,
      .table > thead > tr > td,
      .table > tbody > tr > td,
      .table > tfoot > tr > td {
        border-color: rgba(208, 237, 254, 0.2) !important;
      }
      .table-hover > tbody > tr:hover {
        background-color: #031a46 !important;
      }
      .fixed-table-container {
        border: none !important;
      }
      .table-bordered.bg-change .clearfix {
        background: #031a46;
        /*margin: 0 -25px;*/
      }
      .result-content .top .left {
        background-color: rgba(2, 17, 50, 0.5);
        box-shadow: 0 0 20px inset rgba(6, 33, 89, 1);
        padding: 20px;
      }
      .result-content .top .left .icon {
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 30px 0;
      }
      .result-content .top .left .icon span {
        font-size: 14px;
        padding-right: 15px;
        display: inline-block;
      }
      .result-content .top .left .icon .icon-minus {
        width: 58px;
        height: 58px;
        background-image: url("~@/assets/image/energy/minus-blue.png");
        background-size: 100%;
      }
      .result-content .top .right {
        width: 739px;
        height: 632px;
        background-color: rgba(2, 17, 50, 0.5);
        box-shadow: 0 0 20px inset rgba(6, 33, 89, 1);
      }
      .result-content .top .right .title {
        color: #cfdce6;
        font-size: 14px;
        height: 30px;
        line-height: 30px;
        padding-left: 18px;
        background: #031a46;
      }
      .result-content .top .right .content {
        padding: 36px 47px 0;
        color: #cfdce6;
        font-size: 14px;
      }
      .result-content .top .middle {
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .result-content .top .middle span {
        font-size: 14px;
        padding-right: 15px;
        display: inline-block;
      }
      .result-content .top .middle .icon-equals {
        width: 58px;
        height: 58px;
        background-image: url("~@/assets/image/energy/equals-blue.png");
        background-size: 100%;
      }
      .result-content .bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 45px;
      }
      .result-content .bottom .left {
        display: flex;
        align-items: center;
      }
      .result-content .bottom .left .title {
        width: 40px;
        height: 98px;
        /*background-image: url('~@/assets/image/energy/edit-table-short-title-bg.png');*/
        background-size: 100%;
        color: #cfdce6;
        font-size: 16px;
        padding: 27px 11px;
        box-sizing: border-box;
      }
      .result-content .bottom .left .text-area {
        width: 800px;
        height: 98px;
        background-color: rgba(2, 17, 50, 0.5);
        box-shadow: 0 0 20px inset rgba(6, 33, 89, 1);
      }
      textarea {
        width: 800px;
        height: 98px;
        padding: 10px;
        box-sizing: border-box;
        background: transparent;
        border: none;
        outline: none;
        color: #cfdce6;
        font-size: 16px;
      }
      .result-content .bottom .right {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 739px;
      }
      .result-content .bottom .right .button {
        width: 88px;
        height: 44px;
        font-size: 18px;
        color: #fff;
        text-align: center;
        line-height: 44px;
        border-radius: 2px;
        margin-right: 15px;
        cursor: pointer;
      }
      .result-content .bottom .right .button:last-child {
        margin: 0;
      }
      .result-content .bottom .right .cancel {
        background: linear-gradient(
          0deg,
          rgba(62, 119, 196, 1),
          rgba(142, 179, 232, 1)
        );
      }
      .result-content .bottom .right .save {
        background: linear-gradient(
          0deg,
          rgba(0, 102, 255, 1),
          rgba(0, 198, 255, 1)
        );
      }
    }
  }
}
</style>
