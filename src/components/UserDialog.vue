<template>
  <div id="app">
    <mu-dialog
      width="360"
      transition="scale"
      fullscreen
      :open.sync="userDialog"
    >
      <mu-appbar color="primary" title="个人中心">
        <mu-button slot="left" icon @click="closeUserDialog">
          <mu-icon value="close"></mu-icon>
        </mu-button>
      </mu-appbar>
      <div style="padding: 24px">
        <div class="text-center">
          <mu-avatar class="shadow" size="80">
            <img :src="userInfo.face || ''" />
          </mu-avatar>
          <br />
          <span style="font-size: 15px"
            >{{ userInfo.uname || "" }}
            <mu-badge
              v-if="userInfo.level_info"
              :content="(userInfo.level_info.current_level || '') + '级'"
              color="primary"
            ></mu-badge
          ></span>
          <p>
            <mu-chip>硬币数：{{ userInfo.money || "" }}个</mu-chip>
            <mu-chip>
              <span v-if="userInfo.vipStatus == 1">已开通大会员</span>
              <span v-else>未开通大会员</span>
            </mu-chip>
          </p>
        </div>
      </div>
    </mu-dialog>
  </div>
</template>

<script>
export default {
  name: "UserDialog",
  data() {
    return {
      isLogin: false,
      userDialog: false,
      userInfo: [],
    };
  },
  methods: {
    openUserDialog() {
      this.userDialog = true;
    },
    closeUserDialog() {
      this.userDialog = false;
    },
  },
  created() {
    var that = this;
    var user = this.$Cookies.get("user");
    if (user) {
      user = JSON.parse(user);
      if (user) {
        this.isLogin = true;
        this.$axios
          .get(
            "v2?callback=&url=" +
              encodeURIComponent("https://api.bilibili.com/nav") +
              '&headers={"Cookie":"SESSDATA=' +
              user.sessdata +
              '"}'
          )
          .then((res) => {
            if (res.data.data.isLogin == true) {
              that.userInfo = res.data.data;
            } else {
              that.$Cookies.remove("user");
              that.$toast.error("登录信息已过期请重新登录！");
            }
          });
      } else {
        this.isLogin = false;
      }
    }
  },
};
</script>

<style>
.text-center {
  text-align: center;
}
.shadow {
  box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.8);
}
</style>