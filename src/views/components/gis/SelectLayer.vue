<template>
  <div>
    <el-input placeholder="请选择GIS图层" v-model="inputValue" readonly>
      <el-button
        slot="append"
        icon="el-icon-search"
        @click="handleSelect()"
      ></el-button>
    </el-input>
    <el-dialog
      title="GIS图层选择"
      :visible.sync="open"
      width="70%"
      append-to-body
    >
      <el-row>
        <el-col>
          <el-table
            v-loading="loading"
            :data="layerList"
            height="400"
            ref="multipleTable"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="显示隐藏" align="center" prop="display">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.display"
                  :active-value="1"
                  :inactive-value="0"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="JS图层编码"
              align="center"
              prop="layerCodeJs"
            />
            <el-table-column
              label="JS图层名"
              align="center"
              prop="layerNameJs"
            />
            <el-table-column
              label="GIS图层编码"
              align="center"
              prop="layerCodeGis"
            />
            <el-table-column
              label="含有系统分类"
              align="center"
              prop="systemNames"
            />
          </el-table>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <div style="float: right; margin-top: 20px">
            <el-button type="primary" @click="multipleSelect">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { listLayerAll } from "@/api/gis/layer";

export default {
  name: "SelectLayer",
  props: {
    value: {
      type: Array,
    },
  },
  data() {
    return {
      selected: [],
      // 加载状态
      loading: false,
      // 显示选中的图层
      inputValue: "",
      // 总条数
      total: 0,
      // 数据
      layerList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {},
    };
  },
  mounted() {
    if (this.value) {
      //console.log(this.value);
      let arr = [];
      this.value.forEach((item) => {
        arr.push(
          item.gisLayerName + "(" + this.formatDisplay(item.display) + ")"
        );
      });
      this.inputValue = arr.join(",");
    }
  },
  methods: {
    formatDisplay(val) {
      if (val == 1) {
        return "显示";
      } else {
        return "隐藏";
      }
    },
    /** 打开选择列表 */
    async handleSelect() {
      this.open = true;
      this.getList(true);
    },
    /** 查询 列表 */
    getList(load) {
      this.loading = true;
      listLayerAll().then((response) => {
        this.layerList = response.rows;
        this.total = response.total;
        this.loading = false;

        this.$nextTick(() => {
          load && this.selected.push(...this.value); //防止初始化后调用handleSelectionChange清空selected

          this.selected.forEach((item) => {
            let layer = this.layerList.find((t) => t.id === item.gisLayerId);
            if (layer) {
              this.$refs.multipleTable.toggleRowSelection(layer, true);
              layer.display = item.display;
            }
          });
        });
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selected = [];
      this.selected.push(...selection);
    },
    // 取消选择
    cancel() {
      this.open = false;
    },
    // 多选
    multipleSelect() {
      let arr = this.selected.map((item) => {
        return item.layerNameJs + "(" + this.formatDisplay(item.display) + ")";
      });
      this.inputValue = arr.join(",");
      this.open = false;
      this.returnBackFn(this.selected);
    },
    // 回调
    returnBackFn(val) {
      this.$emit("returnBack", val);
    },
  },
};
</script>