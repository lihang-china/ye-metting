<template>
  <div class="history">
    <!-- 会议室等级查询 -->
    <van-sticky>
      <van-nav-bar title="预约记录查询" left-text="返回" left-arrow  @click-left="onClickLeft" @click-right.stop="onClickRight">
        <template #right>
        </template>
      </van-nav-bar>
      <!-- 筛选 -->
        <div class="btn-box">
          <van-field
            v-model='queryParams.start'
            label='会议时间'
            readonly
            placeholder='请选择会议时间'
            @click='showStartPicker = true'
          />
          <van-popup v-model='showStartPicker' position='top'>
            <van-datetime-picker
              title='会议时间'
              type='date'
              v-model="currentDate"
              :min-date="minDate"
              :max-date="maxDate"
              @confirm='onDatefirm'
              @cancel='showStartPicker = false'
            />
          </van-popup>
        <button class="screening"  @click.stop="onScreening">筛选<van-icon name="filter-o" /></button>
        <button class="screening"  @click.stop="onReset">重置<van-icon name="revoke" /></button>
      </div>
    </van-sticky>
    <div class="mian">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
        <van-collapse v-model="activeName" accordion>
          <van-collapse-item disabled v-for="(item,index) in items" :key= index :name= index >
            <!-- <template #right-icon> <van-icon name="arrow" /> </template> -->
            <template #title>
              <div  class="line-height-cell">
                <ul class="list-groups">
                  <li>会议地点： &nbsp; &nbsp;<span> {{ item.meetingAddr === placeList[item.meetingAddr].value ? placeList[item.meetingAddr].label: '' }}</span></li>
                  <button class="btn" @click.stop="seeMore(item)">查看详情</button>
                  <li>会议名称： &nbsp; &nbsp;<span> {{item.meetingName}}</span> </li>
                  <li>会议时间： &nbsp; &nbsp;<span> {{item.meetingDate}}&nbsp;&nbsp;{{ item.meetingStartTime}} &nbsp; 至 &nbsp; {{item.meetingEndTime }}</span></li>
                  <li>联系人：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{ item.meetingUser}} - ({{item.meetingDept === deptList[item.meetingDept].value ? deptList[item.meetingDept].label: '' }})</li>
                </ul>
              </div>
            </template>
            <div class="operation">
              <!-- <button class="operation-btn" @click="queryView(item)">查看</button> -->
              <!-- <button class="operation-btn" v-if="item.meetingStatus == 1" @click="remove(item.id)">删除</button> -->
              <ul class="ui-li">
                <!-- <li>使用部门： &nbsp; &nbsp; {{item.meetingDept === deptList[item.meetingDept].value ? deptList[item.meetingDept].label: '' }}</li>
                <li>联系人：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{ item.meetingUser}}</li> -->
              </ul>
            </div>
          </van-collapse-item>
        </van-collapse>
        </van-list>
      </van-pull-refresh>
    </div>
    <!-- 查看详情弹框 -->
    <van-dialog width="330"  v-model="isDetails" title="详情数据" :show-confirm-button ="false" cancel-button-text ="关闭" show-cancel-button>
      <van-form>
        <van-field
          label='会议地点'
          placeholder='请选择会议地点'
          readonly
        >
        <template #input>
          {{ meetingform.meetingAddr === placeList[meetingform.meetingAddr].value ? placeList[meetingform.meetingAddr].label: '' }}
        </template>
        </van-field>
        <van-field
          v-model='meetingform.meetingName'
          label='会议名称'
          readonly
          rows="1"
          autosize
          type="textarea"
          placeholder='请输入会议名称'
        />
        <van-field
          v-model='meetingform.meetingDate'
          label='会议时间'
          readonly
          placeholder='请选择会议时间'
        />
        <!-- 会议开始时间 -->
        <van-field
          v-model='meetingform.meetingStartTime'
          label='会议开始时间'
          readonly
          placeholder='请选择会议开始时间'
        />
        <!-- 会议结束时间 -->
        <van-field
          v-model='meetingform.meetingEndTime'
          label='会议结束时间'
          readonly
          placeholder='请选择会议结束时间'
        />
        <!-- //////////////////////////////////// -->
        <van-field
          label='使用部门'
          placeholder='请选择使用部门'
          readonly
        >
        <template #input>
          {{ meetingform.meetingDept === deptList[meetingform.meetingDept].value ? deptList[meetingform.meetingDept].label: '' }}
        </template>
        </van-field>
        <van-field
          v-model='meetingform.meetingUser'
          label='联系人'
          placeholder='请输入联系人'
          readonly
          rows="1"
          autosize
          type="textarea"
        />
        <van-field
          v-model='meetingform.meetingContent'
          label='会议内容'
          placeholder='请输入会议内容'
          readonly
          rows="2"
          autosize
          type="textarea"
        />
      </van-form>
    </van-dialog>
  </div>
</template>
<script>
import { deptList, placeList } from '@/depdata/index.js'
import { pagemeet, delmeet } from '@/api'
export default {
  data() {
    return {
      demandValue: 0,
      searchValue: '',
      loading: false,
      finished: false,
      refreshing: false,
      isShow: false,
      isDetails: false,
      isWhy: false,
      activeName: '0',
      whyVal: '',
      deleteId: undefined,
      showStartPicker: false,
      stateColor: '#323233',
      currentDate: undefined,
      toDate: undefined,
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2026, 10, 1),
      deptList: deptList,
      placeList: placeList,
      option: [
        { text: '选择查询', value: 0 },
        // { text: '会议地点', value: 1 },
        { text: '会议日期', value: 1 }
      ],
      items: [
        {
          meeting_addr: 1, // 0是茶水间, 1是会议室
          meeting_name: '移动端结项', // 会议名称
          meeting_date: '2021-10-27', // 会议时间
          meeting_time: '13:00 - 14:30', // 使用时间段
          meeting_dept: undefined, // 使用部门
          meeting_user: undefined, // 联系人
          meeting_content: undefined, // 会议内容
          meeting_notes: undefined // 备注说明
        }
      ],
      variation: 0,
      queryParams: {
        meetingStatus: 0,
        pageSize: 10,
        pageNum: 1,
        start: '',
        end: '',
        orderByColumn: 'meeting_date',
        isAsc: 'desc'
      },
      meetingform: {}
    }
  },
  watch: {

  },
  created() {
    var date = new Date()
    const dates = this.parseTime(date, '{y},{m},{d}')
    this.currentDate = new Date(dates)
    this.getList()
  },
  methods: {
    onClickLeft() { // 页眉左侧事件
      this.$router.go(-1)
    },
    onClickRight() { // 页眉右侧事件
    },
    getList() { // 回去列表事件
    this.loading = true
      pagemeet(this.queryParams).then((res) => {
        this.items = res.data.rows
        this.loading = false
      })
    },
    onSearch() { // 搜索事件
      switch (this.demandValue) {
        case 0:
          if (this.variation == 0) {
            this.$toast.fail('请先选择查询项！')
          } else {
            this.variation = 0
            this.queryParams = {
              meetingStatus: 0,
              pageSize: 10,
              pageNum: 1,
              meetingName: undefined,
              orderByColumn: 'meeting_date',
              isAsc: 'desc'
            }
            this.onRefresh()
            this.getList()
            this.searchValue = ''
          }
          break
        case 1:
           this.variation = 1
          if (this.searchValue === '') {
            this.$toast.fail('请正确输入查询内容！')
          } else {
            this.queryParams.meetingName = this.searchValue
            this.onRefresh()
            this.getList()
          }
          break
      }
    },
    // 查看事件
    queryView(row) {
      this.isShow = true
    },
    remove(row) {
      this.isWhy = true
      this.deleteId = row
    },
    // 查看详情接口
    seeMore(row) {
      console.log(row)
      this.isDetails = true
      this.meetingform = row
    },
    onconfirmisWhy() { // 确认删除
      this.$refs.whyform.validate().then(() => {
        delmeet({ id: this.deleteId, meetingDeleteNotes: this.whyVal }).then((res) => {
          if (res.data.code === 200) {
            this.$toast.success('删除成功')
            this.isWhy = false
            this.getList()
          } else {
            this.$toast.fail('接口错误')
          }
        })
      }).catch(() => {
          this.isWhy = true
        })
    },
    // 时间筛选事件
    onScreening() {
      if (this.queryParams.start == '') {
        this.$toast.fail('请先选择会议日期！')
      } else {
        this.onRefresh()
        this.getList()
      }
    },
    // 筛选重置事件
    onReset() {
      this.queryParams = {
        meetingStatus: 0,
        pageSize: 10,
        pageNum: 1,
        end: '',
        start: '',
        orderByColumn: 'meeting_date',
        isAsc: 'desc'
      }
      this.onRefresh()
      this.getList()
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true
      this.queryParams.pageNum = 1
      this.onLoad()
    },
    onLoad() {
      // if (!this.controlCalls) {
      //   this.finished = true
      //   this.loading = false
      //   this.refreshing = false
      //   return
      // }
      const params = (
        this.queryParams
      )
      pagemeet(params).then((response) => {
        this.listData = response.data.rows
        this.listData.forEach((item, index) => {
          if (this.items.length < response.data.total) {
            if (this.listData[index].id !== this.items[index].id) {
              this.items.push(this.listData[index])
            }
          }
        })
        if (this.refreshing) {
          this.refreshing = false
        }
        this.loading = false
        console.log(this.items.length, '/////////', response.data.total)
        if (this.items.length >= response.data.total) {
          this.finished = true
        } else {
          this.queryParams.pageNum += 1
          this.$toast.success('加载成功！')
        }
      })
    },
    onDatefirm(row) {
      this.queryParams.start = this.parseTime(row, '{y}-{m}-{d}')
      this.queryParams.end = this.parseTime(row, '{y}-{m}-{d}')
      this.showStartPicker = false
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
<style lang="scss" scoped>
  /* 子页面的搜索框样式 */
.history{
  .search-margin{
    z-index: 1000;
    height: 100px;
    border-bottom: 2px solid #ddd;
    background: #fff;
    position: relative;
    .search{
      width: 522px;
      float: right;
      .van-search{
        margin-right: 24px;
        padding: 14px 0px
      }
      .van-search__action{
        color: #232323;
        margin: 0px 6px;
        background:linear-gradient(to top, #abdabd, #c3f6f2);
        border-radius: 28px;
      }
      .van-search__content{
        border: 1px solid rgb(63, 165, 233);
        margin: 0px 6px 0px 0px;
        background: #f7f8fa;
        border-radius: 32px;
      }
    }
    .van-popup{
      max-height: 100%;
      overflow-y: hidden !important;
      background: #fff !important;
    }
    .drop-down{
      position: absolute;
      .van-ellipsis{
        color: #1989fa !important;
      }
      .van-dropdown-menu__item {
        margin: 14px 0px 0px 14px;
        justify-content: left;
      }
      .van-dropdown-menu__bar {
        box-shadow: none;
        padding: 0px;
        height: 99px;
      }
    }
  }
  .line-height-cell{
    color:#232323;
    font-size: 28px;
    .list-groups {
      display:inline-block;
      position: relative;
      width: 750px;
      li{
        height: 48px;
      }
    }
    .btn{
      position: absolute;
      top: 4px;
      right: 82px;
      color: #1989fa;
      border: none;
      background-color: transparent;
      outline: none;
      margin-left: 8px;
      font-size: 26px;
    }
  }
  // 列表项下拉样式
  .van-collapse-item__content {
    margin: 0px 24px;
    background-image: linear-gradient(#e9e9e9, #c0c0c0);
    margin-bottom: 4px !important;
  }
  .operation-btn{
    color: #1989FA;
    border: none;
    margin: 0px 24px;
    background-color: transparent;
    outline: none;
  }
  .btn-box{
  display: flex;
  align-items: center;
  justify-self: center;
  background: #fff;
  padding: 0 16px;
  font-size: 28px;
  margin: 0px 24px;
  border-top: 1px solid #ddd;
  border-bottom: 2px solid #ddd;
  .btn{
    color: #f66;
    padding:0;
    margin:0;
    height:88px;
    line-height:88px;
    font-size: 28px;
    border: none;
    background-color: transparent;
    outline: none;
  }
  .screening{
    text-align: right;
    padding-right:0px;
    color: #1989FA;
    border: none;
    background-color: transparent;
    width: 160px;
  }
}
}
</style>
