 <template>
  <div class="dashboard-view-analyse">
    <div class="page-left-view">
      <div
        :key="item.val"
        v-for="item in type"
        class="t-block"
        :class="{ active: currentType.val === item.val }"
        @click="
          currentType = item;
          init();
        "
      >
        <div>
          <div>
            <svg-icon
              :icon-class="item.icon"
              style="font-size: 26px"
            ></svg-icon>
          </div>
          <div style="margin-top: 20px">{{ item.label }}</div>
        </div>
      </div>
    </div>
    <div class="page-right-view">
      <div class="right-top">
        <div class="title">
          {{ currentType.label }}{{ currentAds.label }}用能趋势分析
        </div>
        <div class="title-right">
          <div class="zt-block">
            <div
              class="qs"
              :class="
                totalDayTB === 0 ? 'same-bg' : totalDayTB > 0 ? 'top-bg' : ''
              "
            >
              <el-icon
                class="qs-icon"
                :class="
                  totalDayTB === 0
                    ? 'el-icon-minus'
                    : totalDayTB > 0
                    ? 'el-icon-top'
                    : 'el-icon-bottom'
                "
              />
            </div>
            <div>
              <div class="qs-label-top">
                <div
                  class="qs-title"
                  :class="
                    totalDayTB === 0
                      ? 'same-text'
                      : totalDayTB > 0
                      ? 'top-text'
                      : ''
                  "
                >
                  {{ totalDayTimeValue ? totalDayTimeValue : 0 }}
                </div>
                <div style="margin-right: 10px">同比去年</div>
                <div
                  class="bottom-text"
                  :class="
                    totalDayTB === 0
                      ? 'same-text'
                      : totalDayTB > 0
                      ? 'top-text'
                      : ''
                  "
                >
                  {{
                    totalDayTB === 0
                      ? "持平"
                      : totalDayTB > 0
                      ? "上升 " + totalDayTimePercent + "%"
                      : "下降 " + Math.abs(totalDayTimePercent) + "%"
                  }}
                </div>
              </div>
              <div class="qs-label-bottom">
                <div
                  class="bottom-text"
                  :class="
                    totalDayTB === 0
                      ? 'same-text'
                      : totalDayTB > 0
                      ? 'top-text'
                      : ''
                  "
                >
                  {{ date }}年
                </div>
                <div>
                  {{ area ? area.name : "所有区域" }} 白天总用{{
                    currentType.label
                  }}量
                </div>
              </div>
            </div>
          </div>
          <div class="zt-block">
            <div
              class="qs"
              :class="
                totalNightTB === 0
                  ? 'same-bg'
                  : totalNightTB > 0
                  ? 'top-bg'
                  : ''
              "
            >
              <el-icon
                class="qs-icon"
                :class="
                  totalNightTB === 0
                    ? 'el-icon-minus'
                    : totalNightTB > 0
                    ? 'el-icon-top'
                    : 'el-icon-bottom'
                "
              />
            </div>
            <div>
              <div class="qs-label-top">
                <div
                  class="qs-title"
                  :class="
                    totalNightTB === 0
                      ? 'same-text'
                      : totalNightTB > 0
                      ? 'top-text'
                      : ''
                  "
                >
                  {{ totalNightValue ? totalNightValue : 0 }}
                </div>
                <div style="margin-right: 10px">同比去年</div>
                <div
                  class="bottom-text"
                  :class="
                    totalNightTB === 0
                      ? 'same-text'
                      : totalNightTB > 0
                      ? 'top-text'
                      : ''
                  "
                >
                  {{
                    totalNightTB === 0
                      ? "持平"
                      : totalNightTB > 0
                      ? "上升 " + totalNightPercent + "%"
                      : "下降 " + Math.abs(totalNightPercent) + "%"
                  }}
                </div>
              </div>
              <div class="qs-label-bottom">
                <div
                  class="bottom-text"
                  :class="
                    totalNightTB === 0
                      ? 'same-text'
                      : totalNightTB > 0
                      ? 'top-text'
                      : ''
                  "
                >
                  {{ date }}年
                </div>
                <div>
                  {{ area ? area.name : "所有区域" }} 夜间总用{{
                    currentType.label
                  }}量
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right-bottom">
        <div class="bottom-left">
          <div class="btn-block">
            <div
              :key="item.val"
              v-for="item in ads"
              class="btn"
              :class="{ active: currentAds.val === item.val }"
              @click="currentAds = item"
            >
              {{ item.label }}
            </div>
          </div>
          <div class="tree-block">
            <el-scrollbar style="height: 100%">
              <div style="height: 100%; padding: 10px 20px 10px 0">
                <CollapseTree
                  :tree-data="areaTree"
                  @tap="changeTree"
                ></CollapseTree>
              </div>
            </el-scrollbar>
          </div>
        </div>
        <div class="bottom-right">
          <div class="search-block">
            <div class="year-block">
              <div>年度</div>
              <div class="year">
                <el-date-picker
                  class="custom-year"
                  v-model="date"
                  type="year"
                  value-format="yyyy"
                  @change="init"
                  prefix-icon="false"
                  :editable="false"
                  :clearable="false"
                >
                </el-date-picker>
                <div style="position: absolute; right: 0; z-index: 0">
                  <el-icon class="el-icon-arrow-down year-icon" />
                </div>
              </div>
            </div>
            <div class="item-block">
              <div style="margin-right: 20px">分项能耗</div>
              <div
                :key="index"
                v-for="(item, index) in items"
                class="item-btn"
                :class="{ 'item-active': currentItem.val === item.val }"
                @click="
                  currentItem = item;
                  init();
                "
              >
                {{ item.label }}
              </div>
            </div>
          </div>
          <div class="result-block">
            <div class="echarts">
              <div class="echarts-title">
                {{ date }}年用{{ currentType.label }}量统计分析
              </div>
              <div class="echarts-content">
                <line-chart
                  style="
                    width: 100%;
                    height: calc(100% + 25px);
                    margin-top: -30px;
                  "
                  :c-data="chartData"
                  v-if="chartData"
                  @tap="chartTap"
                />
              </div>
            </div>
            <div class="table">
              <div class="table-title">
                <div>日期</div>
                <div>
                  当前用{{ currentType.label }}量（{{ currentType.unit }}）
                </div>
                <div>
                  同期用{{ currentType.label }}量（{{ currentType.unit }}）
                </div>
                <div>同比涨幅(%)</div>
              </div>
              <div class="table-list">
                <el-scrollbar
                  style="height: 100%; width: 100%"
                  class="custom-scroll"
                >
                  <div
                    class="list-item"
                    v-for="(item, i) in detailList"
                    :key="i"
                  >
                    <div>{{ item.date }}</div>
                    <div>{{ item.current }}</div>
                    <div>{{ item.last }}</div>
                    <div>{{ item.percent }}</div>
                  </div>
                </el-scrollbar>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  energyByAreaAndDept,
  energyByAreaAndDeptRit,
  energyDayByAreaAndDeptRit,
  energyHourByAreaAndDeptRit,
} from "@/api/energy/app/analyse";
import { getItemRoot } from "@/api/energy/app/basic";
import LineChart from "./component/lineChart";
import CollapseTree from "@/components/CollapseTree/collapseTree";
import { toTreeData } from "@/components/CollapseTree/index";
import moment from "moment";

export default {
  name: "EnergyAreaDept",
  components: {
    LineChart,
    CollapseTree,
  },
  data() {
    return {
      areaTree: [],
      type: [
        { label: "电", val: 1, icon: "electricity", unit: "kWh" },
        { label: "水", val: 2, icon: "water", unit: "t" },
        { label: "气", val: 3, icon: "gas", unit: "t" },
      ],
      ads: [{ label: "区域", val: "area" }],
      currentType: { label: "电", val: 1, unit: "kWh" },
      currentAds: { label: "区域", val: "area" },
      date: "2020",
      items: [{ label: "全部", val: null }],
      currentItem: { label: "全部", val: null },
      area: null,
      totalDayTimePercent: null,
      totalDayTimeValue: null,
      totalDayTB: 0,
      totalNightPercent: null,
      totalNightValue: null,
      totalNightTB: 0,
      detailList: null,
      chartData: null,
      dateDay: null,
    };
  },
  created() {
    this.date = moment().format("YYYY");
    this.init();
  },
  methods: {
    init() {
      // 初始数据
      this.getEnergyTree();
      this.getEnergyTreeRit();
      this.getItemRoot();
    },
    getQuery() {
      return {
        areaOrDeptId: this.area ? this.area.id : null,
        date: this.date,
        energyType: this.currentType.val,
        itemCode: this.currentItem ? this.currentItem.val : null,
      };
    },
    changeTree(item) {
      // 树点击回调
      this.area = item;
      this.getEnergyTreeRit(); // 重新获取右侧数据
    },
    getEnergyTree() {
      // 获取左侧目录树数据
      var query = this.getQuery();
      query.areaOrDeptId = null;
      energyByAreaAndDept(this.currentAds.val, query).then((res) => {
        var result = res.data.map((item) => ({
          id: item.areaId,
          name: item.areaName,
          pid: item.parentId,
          tb: item.tb,
          total: item.total,
        }));

        this.areaTree = toTreeData(result);
      });
    },
    getEnergyTreeRit() {
      // 获取右侧数据
      var query = this.getQuery();
      energyByAreaAndDeptRit(this.currentAds.val, query).then((res) => {
        var d = res.data;
        this.chartData = null;
        this.detailList = null;
        if (d.detailList) {
          this.detailList = d.detailList.map((de) => ({
            date: de.date,
            current: de.current ? de.current : 0,
            last: de.last ? de.last : 0,
            percent: de.percent ? (de.percent * 100).toFixed(2) : 0.0,
          }));

          var text = this.currentType.label;
          this.chartData = {
            xAxisData: this.detailList.map((i) => i.date),
            series: [
              {
                name: "当前用" + text + "量",
                type: "bar",
                data: this.detailList.map((i) => i.current),
              },
              {
                name: "同期用" + text + "量",
                type: "bar",
                data: this.detailList.map((i) => i.last),
              },
              {
                name: "同比涨幅",
                type: "line",
                yAxisIndex: 1,
                data: this.detailList.map((i) => i.percent),
                smooth: true,
              },
            ],
          };
        }
        this.totalDayTimePercent = d.totalDayTimePercent
          ? (d.totalDayTimePercent * 100).toFixed(2)
          : 0;
        this.totalDayTimeValue = d.totalDayTimeValue;
        this.totalDayTB =
          !this.totalDayTimePercent || this.totalDayTimePercent === 0
            ? 0
            : this.totalDayTimePercent > 0
            ? 1
            : -1;
        this.totalNightPercent = d.totalNightPercent
          ? (d.totalNightPercent * 100).toFixed(2)
          : 0;
        this.totalNightValue = d.totalNightValue;
        this.totalNightTB =
          !this.totalNightPercent || this.totalNightPercent === 0
            ? 0
            : this.totalNightPercent > 0
            ? 1
            : -1;
      });
    },
    getEnergyTreeRitDay(date) {
      // 获取每日明细
      var query = this.getQuery();
      query.date = date;
      this.dateDay = date;
      energyDayByAreaAndDeptRit(this.currentAds.val, query).then((res) => {
        var d = res.data;
        this.chartData = null;
        this.detailList = null;
        if (d) {
          this.detailList = d.map((de) => ({
            dateDay: de.date,
            date: this.dateDay + "-" + de.date,
            current: de.current ? de.current : 0,
            last: de.last ? de.last : 0,
            percent: de.percent ? (de.percent * 100).toFixed(2) : 0.0,
          }));

          var text = this.currentType.label;
          this.chartData = {
            xAxisData: this.detailList.map((i) => i.dateDay),
            series: [
              {
                name: "当前用" + text + "量",
                type: "bar",
                data: this.detailList.map((i) => i.current),
              },
              {
                name: "同期用" + text + "量",
                type: "bar",
                data: this.detailList.map((i) => i.last),
              },
              {
                name: "同比涨幅",
                type: "line",
                yAxisIndex: 1,
                data: this.detailList.map((i) => i.percent),
                smooth: true,
              },
            ],
          };
        }
      });
    },
    getEnergyTreeRitHour(date) {
      // 获取每小时明细
      var query = this.getQuery();
      query.date = this.dateDay + "-" + date;
      energyHourByAreaAndDeptRit(this.currentAds.val, query).then((res) => {
        var d = res.data;
        this.chartData = null;
        this.detailList = null;
        if (d) {
          this.detailList = d.map((de) => ({
            date: de.date + "点",
            current: de.current ? de.current : 0,
            last: de.last ? de.last : 0,
            percent: de.percent ? (de.percent * 100).toFixed(2) : 0.0,
          }));

          var text = this.currentType.label;
          this.chartData = {
            xAxisData: this.detailList.map((i) => i.date),
            series: [
              {
                name: "当前用" + text + "量",
                type: "bar",
                data: this.detailList.map((i) => i.current),
              },
              {
                name: "同期用" + text + "量",
                type: "bar",
                data: this.detailList.map((i) => i.last),
              },
              {
                name: "同比涨幅",
                type: "line",
                yAxisIndex: 1,
                data: this.detailList.map((i) => i.percent),
                smooth: true,
              },
            ],
          };
        }
      });
    },
    chartTap(date) {
      if (date.indexOf("-") >= 0) {
        this.getEnergyTreeRitDay(date);
      } else {
        if (date.indexOf("点") < 0) {
          this.getEnergyTreeRitHour(date);
        }
      }
    },
    getItemRoot() {
      // 获取分项数据
      getItemRoot(this.currentType.val).then((res) => {
        this.items = [{ label: "全部", val: null }];
        var d = res.data.map((r) => ({
          label: r.name,
          val: r.code,
        }));
        this.items = this.items.concat(d);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./styles/index.scss";
</style>
<style lang="scss">
.custom-year {
  position: relative;
  z-index: 1;
  cursor: pointer;
}
.custom-year .el-input__inner {
  padding: 0 !important;
  background: transparent !important;
  border: none !important;
  color: #048cff !important;
  cursor: pointer;
}

.custom-scroll .el-scrollbar__wrap {
  overflow-x: hidden;
}

.custom-scroll .el-scrollbar__view {
  width: calc(100% - 8px);
}
</style>
