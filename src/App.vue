<template>
  <div id="app">
    <appbar></appbar>
    <video-grid></video-grid>
  </div>
</template>

<script>
import Appbar from "./Appbar.vue";
import VideoGrid from "./components/VideoGrid.vue";
export default {
  name: "App",
  data() {
    return {
      
    };
  },
  components: {
    Appbar,
    VideoGrid,
  },
};
</script>

<style>
</style>