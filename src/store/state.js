
/** 
 * state 定义各种状态
 * getter 获取各种状态
 * mutation-type 定义改变状态的操作
 * mutations 改变状态
 * action 触发动作 提交给mutation---有多个状态需要改变可以封装成一个action提交给mutation
 */


import {playMode} from 'common/js/config'
const state = {
    singer: {},
    playing: false,
    fullScreen: false,
    playlist: [],
    sequenceList: [],
    mode: playMode.sequence,
    currentIndex: -1,
    disc: {}
}

export default state