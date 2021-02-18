<template>
  <div id="app">
    <mu-drawer :open.sync="openDrawer" :docked="false">
      <mu-list>
        <mu-list-item @click="prompt" button>
          <mu-list-item-title>自定义解析</mu-list-item-title>
        </mu-list-item>
        <mu-list-item @click="openUserDialog" button>
          <mu-list-item-title>个人中心</mu-list-item-title>
        </mu-list-item>
      </mu-list>
    </mu-drawer>
    <Player ref="Player"></Player>
    <UserDialog ref="UserDialog"></UserDialog>
  </div>
</template>

<script>
import Player from "./Player.vue";
import UserDialog from "./UserDialog.vue";
export default {
  data() {
    return {
      openDrawer: false,
    };
  },
  methods: {
    openUserDialog() {
      this.openDrawer = false;
      this.$refs.UserDialog.openUserDialog();
    },
    prompt() {
      this.openDrawer = false;
      this.$prompt("请输入BV号", "提示", {
        validator(value) {
          return {
            valid: value,
            message: "请输入BV号",
          };
        },
      }).then(({ result, value }) => {
        if (result) {
          this.openPlayer(value);
        }
      });
    },
    openPlayer(bvid) {
      this.$refs.Player.openPlayerDialog = true;
      this.$refs.Player.bvid = bvid;
      this.$refs.Player.getVideoInfo(bvid);
    },
  },
  components: {
    Player,
    UserDialog,
  },
};
</script>

<style>
</style>