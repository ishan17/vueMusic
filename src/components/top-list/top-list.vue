<template>
  <transition name="slide">
    <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import {getMusicList} from 'src/api/rank'
  import {ERR_OK as ok} from 'src/api/config'
  import {mapGetters} from 'vuex'
  import {createSong} from 'common/js/song'
  import {getSongVkey} from 'src/api/singer'

  export default {
    computed: {
      title() {
        return this.topList.topTitle
      },
      bgImage() {
        if (this.songs.length) {
          return this.songs[0].image
        }
        return ''
      },
      ...mapGetters([
        'topList'
      ])
    },
    data() {
      return {
        songs: [],
        rank: true
      }
    },
    created() {
      this._getMusicList()
    },
    methods: {
      _getMusicList() {
        if (!this.topList.id) {
          this.$router.push('/rank')
          return
        }
        getMusicList(this.topList.id).then((res) => {
          if (res.code === ok) {
            this.songs = this._normalizeSongs(res.songlist)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list =  list.slice(0,3)
        list.forEach((item) => {
          const musicData = item.data
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
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>