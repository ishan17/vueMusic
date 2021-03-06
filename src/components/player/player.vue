<template>
    <div class="player" v-show="playlist.length>0">
        <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
            <div class="normal-player" v-show="fullScreen">
            <div class="background">
                <img width="100%" height="100%" :src="currentSong.image">
            </div>
            <div class="top">
                <div class="back" @click="back">
                    <i class="icon-back"></i>
                </div>
                <!-- title包含转移字符 -->
                <h1 class="title" v-html="currentSong.name"></h1>
                <h2 class="subtitle" v-html="currentSong.singer"></h2>
            </div>
            <div class="middle" @touchstart.prevent="middleTouchStart" @touchmove.prevent="middleTouchMove" @touchend="middleTouchEnd">
                <div class="middle-l" ref="middleL">
                    <div class="cd-wrapper" ref="cdWrapper">
                        <div class="cd" :class="cdRotate" >
                            <img class="image" :src="currentSong.image">
                        </div>
                    </div>
                    <div class="playing-lyric-wrapper">
                        <div class="playing-lyric">{{playingLyric}}</div>
                    </div>
                </div>
                <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
                    <div class="lyric-wrapper">
                        <div v-if="currentLyric">
                            <p ref="lyricLine" class="text" :class="{'current': currentLineNum === index}" v-if="currentLyric.lines" v-for="(line,index) in currentLyric.lines" :key="index">{{line.txt}}</p>
                        </div>
                    </div>
                </scroll>
            </div>
            <div class="bottom">
                <div class="dot-wrapper">
                    <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
                    <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
                </div>
                <div class="progress-wrapper">
                    <span class="time time-l">{{formate(currentTime)}}</span>
                    <div class="progress-bar-wrapper">
                        <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
                    </div>
                    <span class="time time-r">{{formate(currentSong.duration)}}</span>
                </div>
                <div class="operators">
                    <div class="icon i-left" @click="changeMode">
                        <i :class="iconMode"></i>
                    </div>
                    <div class="icon i-left" :class="disabledCls">
                        <i @click="prev" class="icon-prev"></i>
                    </div>
                    <div class="icon i-center" :class="disabledCls">
                        <i @click="togglePlaying" :class="iconPlay"></i>
                    </div>
                    <div class="icon i-right" :class="disabledCls">
                        <i @click="next" class="icon-next"></i>
                    </div>
                    <div class="icon i-right">
                        <i class="icon" :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i>
                    </div>
                </div>
            </div>
        </div>
        </transition>
        <transition name="mini">
            <div class="mini-player" v-show="!fullScreen" @click="open">
            <div class="icon">
                <img :class="cdRotate" width="40" height="40" :src="currentSong.image">
            </div>
            <div class="text">
                <h2 class="name" v-html="currentSong.name"></h2>
                <p class="desc" v-html="currentSong.singer"></p>
            </div>
            <div class="control">
                <progress-circle :radius="radius" :percent="percent">
                <i @click.stop="togglePlaying" class="icon-mini" :class="iconMini"></i>
                </progress-circle>
            </div>
            <div class="control" @click.stop="showPlaylist">
                <i class="icon-playlist"></i>
            </div>
        </div>
        </transition>
        <play-list ref="showlist"></play-list>
        <audio ref="audio" :src="currentSong.url" @play="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
    </div>
</template>

<script type="text/ecmascript-6">

import {mapGetters,mapMutations,mapActions} from 'vuex'
import animations from 'create-keyframe-animation'
import {prefixStyle} from 'common/js/dom'
import progressBar from 'src/base/progress-bar/progress-bar'
import progressCircle from 'src/base/progress-circle/progress-circle'
import {playMode} from 'common/js/config'
// import {shuffle} from 'common/js/util'
// Lyric是一个class对象
import Lyric from 'lyric-parser'
import Scroll from 'src/base/scroll/scroll'
import PlayList from 'src/components/play-list/play-list'
import {playerMixin} from 'common/js/mixin'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transform-duration')

export default {
    mixins: [playerMixin],
    created() {
        this.touch = {}
    },
    data() {
        return {
            playReady: false,
            currentTime: 0,
            radius: 32,
            currentLyric: null,
            currentLineNum: 0,
            currentShow: 'cd',
            playingLyric: ''
        }
    },
    computed: {
        iconPlay() {
            return this.playing ? 'icon-pause' : 'icon-play'
        },
        iconMini() {
            return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
        },
        cdRotate() {
            return this.playing ? 'play' : 'play pause'
        },
        percent() {
            return this.currentTime / this.currentSong.duration
        },
        // iconMode() {
        //     return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
        // },
        ...mapGetters([
            'fullScreen',
            'playlist',
            'currentSong',
            'playing',
            'currentIndex',
            'mode',
            'sequenceList'
        ])
    },
    methods: {
        showPlaylist() {
            this.$refs.showlist.show()
        },
        back() {
            this.setFullScreen(false)
        },
        open() {
             this.setFullScreen(true)
        },
        enter(el, done) {
            const {x, y, scale} = this._getPosAndScale()

            // x轴向右为正 y轴向下为正  最终落点为原点
            let animation = {
                0: {
                    transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
                },
                60: {
                    transform: `translate3d(0,0,0) scale(1.1)`
                },
                100: {
                    transform: `translate3d(0,0,0) scale(1)`
                }
            }

            animations.registerAnimation({
                name: 'move',
                animation,
                presets: {
                    duration: 400,
                    easing: 'linear'
                }
            })
            // done动画执行完毕的回调函数  enter=>afterEnter    leave=>afterLeave
            animations.runAnimation(this.$refs.cdWrapper, 'move', done)
        },
        afterEnter(el, done) {
            // 注销animations  和  css动画样式
            animations.unregisterAnimation('move')
            this.$refs.cdWrapper.style.animation = ''
        },
        leave(el, done) {
            this.$refs.cdWrapper.style.transition = 'all 0.4s'
            const {x, y, scale} = this._getPosAndScale()
            this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
            this.$refs.cdWrapper.addEventListener('transitionend', done)
        },
        afterLeave(el, done) {
            this.$refs.cdWrapper.style.transition = ''
            this.$refs.cdWrapper.style[transform] = ''
        },
        disabledCls() {
            return this.playReady ? '' : 'disabled'
        },
        togglePlaying() {
            if (!this.playReady) {
                return
            }
            if (this.currentLyric) {
                this.currentLyric.togglePlay()
            }
            this.setPlayingState(!this.playing)
        },
        end() {
            if (this.mode === playMode.loop) {
                this.loop()
            } else {
                this.next()
            }
        },
        loop() {
            this.$refs.audio.currentTime = 0
            this.$refs.audio.play()
            if (this.currentSong) {
                this.currentLyric.seek(0)
            }
        },
        prev() {
            if (!this.playReady) {
                return
            }
            if (this.playlist.length === 1) {
                this.loop()
            } else {
                let index = this.currentIndex - 1
                if (index === -1) {
                    index = this.playlist.length - 1
                }
                this.setCurrentIndex(index)
                if (!this.playing) {
                    this.togglePlaying()
                }
            }
            this.playReady = false
        },
        next() {
            if (!this.playReady) {
                return
            }
            if (this.playlist.length === 1) {
                this.loop()
                return
            } else {
                let index = this.currentIndex + 1
                if (index === this.playlist.length) {
                    index = 0
                }
                this.setCurrentIndex(index)
                if (!this.playing) {
                    this.togglePlaying()
                }
            }
            
            this.playReady = false
        },
        ready() {
            this.playReady = true
            this.savePlayHistory(this.currentSong)
        },
        error() {
            this.playReady = true
        },
        updateTime(e) {
            this.currentTime = e.target.currentTime
        },
        onProgressBarChange(percent) {
            const currentTime = this.currentSong.duration * percent
            this.$refs.audio.currentTime = currentTime
            if (!this.playing) {
                this.togglePlaying()
            }
            if (this.currentLyric) {
                this.currentLyric.seek(currentTime * 1000)
            }
        },
        // changeMode() {
        //     let mode = (this.mode + 1) % 3
        //     this.setPlayMode(mode)
        //     let list = null
        //     if (mode === playMode.random) {
        //         list = shuffle(this.sequenceList)
        //     } else {
        //         list = this.sequenceList
        //     }
        //     this.resetCurrentIndex(list)
        //     this.setPlayList(list)     
        // },
        // resetCurrentIndex(list) {
        //     let index = list.findIndex((item) => {
        //         return item.id === this.currentSong.id
        //     })
        //     this.setCurrentIndex(index)
        // },
        getLyric() {
            this.currentSong.getLyric().then((lyric) => {
                // 异步问题
                if (this.currentSong.lyric !== lyric) {
                    return
                }
                        this.currentLyric = new Lyric(lyric, this.handleLyric)
                if (this.playing) {
                    this.currentLyric.play()
                }
                // console.log(this.currentLyric)
            }).catch(() => {
                this.currentLyric = null
                this.playingLyric = ''
                this.currentLineNum = 0
            })
        },
        handleLyric({lineNum,txt}) {
            this.currentLineNum = lineNum
            if (lineNum > 5) {
                let lineEl = this.$refs.lyricLine[lineNum - 5]
                this.$refs.lyricList.scrollToElement(lineEl,1000)
            } else {
                this.$refs.lyricList.scrollTo(0,0,1000)
            }
            this.playingLyric = txt
        },
        middleTouchStart(e) {
            this.touch.initiated = true
            const touch = e.touches[0]
            this.touch.startX = touch.pageX
            this.touch.startY = touch.pageY
        },
        middleTouchMove(e) {
            if (!this.touch.initiated) {
                return
            }
            const touch = e.touches[0]
            const deltaX = touch.pageX - this.touch.startX
            const deltaY = touch.pageY - this.touch.startY
            // 纵向滚动
            if (Math.abs(deltaY) > Math.abs(deltaX)) {
                return
            }
            const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
            const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
            this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
            this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
            this.$refs.lyricList.$el.style[transitionDuration] = 0
            // 改变CD透明度
            this.$refs.middleL.style.opacity = 1 - this.touch.opacity
            this.$refs.middleL.style[transitionDuration] = 0
        },
        middleTouchEnd(e) {
            let offsetWidth
            let opacity
            if (!this.touch.initiated) {
                return
            }
            if (this.currentShow === 'cd') {
                if (this.touch.percent > 0.1) {
                    offsetWidth = -window.innerWidth
                    this.currentShow = 'lyric'
                    opacity = 0
                } else {
                    offsetWidth = 0
                    opacity = 1
                }
            } else {
                if (this.touch.percent < 0.9) {
                    offsetWidth = 0
                    this.currentShow = 'cd'
                    opacity = 1
                } else {
                    offsetWidth = -window.innerWidth
                    opacity = 0
                }
            }
            const time = 300
            this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
            this.$refs.lyricList.$el.style[transitionDuration] = `${time}`
            // 改变CD透明度
            this.$refs.middleL.style.opacity = opacity
            this.$refs.middleL.style[transitionDuration] = `${time}`
            // 切换到歌词之后会出现  歌词不滚动现象
            this.$refs.lyricList.refresh()
        },
        formate(interval) {
            interval = interval | 0
            const minute = interval / 60 | 0
            const second = this._pad(interval % 60)
            return `${minute}:${second}`
        },
        // 补0
        _pad(num, n = 2) {
            let len = num.toString().length
            while (len < n) {
                num = '0' + num
                len++
            }
            return num
        },
        _getPosAndScale() {
            // 小图片宽度
            const targetWidth = 40  
            // 小图片中心距左边界距离
            const paddingLeft = 40  
            // 小图片中心距下边界距离
            const paddingBottom = 30 
            // 大图片中心距上边界距离
            const paddingTop = 80  
            // 大图片宽度
            const width = window.innerWidth * 0.8  
            // 缩放比例
            const scale = targetWidth / width
            const x = -(window.innerWidth / 2 - paddingLeft)
            const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
            return {
                x,
                y,
                scale
            }
        },
        ...mapMutations({
            setFullScreen: 'SET_FULL_SCREEN',
            setPlayingState: 'SET_PLAYING_STATE',
            setCurrentIndex: 'SET_CURRENT_INDEX',
            setPlayMode: 'SET_PLAY_MODE',
            setPlayList: 'SET_PLAYLIST'
        }),
        ...mapActions([
            'savePlayHistory'
        ])
    },
    watch: {
        currentSong(newSong,oldSong) {
            // 列表没有歌曲时
            if (!newSong.id) {
                return
            }
            if (newSong.id === oldSong.id) {
                return
            }

            // 每次切换歌曲 需要切断之前的歌曲的歌词
            if (this.currentLyric) {
                this.currentLyric.stop()
                this.currentTime = 0
                this.playingLyric = ''
                this.currentLineNum = 0
            }
            // Vue 实现响应式并不是数据发生变化之后 DOM 立即变化，而是按一定的策略进行 DOM 的更新
            // $nextTick 是在下次 DOM 更新循环结束之后执行延迟回调，在修改数据之后使用 $nextTick，则可以在回调中获取更新后的 DOM
            // this.$nextTick(() => {
            //     this.$refs.audio.play()
            //     this.getLyric()
            // })


            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.$refs.audio.play()
                this.getLyric()
            }, 1000)
        },
        playing(newPlaying) {
            const audio = this.$refs.audio
            this.$nextTick(() => {
                newPlaying ? audio.play() : audio.pause()
            })
        }
    },
    components: {
        progressBar,
        progressCircle,
        Scroll,
        PlayList
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
        //   transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55) // 贝塞尔去向-生成速度曲线的函数  带缓冲效果
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>


