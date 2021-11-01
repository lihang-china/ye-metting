<template>
  <div class="dashboard-view">
    <div class="menu-view">
      <div
        class="item-view"
        :class="{ active: nhType == 1 }"
        @click="
          nhType = 1;
          init();
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
          init();
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
          init();
        "
      >
        <img src="@/assets/image/energy/air.png" />
        <a>气</a>
      </div>
    </div>

    <div class="page-left-view">
      <div class="top-view">
        <img src="@/assets/image/energy/energy-header.png" />
        <span>本月总能耗（kw）</span>
        <progress-chart ref="monthChart1" />
        <div class="chart-title">
          <a>{{ monthPay }}</a>
          <a>本月用量</a>
        </div>
        <progress-chart2 ref="monthChart2" />
        <div class="chart-title">
          <a>{{ monthPayLastYear }}</a>
          <a>去年同期</a>
        </div>
      </div>
      <div class="bottom-view">
        <img src="@/assets/image/energy/energy-header.png" />
        <span>能耗健康指标</span>
        <healthy-chart />
      </div>
    </div>

    <div class="page-center-view">
      <div class="top-view">
        <el-carousel :interval="5000">
          <el-carousel-item>
            <!-- <div
              class="row-view"
              v-for="(project, index) in projectList"
              :key="index"
            > -->
            <div class="row-view">
              <div class="chart-view" v-for="(item, i) in projectList" :key="i">
                <div class="card-title-view">
                  <img src="@/assets/image/energy/energy-head.png" />
                  <div class="card-title">{{ item.itemName }}</div>
                </div>
                <div class="content-view">
                  <div class="card-top-view">
                    <div class="card-left-view">{{ item.total }}</div>
                    <div class="card-right-view">Kwh</div>
                  </div>
                  <div class="card-bottom-view">
                    <div class="card-left-view">环比昨日</div>
                    <div class="card-right-view">
                      {{ (item.percent * 100).toFixed(2) + "%" }}
                      <!-- {{
                        item.percent > 0
                          ? "0" + item.percent
                          : item.percent
                      }}%
                      <i v-if="item.percent == 0" style="color: #00fff6">—</i>
                      <i v-if="item.percent > 0"></i>
                      <i v-if="item.percent < 0" style="color: #00fff6"></i> -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>

      <div class="bottom-view">
        <img src="@/assets/image/energy/energy-header.png" />
        <span>{{ nowDate }}能耗数据分析</span>
        <line-chart ref="hourCount" />
      </div>
    </div>

    <div class="page-right-view">
      <div class="top-view">
        <img src="@/assets/image/energy/energy-header.png" />
        <span>各区域能耗占比分析</span>
        <pie-chart ref="pieChart" />
      </div>
      <div class="bottom-view">
        <img src="@/assets/image/energy/energy-header.png" />
        <span>各分项能耗占比分析</span>
        <pie-chart2 ref="pieChart2" />
      </div>
    </div>
  </div>
</template>

<script>
import { dashboard } from "@/api/energy/app/dashboard";
import HealthyChart from "./healthyChart";
import ProgressChart from "./progressChart";
import PieChart from "./pieChart";
import LineChart from "./lineChart";
import echarts from "echarts";

import moment from "moment";
import logVue from "../../../monitor/job/log.vue";
require("echarts/theme/macarons");

export default {
  name: "EnergyIndex",
  data() {
    return {
      currentType: { label: "电", val: 1, unit: "kWh" },
      nowDate: moment().format("MM月DD日"),
      monthPay: 0,
      monthPayLastYear: 0,
      projectList: [],
      // 能源类型
      nhType: 1,
    };
  },
  components: {
    HealthyChart,
    ProgressChart,
    ProgressChart2: ProgressChart,
    PieChart,
    PieChart2: PieChart,
    LineChart,
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      dashboard(this.nhType).then((res) => {
        let result = res.data;

        //分项数据整理
        console.log(result.itemCount);
        // let arr1 = [];
        // while (result.itemCount.length > 0) {
        //   let tmp = [];
        //   while (tmp.length < 4 && result.itemCount.legnth > 0) {
        //     tmp.push(result.itemCount.pop());
        //   }
        //   arr1.push(tmp);
        // }
        this.projectList = result.itemCount;

        //console.log("hourCount", result.hourCount);
        //加载当日能耗折线图
        this.$refs.hourCount.initChart(result.hourCount);

        //加载区域能耗图
        let areaData = { data: [...result.areaCount] };
        areaData.legend = result.areaCount.map((e) => {
          return e.areaName;
        });
        //console.log('areaData', areaData);
        this.$refs.pieChart.initChart(areaData);

        //各分项能耗占比分析
        let itemData = { data: [...result.itemCount] };
        itemData.legend = result.itemCount.map((e) => {
          return e.itemName;
        });
        this.$refs.pieChart2.initChart(itemData, "itemName", "分项能耗占比");

        //本月总能耗
        this.monthPay = result.monthCount.total;
        this.monthPayLastYear = result.monthCount.lastTotal;

        //console.log(this.$refs.monthChart1);
        let monthPayP = (this.monthPay / 500000) * 100;
        let monthPayLastYearP = (this.monthPayLastYear / 500000) * 100;
        this.$refs.monthChart1.initChart(monthPayP.toFixed(2));
        this.$refs.monthChart2.initChart(monthPayLastYearP.toFixed(2));
      });
    },
  },
};
</script>

<style lang="scss">
@import "~@/assets/styles/common.scss";

.el-carousel__container {
  height: rem(520);
}
.dashboard-view {
  display: flex;
  padding: rem(30);
  .menu-view {
    display: flex;
    flex-direction: column;
    margin-right: rem(18);
    width: rem(72);
    height: 100%;
    align-items: center;
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
  .page-left-view {
    display: flex;
    flex-direction: column;
    margin-right: rem(18);
    .top-view {
      position: relative;
      width: rem(423);
      height: rem(559);
      background: rgba(5, 20, 19, 0.3);
      border: 1px solid #025d97;
      border-radius: rem(8);
      margin-bottom: rem(30);
      display: flex;
      flex-direction: column;
      align-items: center;
      span {
        margin-top: rem(27);
        font-size: rem(18);
        font-weight: bold;
        color: #ffffff;
      }
      img {
        position: absolute;
        right: rem(27);
        top: rem(-13);
        width: rem(107);
        height: rem(26);
      }
      .chart-title {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 45%;
        font-size: rem(18);
        font-family: Compacta Blk BT;
        font-weight: 900;
        color: #00a2ff;
        line-height: 12px;
        &:last-child {
          top: 90%;
        }
        a {
          &:nth-child(2) {
            font-weight: 400;
            margin-top: 10px;
          }
        }
      }
    }
    .bottom-view {
      position: relative;
      width: rem(423);
      height: rem(355);
      background: rgba(5, 20, 19, 0.3);
      border: 1px solid #025d97;
      border-radius: rem(8);
      display: flex;
      flex-direction: column;
      align-items: center;
      span {
        margin-top: rem(27);
        font-size: rem(18);
        font-weight: bold;
        color: #ffffff;
      }
      img {
        position: absolute;
        right: rem(27);
        top: rem(-13);
        width: rem(107);
        height: rem(26);
      }
    }
  }
  .page-center-view {
    display: flex;
    flex-direction: column;
    margin-right: rem(18);
    .top-view {
      position: relative;
      width: rem(884);
      height: rem(559);
      padding: rem(42) rem(50) 0 rem(50);
      margin-bottom: rem(30);

      .row-view {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .chart-view {
          position: relative;
          width: rem(362);
          height: rem(194);

          margin-bottom: rem(69);

          .card-title-view {
            position: relative;
            left: rem(-3);
            // top: rem(-38);
            width: rem(188);
            height: rem(41);
            display: flex;
            justify-content: center;
            align-items: center;
            .card-title {
              font-size: rem(18);
              font-weight: 400;
              color: #ffffff;
            }
            img {
              position: absolute;
              width: 100%;
              height: 100%;
            }
          }
          .content-view {
            position: absolute;
            top: rem(37);
            width: rem(362);
            height: rem(157);
            background: rgba(1, 68, 144, 0.3);
            border: 1px solid #009cff;
            border-radius: 0px rem(5) rem(5) rem(5);
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 0 rem(30);
            .card-top-view {
              display: flex;
              justify-content: space-between;
              padding-bottom: rem(20);
              border-bottom: 1px solid #009cff;
              margin-bottom: rem(20);
              align-items: flex-end;
              .card-left-view {
                font-size: rem(46);
                font-weight: bold;
                color: #00fff6;
              }
              .card-right-view {
                font-size: rem(18);
                font-weight: 400;
                color: #00a2ff;
              }
            }
            .card-bottom-view {
              display: flex;
              justify-content: space-between;
              .card-left-view {
                font-size: rem(18);
                font-weight: 400;
                color: #cfdce6;
              }
              .card-right-view {
                font-size: rem(18);
                font-weight: 400;
                color: #00d2ff;
                i {
                  margin-left: rem(12);
                  color: #ff4343;
                }
              }
            }
          }
        }
      }
    }
    .bottom-view {
      position: relative;
      width: rem(884);
      height: rem(355);
      background: rgba(5, 20, 19, 0.3);
      border: 1px solid #025d97;
      border-radius: rem(8);
      display: flex;
      flex-direction: column;
      span {
        margin-top: rem(25);
        margin-left: rem(16);
        font-size: rem(18);
        font-weight: bold;
        color: #ffffff;
      }
      img {
        position: absolute;
        right: rem(27);
        top: rem(-13);
        width: rem(107);
        height: rem(26);
      }
    }
  }
  .page-right-view {
    display: flex;
    flex-direction: column;
    margin-right: rem(18);
    .top-view {
      position: relative;
      width: rem(430);
      height: rem(460);
      background: rgba(5, 20, 19, 0.3);
      border: 1px solid #025d97;
      border-radius: rem(8);
      margin-bottom: rem(30);
      display: flex;
      flex-direction: column;
      align-items: center;
      span {
        margin-top: rem(50);
        font-size: rem(18);
        font-weight: bold;
        color: #ffffff;
      }
      img {
        position: absolute;
        right: rem(27);
        top: rem(-13);
        width: rem(107);
        height: rem(26);
      }
    }
    .bottom-view {
      position: relative;
      width: rem(430);
      height: rem(460);
      background: rgba(5, 20, 19, 0.3);
      border: 1px solid #025d97;
      border-radius: rem(8);
      display: flex;
      flex-direction: column;
      align-items: center;
      span {
        margin-top: rem(50);
        font-size: rem(18);
        font-weight: bold;
        color: #ffffff;
      }
      img {
        position: absolute;
        right: rem(27);
        top: rem(-13);
        width: rem(107);
        height: rem(26);
      }
    }
  }
}
</style>
