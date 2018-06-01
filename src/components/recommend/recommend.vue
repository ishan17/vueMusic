<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper">
          <slider>
            <div v-for="item in recommends" :key="item.id">
              <a :href="item.linkUrl">
                <img class="needsclick" @load="loadImage" :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <!-- <li @click="selectItem(item)" v-for="item in discList" class="item"> -->
            <li v-for="item in discList" :key="item.listennum" class="item">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.imgurl">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <!-- <router-view></router-view> -->
  </div>
</template>

<script type="text/ecmascript-6">
import {getRecommend,getDiscList} from 'src/api/recommend'
import {ERR_OK as ok} from 'src/api/config'

import Slider from 'src/base/slider/slider'
import Scroll from 'src/base/scroll/scroll'
import Loading from 'src/base/loading/loading'

/**
 * 一个生命周期钩子函数，就是一个vue实例被生成后调用这个函数。
 * 一个vue实例被生成后还要绑定到某个html元素上，之后还要进行编译，然后再插入到document中。
 * 每一个阶段都会有一个钩子函数，方便开发者在不同阶段处理不同逻辑。
 * 一般可以在created函数中调用ajax获取页面初始化所需的数据。
 **/
export default {
    data() {
        return {
            recommends: [],
            discList: []
        }
    },
    created() {
        // this 包含当前组件的一些属性方法
        this._getRecommend()
        // 歌单接口数据改变
        this._getDiscList()
    },
    methods: {
        _getRecommend() {
            getRecommend().then((res) => {
                if (res.code === ok) {
                    this.recommends = res.data.slider
                }
            })
        },
        _getDiscList() {
          getDiscList().then((res) => {
            if (res.code === ok) {
                this.discList = res.data.list
            }
          })
        },
        // 添加一个图片加载监听  防止slider数据晚于歌单数据获取，  影响better-scroll高度获取  使歌单数据不能滑动到底部
        loadImage() {
          if (!this.checkLoad) {
            this.$refs.scroll.refresh();
            this.checkLoad = true;
          }
        }
    },
    components: {
        Slider,
        Scroll,
        Loading
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>