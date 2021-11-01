<template>
  <div class="dashboard-view-pub">
    <div class="top">
      <div class="top-left">
        <div>起止月份：</div>
        <div class="month-block">
          <el-date-picker
            class="custom-year-s0"
            v-model="startMonth"
            type="month"
            value-format="yyyy-MM"
            @change="init"
            prefix-icon="false"
            :editable="false"
            :clearable="false"
          >
          </el-date-picker>
          <el-icon class="el-icon-date month-icon" />
        </div>
        <div>至</div>
        <div class="month-block">
          <el-date-picker
            class="custom-year-s0"
            v-model="endMonth"
            type="month"
            value-format="yyyy-MM"
            @change="init"
            prefix-icon="false"
            :editable="false"
            :clearable="false"
          >
          </el-date-picker>
          <el-icon class="el-icon-date month-icon" />
        </div>
        <div
          :key="item.val"
          v-for="item in months"
          class="btn"
          :class="{ active: current === item.value }"
          @click="changeMonth(item.value)"
        >
          {{ item.label }}
        </div>
      </div>
      <div class="top-right">
        <div>能耗统计：</div>
        <div :key="item.val" v-for="item in items" class="btn active">
          {{ item.label }}
        </div>
      </div>
    </div>
    <div class="center">
      <div class="center-block">
        <div class="center-title">用电总能耗排行榜（区域排行前10名）</div>
        <div class="table">
          <div class="table-title">
            <div style="width: 80px">序号</div>
            <div>区域</div>
            <div>耗能总量</div>
          </div>
          <div class="table-list">
            <el-scrollbar
              style="height: 100%; width: 100%"
              class="custom-scroll"
            >
              <div class="list-item" v-for="i in 10" :key="i">
                <template v-if="d_areaMonthCountList.length >= i">
                  <div style="width: 80px">{{ i }}</div>
                  <div>{{ d_areaMonthCountList[i - 1].areaName }}</div>
                  <div class="tree-right">
                    <div class="tree-pre">
                      <div
                        :style="{
                          width:
                            (d_areaMonthTotal ||
                              (d_areaMonthCountList[i - 1].totalMonthValue /
                                d_areaMonthTotal) *
                                200) < 3
                              ? '2px'
                              : (d_areaMonthCountList[i - 1].totalMonthValue /
                                  d_areaMonthTotal) *
                                  200 +
                                'px',
                        }"
                        class="custom-progress custom-progress-small"
                      ></div>
                    </div>
                    <div>{{ d_areaMonthCountList[i - 1].totalMonthValue }}</div>
                  </div>
                </template>
                <template v-else>
                  <div style="width: 80px"></div>
                  <div></div>
                  <div></div>
                </template>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>

      <div class="center-block">
        <div class="center-title">用电总能耗排行榜（部门排行前10名）</div>
        <div class="table">
          <div class="table-title">
            <div style="width: 80px">序号</div>
            <div>部门</div>
            <div>耗能总量</div>
          </div>
          <div class="table-list">
            <el-scrollbar
              style="height: 100%; width: 100%"
              class="custom-scroll"
            >
              <div class="list-item" v-for="i in 10" :key="i">
                <template v-if="d_deptMonthCountList.length >= i">
                  <div style="width: 80px">{{ i }}</div>
                  <div>{{ d_deptMonthCountList[i - 1].deptName }}</div>
                  <div class="tree-right">
                    <div class="tree-pre">
                      <div
                        :style="{
                          width:
                            (d_deptMonthTotal ||
                              (d_deptMonthCountList[i - 1].totalMonthValue /
                                d_deptMonthTotal) *
                                100) < 3
                              ? '2px'
                              : (d_deptMonthCountList[i - 1].totalMonthValue /
                                  d_deptMonthTotal) *
                                  100 +
                                'px',
                        }"
                        class="custom-progress custom-progress-small"
                      ></div>
                    </div>
                    <div>{{ d_deptMonthCountList[i - 1].totalMonthValue }}</div>
                  </div>
                </template>
                <template v-else>
                  <div style="width: 80px"></div>
                  <div></div>
                  <div></div>
                </template>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>

      <div class="center-block">
        <div class="center-title">用水总能耗排行榜（区域排行前10名）</div>
        <div class="table">
          <div class="table-title">
            <div style="width: 80px">序号</div>
            <div>区域</div>
            <div>耗能总量</div>
          </div>
          <div class="table-list">
            <el-scrollbar
              style="height: 100%; width: 100%"
              class="custom-scroll"
            >
              <div class="list-item" v-for="i in 10" :key="i">
                <template v-if="s_areaMonthCountList.length >= i">
                  <div style="width: 80px">{{ i }}</div>
                  <div>{{ s_areaMonthCountList[i - 1].areaName }}</div>
                  <div class="tree-right">
                    <div class="tree-pre">
                      <div
                        :style="{
                          width:
                            (s_areaMonthTotal ||
                              (s_areaMonthCountList[i - 1].totalMonthValue /
                                s_areaMonthTotal) *
                                100) < 3
                              ? '2px'
                              : (s_areaMonthCountList[i - 1].totalMonthValue /
                                  s_areaMonthTotal) *
                                  100 +
                                'px',
                        }"
                        class="custom-progress custom-progress-small"
                      ></div>
                    </div>
                    <div>{{ s_areaMonthCountList[i - 1].totalMonthValue }}</div>
                  </div>
                </template>
                <template v-else>
                  <div style="width: 80px"></div>
                  <div></div>
                  <div></div>
                </template>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>

      <div class="center-block">
        <div class="center-title">用水总能耗排行榜（部门排行前10名）</div>
        <div class="table">
          <div class="table-title">
            <div style="width: 80px">序号</div>
            <div>部门</div>
            <div>耗能总量</div>
          </div>
          <div class="table-list">
            <el-scrollbar
              style="height: 100%; width: 100%"
              class="custom-scroll"
            >
              <div class="list-item" v-for="i in 10" :key="i">
                <template v-if="s_deptMonthCountList.length >= i">
                  <div style="width: 80px">{{ i }}</div>
                  <div>{{ s_deptMonthCountList[i - 1].deptName }}</div>
                  <div class="tree-right">
                    <div class="tree-pre">
                      <div
                        :style="{
                          width:
                            (s_deptMonthTotal ||
                              (s_deptMonthCountList[i - 1].totalMonthValue /
                                s_deptMonthTotal) *
                                100) < 3
                              ? '2px'
                              : (s_deptMonthCountList[i - 1].totalMonthValue /
                                  s_deptMonthTotal) *
                                  100 +
                                'px',
                        }"
                        class="custom-progress custom-progress-small"
                      ></div>
                    </div>
                    <div>{{ s_deptMonthCountList[i - 1].totalMonthValue }}</div>
                  </div>
                </template>
                <template v-else>
                  <div style="width: 80px"></div>
                  <div></div>
                  <div></div>
                </template>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>

      <div class="center-block">
        <div class="center-title">用气总能耗排行榜（区域排行前10名）</div>
        <div class="table">
          <div class="table-title">
            <div style="width: 80px">序号</div>
            <div>区域</div>
            <div>耗能总量</div>
          </div>
          <div class="table-list">
            <el-scrollbar
              style="height: 100%; width: 100%"
              class="custom-scroll"
            >
              <div class="list-item" v-for="i in 10" :key="i">
                <template v-if="q_areaMonthCountList.length >= i">
                  <div style="width: 80px">{{ i }}</div>
                  <div>{{ q_areaMonthCountList[i - 1].areaName }}</div>
                  <div class="tree-right">
                    <div class="tree-pre">
                      <div
                        :style="{
                          width:
                            (q_areaMonthTotal ||
                              (q_areaMonthCountList[i - 1].totalMonthValue /
                                q_areaMonthTotal) *
                                100) < 3
                              ? '2px'
                              : (q_areaMonthCountList[i - 1].totalMonthValue /
                                  q_areaMonthTotal) *
                                  100 +
                                'px',
                        }"
                        class="custom-progress custom-progress-small"
                      ></div>
                    </div>
                    <div>{{ q_areaMonthCountList[i - 1].totalMonthValue }}</div>
                  </div>
                </template>
                <template v-else>
                  <div style="width: 80px"></div>
                  <div></div>
                  <div></div>
                </template>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>

      <div class="center-block">
        <div class="center-title">用气总能耗排行榜（部门排行前10名）</div>
        <div class="table">
          <div class="table-title">
            <div style="width: 80px">序号</div>
            <div>部门</div>
            <div>耗能总量</div>
          </div>
          <div class="table-list">
            <el-scrollbar
              style="height: 100%; width: 100%"
              class="custom-scroll"
            >
              <div class="list-item" v-for="i in 10" :key="i">
                <template v-if="q_deptMonthCountList.length >= i">
                  <div style="width: 80px">{{ i }}</div>
                  <div>{{ q_deptMonthCountList[i - 1].deptName }}</div>
                  <div class="tree-right">
                    <div class="tree-pre">
                      <div
                        :style="{
                          width:
                            (q_deptMonthTotal ||
                              (q_deptMonthCountList[i - 1].totalMonthValue /
                                q_deptMonthTotal) *
                                100) < 3
                              ? '2px'
                              : (q_deptMonthCountList[i - 1].totalMonthValue /
                                  q_deptMonthTotal) *
                                  100 +
                                'px',
                        }"
                        class="custom-progress custom-progress-small"
                      ></div>
                    </div>
                    <div>{{ q_deptMonthCountList[i - 1].totalMonthValue }}</div>
                  </div>
                </template>
                <template v-else>
                  <div style="width: 80px"></div>
                  <div></div>
                  <div></div>
                </template>
              </div>
            </el-scrollbar>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { energyPublicity } from "@/api/energy/app/publicity";
import moment from "moment";

export default {
  name: "EnergyPublicity",
  components: {},
  data() {
    return {
      startMonth: null,
      endMonth: null,
      months: [
        { label: "本月", value: 0 },
        { label: "最近三个月", value: 3 },
        { label: "半年", value: 6 },
        { label: "一年", value: 12 },
      ],
      current: 0,
      items: [{ label: "总能耗", value: 0 }],
      d_areaMonthCountList: [],
      d_deptMonthCountList: [],
      s_areaMonthCountList: [],
      s_deptMonthCountList: [],
      q_areaMonthCountList: [],
      q_deptMonthCountList: [],
      d_areaMonthTotal: null,
      d_deptMonthTotal: null,
      s_areaMonthTotal: null,
      s_deptMonthTotal: null,
      q_areaMonthTotal: null,
      q_deptMonthTotal: null,
    };
  },
  created() {
    this.startMonth = moment().format("YYYY-MM");
    this.endMonth = moment().format("YYYY-MM");
    this.init();
  },
  methods: {
    changeMonth(value) {
      this.current = value;
      this.startMonth = moment()
        .subtract(value, "months")
        .format("YYYY-MM-DD HH:mm:ss");
      this.endMonth = moment().format("YYYY-MM");
      this.init();
    },
    init() {
      // 获取左侧目录树数据
      var query = {
        startMonth: this.startMonth,
        endMonth: this.endMonth,
      };
      energyPublicity(query).then((res) => {
        var d = res.data;
        console.log(d);

        this.d_areaMonthCountList = d.d_areaMonthCountList;
        this.d_areaMonthTotal =
          this.d_areaMonthCountList && this.d_areaMonthCountList.length > 0
            ? this.d_areaMonthCountList[0].totalMonthValue
            : 0;

        this.d_deptMonthCountList = d.d_deptMonthCountList;
        this.d_deptMonthTotal =
          this.d_deptMonthCountList && this.d_deptMonthCountList.length > 0
            ? this.d_deptMonthCountList[0].totalMonthValue
            : 0;

        this.s_areaMonthCountList = d.s_areaMonthCountList;
        this.s_areaMonthTotal =
          this.s_areaMonthCountList && this.s_areaMonthCountList.length > 0
            ? this.s_areaMonthCountList[0].totalMonthValue
            : 0;

        this.s_deptMonthCountList = d.s_deptMonthCountList;
        this.s_deptMonthTotal =
          this.s_deptMonthCountList && this.s_deptMonthCountList.length > 0
            ? this.s_deptMonthCountList[0].totalMonthValue
            : 0;

        this.q_areaMonthCountList = d.q_areaMonthCountList;
        this.q_areaMonthTotal =
          this.q_areaMonthCountList && this.q_areaMonthCountList.length > 0
            ? this.q_areaMonthCountList[0].totalMonthValue
            : 0;

        this.q_deptMonthCountList = d.q_deptMonthCountList;
        this.q_deptMonthTotal =
          this.q_deptMonthCountList && this.q_deptMonthCountList.length > 0
            ? this.q_deptMonthCountList[0].totalMonthValue
            : 0;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/common.scss";

.dashboard-view-pub {
  height: calc(100% - 100vw / 1920 * 41);

  .top {
    background: rgba(1, 68, 144, 0.5);
    width: 100%;
    height: rem(60);
    padding: 0 rem(60);
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #cfdce6;
    font-size: rem(14);
  }

  .top-left {
    display: flex;
    align-items: center;
  }

  .top-right {
    display: flex;
    align-items: center;
  }

  .month-block {
    position: relative;
    display: flex;
    align-items: center;
    width: rem(250);
    background: #fff;
    height: rem(30);
    //border: 1px solid #333;
    border-radius: 2px;
    padding-left: 15px;
    color: #333;
    margin: 0 15px 0 10px;
  }

  .month-icon {
    font-size: 18px;
    margin-right: 5px;
    color: #3985ca;
  }

  .btn {
    color: #048cff;
    margin-left: rem(10);
    padding: rem(6) rem(10);
    text-align: center;
    border-radius: 2px;
    cursor: pointer;
  }

  .active {
    background: linear-gradient(to top, #0066ff 0%, #00c6ff 100%);
    color: #fff;
    padding: rem(6) rem(20);
  }

  .center {
    width: 100%;
    height: calc(100% - 100vw / 1920 * 30);
    display: flex;
    flex-wrap: wrap;
    padding: 0 rem(50);
  }

  .center-block {
    width: 50%;
    height: 50%;
    padding: 0 rem(30);
  }

  .center-title {
    text-align: center;
    color: #00a2ff;
    padding: 20px 0;
    font-size: 16px;
    height: 50px;
  }

  .table {
    height: calc(100% - 50px);
    padding-top: 15px;
    width: 100%;

    .table-title {
      background: rgba(2, 96, 204, 0.6);
      display: flex;
      justify-content: space-around;
      height: 30px;
      align-items: center;
      color: #cfdce6;
      width: 100%;

      div {
        width: 50%;
        text-align: center;
        border-bottom: 1px solid rgba(208, 237, 254, 0.2);
        /* background-color: white; */
        height: 30px;
        line-height: 30px;
        border-right: 1px solid rgba(208, 237, 254, 0.2);
        color: #cfdce6;
      }

      div:last-child {
        border-right: none;
      }
    }

    .table-list {
      height: calc(100% - 30px);
      overflow: hidden;
    }

    .list-item {
      background: rgba(1, 68, 144, 0.5);
      display: flex;
      justify-content: space-around;
      height: 40px;
      align-items: center;
      color: #cfdce6;
      font-size: 14px;

      > div {
        width: 50%;
        text-align: center;
        border-bottom: 1px solid rgba(208, 237, 254, 0.2);
        /* background-color: white; */
        height: 40px;
        line-height: 40px;
        border-right: 1px solid rgba(208, 237, 254, 0.2);
        color: #cfdce6;
        padding: 0 10px;
      }

      div:last-child {
        border-right: none;
      }
    }

    .list-item:last-child {
      div {
        border-bottom: none;
      }
    }
  }

  .tree-right {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: rem(170);
  }

  .tree-pre {
    width: 200px;
    overflow: hidden;
    display: flex;
    justify-content: flex-start;
    margin-right: 10px;
  }

  .custom-progress {
    background: linear-gradient(to top, #0066ff 0%, #00c6ff 100%);
    height: rem(20);
    border-radius: 1px;
    border: 1px solid #69d9de;
  }

  .custom-progress-small {
    height: rem(15);
  }
}
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
</style>