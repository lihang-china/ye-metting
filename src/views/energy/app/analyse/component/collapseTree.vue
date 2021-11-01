<template>
<div>
    <template v-for="(item,index) in treeData">
        <el-collapse :key="index" accordion class="custom-collapse" v-model="activeName" style="padding-left:10px;" v-if="item.children.length>0">
            <el-collapse-item  :name="index">
                <template slot="title">
                    <div class="parent-title" @click="tap(item)">
                        <div class="tree-left">
                            <div class="tree-qs" :class="item.tb===0?'same-bg':item.tb>0?'top-bg':''">
                                <el-icon class="tree-qs-icon" :class="item.tb===0?'el-icon-minus':item.tb>0?'el-icon-top':'el-icon-bottom'"/>
                            </div>
                            <div class="tree-name">{{item.name}}</div>
                        </div>
                        <div class="tree-right">
                            <div class="tree-pre"><div :style="{width:(item.total/total*100)<3?'3px':(item.total/total*100+'px')}" class="custom-progress"></div></div>
                            <div class="bottom-text" :class="item.tb===0?'same-text':item.tb>0?'top-text':''">{{item.total}}</div>
                        </div>
                    </div>
                </template>
                <CollapseTree :key="index" :tree-data="item.children" @tap="tap"></CollapseTree>
            </el-collapse-item>
        </el-collapse>
        <div :key="index" v-else style="padding-left:10px;" @click="tap(item)">
             <div class="child-title">
                <div class="tree-left" style="margin-left: 50px;">
                    <div class="tree-qs tree-qs-small" :class="item.tb===0?'same-bg':item.tb>0?'top-bg':''">
                        <el-icon class="tree-qs-icon" :class="item.tb===0?'el-icon-minus':item.tb>0?'el-icon-top':'el-icon-bottom'"/>
                    </div>
                    <div class="tree-name">{{item.name}}</div>
                </div>
                <div class="tree-right">
                    <div class="tree-pre"><div :style="{width:(item.total/total*100)<3?'3px':(item.total/total*100+'px')}" class="custom-progress custom-progress-small"></div></div>
                    <div class="bottom-text" :class="item.tb===0?'same-text':item.tb>0?'top-text':''">{{item.total}}</div>
                </div>
            </div>
        </div>
    </template>
    </div>
</template>
<script>

export default {
    name:"CollapseTree",
     props: {
        treeData: {
            default: null,
            type: Array
        }
    },
    components: {
    },
    data() {
      return {
          activeName:0,
          total:4000000,
      };
    },
    created(){
       var t_arr = this.treeData.map(item => item.total)
       //console.log(t_arr)
    },
    methods:{
        tap(item){
            this.$emit('tap',item)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/styles/common.scss';
    .parent-title{
        background: rgba(1, 68, 144, .5);
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 0 5px;
        color:#CFDCE6;
        align-items: center;
        margin-left:20px;
    }

    .child-title{
        padding: 5px 5px;
        margin: 5px 0;
        background: transparent;
        width: 100%;
        display: flex;
        justify-content: space-between;
        color:#CFDCE6;
        align-items: center;
        cursor: pointer;
    }

    .child-title:hover{
        background: rgba(1, 68, 144, .5);
    }

    .custom-collapse {
        border:none;
    }

    .tree-qs{
        background: #048CFF;
        width:rem(30);
        height:rem(30);
        transform:rotate(45deg);
        margin-right: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left:-20px;

        .tree-qs-icon{
            transform:rotate(-45deg);
            font-size:rem(24);
        }
    }

    .tree-qs-small{
        width:rem(20);
        height:rem(20);
        margin-left:-40px;
        .tree-qs-icon{
            transform:rotate(-45deg);
            font-size:rem(16);
        }
    }

    .tree-left{
        display: flex;
        align-items: center;
    }

    .tree-right{
        display: flex;
        align-items: center;
        width: rem(180);
        justify-content: space-between;
    }

    .tree-pre{
        width: rem(100);
        overflow: hidden;
        display: flex;
        justify-content: flex-end;
        margin-right: 10px;
    }

    .bottom-text{
        color:#04B5FF;
        padding-top:1px;
    }

    .top-bg{
        background:#FA5A35 !important;
    }

    .top-text{
        color:#FA5A35 !important;
    }

    .same-bg{
        background:#7391ad !important;
    }

    .same-text{
        color:#7391ad !important;
    }

    .custom-progress{
        background: linear-gradient(to top, #0066FF 0%,#00C6FF 100%);
        height:rem(20);
        border-radius: 1px;
        border: 1px solid #69d9de;
    }

    .custom-progress-small{
        height:rem(15);
    }

    .tree-name{
        font-size: rem(12);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
</style>
<style lang="scss">
    .custom-collapse .el-collapse-item__header{
        background-color: #011C52;
        border-bottom: 1px solid #011C52;
        margin-bottom: 10px;
    }

    .custom-collapse  .el-collapse-item__wrap{
        background: transparent;
        border:none;
    }

    .custom-collapse .el-collapse-item__arrow{
        display: none;
    }

    .custom-collapse .el-collapse-item__content{
        padding-bottom:0;
    }
   
</style>