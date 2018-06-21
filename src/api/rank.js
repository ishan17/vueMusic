import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

export function getTopList() {
    const url = '/api/getTopList'
    const data = Object.assign({}, commonParams, {
      g_tk: 5381,
      uin: 0,
      needNewCode: 1,
      platform: 'h5',
      format: 'json'
    })
    return axios.get(url, {
        params: data
      }).then((res) => {
        // 此处的res包含status\statusText\headers\config\request\data等多字段
        return Promise.resolve(res.data)
      })
  }


  export function getMusicList(topid) {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
  
    const data = Object.assign({}, commonParams, {
      topid,
      g_tk: 5381,
      needNewCode: 1,
      uin: 0,
      tpl: 3,
      page: 'detail',
      type: 'top',
      platform: 'h5'
    })
  
    return jsonp(url, data, options)
  }