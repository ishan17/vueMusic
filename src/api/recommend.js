import jsonp from 'common/js/jsonp'
import {commonParams,options} from './config'
import axios from 'axios'

export function getRecommend() {
    const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

    const data = Object.assign({}, commonParams, {
        platform: 'h5',
        uin: 0,
        needNewCode: 1
    })

    return jsonp(url, data, options)
}


export function getDiscList() {
    const url = '/api/getDiscList'
    // const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'

    // const data = Object.assign({}, commonParams, {
    //     g_tk:5381,
    //     uin:0,
    //     format:'json',
    //     inCharset: 'utf-8',
    //     outCharset: 'utf-8',
    //     notice: 0,
    //     platform: 'h5',
    //     needNewCode: 1
    // })
    const data = Object.assign({}, commonParams, {
        platform: 'yqq',
        hostUin: 0,
        sin: 0,
        ein: 29,
        sortId: 5,
        needNewCode: 0,
        categoryId: 10000000,
        rnd: Math.random(),
        format: 'json'
      })
  
    return axios.get(url, {
      params: data
    }).then((res) => {
      // 此处的res包含status\statusText\headers\config\request\data等多字段
      return Promise.resolve(res.data)
    })

    // return jsonp(url, data, options)
  }

  export function getSongList(disstid) {
    const url = '/api/getSongList'
  
    const data = Object.assign({}, commonParams, {
      disstid,
      type: 1,
      json: 1,
      utf8: 1,
      onlysong: 0,
      platform: 'yqq',
      loginUin: 0,
      hostUin: 0,
      needNewCode: 0,
      format: 'json'
    })
  
    return axios.get(url, {
      params: data
    }).then((res) => {
      // 此处的res包含status\statusText\headers\config\request\data等多字段
      return Promise.resolve(res.data)
    })
  }