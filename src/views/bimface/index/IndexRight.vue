<template>
  <div class="mrbox">
    <IndexRightMidd />
    <IndexRightRight />
  </div>
</template>

<script>
import IndexRightMidd from "./IndexRightMidd";
import IndexRightRight from "./IndexRightRight";

export default {
  name: "IndexRight",
  components: { IndexRightMidd, IndexRightRight },
};
</script>