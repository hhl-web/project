/*
 *axios的二次封装
 * 请求前后loading的开启和关闭
 * axios请求拦截和响应拦截
 * 取消请求函数 （订阅发布的模式）;
 */

import { baseURL } from './config.js'
import axios from 'axios'
import store from '@/store'
import { Loading, Message } from 'element-ui'
//每请求一次创建一个唯一的axios
class AjaxFetch {
  constructor() {
    this.config = {
      withCredentials: true,	//跨域凭证
      responseType: 'json',
      baseURL: baseURL,
      timeout: 3000,
    }
    this.queue = {}
  }
  request(option) {
    //创建一个axios实例
    let config = {
      ...this.config,
      ...option,
    }
    let instance = axios.create()
    this.interceptors(instance,config.url)
    return instance(config)
  }
  interceptors(instance,url) {
    instance.interceptors.request.use(
      (config) => {
        let CancelToken = axios.CancelToken
        //设置取消函数
        config.cancelToken = new CancelToken((c) => {
          //c是一个函数
          store.commit('push_cancel', { fn: c, url:url }) //存放取消的函数实例
        })
        if (Object.keys(this.queue).length == 0) {
          this._loading = Loading.service({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)',
          })
        }
        this.queue[url] = url;
        return config;
      },
      (err) => {
        return Promise.reject(err)
      }
    )
    instance.interceptors.response.use(
      (response) => {
        let {data} = response;
        store.commit('filter_cancel',url) //存放取消的函数实例
        delete this.queue[url]
        if (Object.keys(this.queue).length == 0) {
          this._loading.close()
        }
        switch (data.code) {
          case 500:
            Message({
              type: 'error',
              message: data.msg,
            })
            break;
          case 401:
            Message({
              type: 'warning',
              message: data.msg,
            })
            break;
        }
        return data;
      },
      (err) => {
        delete this.queue[url];
        if (Object.keys(this.queue).length == 0) {
          this._loading.close();
        }
        return Promise.reject(err)
      }
    )
  }
}
export default new AjaxFetch()
