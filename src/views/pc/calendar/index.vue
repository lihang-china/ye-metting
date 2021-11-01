<!--
 * @Descriptin:
 * @Version: 0.1
 * @Autor: Your Name
 * @Date: 2021-09-14 16:17:44
 * @LastEditors: Your Name
 * @LastEditTime: 2021-09-17 16:05:47
-->
<template>
    <div class="wrap">
        <Calendar style="margin-top:-50px;"/>
    </div>
</template>

<script>
import Calendar from './components/CalendarDetails.vue'
    export default {
        name: 'ProjectIndex',
        components: {
          Calendar
        },
        data() {
            return {

            }
        },

        mounted() {

        },

        methods: {

        }
    }
</script>

<style lang="scss" scoped>
.wrap{
    width: 100%;
    height: 100%;
}
</style>