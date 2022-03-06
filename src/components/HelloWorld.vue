<script>
import {defineComponent} from "vue";
import Scrollbar from "./scrollbar/index.vue"

export default defineComponent({
  components: {
    Scrollbar
  },
  setup() {

  }
})
</script>

<template>
  <div class="container">
    <Scrollbar class="row scroll" :snap-vertical-bar-to-parent="true">
      <div class="inner">test</div>
      <div class="inner"></div>
      <div class="inner"></div>
      <div class="inner"></div>
      <div class="inner"></div>
    </Scrollbar>
    <div class="row">a</div>
    <div class="row">b</div>
    <div class="row">c</div>
    <div class="row">d</div>
    <div class="row">e</div>
    <div class="row">f</div>
  </div>
</template>
<style scoped>
.container {
  background-color: grey;
  height: 500px;
  width: 80%;
  margin: auto;
  overflow: scroll;
}
.container::-webkit-scrollbar-thumb:horizontal {
   /*水平滚动条的样式*/
   width: 4px;
   background-color: #cccccc;
   -webkit-border-radius: 6px;
 }

.container::-webkit-scrollbar-track-piece {
   background-color: #fff; /*滚动条的背景颜色*/
   -webkit-border-radius: 0; /*滚动条的圆角宽度*/
 }

.container::-webkit-scrollbar {
   width: 10px; /*滚动条的宽度*/
   height: 8px; /*滚动条的高度*/
   background-color:white;
 }

.container::-webkit-scrollbar-track:vertical {
   margin-top: 200px;
 }

.container::-webkit-scrollbar-thumb:vertical {
   /*垂直滚动条的样式*/
   height: 50px;
   background-color: #999;
   -webkit-border-radius: 4px;
   outline: 2px solid #fff;
   outline-offset: -2px;
   border: 2px solid #fff;
 }

.container::-webkit-scrollbar-thumb:hover {
   /*滚动条的hover样式*/
   height: 50px;
   background-color: #9f9f9f;
   -webkit-border-radius: 4px;
 }
.row {
  background: white;
  border: 2px solid black;
  width: 3000px;
  height: 200px;
}
.scroll {
  overflow-y: scroll;
  position: sticky;
  top: 0;
}
.inner {
  width: 100%;
  height: 150px;
  background-color: cadetblue;
  border: 2px solid black;
}
</style>
