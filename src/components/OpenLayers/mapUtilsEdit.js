/**2020-12-29 LG* 改： obid=>guid // systemCode=>classCode */


import request from '@/utils/request'

import Map from "ol/Map";
import View from "ol/View";

import TileLayer from "ol/layer/Tile";
import Image from "ol/layer/Image";
import { XYZ, ImageWMS } from "ol/source"
import { unByKey } from 'ol/Observable';
import TileGrid from "ol/tilegrid/TileGrid";
import { format, toStringHDMS } from 'ol/coordinate';
import { toLonLat, transform } from 'ol/proj';
// 图上图标相关
import OlFeature from 'ol/Feature';
import OlGeomPoint from 'ol/geom/Point';
import OlLayerVector from 'ol/layer/Vector';
import OlSourceVector from 'ol/source/Vector';
import OlStyleStyle from 'ol/style/Style';
import OlStyleIcon from 'ol/style/Icon';
// 用来添加相关文字描述的
import Text from 'ol/style/Text';
import Fill from 'ol/style/Fill';
import Overlay from 'ol/Overlay'
import * as olControl from 'ol/control';
import * as interaction from 'ol/interaction';

import { getPath, parseDom, getCurrentIcon, isPicture } from "@/components/OpenLayers/utils";

import { getDeviceBySystemIds, getDeviceStatus } from "@/api/equipment/card";

import spjkParams from "./spjkParam";
import bapauParams from "./bapauParam";

let gMap = null;
//弹窗
let tipOverlay = null;
//刷新设备状态定时器
let refreshTimer = null;
let currLayers = {};
//定位图层
let locationLayer = null;
//设备图层
let deviceLayer = {};
//当前楼层id
let selectFloor = null;
//菜单编码
let type = null;
//地图配置信息
let buildings = {}, icons = {}, lstLayer = [], modelType = null, layerModel = null, mapClickEvent;
// let urlPrefix="http://localhost:8888/geoserver";
// let urlPrefix="http://172.20.113.52:9999/supconit";
//geoserver 地址
let urlPrefix;
//geoserver 类型 1:地图服务 2:切片
let layerType;
//编辑定位图层
let positionLayer = null;

export {
    gMap
}

// 加载地图基本配置
export function loadGisInitInfo(data) {
    // 2020-10-14 LG*  
    // bug：当页面从gis切换到别的页面再切换回来时，gis图会加载不出来，现在可以了
    if (gMap) {
        gMap = null;
    }

    return request({
        url: '/gis/map/getGisInitInfo',
        method: 'get'
    }).then(response => {
        console.log("loadGisInitInfo", response);
        if (response.code === 200) {
            buildings = response.data.buildings;
            //geoserver type 1:地图服务 2:切片
            layerType = response.data.layerType;
            //geoserver 地址
            urlPrefix = response.data.urlPrefix;
            //是否运行监控菜单
            if (data && data.type) {
                type = data.type;
                modelType = data.modelType;
                if (modelType === 2) {
                    icons = data.icons;
                    lstLayer = data.lstLayer;
                    layerModel = data.layerModel;
                }
            }
        } else {
            console.log(response)
        }
    });
}

export function changeFloor(floorId, refresh = true, clickCallBack) {
    let mapConfig = buildings[floorId];
    selectFloor = floorId;
    if (mapConfig) {
        let tileInfo = {
            layerType: layerType,
            layerName: mapConfig.baseLayer,
            projection: "EPSG:4326",
            //    extent: [-2.1073843752129084, -1.4536419190656158, 2.5214473259524413, 1.1500759128398932],
            extent: [Number(mapConfig.minlon), Number(mapConfig.minlat), Number(mapConfig.maxlon), Number(mapConfig.maxlat)],
            fullextent: [-180.0, -90.0, 180.0, 90.0],
            origin: [-180.0, 90.0],
            center: [Number(mapConfig.centerx), Number(mapConfig.centery)],
            maxZoom: 12,
            minZoom: 8,
            zoom: mapConfig.initlevel || 9,
            //mapConfig.scales
            resolutions: [0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 6.866455078125E-4, 3.433227539062E-4, 1.716613769531E-4, 8.58306884766E-5, 4.29153442383E-5, 2.14576721191E-5, 1.07288360596E-5, 5.3644180298E-6, 2.6822090149E-6, 1.3411045074E-6, 6.705522537E-7, 3.352761269E-7],
            // resolutions: mapConfig.scales.split(',').map(Number),
            tileSize: [256, 256]
        };
        loadMap(tileInfo, refresh, clickCallBack);
    } else {
        console.log("配置错误！....");
    }
}

export function loadMap(tileInfo, refresh, clickCallBack) {
    let layer;
    if (tileInfo.layerType == 2) {
        //切片图层的分辨率集合
        let resolutions = tileInfo.resolutions;
        let tileGrid = new TileGrid(
            {
                tileSize: tileInfo.tileSize || [256, 256],
                extent: tileInfo.fullextent,
                origin: tileInfo.origin,
                center: tileInfo.center,
                minZoom: tileInfo.minZoom,
                resolutions: resolutions
            }
        )

        let url = urlPrefix + "/" + tileInfo.layerName + '/{z}/{f}/{x}_{y}.png'; //初步的url
        //projection: "EPSG:4326",
        let fileName = tileInfo.projection.replace(':', '_');

        //添加下载后的切片地图
        layer = new TileLayer({
            source: new XYZ({
                tileGrid: tileGrid,
                projection: tileInfo.projection,
                tileUrlFunction: function (tileCoord) {
                    let z = tileCoord[0];
                    let x = tileCoord[1];
                    let y = tileCoord[2];
                    let path = getPath(x, y, z);
                    if (z < 10) {
                        let tiles = url.replace('{z}', fileName + '_0' + z.toString())
                            .replace('{f}', path.file)
                            .replace('{x}', path.row)
                            .replace('{y}', path.col)
                        return tiles
                    } else {
                        let tiles = url.replace('{z}', fileName + '_' + z.toString())
                            .replace('{f}', path.file)
                            .replace('{x}', path.row)
                            .replace('{y}', path.col)
                        return tiles
                    }
                }
            })
        })
    } else {
        layer = new Image({
            source: new ImageWMS({
                url: urlPrefix + '/wms',
                params: { 'LAYERS': tileInfo.layerName },
                serverType: 'geoserver',
            })
        });
    }

    if (gMap) {
        gMap.getOverlays().clear();
        gMap.getView().setCenter(tileInfo.center);
        // gMap.getLayerGroup().getLayersArray().forEach(function (item) {
        //   gMap.removeLayer(item);
        // })
        gMap.getLayers().clear();

        currLayers = [];
        locationLayer = null;
        tipOverlay = null;
    } else {
        gMap = new Map({
            target: "myMap",
            view: new View({
                projection: tileInfo.projection,
                maxZoom: tileInfo.maxZoom,
                minZoom: tileInfo.minZoom,
                zoom: tileInfo.zoom,
                center: tileInfo.center,
            }),
            controls: olControl.defaults({
                attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                    collapsible: false
                }),
                //清除地图上默认样式（放大、缩小、旋转按钮等）
                attribution: false,
                rotate: false,
                zoom: false
            }),
            interactions: interaction.defaults({
                doubleClickZoom: false,// 取消双击放大功能交互
            })
        });
    }

    // gMap.addControl(new olControl.LayerSwitcher());
    // gMap.addControl(new olControl.Zoom({}));
    //添加鼠标定位控件
    // gMap.addControl(new olControl.MousePosition({
    //     undefinedHTML: 'outside',
    //     projection: 'EPSG:4326',
    //     coordinateFormat: function(coordinate) {
    //       return format(coordinate, '{x}, {y}', 4);
    //     }
    //   })
    // );

    gMap.addLayer(layer);
    //是否运行监控菜单
    if (type) {
        //modelType 2:gis模式 1:网页模式
        if (modelType === 2) {
            //layerModel 2:gis系统图 1:楼层图"
            if (layerModel === 1) {
                //加载设备图层
                addDeviceLayers();
                //刷新设备状态
                if (refreshTimer) {
                    clearInterval(refreshTimer)
                }
                if (refresh) {
                    //refreshTimer = setInterval(refreshDeviceStatus, 10000)
                }
            }
        }
    }
    // gMap.getView().fit(tileInfo.extent,8)

    if (mapClickEvent) {
        unByKey(mapClickEvent);
    }

    //绑定点击事件
    // if (!clickCallBack && type) {
    //     clickCallBack = monitorCallBack;
    // }
    // if (clickCallBack && typeof clickCallBack == 'function') {
    //     mapClickEvent = mapClick(clickCallBack);
    // }
    mapClickEvent = mapClick(clickCallBack);
}

let monitorCallBack = function (evt) {
    if (tipOverlay) {
        gMap.removeOverlay(tipOverlay);
    }
    if (gMap.hasFeatureAtPixel(evt.pixel)) {
        // let feature = gMap.getFeaturesAtPixel(evt.pixel)
        // console.log(feature)
        let pixel = gMap.getEventPixel(evt.originalEvent);
        gMap.forEachFeatureAtPixel(pixel, function (feature) {
            let device = feature.get('key');
            if (device && device.guid) {
                let event = device.event;
                if (event && 1 == event.clickEvent) {
                    if (event.clickFunction) {
                        //根据函数名得到函数类型
                        let func = eval(event.clickFunction);
                        //创建函数对象，并调用
                        new func(evt, device);
                        // clickVS(evt,device);
                    }
                }
            }
        });
    }
}

// 绑定点击事件 callBack为回调函数
export function mapClick(clickCallBack) {
    // 通过 map.on() 监听，singleclick 是单击的意思。也可以用 click 代替 singleclick。
    return gMap.on('singleclick', evt => {
        //点击的坐标
        console.log("coordinate", evt.coordinate);
        //alert(evt.coordinate);
        positionClick(evt.coordinate)

        monitorCallBack(evt);

        clickCallBack(evt.coordinate);
    })
}

export function positionClick(coordinate = []) {
    console.log("positionClick");

    if (positionLayer) {
        gMap.removeLayer(positionLayer);
        positionLayer = null;
    }

    if (coordinate.length > 0) {
        let imgFeature = new OlFeature({
            id: "feature_location",
            type: 'icon',
            geometry: new OlGeomPoint(coordinate)
        })

        positionLayer = new OlLayerVector({
            source: new OlSourceVector({
                features: [imgFeature]
            }),
            style: new OlStyleStyle({
                image: new OlStyleIcon({
                    anchor: [0.45, 15],
                    scale: 1,
                    anchorXUnits: 'fraction',       //锚点X值单位(单位:分数)
                    anchorYUnits: 'pixels',         //锚点Y值单位(单位:像素)
                    src: require('@/assets/image/gis/position.png')
                })
            })
        })
        gMap.addLayer(positionLayer);
        //设置中心点
        gMap.getView().animate({ center: coordinate }, { duration: 1000 });
    }
}

// 点击摄像头
let clickVS = function (evt, device) {
    console.log(device);
    //console.log(spjkParams[device.deviceName]);
    var url = "http://10.58.24.1:8099/spjk/video.html?url=" + spjkParams[device.deviceName];                            //转向网页的地址;
    var name = device.deviceName + " 视频监控";                           //网页名称，可为空;
    var iWidth = 640;                         //弹出窗口的宽度;
    var iHeight = 480;                        //弹出窗口的高度;
    //window.screen.height获得屏幕的高，window.screen.width获得屏幕的宽
    var iTop = (window.screen.height - 30 - iHeight) / 2;       //获得窗口的垂直位置;
    var iLeft = (window.screen.width - 10 - iWidth) / 2;        //获得窗口的水平位置;
    window.open(url, name, 'height=' + iHeight + ',innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',toolbar=no,menubar=no,scrollbars=auto,resizeable=no,location=no,status=no');

    // let container = parseDom('<div class="map-detail" id="map-detail-' + device.guid + '">' + device.deviceName + '<br />(' + device.deviceCode + ')</div>')[0];
    // let overlay = new Overlay({
    //     id: "tip_overlay_" + device.guid,
    //     //设置弹出框的容器
    //     element: container,
    //     //是否自动平移，即假如标记在屏幕边缘，弹出时自动平移地图使弹出框完全可见
    //     autoPan: true,
    //     //换成设备坐标
    //     position: evt.coordinate,
    //     offset: [0, -20]
    // });

    // //设置弹出框内容，可以HTML自定义
    // // container.innerHTML= tagsStr+tagStrdetail;

    // //显示overlay

    // gMap.addOverlay(overlay);
    // //right会流畅一些
    // overlay.setPositioning('bottom-center');
    // tipOverlay = overlay;
}

let clickES = function (evt, device) {
    console.log(device);
    let container = parseDom('<div class="map-detail" id="map-detail-' + device.guid + '">' + device.deviceName + '<br />' + device.deviceCode + '</div>')[0];
    let overlay = new Overlay({
        id: "tip_overlay_" + device.guid,
        //设置弹出框的容器
        element: container,
        //是否自动平移，即假如标记在屏幕边缘，弹出时自动平移地图使弹出框完全可见
        autoPan: true,
        //换成设备坐标
        position: evt.coordinate,
        offset: [0, -20]
    });

    //设置弹出框内容，可以HTML自定义
    // container.innerHTML= tagsStr+tagStrdetail;

    //显示overlay

    gMap.addOverlay(overlay);
    //right会流畅一些
    overlay.setPositioning('bottom-center');
    tipOverlay = overlay;
}

let clickDM = function (evt, device) {
    console.log(device);
    let container = parseDom('<div class="map-detail" id="map-detail-' + device.guid + '">' + device.deviceName + '<br />' + device.deviceCode + '</div>')[0];
    let overlay = new Overlay({
        id: "tip_overlay_" + device.guid,
        //设置弹出框的容器
        element: container,
        //是否自动平移，即假如标记在屏幕边缘，弹出时自动平移地图使弹出框完全可见
        autoPan: true,
        //换成设备坐标
        position: evt.coordinate,
        offset: [0, -20]
    });

    //设置弹出框内容，可以HTML自定义
    // container.innerHTML= tagsStr+tagStrdetail;

    //显示overlay

    gMap.addOverlay(overlay);
    //right会流畅一些
    overlay.setPositioning('bottom-center');
    tipOverlay = overlay;
}

let clickBA = function (evt, device) {
    console.log(device);

    var url = 'http://' + bapauParams[device.deviceCode] + "/manage.htm";
    window.location.href = "alert:" + url;// 使用IE打开

    // // let container = parseDom('<div class="map-detail" id="map-detail-' + device.guid + '">' + device.deviceName + '<br />' + device.deviceCode + '</div>')[0];
    // let container = parseDom('<iframe src="http://10.58.24.1:8089/#/runtime/6fc319fc49124225bf440b57a9041617" frameborder="0" width="500px" height="500px"></iframe>')[0];
    // let overlay = new Overlay({
    //     id: "tip_overlay_" + device.guid,
    //     //设置弹出框的容器
    //     element: container,
    //     //是否自动平移，即假如标记在屏幕边缘，弹出时自动平移地图使弹出框完全可见
    //     autoPan: true,
    //     //换成设备坐标
    //     position: evt.coordinate,
    //     offset: [0, -20]
    // });

    // //设置弹出框内容，可以HTML自定义
    // // container.innerHTML= tagsStr+tagStrdetail;

    // //显示overlay

    // gMap.addOverlay(overlay);
    // //right会流畅一些
    // overlay.setPositioning('bottom-center');
    // tipOverlay = overlay;
}

export function addDeviceLayers() {
    if (lstLayer && lstLayer.length > 0) {
        lstLayer.forEach(function (item) {
            let layerName = item.layerCodeJs;
            let event = item;
            let display = item.display;
            getDeviceBySystemIds({ areaId: selectFloor, systemIds: item.systemIds }).then(response => {
                console.log("addDeviceLayers", response);
                if (response.code === 200 && response.rows.length > 0) {
                    let devices = [];
                    response.rows.forEach(function (item) {
                        let src;
                        let icon = icons.one[item.classCode];
                        if (!icon) { return false; }
                        if (isPicture(icon)) {
                            src = require('@/assets/image/gis/deviceStatus/' + icon);
                        } else {
                            src = getCurrentIcon(icon, 30, 'rgba(0,0,0,0)', 'blue');
                        }
                        devices.push({
                            coordinate: [item.longitude, item.latitude],
                            //coordinate: [(Math.random() > 0.5 ? -Math.random() : Math.random()) /* * 1.8*/, (Math.random() > 0.5 ? -Math.random() : Math.random()) /* * 0.3*/],
                            icon: {
                                src: src,
                                scale: 1
                            },
                            key: { guid: item.equGuid, deviceName: item.equName, deviceCode: item.equCode, classCode: item.classCode, event: event }
                        })
                    })
                    addDeviceLayer(layerName, devices);
                    changeHideShow(layerName, display);
                    refreshDeviceStatus();
                }
            })
        })
    }
}

// 添加设备图标的方法
export function addDeviceLayer(layerName, devices) {
    let vectorLayer = new OlLayerVector({
        source: new OlSourceVector()
    });
    gMap.addLayer(vectorLayer);

    devices.forEach(function (device) {
        // 创建一个Feature，并设置好在地图上的位置
        let anchor = new OlFeature({
            id: "feature_" + device.key.guid,
            type: 'icon',
            //参数
            key: device.key,
            geometry: new OlGeomPoint(device.coordinate)
        });
        // 设置样式，在样式中就可以设置图标
        anchor.setStyle(new OlStyleStyle({
            image: new OlStyleIcon({
                anchor: [0.5, 1],
                scale: device.icon.scale || 1,
                anchorXUnits: 'fraction',       //锚点X值单位(单位:分数)
                anchorYUnits: 'pixels',         //锚点Y值单位(单位:像素)
                src: device.icon.src
            }),
            /*      // 设置图片下面显示字体的样式和内容
                  text: new Text({
                    text: '文字描述',// 添加文字描述
                    font: '14px font-size', // 设置字体大小
                    fill: new Fill({// 设置字体颜色
                      color: '#1CAF9A'
                    }),
                    offsetY: 10// 设置文字偏移量
                  })*/
        }));
        vectorLayer.getSource().addFeature(anchor);
    });
    deviceLayer[layerName] = vectorLayer;
}

// 隐藏显示图层
export function changeHideShow(layerName, display) {
    deviceLayer[layerName].setVisible(display);
}

// 刷新设备状态
export function refreshDeviceStatus() {
    if (lstLayer && lstLayer.length > 0) {
        lstLayer.forEach(function (item) {
            let layerName = item.layerCodeJs;
            getDeviceStatus({ areaId: selectFloor, systemIds: item.systemIds }).then(response => {
                console.log("refreshDeviceStatus", response);
                if (response.code === 200 && response.data) {
                    //开
                    let openDeviceGuids = response.data.openDeviceGuids;
                    //关
                    let closeDevicesGuids = response.data.closeDevicesGuids;
                    //报警
                    let alarmDevicesGuids = response.data.alarmDevicesGuids;
                    //故障
                    let faultDevicesGuids = response.data.faultDevicesGuids;
                    let layer = deviceLayer[layerName];
                    if (!layer) {
                        return false;
                    }
                    layer.getSource().getFeatures().forEach(function (item) {
                        let src = null, scale = 1;
                        let guid = item.getProperties().key.guid;
                        let classCode = item.getProperties().key.classCode;
                        let oneIcon = icons.one[classCode], twoIcon = icons.two[classCode], threeIcon = icons.three[classCode], fourIcon = icons.four[classCode];
                        if (oneIcon) {
                            if (isPicture(oneIcon)) {
                                src = require('@/assets/image/gis/deviceStatus/' + oneIcon);
                            } else {
                                src = getCurrentIcon(oneIcon, 30, 'rgba(0,0,0,0)', 'blue');
                            }
                        }

                        if (twoIcon) {
                            if (openDeviceGuids.includes(guid)) {
                                if (isPicture(twoIcon)) {
                                    src = require('@/assets/image/gis/deviceStatus/' + twoIcon);
                                } else {
                                    // let iconFont='\ue665';
                                    src = getCurrentIcon(twoIcon, 30, 'rgba(0,0,0,0)', 'green');
                                }
                            }
                        }
                        if (threeIcon) {
                            if (alarmDevicesGuids.includes(guid)) {
                                if (isPicture(threeIcon)) {
                                    src = require('@/assets/image/gis/deviceStatus/' + threeIcon);
                                } else {
                                    src = getCurrentIcon(threeIcon, 30, 'rgba(0,0,0,0)', 'red');
                                }
                            }
                        }
                        if (fourIcon) {
                            if (faultDevicesGuids.includes(guid)) {
                                if (isPicture(fourIcon)) {
                                    src = require('@/assets/image/gis/deviceStatus/' + fourIcon);
                                } else {
                                    src = getCurrentIcon(threeIcon, 30, 'rgba(0,0,0,0)', 'yellow');
                                }
                            }
                        }

                        item.getStyle().setImage(new OlStyleIcon({
                            anchor: [0.5, 1],
                            scale: scale,
                            anchorXUnits: 'fraction',       //锚点X值单位(单位:分数)
                            anchorYUnits: 'pixels',         //锚点Y值单位(单位:像素)
                            src: src
                        }));
                        item.changed();
                    })
                }
            })
        })
    }
}

// 定位
export function fixedPosition(device) {
    console.log("fixedPosition");

    if (locationLayer) {
        gMap.removeLayer(locationLayer);
        locationLayer = null;
    }
    let features = [];
    gMap.getLayerGroup().getLayersArray().forEach(function (item) {
        if (item instanceof OlLayerVector) {
            item.getSource().getFeatures().forEach(function (feature) {
                if (feature.get("id") === "feature_" + device.guid) {
                    features.push(feature);
                }
            })
        }
    })
    let feature;
    if (features && features.length > 0) {
        feature = features[0];
    }
    if (!feature) {
        return false;
    }

    let imgFeature = new OlFeature({
        id: "feature_location",
        type: 'icon',
        geometry: new OlGeomPoint(feature.getGeometry().flatCoordinates)
    })

    locationLayer = new OlLayerVector({
        source: new OlSourceVector({
            features: [imgFeature]
        }),
        style: new OlStyleStyle({
            image: new OlStyleIcon({
                anchor: [0.45, 15],
                scale: device.icon.scale || 1,
                anchorXUnits: 'fraction',       //锚点X值单位(单位:分数)
                anchorYUnits: 'pixels',         //锚点Y值单位(单位:像素)
                src: device.icon.src || require('@/assets/image/gis/empty.png')
            })
        })
    })
    gMap.addLayer(locationLayer);
    //设置中心点
    gMap.getView().animate({ zoom: 9 }, { center: feature.getGeometry().flatCoordinates }, { duration: 1000 });
}

// 关闭
export function closeGis() {
    clearInterval(refreshTimer)
}

/*export function styleFunc(iconFont) {
  iconFont='\ue665';
  let styleIcon = new OlStyleStyle({
    image: new OlStyleIcon({
      anchor: [0.5, 1],
      scale:1,
      anchorXUnits: 'fraction',       //锚点X值单位(单位:分数)
      anchorYUnits: 'pixels',         //锚点Y值单位(单位:像素)
      src:getCurrentIcon(iconFont,30, 'rgba(0,0,0,0)', 'blue')
    }),
  });



  let vectorLayer = new OlLayerVector({
    source: new OlSourceVector()
  });
  gMap.addLayer(vectorLayer);

  // 创建一个Feature，并设置好在地图上的位置
  let anchor = new OlFeature({
    id:"feature_test",
    type: 'icon',
    //参数
    // key:device.key,
    geometry: new OlGeomPoint([-0.4, 1])
  });

  anchor.setStyle(styleIcon);
  vectorLayer.getSource().addFeature(anchor);

  return styleIcon;
}*/
