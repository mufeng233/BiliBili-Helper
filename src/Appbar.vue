<template>
  <div id="app">
    <mu-appbar style="width: 100%" color="primary">
      <mu-button icon slot="left" @click="openDrawer">
        <mu-icon value="menu"></mu-icon>
      </mu-button>
      BiliBili Helper
      <mu-button v-show="!isLogin" flat slot="right" @click="openLoginDialog"
        >登录</mu-button
      >
    </mu-appbar>
    <login-dialog @changeLogin="login" ref="LoginDialog"></login-dialog>
    <drawer ref="Drawer"></drawer>
  </div>
</template>

<script>
import Drawer from "./components/Drawer.vue";
import LoginDialog from "./components/LoginDialog.vue";

export default {
  name: "Appbar",
  data() {
    return {
      isLogin: false,
    };
  },
  methods: {
    openLoginDialog() {
      this.$refs.LoginDialog.openDialog = true;
      this.$refs.LoginDialog.loadingQrcode = true;
      setTimeout(() => {
        this.$refs.LoginDialog.qrcode();
        this.$refs.LoginDialog.loadingQrcode = false;
      }, 2000);
    },
    openDrawer() {
      this.$refs.Drawer.openDrawer = true;
    },
    login(data) {
      this.isLogin = data;
    },
  },
  created() {
    var user = this.$Cookies.get("user");
    if (user) {
      user = JSON.parse(user);
      if (user) {
        this.isLogin = true;
      }
    }
  },
  components: {
    LoginDialog,
    Drawer,
  },
};
</script>

<style>
</style>