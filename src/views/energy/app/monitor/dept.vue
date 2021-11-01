 <template>
  <div class="dashboard-view-monitor">
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
          {{ currentType.label }}{{ currentAds.label }}用能监测
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
                <div style="margin-right: 10px">环比昨天</div>
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
                  {{ date }}
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
                <div style="margin-right: 10px">环比昨天</div>
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
                  {{ date }}
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
                {{ date }} 用{{ currentType.label }}量趋势分析
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
                />
              </div>
            </div>
            <div class="table">
              <div class="table-title">
                <div>时间</div>
                <div>用{{ currentType.label }}量（{{ currentType.unit }}）</div>
                <div>时间</div>
                <div>用{{ currentType.label }}量（{{ currentType.unit }}）</div>
                <div>时间</div>
                <div>用{{ currentType.label }}量（{{ currentType.unit }}）</div>
              </div>
              <div class="table-list">
                <el-scrollbar
                  style="height: 100%; width: 100%"
                  class="custom-scroll"
                >
                  <div class="list-item" v-for="(item, i) in 8" :key="i">
                    <div>{{ i }}点</div>
                    <div>{{ totalValue(i) }}</div>

                    <div>{{ i + 8 }}点</div>
                    <div>{{ totalValue(i + 9) }}</div>

                    <div>{{ i + 16 }}点</div>
                    <div>{{ totalValue(i + 16) }}</div>
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
import { monitorByDept, monitorByDeptRit } from "@/api/energy/app/monitor";
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
      ads: [{ label: "部门", val: "dept" }],
      currentType: { label: "电", val: 1, unit: "kWh" },
      currentAds: { label: "部门", val: "dept" },
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
      date: "",
      chartData: null,
    };
  },
  computed: {
    totalValue() {
      return function (date) {
        if (this.detailList) {
          var arr = this.detailList.filter((i) => i.date === date + "点");
          if (arr && arr.length > 0) {
            return arr[0].total;
          }
        }
        return "";
      };
    },
  },
  created() {
    this.date = moment().format("YYYY年MM月DD日");
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
      monitorByDept(query).then((res) => {
        var result = res.data.map((item) => ({
          id: item.deptId,
          name: item.deptName,
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
      monitorByDeptRit(query).then((res) => {
        var d = res.data;
        this.chartData = null;
        this.detailList = null;
        if (d.detailList) {
          this.detailList = d.detailList.map((de) => ({
            date: de.collectHour + "点",
            total: de.total ? de.total : 0,
          }));

          var text = this.currentType.label;
          this.chartData = {
            xAxisData: this.detailList.map((i) => i.date),
            series: [
              {
                name: "用" + text + "量",
                type: "line",
                data: this.detailList.map((i) => i.total),
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
