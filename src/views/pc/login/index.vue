<!--
 * @Descriptin:
 * @Version: 0.1
 * @Autor: Your Name
 * @Date: 2021-09-14 16:21:18
 * @LastEditors: Your Name
 * @LastEditTime: 2021-09-17 16:41:43
-->
<template>
  <div class="wrap">
    <div class="bgwrap">
      <div class="container">
        <el-form ref="formName" :model="form" :rules="rules">
          <el-form-item>
            <h2>管理员登录</h2>
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input
              size="medium"
              v-model="form.username"
              placeholder="请输入用户名"
            >
              <i slot="prefix" class="el-input__icon el-icon-s-custom" />
            </el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              size="medium"
              v-model="form.password"
              @keyup.enter.native="login()"
              type="password"
              placeholder="请输入密码"
            >
              <i slot="prefix" class="el-input__icon el-icon-lock" />
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" round @click="login()">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectIndex',
  data() {
    return {
      activIndex: 0,
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入管理员用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 5 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入管理员密码', trigger: 'blur' }
        ]
      }
    }
  },

  mounted() {},

  methods: {
    login() {
      this.$refs.formName.validate((valid) => {
        if (valid) {
          if (
            this.form.username === 'admin' &&
            this.form.password === 'admin'
          ) {
            window.localStorage.setItem('login', true)
            this.$router.push('/admin')
          } else {
            window.localStorage.setItem('login', false)
            this.$message({
              type: 'error',
              message: '用户名密码错误'
            })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  .bgwrap {
    width: 100%;
    height: 100%;
    background-color: rgba(232, 194, 247, 0.3);
    backdrop-filter: blur(8px); /*主要实现的属性*/
    display: flex;
    justify-content: center;
    align-items: center;
  }
  width: 100%;
  height: 100%;
  background: url('../../../components/bg1.jpeg') no-repeat;
  background-size: 100% 100%;

  .container {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background-color: rgb(255, 255, 255);
    border-radius: 10px;
    box-shadow: 2px 1px 10px 3px rgba(143, 128, 141, 0.7);
    margin-top: -5%;
    width: 320px;
    border: 1px solid rgb(200, 200, 200);
    height: 360px;
    .el-row {
      margin: 0;
      .el-col {
        .button {
          width: 100%;
          height: 35px;
          border: 0;
          cursor: pointer;
          color: rgb(73, 73, 73);
          font-size: 14px;
          background-color: #fff;
          border-bottom: 1px solid rgb(238, 238, 238);
          .active {
            border-bottom: 2px solid rgb(159, 198, 255);
          }
          &:hover {
            background-color: rgb(236, 236, 236);
          }
        }
      }
    }
    .circle {
      &:hover {
        cursor: pointer;
        font-weight: bold;
      }
      position: relative;
      top: calc(50% - 100px);
      left: calc(50% - 50px);
      width: 100px;
      height: 100px;
      padding: 20px;
      border-radius: 50%;
      border: 0;
      background-color: rgb(102, 177, 255);
      color: #fff;
      font-size: 40px;
    }
    .el-form {
      margin: 15px;
      margin-top: 40px;
      h2 {
        text-align: center;
      }
      .el-button {
        width: 100%;
        margin-top: 30px;
      }
    }
  }
}
</style>
