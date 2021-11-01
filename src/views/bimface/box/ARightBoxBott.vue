<template>
  <div class="arightboxbott">
    <h2 class="tith2">{{ title }}</h2>
    <div class="lefttoday_tit" style="height: 7%">
      <div class="area">地点：园区一角</div>
    </div>
    <div id="arightboxbott" class="arightboxbottcont">
      <img src="@/assets/img/show3.jpg" style="width: 400px" />
    </div>
  </div>
</template>

<script>
export default {
  name: "ARightBoxBott",
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>