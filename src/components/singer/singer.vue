<template>
    <div class="singer">
        <list-view @select="selectSinger" :data="singerList"></list-view>
        <router-view></router-view>
    </div>
</template>

<style>
</style>

<script>
import { getSingerList } from "src/api/singer"
import { ERR_OK as ok } from "src/api/config"
import Singer from "common/js/singer"
// ListView驼峰式的 写标签名时<list-view>
import ListView from "src/base/listview/listview"

import {mapMutations} from 'vuex'

const HOT_NAME = "热门";
const HOT_SINGER_LEN = 10;
export default {
    data() {
        return {
            singerList: []
        };
    },
    created() {
        this._getSingerList()
    },
    methods: {
        selectSinger(singer) {  // singer实例
            this.$router.push({
                path: `/singer/${singer.id}`
            })
            this.setSinger(singer)
        },
        _getSingerList: function() {
            getSingerList().then(res => {
                if (res.code === ok) {
                    this.singerList = this._normalizeSinger(res.data.list)
                }
            })
        },
        _normalizeSinger(list) {
            let map = {
                hot: {
                    title: HOT_NAME,
                    items: []
                }
            }
            list.forEach((item, index) => {
                if (index < HOT_SINGER_LEN) {
                    map.hot.items.push(
                        new Singer({
                            name: item.Fsinger_name,
                            id: item.Fsinger_mid
                        })
                    )
                }
                const key = item.Findex
                if (!map[key]) {
                    map[key] = {
                        title: key,
                        items: []
                    }
                }
                map[key].items.push(
                    new Singer({
                        name: item.Fsinger_name,
                        id: item.Fsinger_mid
                    })
                )
            })
            // 为了得到有序列表，我们需要处理 map
            let ret = []
            let hot = []
            for (let key in map) {
                let val = map[key]
                if (val.title.match(/[a-zA-Z]/)) {
                    ret.push(val)
                } else if (val.title === HOT_NAME) {
                    hot.push(val)
                }
            }
            ret.sort((a, b) => {
                return a.title.charCodeAt(0) - b.title.charCodeAt(0)
            })
            return hot.concat(ret)
        },
        // 使用 mapMutations 辅助函数将组件中的 methods 映射为 store.commit 调用（需要在根节点注入 store）
        ...mapMutations({
            setSinger: 'SET_SINGER'
        })
    },
    components: {
        ListView
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    .singer
        position: fixed
        top: 88px
        bottom: 0
        width: 100%
</style>

