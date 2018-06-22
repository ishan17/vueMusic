import jsonp from 'common/js/jsonp'
import {commonParams,options} from './config'


export function getSingerList() {
    const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

    const data = Object.assign({},commonParams,{
        channel: 'singer',
        page: 'list',
        key: 'all_all_all',
        pagesize: 100,
        pagenum: 1,
        hostUin: 0,
        needNewCode: 0,
        platform: 'yqq'
    })

    return jsonp(url,data,options)
}

export function getSingerDetail(singerId) {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

    const data = Object.assign({}, commonParams, {
        hostUin: 0,
        needNewCode: 0,
        platform: 'yqq',
        order: 'listen',
        begin: 0,
        num: 20,
        songstatus: 1,
        singermid: singerId
    })

  return jsonp(url, data, options)
}


export function getSongVkey(param) {
    const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'

    const data = {
        g_tk: 5381,
        loginUin: 0,
        hostUin: 0,
        format: 'json',
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq',
        needNewCode: '0',
        cid: 205361747,
        uin: 0,
        guid: 7635355198,
        songmid: param.songmid,
        filename: param.filename,
        jsonpCallback: 'MusicJsonCallback9503594265798396',
        callback: 'MusicJsonCallback9503594265798396'
    }

    // return jsonp(url,data,options)
    return jsonp(url,data)
}