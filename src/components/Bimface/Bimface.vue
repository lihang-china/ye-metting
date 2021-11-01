<template>
  <div class="container" ref="container"></div>
</template>

<script>
import APILoader from "@/script/APILoader";
import Token from "@/script/Token";
import Door from "@/assets/bimface/door.png";

export default {
  name: "Bimface",
  props: {
    appKey: String,
    appSecret: String,
    fileId: String,
    eventHandle: Function
  },
  mounted: function() {
    new APILoader().load().then(() => {
      let { BimfaceSDKLoaderConfig, BimfaceSDKLoader } = window;
      let dom4Show = this.$refs.container;
      let { appKey, appSecret, fileId } = this;

      let token = new Token(appKey, appSecret);
      token.getViewToken(fileId).then(viewToken => {
        let bimfaceSDKLoaderConfig = new BimfaceSDKLoaderConfig();
        bimfaceSDKLoaderConfig.viewToken = viewToken;
        BimfaceSDKLoader.load(
          bimfaceSDKLoaderConfig,
          viewMetaData => {
            //在load之后，js才会全部被加载完成，所以在这里开始才能取到Glodon
            viewMetaData;
            let { Glodon } = window;
            let viewConfig = new Glodon.Bimface.Viewer.Viewer3DConfig();
            viewConfig.domElement = dom4Show;
            viewConfig.backgroundColor = [
              {
                //透明化背景
                color: new Glodon.Web.Graphics.Color(255, 255, 255, 0)
              }
            ];
            viewConfig.enableBorderLine = true;
            //关闭六面骰
            viewConfig.enableViewHouse = false;

            this.viewer3D = new Glodon.Bimface.Viewer.Viewer3D(viewConfig);
            this.viewer3D.addEventListener(
              Glodon.Bimface.Viewer.Viewer3DEvent.ViewAdded,
              () => {
                //通知已经加载结束了
                new Promise(resolve => {
                  this.viewer3D.getModelTree(objectdata => {
                    let tree = objectdata[0];
                    //取到3F
                    let f3 = tree.items[2];
                    let elementIds = [];
                    f3.items.forEach(category => {
                      category.items.forEach(family => {
                        family.items.forEach(familyType => {
                          familyType.items.forEach(element => {
                            elementIds = elementIds.concat(element.elementIds);
                          });
                        });
                      });
                    });
                    //隐藏3F所有构件
                    this.viewer3D.hideComponentsById(elementIds);

                    let f2 = tree.items[1];
                    let doors = [];
                    f2.items.forEach(category => {
                      if (category.name === "门") {
                        category.items.forEach(family => {
                          family.items.forEach(familyType => {
                            familyType.items.forEach(element => {
                              doors = doors.concat(element.elementIds);
                            });
                          });
                        });
                      }
                    });
                    console.log(doors);
                    this.showMarker(doors);

                    this.viewer3D.render();
                    this.viewer3D.addEventListener(
                      Glodon.Bimface.Viewer.Viewer3DEvent.MouseClicked,
                      this.handleClick
                    );
                    this.viewer3D.addEventListener(
                      Glodon.Bimface.Viewer.Viewer3DEvent.MouseDoubleClicked,
                      this.handleDoubleClick
                    );

                    resolve();
                  });
                })
                  .then(() => {
                    this.eventHandle({ type: "init", data: "successed" });
                  })
                  .catch(e => {
                    console.log(e);
                  });
              }
            );
            this.viewer3D.addView(viewToken);
          },
          () => {
            this.eventHandle({ type: "init", data: "failed" });
          }
        );
      });
    });
  },
  methods: {
    handleClick: handleClick,
    handleDoubleClick: handleDoubleClick,
    showMarker: showMarker
  }
};

//处理点击事件
function handleClick(object) {
  if (object.worldPosition) {
    console.log(object.elementId);
    this.viewer3D.getComponentProperty(object.elementId, function(objectData) {
      console.log(objectData);
    });
    this.viewer3D.getAreas(function(data) {
      console.log(data);
    });
  }

  return true;
}

function handleDoubleClick(object) {
  object;
  return true;
}

function showMarker(elementIds) {
  let { Glodon } = window;
  let config = new Glodon.Bimface.Plugins.Marker3D.Marker3DContainerConfig();
  config.viewer = this.viewer3D;
  let container = new Glodon.Bimface.Plugins.Marker3D.Marker3DContainer(config);
  elementIds.forEach(elementId => {
    this.viewer3D.getComponentProperty(elementId, object => {
      let config = new Glodon.Bimface.Plugins.Marker3D.Marker3DConfig();
      config.id = elementId;
      config.src = Door;
      let { max, min } = object.boundingBox;
      config.worldPosition = {
        x: (max.x + min.x) / 2,
        y: (max.y + min.y) / 2,
        z: max.z
      };
      //三维标签的提示
      config.tooltip = object.name;
      let marker = new Glodon.Bimface.Plugins.Marker3D.Marker3D(config);
      container.addItem(marker);
    });
  });
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>