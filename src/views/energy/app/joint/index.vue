 <template>
  <div class="dashboard-view-joint">
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
      <div class="right-bottom">
        <div class="bottom-left">
          <div class="btn-block">
            <div
              :key="item.val"
              v-for="item in ads"
              class="btn"
              :class="{ active: currentAds.val === item.val }"
              @click="
                currentAds = item;
                init();
              "
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
            <div>分项：</div>
            <div class="month-block" style="padding-left: 0">
              <treeselect
                class="custom-treeselect"
                v-model="itemCode"
                :options="itemOptions"
                :normalizer="normalizer"
                placeholder="选择分项"
              />
            </div>
            <div>时间：</div>
            <div class="month-block">
              <el-date-picker
                class="custom-year-s0"
                v-model="date"
                type="month"
                value-format="yyyy-MM"
                prefix-icon="false"
                :editable="false"
                placeholder="选择时间"
                :clearable="false"
              >
              </el-date-picker>
              <el-icon class="el-icon-date month-icon" />
            </div>
            <div class="btn active" @click="getEnergyTreeRit">查询</div>
            <div class="btn reset" @click="reset">重置</div>
          </div>
          <div class="result-block">
            <div class="table">
              <div class="table-title">
                <div>序号</div>
                <div>{{ currentAds.label }}</div>
                <div>分项名称</div>
                <div>月份</div>
                <div>用{{ currentType.label }}量（{{ currentType.unit }}）</div>
                <div>去年同比（{{ currentType.unit }}）</div>
                <div>上月环比（{{ currentType.unit }}）</div>
              </div>
              <div class="table-list">
                <el-scrollbar
                  style="height: 100%; width: 100%"
                  class="custom-scroll"
                >
                  <div v-if="loading" class="load">
                    <el-icon
                      class="el-icon-loading"
                      style="font-size: 25px; margin-right: 10px"
                    />
                    <div>正在加载...</div>
                  </div>
                  <div
                    class="list-item"
                    v-for="(item, i) in detailList"
                    :key="i"
                  >
                    <div>{{ i + 1 }}</div>
                    <div>{{ item.name }}</div>
                    <div>{{ item.itemName }}</div>
                    <div>{{ item.month }}</div>
                    <div>{{ item.total }}</div>
                    <div>{{ item.yearTotal }}</div>
                    <div>{{ item.monthTotal }}</div>
                  </div>
                  <div
                    v-if="detailList && detailList.length === 0"
                    class="load"
                  >
                    暂无数据
                  </div>
                </el-scrollbar>
              </div>
              <div class="page">
                <el-pagination
                  class="custom-pagination"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="pageNum"
                  :page-sizes="[50, 100, 150, 200]"
                  :page-size="pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  hide-on-single-page
                  :total="total"
                >
                </el-pagination>
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
  energyByArea,
  energyByAreaRit,
  energyByDept,
  energyByDeptRit,
} from "@/api/energy/app/joint";
import { getItemAll } from "@/api/energy/app/basic";
import CollapseTree from "@/components/CollapseTree/collapseTree";
import { toTreeData } from "@/components/CollapseTree/index";
import moment from "moment";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "EnergyAreaDept",
  components: {
    CollapseTree,
    Treeselect,
  },
  data() {
    return {
      areaTree: [],
      type: [
        { label: "电", val: 1, icon: "electricity", unit: "kWh" },
        { label: "水", val: 2, icon: "water", unit: "t" },
        { label: "气", val: 3, icon: "gas", unit: "t" },
      ],
      ads: [
        { label: "部门", val: "dept" },
        { label: "区域", val: "area" },
      ],
      currentType: { label: "电", val: 1, unit: "kWh" },
      currentAds: { label: "部门", val: "dept" },
      area: null,
      itemCode: null,
      detailList: null,
      itemOptions: [],
      date: null,
      total: 0,
      pageNum: 1,
      pageSize: 50,
      loading: false,
    };
  },
  watch: {},
  created() {
    this.init();
  },
  methods: {
    init() {
      // 初始数据
      this.area = null;
      this.date = null;
      this.getItemAll();
      this.getEnergyTree();
      this.getEnergyTreeRit();
    },
    changeTree(item) {
      // 树点击回调
      this.area = item;
      this.getEnergyTreeRit(); // 重新获取右侧数据
    },
    getEnergyTree() {
      // 获取左侧目录树数据
      var query = {
        energyType: this.currentType.val,
      };
      if (this.currentAds.val === "area") {
        energyByArea(query).then((res) => {
          var result = res.data.map((item) => ({
            id: item.areaId,
            name: item.areaName,
            pid: item.parentId,
            tb: item.tb,
            total: item.total,
          }));
          this.areaTree = toTreeData(result);
        });
      } else {
        energyByDept(query).then((res) => {
          var result = res.data.map((item) => ({
            id: item.deptId,
            name: item.deptName,
            pid: item.parentId,
            tb: item.tb,
            total: item.total,
          }));
          this.areaTree = toTreeData(result);
        });
      }
    },
    getEnergyTreeRit() {
      // 获取右侧数据
      var query = {
        energyType: this.currentType.val,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        monthKey: this.date,
        itemCode: this.itemCode,
      };
      this.loading = true;
      this.detailList = null;
      if (this.currentAds.val === "area") {
        if (this.area) {
          query.areaId = this.area.id;
        }
        energyByAreaRit(query).then((res) => {
          var result = res.rows.map((item) => ({
            name: item.areaName,
            itemName: item.itemName,
            month: item.monthKey,
            total: item.totalMonthValue,
            yearTotal: item.totalYoy,
            monthTotal: item.lastMonth,
          }));
          this.detailList = result;
          this.total = res.total;
          this.loading = false;
        });
      } else {
        if (this.area) {
          query.deptId = this.area.id;
        }
        energyByDeptRit(query).then((res) => {
          var result = res.rows.map((item) => ({
            name: item.deptName,
            itemName: item.itemName,
            month: item.monthKey,
            total: item.totalMonthValue,
            yearTotal: item.totalYoy,
            monthTotal: item.lastMonth,
          }));
          this.detailList = result;
          this.total = res.total;
          this.loading = false;
        });
      }
    },
    reset() {
      this.date = null;
      this.itemCode = null;
      this.area = null;
      this.pageNum = 1;
      this.getEnergyTreeRit();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.getEnergyTreeRit();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getEnergyTreeRit();
    },
    getItemAll() {
      // 获取分项数据
      this.itemCode = null;
      getItemAll(this.currentType.val).then((res) => {
        var result = res.data.map((r) => ({
          id: r.code,
          name: r.name,
          pid: r.parentCode,
        }));
        this.itemOptions = toTreeData(result);
      });
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./styles/index.scss";
</style>

<style lang="scss">
.custom-year-s0 {
  position: relative;
  z-index: 1;
  cursor: pointer;
}

.custom-year-s0 .el-input__inner {
  padding: 0 !important;
  background: transparent !important;
  border: none !important;
  color: #333 !important;
  font-size: 13px;
  cursor: pointer;
}

.custom-scroll .el-scrollbar__wrap {
  overflow-x: hidden;
}

.custom-scroll .el-scrollbar__view {
  width: calc(100% - 8px);
}

.custom-pagination .el-pagination__total {
  color: #cfdce6 !important;
}

.custom-pagination .el-pagination__jump {
  color: #cfdce6 !important;
}

.custom-pagination .el-input__inner {
  background: transparent !important;
  color: #cfdce6 !important;
}

.custom-pagination .el-pager li {
  background: transparent !important;
  color: #cfdce6;
  border: 1px solid #cfdce6;
  margin-left: -1px;
}

.custom-pagination .el-pager li.active {
  background: #0260cc !important;
  color: #cfdce6;
}

.custom-pagination .btn-prev,
.custom-pagination .btn-next {
  background: transparent !important;
  color: #cfdce6;
  border: 1px solid #cfdce6;
}

.custom-treeselect .vue-treeselect__control {
  background: transparent !important;
  border: none !important;
}
</style>
