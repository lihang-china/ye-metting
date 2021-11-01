<!--
 * @Descriptin:
 * @Version: 0.1
 * @Autor: Your Name
 * @Date: 2021-09-15 09:46:13
 * @LastEditors: Your Name
 * @LastEditTime: 2021-10-14 09:09:31
-->

<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-select  v-model="form.meetingAddr" placeholder="请选择会议地点">
            <i slot="prefix" class="el-input__icon el-icon-office-building" />
          <el-option
            v-for="(item, index) in addrList"
            :key="index"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="请输入会议名称"
          v-model="form.meetingName"
        ><i slot="prefix" class="el-input__icon el-icon-edit"></i></el-input>
      </el-form-item>
 <el-form-item>
        <el-date-picker
          v-model="meetDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-select placeholder="请选择使用部门" v-model="form.meetingDept">
          <i slot="prefix" class="el-input__icon el-icon-files" />
          <el-option
            v-for="(item, index) in deptList"
            :key="index"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="请输入联系人"
          v-model="form.meetingUser"
        > <i slot="prefix" class="el-input__icon el-icon-user" /></el-input>
      </el-form-item>

      <el-form-item>
        <el-select placeholder="请选择会议状态" v-model="form.meetingStatus">
           <i
slot="prefix" class="el-input__icon el-icon-thumb" />
          <el-option
            v-for="(item, index) in meetStatus"
            :key="index"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          icon="el-icon-search"
          type="primary"
          @click="getMeetlist('search')"
          >搜 索</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button
icon="el-icon-refresh" @click="handelReset()"
          >重 置</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button
icon="el-icon-upload2" @click="meetExport()"
type="success"
          >导 出</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      @sort-change="sorChange"
      :data="tableData"
      size="none"
      v-loading="loading"
    >
      <el-table-column
        type="index"
        label="序号"
        align="center"
        width="120"
      ></el-table-column>
      <el-table-column label="会议地点" prop="meetingAddr" width="150">
        <template slot-scope="scope">
          {{ scope.row.meetingAddr | addr }}
        </template>
      </el-table-column>
      <el-table-column label="会议名称" prop="meetingName" />
      <el-table-column label="会议时间" prop="meetingDate" />
      <el-table-column label="使用时间" >
        <template slot-scope="scope">
          {{ scope.row.meetingStartTime }} - {{ scope.row.meetingEndTime }}
        </template>
      </el-table-column>

      <el-table-column label="使用部门" prop="meetingDept" >
        <template slot-scope="scope">
          {{ scope.row.meetingDept | dept }}
        </template>
      </el-table-column>
      <el-table-column label="联系人" prop="meetingUser"  />
       <el-table-column label="登记时间" prop="meetingCreate" width="160"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="handleSel(scope.row)">查看</el-button>
          <el-divider
            direction="vertical"
            v-if="scope.row.meetingStatus == '0'"
          />
          <el-button
            type="text"
            v-if="scope.row.meetingStatus == '0'"
            @click="handleDel(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @current-change="getMeetlist"
      :page-size.sync="form.pageSize"
      :current-page.sync="form.pageNum"
      layout="jumper, prev, pager, next,total,sizes"
      :total="total"
    >
    </el-pagination>
    <el-dialog
      :close-on-click-modal="false"
      class="dialog"
      title="会议详情"
      :visible.sync="open"
      :destroy-on-close="true"
      width="400px"
    >
      <el-form
        size="medium"
        label-width="80px"
        label-position="right"
        ref="formName"
      >
        <el-form-item
label="会议地点 :"
          ><el-row>{{ dialogForm.meetingAddr | addr }}</el-row>
        </el-form-item>
        <el-form-item label="会议名称 :">
          <el-row> {{ dialogForm.meetingName }}</el-row>
        </el-form-item>
        <el-form-item label="会议时间 :">
          <el-row>{{ dialogForm.meetingDate }}</el-row>
        </el-form-item>
        <el-form-item label="使用时间 :">
          <el-row>
            {{ dialogForm.meetingStartTime }} -
            {{ dialogForm.meetingEndTime }}</el-row
          >
        </el-form-item>
        <el-form-item label="使用部门 :">
          <el-row> {{ dialogForm.meetingDept | dept }}</el-row>
        </el-form-item>
        <el-form-item label="联系人 :">
          <el-row>{{ dialogForm.meetingUser }}</el-row>
        </el-form-item>
        <el-form-item label="会议内容 :">
          <el-row class="el-content"> {{ dialogForm.meetingContent }}</el-row>
        </el-form-item>
        <el-form-item label="登记时间 :">
          <el-row>{{ dialogForm.meetingCreate }}</el-row>
        </el-form-item>
           <el-form-item label="登记IP :">
          <el-row>{{ dialogForm.meetingIp }}</el-row>
        </el-form-item>
        <el-form-item v-if="dialogForm.meetingStatus == '1'" label="删除原因 :">
          <el-row>{{ dialogForm.meetingDeleteNotes }}</el-row>
        </el-form-item>
          <el-form-item v-if="dialogForm.meetingStatus == '1'" label="删除时间 :">
          <el-row>{{ dialogForm.meetingDelete }}</el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      class="dialog"
      title="删除会议"
      :visible.sync="isDel"
      :destroy-on-close="true"
      width="400px"
    >
      <el-form ref="formDel" :model="delFrom" :rules="rules">
        <el-form-item
          prop="meetDelvalue"
          label="删除原因"
          style="padding: 10px 10px 20px 10px"
        >
          <el-input
            type="textarea"
            maxlength="32"
            show-word-limit
            placeholder="请输入删除原因..."
            v-model="delFrom.meetDelvalue"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-row>
        <el-button @click="isDel = false">取消</el-button
        ><el-button
type="primary" @click="handledelSubmit()"
          >确认</el-button
        ></el-row
      >
    </el-dialog>
  </div>
</template>
<script>
import { pagemeet, delmeet } from '@/api/index.js'
import { deptList, placeList } from '@/depdata/index.js'
export default {
  name: 'YcMaaUiIndex',
  data() {
    return {
      meetDate: [],
      queryParams: {
        areaCode: undefined,
        areaName: undefined
      },
      delFrom: { meetDelvalue: undefined },
      total: 0,
      isDel: false,
      delId: undefined,
      loading: false,
      form: {
        start: undefined,
        end: undefined,
        meetingAddr: undefined,
        meetingName: undefined,
        meetingDept: undefined,
        meetingUser: undefined,
        meetingStatus: '0',
        pageSize: 10,
        pageNum: 1,
        orderByColumn: 'meeting_date',
        isAsc: 'desc'
      },
      rules: { meetDelvalue: [{ required: true, message: '请输入删除原因' }] },
      open: false,
      dialogForm: {},
      tableData: [],
      meetStatus: [
        { label: '登记', value: '0' },
        { label: '删除', value: '1' }
      ],
      deptList: deptList,
      addrList: placeList
    }
  },
  filters: {
    addr(val) {
      if (val === 0) {
        return 'E2206会议室'
      } else {
        return 'E2205茶室'
      }
    },
    dept(val) {
      if (val === 0) {
        return '管理层'
      } else if (val === 1) {
        return '南方销售中心'
      } else if (val === 2) {
        return '工程服务中心'
      } else if (val === 3) {
        return '综合管理部'
      } else if (val === 4) {
        return '技术研发中心'
      } else if (val === 5) {
        return '市场战略部'
      } else if (val === 6) {
        return '采供部'
      } else if (val === 7) {
        return '北方销售中心'
      }
    }
  },
  watch: {
    isDel(val) {
      if (val === false) {
        this.delFrom.meetDelvalue = undefined
      }
    }
  },
  mounted() {
    this.getMeetlist()
  },
  methods: {
    sorChange({ column, prop, order }) {
      if (column.order === 'ascending') {
        this.form.isAsc = 'asc'
      } else if (column.order === 'descending') {
        this.form.isAsc = 'desc'
      } else {
        this.form.isAsc = 'desc'
      }
      this.getMeetlist()
    },
    handelReset() {
      Object.assign(this.$data.form, this.$options.data().form)
      this.getMeetlist()
    },
    getMeetlist(val) {
      if (val === 'search') {
        this.form.start = this.moment(this.meetDate[0]).format('YYYY-MM-DD')
        this.form.end = this.moment(this.meetDate[1]).format('YYYY-MM-DD')
      }
      this.loading = true
      pagemeet(this.form).then((res) => {
        console.log(res)
        this.tableData = res.data.rows
        this.total = res.data.total
        this.loading = false
      })
    },
    handleSel(row) {
      this.open = true
      this.dialogForm = row
    },
    meetExport() {
      this.$confirm('是否确认导出会议记录数据?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.download(
          '/api/meeting/export',
          this.form,
          `会议预约记录_${this.moment(new Date().getTime()).format(
        'YYYY-MM-DD'
      )}.xlsx`
        )
      })
    },
    handledelSubmit() {
      this.$refs['formDel'].validate((valid) => {
        if (valid) {
          delmeet({
            id: this.delId,
            meetingDeleteNotes: this.delFrom.meetDelvalue
          }).then((res) => {
            if (res.data.code === 200) {
              this.isDel = false
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.getMeetlist()
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            }
          })
        }
      })
    },
    handleDel(row) {
      this.isDel = true
      this.delId = row.id
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form {
  .el-form-item {
    margin-left: 0;
    float: left;
  }
}
.el-pagination {
  float: right;
}
.dialog {
  .el-row {
    .el-button {
      float: right;
      margin-left: 10px;
    }
  }
  .el-form {
    margin-top: -15px;
    color: rgb(131, 131, 131);
    height: auto;
    display: flex;
    flex-direction: column;
    .el-form-item {
      margin: 2px;
      background-color: rgb(242, 247, 253);
      border: 1px solid rgb(255, 255, 255);
      padding: 2px;

      .el-row {
        width: 100%;
        padding-left: 20px;
        background-color: rgb(250, 250, 250);
      }
    }
  }
}
</style>
