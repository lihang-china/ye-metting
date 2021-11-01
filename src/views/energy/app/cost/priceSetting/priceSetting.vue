<template>
  <div class="config-view">
    <div class="content-view">
      <div class="button-view">
        <el-button type="primary" @click="submitForm" style="color: white"
          >保 存</el-button
        >
      </div>
      <div class="main-content">
        <div class="content">
          <div class="prev" @click="addYear(-1)"></div>
          <div class="calendar">
            <div class="year-title" id="leftYear">{{ startYear }}</div>
            <div class="item-content">
              <div
                class="item"
                :class="{ active: item.active }"
                v-for="(item, index) in leftList"
                :key="index"
                @click="activeItem(item)"
              >
                <div class="month-title">{{ item.month }}月</div>
                <div class="line">
                  <div class="label-text">水:</div>
                  <div class="text" :class="{ hidden: item.active }">
                    <span>{{ item.water }}</span
                    >元/吨
                  </div>
                  <input
                    class="input"
                    :class="{ hidden: !item.active }"
                    v-model="item.water"
                    type="text"
                  />
                  <div class="unit" :class="{ hidden: !item.active }">
                    元/吨
                  </div>
                </div>
                <div class="line">
                  <div class="label-text">电:</div>
                  <div class="text" :class="{ hidden: item.active }">
                    <span>{{ item.electric }}</span
                    >元/度
                  </div>
                  <input
                    class="input"
                    :class="{ hidden: !item.active }"
                    v-model="item.electric"
                    type="text"
                  />
                  <div class="unit" :class="{ hidden: !item.active }">
                    元/度
                  </div>
                </div>
                <div class="line">
                  <div class="label-text">能量:</div>
                  <div class="text" :class="{ hidden: item.active }">
                    <span>{{ item.energy }}</span
                    >元/焦耳
                  </div>
                  <input
                    class="input"
                    :class="{ hidden: !item.active }"
                    v-model="item.energy"
                    type="text"
                  />
                  <div class="unit" :class="{ hidden: !item.active }">
                    元/焦耳
                  </div>
                </div>
                <div class="line">
                  <div class="label-text">蒸汽:</div>
                  <div class="text" :class="{ hidden: item.active }">
                    <span>{{ item.gas }}</span
                    >元/吨
                  </div>
                  <input
                    class="input"
                    :class="{ hidden: !item.active }"
                    v-model="item.water"
                    type="text"
                  />
                  <div class="unit" :class="{ hidden: !item.active }">
                    元/吨
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="calendar">
            <div class="year-title" id="rightYear">{{ startYear * 1 + 1 }}</div>
            <div class="item-content">
              <div
                class="item"
                :class="{ active: item.active }"
                v-for="(item, index) in rightList"
                :key="index"
                @click="activeItem(item)"
              >
                <div class="month-title">{{ item.month }}月</div>
                <div class="line">
                  <div class="label-text">水:</div>
                  <div class="text" :class="{ hidden: item.active }">
                    <span>{{ item.water }}</span
                    >元/吨
                  </div>
                  <input
                    class="input"
                    :class="{ hidden: !item.active }"
                    v-model="item.water"
                    type="text"
                  />
                  <div class="unit" :class="{ hidden: !item.active }">
                    元/吨
                  </div>
                </div>
                <div class="line">
                  <div class="label-text">电:</div>
                  <div class="text" :class="{ hidden: item.active }">
                    <span>{{ item.electric }}</span
                    >元/度
                  </div>
                  <input
                    class="input"
                    :class="{ hidden: !item.active }"
                    v-model="item.electric"
                    type="text"
                  />
                  <div class="unit" :class="{ hidden: !item.active }">
                    元/度
                  </div>
                </div>
                <div class="line">
                  <div class="label-text">能量:</div>
                  <div class="text" :class="{ hidden: item.active }">
                    <span>{{ item.energy }}</span
                    >元/焦耳
                  </div>
                  <input
                    class="input"
                    :class="{ hidden: !item.active }"
                    v-model="item.energy"
                    type="text"
                  />
                  <div class="unit" :class="{ hidden: !item.active }">
                    元/焦耳
                  </div>
                </div>
                <div class="line">
                  <div class="label-text">蒸汽:</div>
                  <div class="text" :class="{ hidden: item.active }">
                    <span>{{ item.gas }}</span
                    >元/吨
                  </div>
                  <input
                    class="input"
                    :class="{ hidden: !item.active }"
                    v-model="item.water"
                    type="text"
                  />
                  <div class="unit" :class="{ hidden: !item.active }">
                    元/吨
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="next" @click="addYear(1)"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { settingList, saveSetting } from "@/api/energy/app/cost";

import moment from "moment";
export default {
  name: "EnergyPriceSetting",
  data() {
    return {
      startYear: moment().format("YYYY") * 1,
      leftList: [],
      rightList: [],
    };
  },
  created() {
    this.initData();
  },
  methods: {
    addYear(year) {
      this.startYear += +year;
      this.initData();
    },
    activeItem(item) {
      item.active = true;
      console.log(item);
    },
    initData() {
      settingList(this.startYear).then((res) => {
        res.data.forEach((item) => {
          item.active = false;
        });
        this.leftList = res.data.slice(0, 11);
        if (res.data.length > 12) {
          this.rightList = res.data.slice(12);
        }
      });
    },
    submitForm() {
      let list = [...this.leftList, ...this.rightList];
      saveSetting(list).then((res) => {
        if (res.code === 200) {
          this.msgSuccess("修改成功");
          this.leftList = [];
          this.rightList = [];
          this.initData();
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~@/assets/styles/common.scss";
.red {
  color: #ff1212;
}
.config-view {
  display: flex;
  justify-content: center;
  height: 100%;
  width: 100%;

  padding-top: rem(40);
  .content-view {
    display: flex;
    flex-direction: column;
    width: rem(1781);
    .button-view {
      display: flex;
      margin-left: rem(60);
    }

    .main-content {
      color: #cfdce6 !important;
      // padding: rem(17) rem(60);
      max-width: rem(1920);
    }

    .content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .content .prev {
      width: rem(20);
      height: rem(36);
      background-image: url("~@/assets/image/energy/prev-blue.png");
      background-size: cover;
      cursor: pointer;
    }
    .content .next {
      width: rem(20);
      height: rem(36);
      background-image: url("~@/assets/image/energy/next-blue.png");
      background-size: cover;
      cursor: pointer;
    }
    // .content .calendar {
    // }
    .content .calendar .year-title {
      font-weight: 800;
      font-size: rem(30);
      color: #ffffff;
      text-align: right;
      padding: 0 rem(10) rem(10) 0;
    }
    .content .calendar .item-content {
      display: flex;
      flex-wrap: wrap;
      width: rem(807);
    }
    .content .calendar .item-content .item {
      width: rem(260);
      padding: rem(15) rem(24);
      box-sizing: border-box;
      margin-right: rem(9);
      margin-bottom: rem(9);
      background: rgba(2, 17, 50, 0.5);
    }
    .content .calendar .item-content .item.active {
      background: #0072ff;
    }
    .content .calendar .item-content .item .month-title {
      font-weight: 800;
      font-size: rem(20);
      color: #fff;
      text-align: center;
    }
    .content .calendar .item-content .item .line {
      display: flex;
      align-items: center;
      padding-top: rem(20);
    }
    .content .calendar .item-content .item .line .label-text {
      font-size: rem(18);
      color: #fff;
      width: rem(55);
    }
    .content .calendar .item-content .item .line .text {
      color: #24d8ce;
      font-size: rem(18);
      margin-left: auto;
    }
    .content .calendar .item-content .item .line .hidden {
      display: none;
    }
    .content .calendar .item-content .item .line .input {
      width: rem(88);
      /* height: 30px; */
      background: #fff;
      outline: none;
      border: none;
      color: #1b3242;
    }
    .content .calendar .item-content .item .line .unit {
      font-size: rem(18);
      color: #fff;
      width: rem(65);
      margin-left: auto;
    }
  }
}
</style>
