// import jsonp from 'common/js/jsonp'
import {commonParams} from './config'
import axios from 'axios'



export function getLyric(mid) {
    const url = '/api/getLyric'
    // const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'

    const data = Object.assign({}, commonParams, {
        songmid: mid,
        platform: 'yqq',
        g_tk: 5381,
        loginUin: 0,
        hostUin: 0,
        needNewCode: 0,
        pcachetime: +new Date(),
        format: 'json'
    })

    return axios.get(url, {
      params: data
    }).then((res) => {
      // 此处的res包含status\statusText\headers\config\request\data等多字段
      return Promise.resolve(res.data)
    })
  }