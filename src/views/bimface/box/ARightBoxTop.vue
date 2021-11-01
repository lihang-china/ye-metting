<template>
  <div class="arightboxtop">
    <h2 class="tith2">{{ title }}</h2>
    <!-- <div class="left2_table"> -->
    <vue-seamless-scroll
      :data="datas"
      :class-option="optionHover"
      class="left2_table"
    >
      <ul>
        <li
          v-for="(data, index) in datas"
          :key="index"
          :class="{ bg: index % 2 === 1 }"
        >
          <p class="fl">
            <b>{{ data.name }}</b>
            &nbsp;&nbsp;{{ data.active }}<br />
          </p>
          <p class="fr pt17">{{ data.status }}</p>
        </li>
      </ul>
    </vue-seamless-scroll>
    <!-- </div> -->
  </div>
</template>

<script>
import vueSeamlessScroll from "vue-seamless-scroll";

export default {
  name: "ARightBoxTop",
  components: { vueSeamlessScroll },
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      datas: [
        {
          name: "客梯01",
          active: "上行",
          status: "在线",
        },
        {
          name: "客梯002",
          active: "上行",
          status: "在线",
        },
        {
          name: "客梯03",
          active: "下行",
          status: "在线",
        },
        {
          name: "客梯04",
          active: "停靠01F",
          status: "在线",
        },
        {
          name: "客梯05",
          active: "停靠09F",
          status: "在线",
        },
        {
          name: "客梯06",
          active: "该电梯已离线......",
          status: "离线",
        },
        {
          name: "客梯07",
          active: "停靠-1F",
          status: "在线",
        },
        {
          name: "客梯08",
          active: "下行",
          status: "在线",
        },
        {
          name: "客梯09",
          active: "上行",
          status: "在线",
        },
        {
          name: "客梯10",
          active: "停靠20F",
          status: "在线",
        },
        {
          name: "货梯01",
          active: "停靠01F",
          status: "在线",
        },
        {
          name: "货梯02",
          active: "停靠01F",
          status: "在线",
        },
        {
          name: "货梯03",
          active: "下行",
          status: "在线",
        },
        {
          name: "货梯04",
          active: "上行",
          status: "在线",
        },
      ],
    };
  },
  computed: {
    optionHover() {
      return {
        step: 0.5,
      };
    },
  },
};
</script>