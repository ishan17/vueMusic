<template>
<div class="singer-detail">
    <transition name="slide">
        <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
    </transition>
</div>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {getSingerDetail,getSongVkey} from 'src/api/singer'
  import {ERR_OK as ok} from 'src/api/config'
  import {createSong} from 'common/js/song'
  import {mapGetters} from 'vuex'

  export default {
    computed: {
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      },
      // 使用对象展开运算符将 getter 混入 computed 对象中
      ...mapGetters([
        'singer'
      ])
    },
    data() {
      return {
        songs: []
      }
    },
    created() {
      this._getDetail()
    },
    methods: {
      _getDetail() {
        if (!this.singer.id) {
          this.$router.push('/singer')
          return
        }
        getSingerDetail(this.singer.id).then((res) => {
          if (res.code === ok) {
            this.songs = this._normalizeSongs(res.data.list)
            // console.log(this.songs)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
            // 解构赋值
          let {musicData} = item
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
          }
        })
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
  .singer-detail
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 100
    background-color $color-background
  .slide-enter-active, .slide-leave-active
    transition: all .3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>