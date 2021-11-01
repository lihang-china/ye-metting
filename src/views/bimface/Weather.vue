<template>
  <div class="weather">
    <iframe
      scrolling="no"
      src="https://tianqiapi.com/api.php?style=tb&skin=cake&city=杭州&fontsize=18&color=ffffff"
      frameborder="0"
      width="400"
      height="24"
      allowtransparency="true"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: "Weather",
};
</script>