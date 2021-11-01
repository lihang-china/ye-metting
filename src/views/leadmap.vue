<template>
  <div class="spatialSampling">
    <div id="map_container"></div>
  </div>
</template>
 
<script>
import { coordinates } from "@/components/LeadMap/supcon";

export default {
  components: {},
  data() {
    return {};
  },
  created() {},
  mounted() {
    const map = initMap({
      tilt: 70,
      heading: -45.3,
      center: [120.200516, 30.188067],
      zoom: 19,
      style: purpleStyle,
    });

    const view = new mapvgl.View({
      map: map,
    });

    let polygons = [];

    coordinates.forEach((item) => {
      let { buildings } = item;
      buildings.forEach((building) => {
        polygons.push({
          geometry: {
            type: "Polygon",
            coordinates: [building.coordinate],
          },
          properties: {
            height: building.height,
          },
        });
      });
    });

    const shapeLayer = new mapvgl.ShapeLayer({
      color: "#409EFF", // 柱状图颜色
      enablePicked: true, // 是否可以拾取
      selectedIndex: -1, // 选中项
      selectedColor: "#909399", // 选中项颜色
      autoSelect: true, // 根据鼠标位置来自动设置选中项
      onClick: (e) => {
        // 点击事件
        console.log(e);
      },
    });
    view.addLayer(shapeLayer);
    shapeLayer.setData(polygons);

    map.setDefaultCursor("default");
  },
  computed: {},
  methods: {},
};
</script>
 
<style lang="scss">
.spatialSampling {
  width: 100%;
  height: 100%;
  border: 1px solid red;
  #map_container {
    width: 100%;
    height: 100%;
  }
}
</style>