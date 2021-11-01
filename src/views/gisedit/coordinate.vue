<template>
  <div style="height: 100vh">
    <!-- gis模式-->
    <div v-if="modelType === 2">
      <div id="myMap" style="height: 100vh"></div>
      <div class="left" v-if="layerModel === 1">
        <div class="left-top">
          <!-- <i class="iconfont left-top-icon">&#xe607;</i> {{menuName}} -->
          <svg-icon
            :icon-class="menuIcon"
            class="iconfont left-top-icon"
          ></svg-icon>
          {{ menuName }}
        </div>
        <div class="left-bottom">
          <el-scrollbar style="height: 100%">
            <div style="padding: 0 15px" v-if="allLou && allLou.length > 0">
              <template v-for="(item, index) in allLou">
                <div :key="index" style="margin-bottom: 18px">
                  <div class="left-title">
                    <div class="vertical-bar" />
                    <div class="left-title-text">
                      {{ item.areaName }}
                    </div>
                  </div>
                  <div class="storey-block">
                    <template v-for="(it, ind) in item.childrens">
                      <div
                        :key="ind"
                        :class="[
                          'storey',
                          { disable: it.showStatus === 3 },
                          { active: currentCeng === it.areaId },
                          { danger: it.showStatus === 2 },
                        ]"
                        :title="it.areaName"
                        @click="
                          it.showStatus === 3 ? '' : changeFloor(it.areaId)
                        "
                      >
                        <div class="storey-status" />
                        <div class="storey-text">{{ it.areaName }}</div>
                      </div>
                    </template>
                  </div>
                </div>
              </template>
            </div>
            <div v-else class="under-data">暂无数据</div>
          </el-scrollbar>
        </div>
      </div>
      <div class="right" v-if="layerModel === 1">
        <div style="padding: 8px 10px 0 0">
          <template v-for="(item, index) in lstLayer">
            <el-checkbox
              :key="index"
              v-model="item.checked"
              :label="item.name"
              @change="changeLayer"
              style="margin-right: 15px"
            ></el-checkbox>
          </template>
        </div>
        <div>
          <div class="right-search-block">
            <div>
              <input
                type="text"
                class="search-input"
                v-model="searchValue"
                placeholder="请输入设备名称"
              />
            </div>
            <div>
              <i class="iconfont" style="color: #fff; font-size: 18px"
                >&#xe699;</i
              >
            </div>
          </div>
          <div class="search-result-block">
            <el-scrollbar style="height: 100%">
              <div
                style="padding: 0 12px"
                v-if="computedPoints && computedPoints.length > 0"
              >
                <template v-for="(item, index) in computedPoints">
                  <div
                    :key="index"
                    class="result-block"
                    @click="handleFixed(item)"
                  >
                    <div class="result-title-block">
                      <div class="result-index">{{ index + 1 }}</div>
                      <div
                        :class="{
                          'result-label-check':
                            deviceList.find((t) => t.equId === item.id)
                              .longitude &&
                            deviceList.find((t) => t.equId === item.id)
                              .latitude,
                        }"
                      >
                        {{ item.label }}
                      </div>
                    </div>
                    <div
                      class="point-icon"
                      :class="{ 'point-active': item.guid === currentGuid }"
                    >
                      <i class="iconfont">&#xe608;</i>
                    </div>
                  </div>
                </template>
              </div>
              <div v-else class="under-data" style="height: 250px">
                暂无数据
              </div>
            </el-scrollbar>
          </div>
          <div class="bottom-block">
            <div>
              <span class="bottom-text">设备名称: </span>
              <input
                type="text"
                class="bottom-input"
                v-model="currentDevice.label"
                placeholder="请选择设备"
                disabled
              />
            </div>
            <div>
              <span class="bottom-text">设备编号: </span>
              <input
                type="text"
                class="bottom-input"
                v-model="currentDevice.value"
                placeholder="请选择设备"
                disabled
              />
            </div>
            <div>
              <span class="bottom-text">当前X: </span>
              <input
                type="text"
                class="bottom-input"
                v-model="currentDevice.longitude"
                placeholder="请选择设备"
                disabled
              />
            </div>
            <div>
              <span class="bottom-text">当前Y: </span>
              <input
                type="text"
                class="bottom-input"
                v-model="currentDevice.latitude"
                placeholder="请选择设备"
                disabled
              />
            </div>
            <div>
              <span class="bottom-text">X: </span>
              <input
                type="text"
                class="bottom-input"
                v-model="xValue"
                placeholder="请选择坐标"
              />
            </div>
            <div>
              <span class="bottom-text">Y: </span>
              <input
                type="text"
                class="bottom-input"
                v-model="yValue"
                placeholder="请选择坐标"
              />
            </div>
          </div>
          <div>
            <div class="bottom-button">
              <div class="storey" @click="saveCoordinate">
                <div class="storey-text">保存</div>
              </div>
              <div class="storey" @click="clearCoordinate">
                <div class="storey-text">清空</div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="right-btn"><i class="iconfont right-icon">&#xe676;</i>实例</div> -->
      </div>
    </div>
    <!-- 网页模式-->
    <div class="myWeb" v-if="modelType === 1">
      <div class="lTabs">
        <template v-for="(item, index) in leftLayout">
          <div
            :key="index"
            class="ltabs-tag"
            :class="{ 'tab-active': item.id === defaultSelectedLayout.id }"
            @click="changeTab(item)"
          >
            {{ item.systemName }}
          </div>
        </template>
      </div>
      <div class="main">来吧，展示</div>
      <div class="rTabs">
        <template v-for="(item, index) in rightLayout">
          <div
            :key="index"
            class="rtabs-tag"
            :class="{ 'tab-active': item.id === defaultSelectedLayout.id }"
            @click="changeTab(item)"
          >
            {{ item.systemName }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import "ol/ol.css";
import * as GIS from "@/components/OpenLayers/mapUtilsEdit";
import { gisMenuConfig } from "@/api/gis/menu";
import { getDeviceBySystemIds, UpdateCoordinate } from "@/api/equipment/card";
import Item from "../../layout/components/Sidebar/Item.vue";

export default {
  name: "GisCoordinate",
  components: { Item },
  computed: {
    computedPoints() {
      return this.points.filter(
        (item) => item.label.indexOf(this.searchValue) >= 0
      );
    },
  },
  data() {
    return {
      modelType: null,
      searchValue: "",
      points: [],
      allLou: null,
      currentCeng: null,
      layerModel: null,
      lstLayer: null,
      currentGuid: null,
      menuName: null,
      menuIcon: null,
      defaultSelectedLayout: null,
      leftLayout: null,
      rightLayout: null,
      deviceList: [],
      currentDevice: {},
      xValue: undefined,
      yValue: undefined,
    };
  },
  watch: {
    xValue(newValue, oldValue) {
      //console.log(newValue, oldValue);
      if (Object.keys(this.currentDevice).length != 0) {
        this.deviceList.find(
          (t) => t.equId === this.currentDevice.id
        ).longitude = newValue;
      }
    },
    yValue(newValue, oldValue) {
      //console.log(newValue, oldValue);
      if (Object.keys(this.currentDevice).length != 0) {
        this.deviceList.find(
          (t) => t.equId === this.currentDevice.id
        ).latitude = newValue;
      }
    },
  },
  created() {
    //示例点击视频监控菜单
    const query = this.$route.query;
    const type = query.type;
    this.menuName = query.menuName;
    this.menuIcon = query.icon;
    this.load(type);
  },
  mounted() {},
  methods: {
    load(type) {
      gisMenuConfig(type).then((response) => {
        //console.log(response);
        if (response.code === 200) {
          if (response.data) {
            //console.log(response);
            let data = response.data;
            this.modelType = data.modelType;
            //modelType 2:gis模式 1:网页模式
            if (data.modelType === 2) {
              //gis模式
              this.layerModel = data.layerModel;
              //layerModel 2:gis系统图 1:楼层图"
              if (data.layerModel === 1) {
                // 加载设备类型
                this.lstLayer = data.lstLayer.map((item) => ({
                  name: item.layerNameJs,
                  code: item.layerCodeJs,
                  systemIds: item.systemIds,
                  checked: true,
                }));
                //console.log("lou", data.allLou);
                // 加载楼层数据
                this.allLou = data.allLou;
                // 默认楼层
                this.currentCeng = data.initShowCeng;
                // 加载设备
                this.loadDevice();
                //加载地图基本配置必须先执行
                GIS.loadGisInitInfo(data).then((response) => {
                  //切换楼层/初始化楼层
                  GIS.changeFloor(data.initShowCeng, false, this.setCoordinate);
                });
              }
            } else {
              this.leftLayout = data.leftLayout;
              this.rightLayout = data.rightLayout;
              this.defaultSelectedLayout = data.defaultSelectedLayout;
            }
          }
        } else {
          this.msgError("菜单配置有误");
        }
      });
    },
    loadDevice() {
      const systemIdsStr = this.lstLayer
        .filter((i) => i.checked)
        .map((i) => i.systemIds)
        .join(",");
      getDeviceBySystemIds({
        areaId: this.currentCeng,
        systemIds: systemIdsStr,
      }).then((res) => {
        this.points = res.rows.map((item) => ({
          value: item.equCode,
          label: item.equName,
          guid: item.equGuid,
          id: item.equId,
          longitude: item.longitude,
          latitude: item.latitude,
        }));
        this.deviceList = res.rows.map((item) => ({
          equId: item.equId,
          xValue: item.longitude,
          yValue: item.latitude,
          longitude: undefined,
          latitude: undefined,
        }));
      });
    },
    changeFloor(floor) {
      // 切换楼层
      this.currentCeng = floor;
      GIS.changeFloor(floor, false, this.setCoordinate);
      this.loadDevice();
    },
    changeLayer() {
      // 显示隐藏设备图层
      this.lstLayer.forEach((item) => {
        GIS.changeHideShow(item.code, item.checked);
      });
      this.loadDevice();
    },
    handleFixed(device) {
      // 定位
      this.currentGuid = device.guid;
      GIS.fixedPosition({
        guid: device.guid,
        icon: { src: require("@/assets/image/gis/empty.png"), scale: 1 },
      });
      this.currentDevice = { ...device };
      this.xValue = this.deviceList.find(
        (t) => t.equId === this.currentDevice.id
      ).longitude;
      this.yValue = this.deviceList.find(
        (t) => t.equId === this.currentDevice.id
      ).latitude;
      if (this.xValue && this.yValue) {
        GIS.positionClick([this.xValue, this.yValue]);
      } else {
        GIS.positionClick();
      }
    },
    changeTab(item) {
      this.defaultSelectedLayout = item;
    },
    setCoordinate(coordinate) {
      if (Object.keys(this.currentDevice).length != 0) {
        this.xValue = coordinate[0];
        this.yValue = coordinate[1];
        // this.deviceList.find(
        //   (t) => t.equId === this.currentDevice.id
        // ).longitude = coordinate[0];
        // this.deviceList.find(
        //   (t) => t.equId === this.currentDevice.id
        // ).latitude = coordinate[1];
      }
    },
    saveCoordinate() {
      // if (this.xValue && this.yValue && this.currentDevice) {
      console.log(this.deviceList);

      const loading = this.openLoading("正在保存,请稍后......");
      UpdateCoordinate(this.deviceList).then((res) => {
        loading.close();
        if (res.code === 200) {
          this.changeFloor(this.currentCeng);
          this.currentGuid = undefined;
          this.currentDevice = {};
          this.xValue = undefined;
          this.yValue = undefined;
          this.msgSuccess("保存成功");
        }
      });
      // } else {
      //   console.log("data");
      // }
    },
    clearCoordinate() {
      this.xValue = undefined;
      this.yValue = undefined;
      this.deviceList.find(
        (t) => t.equId === this.currentDevice.id
      ).longitude = undefined;
      this.deviceList.find(
        (t) => t.equId === this.currentDevice.id
      ).latitude = undefined;
      GIS.positionClick();
    },
  },
};
</script>

<style>
/** 左侧 */
.left {
  width: 335px;
  height: 75%;
  top: 40px;
  position: absolute;
  left: 20px;
}

.left-top {
  font-size: 20px;
  color: #fff;
  font-weight: bold;
  margin-bottom: 15px;
  padding-left: 5px;
}

.left-top-icon {
  font-size: 26px;
}

.left-bottom {
  background-color: rgba(2, 69, 144, 0.5);
  height: calc(100% - 50px);
  border-radius: 10px;
  padding: 20px 5px;
}

.vertical-bar {
  background-color: #0e9bff;
  width: 5px;
  height: 16px;
}

.left-title {
  display: flex;
}

.left-title-text {
  font-size: 16px;
  font-weight: bold;
  margin-left: 7px;
  color: #fff;
}

.storey-block {
  padding: 18px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-wrap: wrap;
  margin-left: -2px;
  margin-right: -2px;
}

.storey {
  background-color: rgba(11, 139, 255, 0.2);
  border-radius: 4px;
  display: flex;
  width: calc(25% - 6px);
  padding: 9px 10px;
  align-items: center;
  margin: 5px 3px;
  cursor: pointer;
  border: 1px solid transparent;
}

.storey:hover {
  background-color: rgba(35, 139, 255, 0.4);
  border: 1px solid #52a3ff;
}

.active {
  background-color: rgba(35, 139, 255, 0.4);
  border: 1px solid #52a3ff;
}

.disable {
  background-color: rgba(157, 157, 157, 0.5) !important;
  cursor: no-drop !important;
  border: 1px solid transparent !important;
}

.danger {
  background-color: #ca3f44 !important;
}

.storey-status {
  background: #46eb06;
  border-radius: 50%;
  width: 8px;
  height: 8px;
  margin-top: -2px;
}

.disable .storey-status {
  background: #fff;
}

.danger .storey-status {
  background: #fff;
}

.danger.active {
  border: 1px solid #fff;
}

.storey-text {
  margin-left: 7px;
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  line-height: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: calc(100% - 12px);
}

/**右侧 */
.right {
  position: absolute;
  right: 15px;
  top: 70px;
  display: flex;
}

.right-btn {
  width: 99px;
  height: 36px;
  background: rgba(5, 100, 207, 1);
  border-radius: 4px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  cursor: pointer;
}

.right-icon {
  font-size: 12px;
  margin-right: 3px;
  font-weight: normal;
}

.right-search-block {
  width: 372px;
  height: 36px;
  background: rgba(1, 68, 144, 0.55);
  border-radius: 4px;
  margin-right: 10px;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  align-items: center;
}

.search-input {
  width: 325px;
  line-height: 22px;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 14px;
  padding-left: 10px;
}

.search-input::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #86a7b6;
}

.search-result-block {
  width: 372px;
  height: 296px;
  background: rgba(11, 40, 77, 0.8);
  border-radius: 4px;
  margin-top: 4px;
  padding: 0 3px;
}

.result-block {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(25, 57, 101, 0.8);
  cursor: pointer;
}

.result-title-block {
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 15px;
}

.result-label-check {
  color: #e6a23c;
}

.result-index {
  width: 28px;
  height: 28px;
  background: rgba(5, 92, 191, 1);
  border-radius: 50%;
  padding: 6px 0;
  margin-right: 8px;
  font-size: 14px;
  text-align: center;
}

.point-icon {
  font-size: 22px;
  color: #055cbf;
}

.point-icon.point-active {
  color: #ffba00;
}

.point-icon:hover {
  font-size: 22px;
  color: #ffba00;
}

.under-data {
  color: #7e9ba9;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
}

/* 底部交互框 */
.bottom-block {
  width: 372px;
  height: 198px;
  background: rgba(1, 68, 144, 0.55);
  border-radius: 4px;
  margin-top: 4px;
  padding: 0 3px;
}

.bottom-text {
  padding-left: 10px;
  color: #c0c4cc;
}

.bottom-input {
  width: 200px;
  line-height: 22px;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 14px;
  padding: 10px 0 0 10px;
}

.bottom-button {
  display: flex;
}

/* 网页模式 */
.myWeb {
  height: 100%;
  display: flex;
  padding: 40px 100px;
}

.lTabs,
.rTabs {
  width: 50px;
}

.ltabs-tag {
  color: #abd7ff;
  border: 1px solid #1682e6;
  width: 28px;
  font-size: 14px;
  padding: 10px 6px;
  border-radius: 5px 0 0 5px;
  float: right;
  margin-right: -1px;
  margin-bottom: 5px;
  cursor: pointer;
}

.rtabs-tag:hover,
.ltabs-tag:hover {
  background: #0e3961;
}

.rtabs-tag {
  color: #abd7ff;
  border: 1px solid #1682e6;
  width: 28px;
  font-size: 14px;
  padding: 10px 6px;
  border-radius: 0px 5px 5px 0px;
  float: left;
  margin-left: -1px;
  margin-bottom: 5px;
  cursor: pointer;
}

.tab-active {
  background: #084a88;
}

.main {
  color: #abd7ff;
  width: calc(100% - 100px);
  border: 1px solid #39648c;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
}
</style>

<style>
.el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>

<style>
.map-detail {
  background: white;
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