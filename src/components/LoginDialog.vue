<template>
  <div id="app">
    <mu-dialog
      width="360"
      transition="scale"
      fullscreen
      :open.sync="openDialog"
    >
      <mu-appbar color="primary" title="扫码以进行登录">
        <mu-button slot="left" icon @click="closeLoginDialog">
          <mu-icon value="close"></mu-icon>
        </mu-button>
      </mu-appbar>
      <div class="center">
        <mu-card
          data-mu-loading-color="primary"
          data-mu-loading-size="24"
          v-loading="loadingQrcode"
          style="padding: 20px"
        >
          <mu-card-text style="display: grid; place-items: center">
            <div id="qrcode" onclick="window.open('bilibili://qrcode')"></div>
          </mu-card-text>
          <mu-card-actions>
            <mu-button color="primary" @click="reloadQrcode" flat
              >刷新</mu-button
            >
            <mu-button color="primary" @click="authLogin" flat>验证</mu-button>
          </mu-card-actions>
        </mu-card>
      </div>
    </mu-dialog>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
export default {
  name: "LoginDialog",
  data() {
    return {
      openDialog: false,
      loadingQrcode: false,
      link: "",
      key: "",
    };
  },
  props: {
    isLogin: Boolean
  },
  methods: {
    openLoginDialog() {
      this.openDialog = true;
    },
    closeLoginDialog() {
      this.openDialog = false;
    },
    qrcode() {
      // eslint-disable-next-line no-unused-vars
      let qrcode = new QRCode("qrcode", {
        width: 124,
        height: 124, // 高度
        text: this.link, // 二维码内容
        render: "canvas", // 设置渲染方式
      });
    },
    reloadQrcode() {
      this.loadingQrcode = true;
      var that = this;
      this.$axios
        .get("http://bili.muxiuge.cn/API/login.php")
        .then(function (res) {
          var code = res.data.code;
          if (code == 200) {
            that.link = res.data.data.url;
            that.key = res.data.data.key;
          }
        });
      setTimeout(() => {
        document.getElementById("qrcode").innerHTML = "";
        this.qrcode();
        this.loadingQrcode = false;
        this.$toast.info('刷新成功！');
      }, 2000);
    },
    authLogin() {
      var that = this;
      this.$axios
        .get("http://bili.muxiuge.cn/API/login.php?key=" + that.key)
        .then(function (res) {
          var code = res.data.code;
          var msg = res.data.msg;
          if (code == 200) {
            that.$toast.success(msg);
            var user = {
              uid: res.data.data.DedeUserID,
              uid_md5: res.data.data.DedeUserID__ckMd5,
              expries: res.data.data.Expries,
              sessdata: res.data.data.SESSDATA,
              bili_jct: res.data.data.bili_jct,
            };
            that.$Cookies.set('user', user);
            that.$emit('changeLogin', true);
          } else {
            that.$toast.error(msg);
          }
        });
    },
  },
  components: {
    // eslint-disable-next-line vue/no-unused-components
    QRCode,
  },
  created() {
    var that = this;
    this.$axios
      .get("http://bili.muxiuge.cn/API/login.php")
      .then(function (res) {
        var code = res.data.code;
        if (code == 200) {
          that.link = res.data.data.url;
          that.key = res.data.data.key;
        }
      });
  },
};
</script>

<style>
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}
</style>