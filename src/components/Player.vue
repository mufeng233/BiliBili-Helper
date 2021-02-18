<template>
  <div id="app">
    <mu-dialog
      width="100%"
      transition="slide-right"
      fullscreen
      scrollable
      :open.sync="openPlayerDialog"
    >
      <mu-appbar color="primary" title="视频播放器">
        <mu-button slot="left" icon @click="closePlayer">
          <mu-icon value="arrow_back"></mu-icon>
        </mu-button>
      </mu-appbar>
      <iframe
        id="player"
        :src="
          'https://player.bilibili.com/player.html?bvid=' + bvid + '&amp;page=1'
        "
        frameborder="no"
        scrolling="no"
        allowfullscreen="allowfullscreen"
        ><span
          data-mce-type="bookmark"
          style="
            display: inline-block;
            width: 0px;
            overflow: hidden;
            line-height: 0;
          "
        ></span>
      </iframe>
      <mu-tabs
        :value.sync="active"
        inverse
        color="secondary"
        text-color="rgba(0, 0, 0, .54)"
      >
        <mu-tab>简介</mu-tab>
        <mu-tab>评论({{ videoInfo.stat.reply }})</mu-tab>
        <mu-tab>推荐</mu-tab>
      </mu-tabs>
      <div class="text" v-if="active === 0">
        <mu-list textline="two-line">
          <mu-list-item avatar button>
            <mu-list-item-action>
              <mu-avatar>
                <img :src="videoInfo.owner.face" />
              </mu-avatar>
            </mu-list-item-action>
            <mu-list-item-content>
              <mu-list-item-title>{{
                videoInfo.owner.name
              }}</mu-list-item-title>
              <mu-list-item-sub-title
                >Uid:{{ videoInfo.owner.mid }}</mu-list-item-sub-title
              >
            </mu-list-item-content>
          </mu-list-item>
        </mu-list>
        <h3 style="margin: 0px">{{ videoInfo.title }}</h3>
        <small>
          <span>{{ videoInfo.stat.view }}次播放&nbsp;&nbsp;</span>
          <span>{{ videoInfo.stat.danmaku }}条弹幕</span>
        </small>
        <p>{{ videoInfo.desc }}</p>
        <mu-select label="选择分P" v-model="selectPage" full-width>
          <mu-option
            v-for="(val, key) in pageList"
            :key="key"
            :label="val.part || ''"
            :value="val.cid || ''"
          ></mu-option>
        </mu-select>
        <div style="text-align: center">
          <mu-button color="red" @click="downloadVideo">
            缓存
            <mu-icon right value="file_download"></mu-icon>
          </mu-button>
        </div>
      </div>
      <div class="text" v-if="active === 1">
        <mu-expansion-panel
          
          v-for="(item, key) in videoReply"
          :key="key"
          :expand="true"
        >
          <div slot="header" class="align">
            <mu-avatar :size="50">
              <img :src="item.member.avatar" />
            </mu-avatar>
            <span style="margin-left: 10px">{{ item.member.uname }}</span>
          </div>
          <div style="padding-left: 30px">{{ item.content.message }}</div>
          <div class="align" style="margin-top:10px;">
            <mu-icon style="margin-right:5px;" value="thumb_up" color="secondary" :size="20"></mu-icon>
            {{ item.like }}
          </div>
        </mu-expansion-panel>
      </div>
      <div class="text," v-if="active === 2">
        <mu-list textline="two-line" :ripple="true">
          <mu-list-item
            :key="key"
            v-for="(val, key) in relateVideoInfo"
            avatar
            button
            @click="openNewPlayer(val.bvid)"
          >
            <mu-list-item-action>
              <mu-avatar>
                <img :src="val.owner.face" />
              </mu-avatar>
            </mu-list-item-action>
            <mu-list-item-content>
              <mu-list-item-title>{{ val.title }}</mu-list-item-title>
              <mu-list-item-sub-title>{{ val.desc }}</mu-list-item-sub-title>
            </mu-list-item-content>
          </mu-list-item>
        </mu-list>
      </div>
    </mu-dialog>
    <mu-dialog title="提示" width="360" :open.sync="downloadTip">
      解析成功！<br />如何下载？<br />首先打开哔哩哔哩官网，在F12打开控制台，输入window.open("视频链接"),就可以下载了！
      <mu-button
        slot="actions"
        flat
        color="primary"
        :data-clipboard-text="downloadUrl"
        @click="copyDownloadUrl"
        >复制视频链接</mu-button
      >
      <mu-button slot="actions" flat color="primary" @click="closeDownloadTip"
        >我知道了</mu-button
      >
    </mu-dialog>
  </div>
</template>

<script>
import Clipboard from "clipboard";
import Player from "./Player.vue";
export default {
  name: "Player",
  data() {
    return {
      openPlayerDialog: false,
      bvid: "",
      active: 0,
      selectPage: "",
      downloadUrl: "",
      downloadTip: false,
      videoInfo: {
        title: "",
        desc: "",
        copyright: "",
        owner: {
          name: "",
          face: "",
          mid: "",
        },
        stat: {
          view: "",
          coin: "",
          danmaku: "",
          favorite: "",
          reply: "",
          share: "",
        },
      },
      relateVideoInfo: [
        {
          title: "",
          desc: "",
          copyright: "",
          owner: {
            name: "",
            face: "",
            mid: "",
          },
          stat: {
            view: "",
            coin: "",
            danmaku: "",
            favorite: "",
            reply: "",
            share: "",
          },
        },
      ],
      videoReply: [
        {
          like: "",
          member: {
            uname: "",
            avatar: "",
          },
          content: {
            message: "",
          },
        },
      ],
      pageList: [
        {
          cid: "",
          part: "",
        },
      ],
    };
  },
  methods: {
    openDownlaodTip() {
      this.downloadTip = true;
    },
    closeDownloadTip() {
      this.downloadTip = false;
    },
    copyDownloadUrl() {
      var that = this;
      var clipboard = new Clipboard("button");
      clipboard.on("success", () => {
        that.$toast.success("复制成功！");
        clipboard.destroy();
      });
      clipboard.on("error", () => {
        that.$toast.error("复制失败！");
        clipboard.destroy();
      });
    },
    closePlayer() {
      this.openPlayerDialog = false;
      this.active = 0;
      this.selectPage = "";
    },
    openNewPlayer(bvid) {
      this.openPlayerDialog = false;
      this.openPlayerDialog = true;
      this.active = 0;
      this.bvid = bvid;
      this.getVideoInfo(bvid);
    },
    getVideoInfo(bvid) {
      var that = this;
      this.$axios
        .get(
          "v1?callback=&url=" +
            encodeURIComponent(
              "http://api.bilibili.com/x/web-interface/view?bvid=" + bvid
            )
        )
        .then(function (res) {
          if (res.data.data) {
            that.videoInfo = res.data.data;
            that.$axios
              .get(
                "v1?callback=&url=" +
                  encodeURIComponent(
                    "http://api.bilibili.com/x/v2/reply?type=1&sort=1&oid=" +
                      that.videoInfo.aid
                  )
              )
              .then(function (res) {
                that.videoReply = res.data.data.replies;
              });
          }else{
            that.$toast.error('解析失败！');
            setTimeout(() => {
              that.openPlayerDialog = false;
            }, 2000);
          }
        });
      this.$axios
        .get(
          "v1?callback=&url=" +
            encodeURIComponent(
              "http://api.bilibili.com/x/web-interface/archive/related?bvid=" +
                bvid
            )
        )
        .then(function (res) {
          var data = res.data.data;
          that.relateVideoInfo = data;
        });
      this.$axios
        .get(
          "v1?callback=&url=" +
            encodeURIComponent(
              "http://api.bilibili.com/x/player/pagelist?bvid=" + bvid
            )
        )
        .then(function (res) {
          var data = res.data.data;
          that.pageList = data;
          that.selectPage = data[0].cid;
        });
    },
    downloadVideo() {
      var that = this;
      this.$axios
        .get(
          "v1?callback=&url=" +
            encodeURIComponent(
              "http://api.bilibili.com/x/player/playurl?qn=32&fnval=0&bvid=" +
                that.bvid +
                "&cid=" +
                that.selectPage
            )
        )
        .then(function (res) {
          var data = res.data.data;
          that.downloadUrl = data.durl[0].url;
          that.openDownlaodTip();
        });
    },
  },
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Player,
    // eslint-disable-next-line vue/no-unused-components
    Clipboard,
  },
};
</script>

<style>
.text {
  padding: 16px;
  background: #fff;
}
.text > p {
  margin: 8px 0;
}
#player {
  width: 100%;
  height: 210px;
}
.align{
  display: flex;
  align-items: center;
}
</style>