<template>
  <div class="aleftboxttop">
    <h2 class="tith2">{{ title }}</h2>
    <div class="tlbox">
      <ul>
        <li style="height: 10%; padding-top: 1%">
          <p class="text">
            <span><i class="riconz"></i>在线</span>
            <span><i class="riconl"></i>离线</span>
            <span><i class="ricong"></i>故障</span>
          </p>
        </li>
        <li v-for="(device, index) in devices" :key="index">
          <p class="text">
            <span class="w12">{{ device.name }}</span>
          </p>
          <p class="rwith bgcg">
            <span
              class="rwith_img qgcz"
              :style="{ width: (device.onLine / device.sum) * 100 + '%' }"
            >
              {{ device.onLine }}
            </span>
            <span
              class="rwith_img qgcl"
              :style="{ width: (device.offLine / device.sum) * 100 + '%' }"
            >
              {{ device.offLine }}
            </span>
            {{ device.breaks }}
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "ALeftBoxtTop",
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      params: [
        {
          name: "门禁设备",
          constant_on: 7,
          multiple_on: 10,
          constant_off: 1,
          multiple_off: 10,
          constant_sum: 1,
          multiple_sum: 100,
        },
        {
          name: "监控设备",
          constant_on: 3,
          multiple_on: 100,
          constant_off: 1,
          multiple_off: 10,
          constant_sum: 4.2,
          multiple_sum: 100,
        },
        {
          name: "照明设备",
          constant_on: 5,
          multiple_on: 100,
          constant_off: 1,
          multiple_off: 100,
          constant_sum: 8,
          multiple_sum: 100,
        },
      ],
      devices: [
        {
          name: "门禁设备",
          onLine: 78,
          offLine: 15,
          breaks: 9,
          sum: 102,
        },
        {
          name: "监控设备",
          onLine: 125,
          offLine: 98,
          breaks: 21,
          sum: 244,
        },
        {
          name: "照明设备",
          onLine: 60,
          offLine: 20,
          breaks: 20,
          sum: 100,
        },
      ],
    };
  },
  mounted() {
    //this.init();
  },
  methods: {
    getDevices() {
      this.devices = [];
      this.params.forEach((item, index) => {
        let sum = (
          (Math.random() + item.constant_sum) *
          item.multiple_sum
        ).toFixed(0);
        let onLine = (
          (Math.random() + item.constant_on) *
          item.multiple_on
        ).toFixed(0);
        let offLine = (
          (Math.random() + item.constant_off) *
          item.multiple_off
        ).toFixed(0);
        let breaks = sum - onLine - offLine;

        this.devices.push({
          name: item.name,
          onLine: onLine,
          offLine: offLine,
          breaks: breaks,
          sum: sum,
        });
      });
    },
    init() {
      this.getDevices();

      if (this.autoECharts) {
        setInterval(() => {
          this.getDevices();
        }, this.autoTime);
      }
    },
  },
};
</script>