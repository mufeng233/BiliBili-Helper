<template>
  <div id="app">
    <mu-container>
      <mu-load-more
        @refresh="refresh"
        :refreshing="refreshing"
        :loading="loading"
        :loaded-all="loaded_all"
        @load="load"
      >
        <mu-grid-list>
          <mu-grid-tile
            v-for="(item, index) in (list || '').slice(0, num)"
            :key="index"
          >
            <img :src="item.pic" />
            <span slot="title">{{ item.title }}</span>
            <span slot="subTitle"
              ><b>{{ item.tname }}</b></span
            >
            <mu-button slot="action" @click="openPlayer(item.bvid)" icon>
              <mu-icon value="play_arrow"></mu-icon>
            </mu-button>
          </mu-grid-tile>
        </mu-grid-list>
      </mu-load-more>
      <player ref="Player"></player>
    </mu-container>
  </div>
</template>

<script>
import Player from "./Player.vue";
export default {
  name: "VideoGrid",
  data() {
    return {
      list: [],
      num: 10,
      refreshing: false,
      loading: false,
      loaded_all: false,
    };
  },
  methods: {
    openPlayer(bvid) {
      this.$refs.Player.openPlayerDialog = true;
      this.$refs.Player.bvid = bvid;
      this.$refs.Player.getVideoInfo(bvid);
    },
    refresh() {
      this.refreshing = true;
      setTimeout(() => {
        this.refreshing = false;
        this.num = 10;
      }, 2000);
    },
    load() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.num += 10;
        if (this.num == 100) {
          this.loaded_all = true;
        }
      }, 1000);
    },
  },
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Player,
  },
  created() {
    var that = this;
    this.$axios
      .get(
        "v1?callback=&url=" +
          encodeURIComponent(
            "http://api.bilibili.com/x/web-interface/ranking/v2?rid=0&type=all"
          )
      )
      .then(function (res) {
        that.list = res.data.data.list;
      });
  },
};
</script>

<style>
</style>