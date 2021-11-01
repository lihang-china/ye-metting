<template>
  <div>
    <el-row>
      <el-col :span="3">
        <el-tree
          :data="menuOptions"
          :props="defaultProps"
          @node-click="handleNodeClick"
        ></el-tree>
      </el-col>
      <el-col :span="21">
        <div
          id="myMap"
          style="height: 100vh; background: #03071c"
          :key="mapKey"
        ></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import "ol/ol.css";
import * as GIS from "@/components/OpenLayers/mapUtils";
import { gisMenuConfig, getMenu, treeListMenu } from "@/api/gis/menu";

export default {
  name: "myMap",
  data() {
    return {
      // 菜单图层
      menuOptions: [],
      // 树型结构
      defaultProps: {
        children: "children",
        label: "label",
      },
      //
      mapKey: +new Date(),
    };
  },
  created() {
    this.getMenuList();
  },
  destroyed() {
    GIS.closeGis();
  },
  methods: {
    getMenuList() {
      treeListMenu().then((response) => {
        this.menuOptions = response.data;
      });
    },
    handleNodeClick(data) {
      getMenu(data.id).then((response) => {
        const menu = { ...response.data };
        if (menu && menu.menuClass === "L") {
          this.init(menu.menuType);
        }
      });
    },
    init(type) {
      gisMenuConfig(type).then((response) => {
        console.log(response);
        if (response.code === 200) {
          if (response.data) {
            let data = response.data;
            //modelType 2:gis模式 1:网页模式
            if (data.modelType === 2) {
              //layerModel 2:gis系统图 1:楼层图"
              if (data.layerModel === 1) {
                this.mapKey = +new Date();
                //加载地图基本配置必须先执行
                GIS.loadGisInitInfo(data).then((response) => {
                  //切换楼层/初始化楼层
                  GIS.changeFloor(data.initShowCeng);
                  //模拟切换
                  //setTimeout(function () {
                  //切换楼层
                  //GIS.changeFloor('12225') 后面参数可以为空
                  // GIS.changeFloor("9", function (evt) {
                  //   //点击的坐标
                  //   alert("自定义点击回调: " + evt.coordinate);
                  // });
                  // setTimeout(function () {
                  //   GIS.fixedPosition({
                  //     obid: "C_01F_VS_RB_0003",
                  //     icon: {
                  //       src: require("@/assets/image/gis/empty.png"),
                  //       scale: 1,
                  //     },
                  //   });
                  // }, 500);
                  //GIS.fixedPosition定位
                  //隐藏显示图层
                  // GIS.changeHideShow("ceng_shexiangtou",false);
                  //}, 5000);
                });
              }
            }
          }
        } else {
          this.msgError("菜单配置有误");
        }
      });
      //切换楼层/初始化楼层
      // GIS.changeFloor(data.initShowCeng);
    },
  },
};
</script>

<style>
.map-detail {
  background: rgb(10, 42, 113);
  border-radius: 6px;
  z-index: 9999;
  padding: 10px;
  font-size: 12px;
  line-height: 20px;
  width: 200px;
}
.map-detail .map-title {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #486aff;
}
.map-detail .item-status {
  color: #00ffb4;
  position: relative;
  padding-left: 20px;
}
.map-detail .item-status:before {
  content: "";
  position: absolute;
  left: 0;
  top: 3px;
  width: 12px;
  height: 12px;
  background: linear-gradient(180deg, #00ffd8, #00c0ff);
  /*border: 2px solid #fff;*/
  border-radius: 50%;
}
.map-detail .item-status.off {
  color: #c9d4e1;
}
.map-detail .item-status.off:before {
  background: linear-gradient(180deg, #a7b2bf, #275284);
}
.map-detail .item-status.alarm {
  color: #ee5757;
}
.map-detail .item-status.alarm:before {
  background: linear-gradient(180deg, #ff7f7f, #f22a2a);
}
.map-detail ul li {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}
</style>