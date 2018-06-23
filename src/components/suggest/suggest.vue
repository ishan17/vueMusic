<template>
<scroll ref="suggest" class="suggest" :data="result" :pullup="pullup" :beforeScroll="beforeScroll" @beforeScroll="listScroll" @my-scroll-to-end="searchMore">
    <ul class="suggest-list">
        <li @click="selectItem(item)" class="suggest-item" v-for="(item,index) in result" :key="index">
            <div class="icon">
                <i :class="getIconCls(item)"></i>
            </div>
            <div class="name">
                <p class="text" v-html="getDisplayName(item)"></p>
            </div>
        </li>
        <loading v-show="hasMore" title=""></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
        <no-result title="抱歉,暂无数据"></no-result>
    </div>
</scroll> 
</template>

<script type="text/ecmascript-6">
  import Scroll from 'src/base/scroll/scroll'
  import Loading from 'src/base/loading/loading'
  import NoResult from 'src/base/no-result/no-result'
  import {search} from 'src/api/search'
  import {ERR_OK as ok} from 'src/api/config'
  import {createSong} from 'common/js/song'
  import {getSongVkey} from 'src/api/singer'
  import {mapMutations, mapActions} from 'vuex'
  import Singer from 'common/js/singer'

  const TYPE_SINGER = 'singer'
  const perpage = 20
  /****
   * Error in event handler for "my-scroll-to-end": "TypeError: fns.apply is not a function"
   * 原因 @my-scroll-to-end="searchMore"  searchMore在全局环境变量中已定义过（手误-hasMore写成searchMore），
   * 不能再用作my-scroll-to-end事件的回调函数名
   */

  export default {
    props: {
        query: {
            type: String,
            default: ''
        },
        showSinger: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            page: 1,
            // 是否开启上拉刷新加载
            pullup: true,
            beforeScroll: true,
            hasMore: true,
            result: []
        }
    },
    methods: {
        search() {
            this.hasMore = true
            this.page = 1
            this.$refs.suggest.scrollTo(0,0)
            search(this.query,this.page,this.showSinger,perpage).then((res) => {
                if (res.code === ok) {
                    this.result = this._genResult(res.data)
                    this._checkMore(res.data)
                }
            })
        },
        getIconCls(item) {
            if (item.type === TYPE_SINGER) {
                return 'icon-mine'
            } else {
                return 'icon-music'
            }
        },
        getDisplayName(item) {
            if (item.type === TYPE_SINGER) {
                return item.singername
            } else {
                return `${item.name}-${item.singer}`
            }
        },
        searchMore() {
            if (!this.hasMore) {
                return
            }
            this.page++
            search(this.query,this.page,this.showSinger,perpage).then((res) => {
                if (res.code === ok) {
                    this.result = this.result.concat(this._genResult(res.data))
                    this._checkMore(res.data)
                }
            })
        },
        selectItem(item) {
            if (item.type === TYPE_SINGER) {
                const singer = new Singer({
                    id: item.singermid,
                    name: item.singername
                })
                this.$router.push({
                    path: `/search/${singer.id}`
                })
                this.setSinger(singer)
            } else {
                this.insertSong()
            }
        },
        listScroll() {
            this.$emit('listScroll')
        },
        _checkMore(data) {
            const song = data.song
            if (!song.list.length || (song.curnum + song.curpage * perpage) >= song.totalnum) {
                this.hasMore = false
            }
        },
        _genResult(data) {
            let ret = []
            // 查找歌手
            if (data.zhida && data.zhida.singerid) {
                ret.push({...data.zhida, ...{type: TYPE_SINGER}})
            }
            if (data.song) {
                // ret = ret.concat(this._normalizeSongs(data.song.list))
                // 异步请求问题 去掉歌手
                // ret = this._normalizeSongs(data.song.list)
            }
            return ret
        },
        _normalizeSongs(list) {
            let ret = []
            // 减少获取vkey次数  只拿3条
            list = list.slice(0,3)
            list.forEach((musicData) => {
                if (musicData.songid && musicData.albummid) {
                    let param = {
                        songmid: musicData.songmid,
                        filename: `C400${musicData.songmid}.m4a`
                    }
                    getSongVkey(param).then((res) => {
                        if (res.code === ok) {
                            let vkey = res.data.items[0].vkey
                            ret.push(createSong(musicData,vkey))
                        }
                    })
                    ret.push(createSong(musicData,null))
                }
            })
            return ret   
        },
        ...mapMutations({
            setSinger: 'SET_SINGER'
        }),
        ...mapActions([
            'insertSong'
        ])
    },
    watch: {
        query(newQuery) {
            this.search(newQuery)
        }
    },
    components: {
        Scroll,
        Loading,
        NoResult
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>