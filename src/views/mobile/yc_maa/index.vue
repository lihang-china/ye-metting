<template>
  <div class='yc_maa'>
    <!-- 会议室登记 -->
    <div>
      <van-form ref='form'>
        <van-field
          v-model='meeting_addr'
          label='会议地点'
          placeholder='请选择会议地点'
          @click='showType = true'
          readonly
          required
          :rules='[{ required: true }]'
        />
        <van-popup v-model='showType' round  position='top'>
          <van-picker
            title='请选择预约地点'
            show-toolbar
            value-key="label"
            :columns='optionss'
            @confirm='onPlace'
            @cancel='showType = false'
          />
        </van-popup>
        <van-field
          v-model='meetingform.meetingName'
          label='会议名称'
          required
          rows="1"
          autosize
          type="textarea"
          maxlength="16"
          show-word-limit
          placeholder='请输入会议名称'
          :rules='[{ required: true }]'
        />
        <!-- <van-field
          v-model='newlyIncreased.visitorPhone'
          label='联系方式'
          placeholder='请输入手机号'
          :rules='[{ required: true }]'
        /> -->
        <van-field
          v-model='meetingform.meetingDate'
          label='会议时间'
          readonly
          required
          placeholder='请选择会议时间'
          @click='showStartPicker = true'
          :rules='[{ required: true }]'
        />
        <!-- <van-popup v-model='showStartPicker' position='top'>
          <van-datetime-picker
            title='会议时间'
            type='date'
            :min-date="minDate"
            :max-date="maxDate"
            @confirm='onDatefirm'
            @cancel='showStartPicker = false'
          />
        </van-popup> -->
        <van-calendar v-model="showStartPicker" :show-confirm="false" @confirm="onConfirm" color="#1989fa" position="top" title="会议时间" />
        <!-- 会议开始时间 -->
        <van-field
          v-model='meetingform.meetingStartTime'
          label='会议开始时间'
          readonly
          required
          placeholder='请选择会议开始时间'
          @click='startStartPicker = true'
          :rules='[{ required: true }]'
        />
        <van-popup v-model='startStartPicker' round position='top'>
          <van-datetime-picker
            v-model="currentDate"
            type="time"
            title="使用开始时间"
            :filter="filter"
            :min-hour="8"
            :max-hour="22"
            :min-minute="5"
            :max-minute="55"
            @confirm='onTimefirmstar'
            @cancel='startStartPicker = false'
          />
        </van-popup>
        <!-- 会议结束时间 -->
        <van-field
          v-model='meetingform.meetingEndTime'
          label='会议结束时间'
          readonly
          required
          placeholder='请选择会议结束时间'
          @click='endStartPicker = true'
          :rules='[{ required: true }]'
        />
        <van-popup v-model='endStartPicker' round position='top'>
          <van-datetime-picker
            v-model="currentDate"
            type="time"
            title="使用结束时间"
            :filter="filter"
            :min-hour="8"
            :max-hour="22"
            :min-minute="5"
            :max-minute="55"
            @confirm='onTimefirmend'
            @cancel='endStartPicker = false'
          />
        </van-popup>
        <!-- //////////////////////////////////// -->
        <van-field
          v-model='meeting_dept'
          label='使用部门'
          placeholder='请选择使用部门'
          @click='showPark = true'
          readonly
          required
          :rules='[{ required: true }]'
        />
        <van-popup v-model='showPark' round  position='top'>
          <van-picker
            title='使用部门'
            show-toolbar
            value-key="label"
            :columns='parkOptions'
            @confirm='onDept'
            @cancel='showPark = false'
          />
        </van-popup>
        <van-field
          v-model='meetingform.meetingUser'
          label='联系人'
          placeholder='请输入联系人'
          rows="1"
          autosize
          type="textarea"
          maxlength="8"
          show-word-limit
          required
          :rules='[{ required: true }]'
        />
        <van-field
          v-model='meetingform.meetingContent'
          label='会议内容'
          placeholder='请输入会议内容'
          rows="2"
          autosize
          type="textarea"
          maxlength="32"
          show-word-limit
        />
        <!-- <van-field
          v-model='meetingform.meetingNotes'
          label='备注说明'
          placeholder='请输入备注'
        /> -->
      </van-form>
    </div>
    <div class='footer'>
      <div class='btn-2'>
        <van-button round color='linear-gradient(to top, #0284a0, #01ffff)' @click='onSubmitVisitor'>提交</van-button>
        <van-button round color='linear-gradient(to top, #0284a0, #01ffff)' @click='onSubmitDelete'>重置</van-button>
      </div>
      <van-button round color='linear-gradient(to top, #0284a0, #01ffff)' @click.stop='onReplacement'>预约记录查询</van-button>
    </div>
    <van-overlay :show="show">
      <div class="wrapper">
        <van-loading type="spinner" size="52px" color="#fff" />
      </div>
    </van-overlay>
  </div>
</template>
<script>
import { addmeet } from '@/api'
import { deptList, placeList } from '@/depdata/index.js'
export default {
  components: {

  },
  data () {
    return {
      show: false,
      showPark: false,
      showType: false,
      showStartPicker: false,
      endStartPicker: false,
      startStartPicker: false,
      meeting_addr: undefined,
      meeting_dept: undefined,
      meeting: undefined,
      currentDate: '08:30',
      meetingform: {
        meetingAddr: undefined, // 预约地点
        meetingName: undefined, // 会议名称
        meetingDate: undefined, // 会议时间
        meetingTime: undefined, // 使用时间段
        meetingDept: undefined, // 使用部门
        meetingUser: undefined, // 联系人
        meetingContent: undefined, // 会议内容
        meetingStartTime: undefined, // 开始时间
        meetingEndTime: undefined // 结束时间
      },
      minDate: new Date(),
      maxDate: new Date(2026, 10, 1),
      optionss: placeList,
      parkOptions: deptList
    }
  },
  created() {
    var myDate = new Date()
    this.meetingform.meetingDate = this.parseTime(myDate, '{y}-{m}-{d}')
  },
  mounted() {
  },
  methods: {
    onPlace(row) { // 选择地点
      this.meeting_addr = row.label
      this.meetingform.meetingAddr = row.value
      this.showType = false
    },
    onConfirm(row) { // 日期选择
      this.meetingform.meetingDate = this.parseTime(row, '{y}-{m}-{d}')
      this.showStartPicker = false
    },
    // 使用时间段选择事件
    onTimefirmstar(row) {
      this.startStartPicker = false
      this.meetingform.meetingStartTime = row
    },
    onTimefirmend(row) {
      this.endStartPicker = false
      if (this.meetingform.meetingStartTime == undefined) {
        this.$toast.fail('请先选择开始时间！')
      } else if (this.countDown(row) <= this.countDown(this.meetingform.meetingStartTime)) {
        this.$toast.fail('结束时间不能小于开始时间！')
      } else {
        this.meetingform.meetingEndTime = row
      }
    },
    // 时分秒转为时间戳
    countDown(time) {
      var s = 0
      var hour = time.split(':')[0]
      var min = time.split(':')[1]
      // var sec = time.split(':')[2]
      console.log(hour, min)
      s = Number(hour * 3600) + Number(min * 60)
      return s
    },
    // 时间选择过滤器
    filter(type, options) {
      if (type === 'minute') {
        return options.filter((option) => option % 10 === 0)
      }
      return options
    },
    onDept(row) { // 部门选择
      this.meeting_dept = row.label
      this.meetingform.meetingDept = row.value
      this.showPark = false
    },
    onSubmitVisitor() { // 提交按钮
      this.show = true
      this.$refs.form.validate().then(() => {
        addmeet(this.meetingform).then((res) => {
          if (res.data.code === 200) {
            this.$toast.success('会议预约成功!')
            this.meetingform = {
              meetingAddr: undefined, // 预约地点
              meetingName: undefined, // 会议名称
              meetingDate: undefined, // 会议时间
              meetingDept: undefined, // 使用部门
              meetingUser: undefined, // 联系人
              meetingContent: undefined, // 会议内容
              meetingStartTime: undefined, // 开始时间
              meetingEndTime: undefined // 结束时间
            }
            this.show = false
            this.$router.push({ path: '/historyquery' })
          } else {
            this.show = false
            this.$toast.fail(res.data.msg)
          }
        })
      }).catch(() => {
        this.show = false
        this.$toast.fail('请正确填写！')
      })
    },
    onSubmitDelete() { // 重置按钮
      this.meetingform = {
        meetingAddr: undefined, // 预约地点
        meetingName: undefined, // 会议名称
        meetingDate: undefined, // 会议时间
        meetingDept: undefined, // 使用部门
        meetingUser: undefined, // 联系人
        meetingContent: undefined, // 会议内容
        meetingStartTime: undefined, // 开始时间
        meetingEndTime: undefined // 结束时间
      }
      this.meeting_addr = undefined
      this.meeting_dept = undefined
    },
    onReplacement() { // 记录查询按钮
      this.$router.push({ path: '/historyquery' })
    },
    // 时间格式
    parseTime(time, pattern) {
      if (arguments.length === 0 || !time) {
        return null
      }
      const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
      let date
      if (typeof time === 'object') {
        date = time
      } else {
        if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
          time = parseInt(time)
        } else if (typeof time === 'string') {
          time = time.replace(new RegExp(/-/gm), '/')
        }
        if ((typeof time === 'number') && (time.toString().length === 10)) {
          time = time * 1000
        }
        date = new Date(time)
      }
      const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
      }
      const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
        if (result.length > 0 && value < 10) {
          value = '0' + value
        }
        return value || 0
      })
      return timeStr
    }
  }
}
</script>
<style lang='scss' scoped>
.yc_maa{
  padding-top: 28px;
  .footer {
    // margin-top:18px;
    padding: 48px 0px;
    .btn-2{
      display: flex;
      .van-button {
        flex: 1;
        margin-bottom: 20px;
        font-size: 32px;
      }
    }
    .van-button--round{
      border-radius: 28px;
    }
    .van-button {
      width: 700px;
      margin: 6px 25px;
      font-size: 32px;
    }
  }
  .van-cell {
    line-height: 80px !important;
  }
  .wrapper{
    position:absolute;
    left:50%;
    top:50%;
    transform:translate(-50%,-50%);
  }
}
</style>
