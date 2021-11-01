<template>
  <div class="amiddboxttop">
    <h2 class="tith2 pt1">{{ title }}</h2>
    <swiper ref="mySwiper" :options="swiperOptions" class="swiper">
      <swiper-slide>
        <div class="swiper_img_1"></div>
      </swiper-slide>
      <swiper-slide>
        <div class="swiper_img_2"></div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import SwiperCore, { Autoplay } from 'swiper';
SwiperCore.use([Autoplay]);

import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/swiper-bundle.css";

export default {
  name: "AMiddBoxtTop",
  components: {
    Swiper,
    SwiperSlide,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      swiperOptions: {
        //自动轮播
        autoplay: {
          delay: 3000,
          //当用户滑动图片后继续自动轮播
          disableOnInteraction: false,
        },
        //开启循环模式
        loop: true,
      },
    };
  },
};
</script>