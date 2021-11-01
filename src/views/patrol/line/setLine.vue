<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="4">
        <el-card shadow="hover">
          <div class="titleS">{{ pline.plineName }}</div>
          <div class="subtitle">
            <font class="fonttext">巡检线路编码：</font>
            {{ pline.plineCode }}
          </div>
          <div class="subtitle">
            <font class="fonttext">巡检线路类型：</font>
            {{ plineTypeFormat(pline.plineType) }}
          </div>
          <div class="subtitle">
            <font class="fonttext">创建人：</font>
            {{ pline.createBy }}
          </div>
          <div class="subtitle">
            <font class="fonttext">创建时间：</font>
            {{ parseTime(pline.createTime) }}
          </div>
        </el-card>

        <el-card shadow="hover" class="elCard bgSuccess">
          <div class="numDiv">
            已选巡检区域
            <div class="rightDiv">
              <font class="numCount">{{ pline.areaCount }}</font>&nbsp;&nbsp;个
            </div>
          </div>
        </el-card>

        <el-card shadow="hover" class="elCard bgWarning">
          <div class="numDiv">
            巡检项共计
            <div class="rightDiv">
              <font class="numCount">{{ pline.itemCout }}</font>&nbsp;&nbsp;项
            </div>
          </div>
        </el-card>

        <el-card shadow="hover" class="elCard bgDanger">
          <div class="numDiv">
            巡检设备共计
            <div class="rightDiv">
              <font class="numCount">{{ pline.equCount }}</font>&nbsp;&nbsp;个
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8" v-if="operate === 'edit'">
        <div class="areaTitle">未选巡检区域</div>
        <div class="areaTitle">
          <el-input
            v-model="queryParamsNo.pareaCode"
            placeholder="请输入巡检路线编码或名称"
            clearable
            size="small"
          />
        </div>
        <el-table v-loading="loadingNo" :data="areaListNo">
          <el-table-column label="序号" type="index" align="center" width="55" />
          <el-table-column label="巡检区域" align="left">
            <template slot-scope="scope">
              <span>{{ scope.row.pareaName }} ({{ scope.row.pareaCode }})</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-plus"
                @click="handleChoose(scope.row)"
              >选取</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="totalNo>0"
          :total="totalNo"
          :page.sync="queryParamsNo.pageNum"
          :limit.sync="queryParamsNo.pageSize"
          @pagination="getAreaNo"
        />
      </el-col>
      <el-col :span="12">
        <div class="areaTitle">已选巡检区域</div>
        <div class="areaTitle">
          <el-input
            v-model="queryParams.pareaCode"
            placeholder="请输入巡检路线编码或名称"
            clearable
            size="small"
          />
        </div>
        <el-table v-loading="loading" :data="areaList" class="tebale_areeList">
          <el-table-column label="巡检区域" align="left">
            <template slot-scope="scope">
              <span>{{ scope.row.pareaName }} ({{ scope.row.pareaCode }})</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-box"
                @click="handleItem(scope.row)"
              >查看环境巡检项</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-s-order"
                @click="handleEqu(scope.row)"
              >查看巡检设备</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleRemove(scope.row)"
                v-if="operate === 'edit'"
              >移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <ItemView
      v-if="isShowI"
      :title="titleI"
      :isShow.sync="isShowI"
      :pareaId="pareaIdI"
      :key="viewKeyI"
    />
    <EquipmentView
      v-if="isShowE"
      :title="titleE"
      :isShow.sync="isShowE"
      :pareaId="pareaIdE"
      :key="viewKeyE"
    />
  </div>
</template>

<script>
import { getLine } from "@/api/patrol/line";
import { listByLine, listNoByLine } from "@/api/patrol/area";
import { save, remove } from "@/api/patrol/lineChildren";
import Sortable from "sortablejs";
import ItemView from "@/views/components/patrol/ItemView";
import EquipmentView from "@/views/components/patrol/EquipmentView";

export default {
  name: "SetLine",
  components: {
    Sortable,
    ItemView,
    EquipmentView,
  },
  data() {
    return {
      //
      plineId: undefined,
      //
      operate: undefined,
      //
      pline: undefined,
      // 巡检项类型
      plineTypeOptions: [],
      //
      loadingNo: false,
      //
      areaListNo: [],
      //
      totalNo: 0,
      //
      queryParamsNo: {
        pageNum: 1,
        pageSize: 10,
        pareaCode: undefined,
      },
      //
      loading: false,
      //
      areaList: [],
      //
      queryParams: {
        pareaCode: undefined,
      },
      //
      isShowI: false,
      pareaIdI: undefined,
      titleI: false,
      viewKeyI: +new Date(),
      //
      isShowE: false,
      pareaIdE: undefined,
      titleE: false,
      viewKeyE: +new Date(),
    };
  },
  created() {
    this.getDicts("patrol_line_type").then((response) => {
      this.plineTypeOptions = response.data;
    });

    this.plineId = this.$route.params.plineId;
    this.operate = this.$route.params.operate;

    this.reset();
    this.getPline();
  },
  watch: {
    "queryParamsNo.pareaCode": "handlePareaNo",
    "queryParams.pareaCode": "handleParea",
  },
  mounted() {
    this.rowDrop();
  },
  methods: {
    plineTypeFormat(value) {
      return this.selectDictLabel(this.plineTypeOptions, value);
    },
    reset() {
      this.pline = {
        plineCode: undefined,
        plineName: undefined,
        plineType: undefined,
        createBy: undefined,
        createTime: undefined,
        areaCount: undefined,
        itemCout: undefined,
        equCount: undefined,
      };
    },
    getPline() {
      getLine(this.plineId).then((response) => {
        this.pline = response.data;
        this.getAreaNo();
        this.getArea();
      });
    },
    getAreaNo() {
      this.loadingNo = true;
      listNoByLine(this.plineId, this.queryParamsNo).then((response) => {
        this.areaListNo = response.rows;
        this.totalNo = response.total;
        this.loadingNo = false;
      });
    },
    handleChoose(row) {
      const data = {
        plineId: this.plineId,
        pareaId: row.pareaId,
      };
      save(data).then((response) => {
        if (response.code === 200) {
          this.msgSuccess("选取成功");
          this.getPline();
        } else {
          //
          this.msgError("选取失败");
        }
      });
    },
    handlePareaNo(val) {
      this.getAreaNo();
    },
    getArea() {
      this.loading = true;
      listByLine(this.plineId, this.queryParams).then((response) => {
        this.areaList = response.rows;
        this.loading = false;
      });
    },
    handleRemove(row) {
      const data = {
        plineId: this.plineId,
        pareaId: row.pareaId,
      };
      remove(data).then((response) => {
        if (response.code === 200) {
          this.msgSuccess("移除成功");
          this.getPline();
        } else {
          //
          this.msgError("选取成功");
        }
      });
    },
    handleParea(val) {
      this.getArea();
    },
    handleItem(row) {
      this.isShowI = true;
      this.pareaIdI = row.pareaId;
      this.titleI = row.pareaName + " - 环境巡检项";
      this.viewKeyI = +new Date();
    },
    handleEqu(row) {
      this.isShowE = true;
      this.pareaIdE = row.pareaId;
      this.titleE = row.pareaName + " - 巡检设备";
      this.viewKeyE = +new Date();
    },
    rowDrop() {
      const tbody = document.querySelector(".tebale_areeList tbody");
      Sortable.create(tbody);
    },
  },
};
</script>

<style scoped>
.areaTitle {
  margin: 10px;
  font-weight: 600;
  color: #303133;
}
.elCard {
  margin-top: 30px;
}
.bgSuccess {
  background-color: #67c23a;
}
.bgWarning {
  background-color: #e6a23c;
}
.bgDanger {
  background-color: #f56c6c;
}

.titleS {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 15px;
}
.subtitle {
  font-size: 13px;
  color: #909399;
  margin-top: 10px;
}
.fonttext {
  font-weight: bold;
}

.numDiv {
  padding-top: 5px;
  font-size: 16px;
  color: white;
}
.rightDiv {
  float: right;
}
.numCount {
  font-size: 20px;
  font-weight: bold;
}
</style>