<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {getSongList} from 'src/api/recommend'
  import {ERR_OK as ok} from 'src/api/config'
  import {mapGetters} from 'vuex'
  import {createSong} from 'common/js/song'
  import {getSongVkey} from 'src/api/singer'

  export default {
    computed: {
      title() {
        return this.disc.dissname
      },
      bgImage() {
        return this.disc.imgurl
      },
      ...mapGetters([
        'disc'
      ])
    },
    data() {
      return {
        songs: []
      }
    },
    created() {
      this._getSongList()
    },
    methods: {
      _getSongList() {
        // 刷新页面时返回上级页面
        if (!this.disc.dissid) {
          this.$router.push('/recommend')
          return
        }
        getSongList(this.disc.dissid).then((res) => {
          if (res.code === ok) {
            this.songs = this._normalizeSongs(res.cdlist[0].songlist)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list =  list.slice(0,3)
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
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>