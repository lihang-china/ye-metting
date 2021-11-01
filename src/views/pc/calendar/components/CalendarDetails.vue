<template>
  <div class="warp">
    <el-dialog
      class="abow_dialog"
      width="500px"
      title="预约会议"
      :visible.sync="meetOpen"
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <el-form
        :model="form"
        :rules="rules"
        size="medium"
        label-width="80px"
        label-position="right"
        ref="formName"
      >
        <el-form-item
label="会议地点" prop="meetingAddr"
          ><el-select
            placeholder="请选择会议地点"
            v-model="form.meetingAddr"
            style="width: 100%"
          >
            <i slot="prefix" class="el-input__icon el-icon-office-building" />
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="(item, index) in optionList"
              :key="index" /></el-select
        ></el-form-item>
        <el-form-item
label="会议名称" prop="meetingName"
          ><el-input
            placeholder="请输入会议名称"
            v-model="form.meetingName"
            maxlength="16"
            show-word-limit
            ><i slot="prefix" class="el-input__icon el-icon-edit"></i></el-input
        ></el-form-item>
        <el-form-item label="会议时间" prop="meetingDate">
          <el-date-picker
            v-model="form.meetingDate"
            style="width: 100%"
            type="date"
            placeholder="请选择会议时间"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="使用时间" prop="meetingEndTime">
          <el-row>
            <el-col :span="12">
              <el-time-select
                style="width: 95%"
                placeholder="起始时间"
                v-model="form.meetingStartTime"
                :picker-options="{
                  start: '08:30',
                  step: '00:05',
                  end: '22:30'
                }"
              >
              </el-time-select
            ></el-col>
            <el-col :span="12">
              <el-time-select
                :disabled="form.meetingStartTime == undefined"
                style="width: 100%"
                placeholder="结束时间"
                v-model="form.meetingEndTime"
                :picker-options="{
                  start: '08:30',
                  step: '00:05',
                  end: '22:30',
                  minTime: form.meetingStartTime
                }"
              >
              </el-time-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="使用部门" prop="meetingDept">
          <el-select
            style="width: 100%"
            v-model="form.meetingDept"
            placeholder="请选择使用部门"
          >
            <i slot="prefix" class="el-input__icon el-icon-files" />
            <el-option
              v-for="(item, index) in deptList"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="联系人" prop="meetingUser">
          <el-input
            placeholder="请输入联系人"
            v-model="form.meetingUser"
            maxlength="8"
            show-word-limit
          >
            <i slot="prefix" class="el-input__icon el-icon-user" />
          </el-input>
        </el-form-item>
        <el-form-item label="会议内容">
          <el-input
            v-model="form.meetingContent"
            type="textarea"
            placeholder="请输入会议内容..."
            maxlength="32"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="meetOpen = false">取 消</el-button>
          <el-button
size="small" @click="handleSubmit"
type="primary"
            >确 认</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-button
      icon="el-icon-s-custom"
      type="danger"
      @click="handleMeet()"
      class="appointment"
      size="none"
      >预约会议</el-button
    >
    <el-select
      class="app-select"
      size="none"
      placeholder="请选择会议地点"
      v-model="selectValue"
      @change="selectChange"
    >
      <i slot="prefix" class="el-input__icon el-icon-location-outline" />
      <el-option
        :label="item.label"
        :value="item.value"
        v-for="(item, index) in selectList"
        :key="index"
    /></el-select>
    <FullCalendar
      slot="reference"
      class="fullcaledar"
      ref="eventDialogue"
      :options="calendarOptions"
    />
    <transition name="el-fade-in-linear">
      <div
        class="dialog"
        v-if="isShow"
        :style="`left:${tranLeft}px;top:${tranTop}px`"
      >
        <header>
          {{ dialogForm.time }} {{ dialogForm.title }}
          <span class="el-icon-close" @click="isShow = false" />
        </header>
        <ul>
          <li>
            <i :style="'background-color:' + dialogColor + ';'"></i
            ><span>会议地点：</span>{{ dialogForm.meetingAddr | addr }}
          </li>

          <li>
            <i :style="'background-color:' + dialogColor + ';'"></i
            ><span>会议时间：</span>{{ dialogForm.meetingDate }}
          </li>
          <li>
            <i :style="'background-color:' + dialogColor + ';'"></i
            ><span>使用时间：</span>{{ dialogForm.meetingStartTime }}-{{
              dialogForm.meetingEndTime
            }}
          </li>
          <li>
            <i :style="'background-color:' + dialogColor + ';'"></i
            ><span>使用部门：</span>{{ dialogForm.meetingDept | dept }}
          </li>
          <li>
            <i :style="'background-color:' + dialogColor + ';'"></i
            ><span>联系人：</span>{{ dialogForm.meetingUser }}
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
import { deptList, placeList } from '@/depdata/index.js'
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import '@fullcalendar/daygrid/main.css'
import { selmeet, addmeet } from '@/api/index.js'
export default {
  name: 'CalendarIndex',
  props: {
    events: {
      type: Array,
      default: () => []
    }
  },
  components: {
    FullCalendar
  },
  filters: {
    addr(val) {
      if (val === '0') {
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
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24
        }
      },
      rules: {
        meetingAddr: [{ required: true, message: '请选择会议地点' }],
        meetingName: [{ required: true, message: '请输入会议名称' }],
        meetingDate: [{ required: true, message: '请选择会议时间' }],
        meetingEndTime: [{ required: true, message: '请选择使用时间' }],
        meetingDept: [{ required: true, message: '请选择使用部门' }],
        meetingUser: [{ required: true, message: '请输入联系人' }]
      },
      dataList: [],
      selectValue: '-1',
      deptList: deptList,
      selectList: [{ label: '全部地点', value: '-1' }, ...placeList],
      optionList: placeList,
      meetOpen: false,
      dialogColor: '',
      form: {
        meetingStatus: '0'
      },
      dialogForm: {},
      tranLeft: '',
      tranTop: '',
      isShow: false,
      calendarOptions: {
        fixedWeekCount: false,
        // 引入的插件
        plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
        // 日历头部按钮位置
        headerToolbar: {
          left: 'prevYear,prev,next,nextYear today',
          center: 'title',
          right: 'dayGridMonth timeGridWeek timeGridDay listMonth'
        },
        // 日历头部按钮中文转换
        buttonText: {
          today: '今天',
          month: '月',
          week: '周',
          day: '天',
          list: '列表'
        },
        displayEventEnd: true, // 所有视图显示结束时间
        eventTimeFormat: {
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false,
          hour12: false // 设置时间为24小时
        },
        allDayDefault: false,
        initialView: 'dayGridMonth', // 指定默认显示视图
        locale: 'zh-ch', // 切换语言，当前为中文
        weekNumbers: true, // 是否在日历上显示周数
        weekNumberFormat: { week: 'numeric' }, // 周数的显示文本
        height: '99%', // 设置日历高度
        displayEventTime: true, // 是否显示事件时间
        allDaySlot: false, // 周、日视图时，all-day不显示，默认true
        // eventLimit: true, // 浏览器显示已失效 设置月日程，与all-day slot 的最大显示数量，超过的通过弹窗展示
        slotLabelFormat: {
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false,
          hour12: false // 设置时间为24小时制
        },
        events: [], // 日程(可理解为事件)数组
        // 事件
        selectable: true, // 是否可以选中日历格
        selectMinDistance: 2, // 选中日历格的最小距离
        weekends: true, // 是否包括周日周六
        navLinks: true, // 日期、周数是否可点击
        // selectHelper: false, // 浏览器显示已失效 ?
        // selectEventOverlap: true, // 浏览器显示已失效 相同时间段的多个日程视觉上是否允许重叠，默认为true，允许
        dayMaxEvents: true, // 日期内事件显示数量，true：事件数将限制为日单元格的高度
        eventClick: this.handleEventClick, // 事件点击事件
        datesSet: this.change
      },
      scenceList: [],
      eventList: []
    }
  },
  created() {
    this.getScenceslist()
  },
  watch: {
    meetOpen(val) {
      if (val === false) {
        this.form = this.$options.data().form
      }
    }
  },
  methods: {
    handleMeet() {
      this.isShow = false
      this.meetOpen = true
    },
    handleSubmit() {
      this.$refs.formName.validate((valid) => {
        if (valid) {
          this.form.meetingDate = this.moment(this.form.meetingDate).format(
            'YYYY-MM-DD'
          )
          addmeet(this.form).then((res) => {
            if (res.data.code === 200) {
              this.$message({
                message: '预约成功',
                type: 'success'
              })
              this.meetingAddr = undefined
              this.selectValue = '-1'
              this.getScenceslist()
              this.meetOpen = false
            } else {
              this.$message({
                message: '预约失败，使用时间冲突',
                type: 'error'
              })
            }
          })
        } else {
          return false
        }
      })
    },
    routerPage() {},
    handleEventClick(row) {
      this.dialogColor = row.event.backgroundColor
      this.dialogForm.title = row.event.title
      this.dialogForm.time = this.moment(row.event.startStr).format(
        'YYYY-MM-DD'
      )
      this.dialogForm = {
        ...row.event._def.extendedProps,
        title: row.event.title,
        time: this.moment(row.event.startStr).format('YYYY-MM-DD')
      }
      if (this.isShow === true) {
        this.isShow = false
      }
      if (row.jsEvent.pageX > 1190) {
        this.tranLeft = row.jsEvent.pageX - 300
        this.tranTop = row.jsEvent.pageY - 100
      } else {
        this.tranLeft = row.jsEvent.pageX - 100
        this.tranTop = row.jsEvent.pageY - 100
      }
      setTimeout(() => {
        this.isShow = true
      }, 100)
    },
    change() {
      this.isShow = false
    },
    selectChange() {
      if (this.selectValue === '-1') {
        this.dataList.splice(0)
        this.meetingAddr = undefined
      } else {
        this.meetingAddr = this.selectValue
      }
      this.getScenceslist('change')
    },
    getScenceslist(val) {
      if (val === 'change') {
        this.dataList.splice(0)
      }
      selmeet({ meetingAddr: this.meetingAddr, meetingStatus: '0' }).then(
        (res) => {
          this.dataList.splice(0)
          res.data.data.forEach((e) => {
            this.dataList.push({
              ...e,
              meetingDate: this.moment(e.meetingDate).format('YYYY-MM-DD '),
              title: e.meetingName,
              color: e.meetingAddr === '0' ? '#409EFF' : '#67C23A',
              end: `${this.moment(e.meetingDate).format('YYYY-MM-DD ')}${
                e.meetingEndTime
              }`,
              start: `${this.moment(e.meetingDate).format('YYYY-MM-DD ')}${
                e.meetingStartTime
              }`,
              display: 'block'
            })
          })
        }
      )
      this.calendarOptions.events = this.dataList
    }
  }
}
</script>
<style lang="scss" scoped>
.warp {
  height: 100%;
  width: 100%;
}
.abow_dialog {
  .el-form {
    margin: 5px;
  }
  .el-button {
    float: right;
    margin-left: 10px;
  }
}
.appointment {
  font-size: 16px;
  position: relative;
  left: 260px;
  bottom: -42px;
  color: #fff;
  border-radius: 4px;
  border: 1px solid #fff;
  &:hover {
    background-color: rgb(231, 30, 30);
    border: 1px solid #fff;
  }
}
.app-select {
  font-size: 16px;
  position: relative;
  left: 270px;
  bottom: -42px;
  height: 40px;
  width: 150px;
}
.dialog {
  border: 1px solid rgb(241, 241, 241);
  font-size: 14px;
  width: 280px;
  position: absolute;
  background-color: #fff;
  z-index: 55555;
  box-shadow: 2px 1px 5px 2px rgba(200, 200, 200, 0.7);
  header {
    span {
      float: right;
      &:hover {
        font-weight: bold;
        cursor: pointer;
      }
    }
    font-weight: bold;
    padding: 4px 8px 4px 20px;
    font-size: 18px;
    text-align: left;
    color: rgb(72, 72, 72);
    margin: 0;
    background-color: rgb(241, 241, 241);
  }
  ul {
    padding: 0px 8px 8px 8px;
    li {
      padding: 2px 5px;
      border-radius: 10px;
      cursor: pointer;
      button {
        position: relative;
        right: 0;
        border: 0;
        color: rgb(63, 144, 251);
        background-color: rgba(241, 241, 241, 0);
        margin-left: 10px;
        &:hover {
          cursor: pointer;
          color: rgb(6, 112, 252);
        }
      }
      &:hover {
        background-color: rgb(241, 241, 241);
      }
      i {
        width: 9px;
        height: 9px;
        border-radius: 50%;
      }
      display: flex;
      align-items: center;
      color: rgb(117, 117, 117);
      span {
        color: rgb(80, 80, 80);
        text-align: right;
        font-weight: bold;
        display: block;
        width: 80px;
      }
      margin-top: 2px;
    }
  }
}
</style>
