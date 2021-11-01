<template>
    <div class="config-view">
        <div class="content-view">
            <div class="button-view">
                <el-button
                    type="default"
                    @click="cancel"
                    style="color:#000000;"
                >取 消</el-button>
                <el-button
                    type="primary"
                    @click="submitForm"
                    style="color:white;"
                >保 存</el-button>
            </div>
            <div class="item-view">
                <div class="title-view">节假日设置</div>
                <div class="row-view"  v-for="item in festivalArray"
                                :key="index">
                    <div class="row-left-view">
                        <div class="flex-center">
                            <p class="red">*</p>
                            <p>配置项名称：{{item.name}}</p>
                        </div>
                        <div class="flex-center">
                            <p class="red">*</p>
                            <p>配置项值：</p>
                            <el-date-picker
                                class="input"
                                v-model="startDate"
                                type="date"
                                placeholder="选择开始日期"
                            >
                            </el-date-picker>
                            <el-date-picker
                                class="input"
                                v-model="endDate"
                                type="date"
                                placeholder="选择结束日期"
                            >
                            </el-date-picker>
                        </div>
                    </div>
                    <div class="flex-center">
                        <p class="red">*</p>
                        <p>是否有效：</p>
                        <el-select
                            class="input"
                            v-model="value"
                            placeholder="请选择"
                        >
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </div>
                </div>
                
            </div>

            <div class="item-view">
                <div class="title-view">波峰谷设置</div>
                <div class="row-view"  v-for="item in pvArray"
                                :key="index">
                    <div class="row-left-view">
                        <div class="flex-center">
                            <p class="red">*</p>
                            <p>配置项名称：{{item.name}}</p>
                        </div>
                        <div class="flex-center">
                            <p class="red">*</p>
                            <p>配置项值：</p>
                            <el-date-picker
                                class="input"
                                v-model="startDate"
                                type="date"
                                placeholder="选择开始日期"
                            >
                            </el-date-picker>
                            <el-date-picker
                                class="input"
                                v-model="endDate"
                                type="date"
                                placeholder="选择结束日期"
                            >
                            </el-date-picker>
                            <div class="sub-title">
                                如果结束时间小于开始时间，结束时间表示第二天时间
                                </div>
                        </div>
                    </div>
                    <div class="flex-center">
                        <p class="red">*</p>
                        <p>是否有效：</p>
                        <el-select
                            class="input"
                            v-model="value"
                            placeholder="请选择"
                        >
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </div>
                </div>
                
            </div>

            <div class="item-view">
                <div class="title-view">白天晚上设置</div>
                <div class="row-view"  v-for="item in dayArray"
                                :key="index">
                    <div class="row-left-view">
                        <div class="flex-center">
                            <p class="red">*</p>
                            <p>配置项名称：{{item.name}}</p>
                        </div>
                        <div class="flex-center">
                            <p class="red">*</p>
                            <p>配置项值：</p>
                            <el-date-picker
                                class="input"
                                v-model="startDate"
                                type="date"
                                placeholder="选择开始日期"
                            >
                            </el-date-picker>
                            <el-date-picker
                                class="input"
                                v-model="endDate"
                                type="date"
                                placeholder="选择结束日期"
                            >
                            </el-date-picker>
                            <div class="sub-title">
                                如果结束时间小于开始时间，结束时间表示第二天时间
                                </div>
                        </div>
                    </div>
                    <div class="flex-center">
                        <p class="red">*</p>
                        <p>是否有效：</p>
                        <el-select
                            class="input"
                            v-model="value"
                            placeholder="请选择"
                        >
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </div>
                </div>
                
            </div>
        </div>
    </div>

</template>
<script>
export default {
  name: "EnergyConfig",
  data() {
    return {
      options: [
        {
          value: 1,
          label: "有效"
        },
        {
          value: 0,
          label: "无效"
        }
      ],
      festivalArray:[
          {
              name:"元旦"
          },
          {
              name:"春节"
          },
          {
              name:"清明节"
          },
          {
              name:"劳动节"
          },
          {
              name:"端午节"
          },
          {
              name:"中秋节"
          },
          {
              name:"国庆节"
          }
      ],
      pvArray:[
          {
              name:"波峰"
          },
          {
              name:"波谷"
          }
      ],
    dayArray:[
        {
            name:"白天"
        },
        {
            name:"晚上"
        }
    ]

    };
  },
  created() {},
  methods: {
    cancel() {},
    submitForm() {}
  }
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
  padding-top: rem(18);
  .content-view {
    display: flex;
    flex-direction: column;
    width: rem(1781);
    .button-view {
      display: flex;
      margin-bottom: rem(18);
    }
    .item-view {
      margin-bottom: rem(18);
      width: 100%;
      display: flex;
      flex-direction: column;
      padding: rem(25) rem(55) 0 rem(55);
      background: rgba(1, 68, 144, 0.5);
      .title-view {
        font-size: rem(14);
        font-weight: 400;
        color: #cfdce6;
        margin-bottom: rem(17);
      }
      .row-view {
        font-size: rem(14);
        color: #cfdce6;
        font-weight: 400;
        display: flex;
        justify-content: space-between;
        margin-bottom: rem(30);
        .input {
          margin-right: rem(14);
          width: rem(300);
        }
        .flex-center {
          display: flex;
          align-items: center;
        }
        .row-left-view {
          display: flex;
          justify-content: space-between;
          
          
          .flex-center {
              position: relative;
              .sub-title{
              position: absolute;
              left: 0;
              top: rem(50);
font-size: rem(14);
font-family: Microsoft YaHei;
font-weight: 400;
color: #4B80CA;
          }
            &:first-child {
              width: rem(260);
            }
          }
        }
      }
    }
  }
}
</style>
