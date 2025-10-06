import axios, {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig,
  CancelTokenSource
} from 'axios'
import NProgress from './progress'
import { showFailToast } from 'vant'
import { $t } from '@src/i18n'
import { localStorage } from 'tm-libs/storage'
// import { useAppStore } from '../store'
import 'vant/es/toast/style'

export enum ContentTypeEnum {
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
  JSON = 'application/json;charset=UTF-8'
}

export enum ResultEnum {
  SUCCESS = 0,
  ERROR = 1
}

const defaultConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_APP_API,
  timeout: 15000,
  headers: {
    'Content-Type': ContentTypeEnum.JSON
  }
}

export class Http {
  private axiosInstance: AxiosInstance
  private cancelSource?: CancelTokenSource

  constructor(config: AxiosRequestConfig = defaultConfig) {
    this.axiosInstance = axios.create(config)
    this.setupInterceptors()
  }

  /** Setup Interceptors */
  private setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      config => {
        NProgress.start()
        // useAppStore().setLoading(config.method)
        const token = localStorage.get('auth.token')
        if (token) {
          config.headers['x-access-token'] = `Bearer ${token}`
        }
        return config
      },
      (error: AxiosError) => {
        // useAppStore().setLoading()
        showFailToast(error.message)
        return Promise.reject(error)
      }
    )

    this.axiosInstance.interceptors.response.use(
      (res: AxiosResponse) => {
        NProgress.done()
        // useAppStore().setLoading()
        return res.data
      },
      (error: AxiosError) => {
        NProgress.done()
        // useAppStore().setLoading()
        this.handleError(error)
        return Promise.reject(error.response)
      }
    )
  }

  /** Handle common error messages */
  private handleError(error: AxiosError) {
    const status = error.response?.status
    let message = ''

    switch (status) {
      case 400: message = $t('http.400', 'Request error'); break
      case 401:
        message = $t('http.401', 'Unauthorized, please log in')
        localStorage.remove('auth.token')
        location.reload()
        break
      case 403: message = $t('http.403', 'Access denied'); break
      case 404: message = $t('http.404', `Not found: ${error.config?.url}`); break
      case 408: message = $t('http.408', 'Request timeout'); break
      case 500: message = $t('http.500', 'Internal Server Error'); break
      default: message = $t('http.default', 'Network connection failure')
    }

    if (status !== 409) showFailToast(message)
  }

  /** Common request */
  public async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    const res = await this.axiosInstance.request<any>(config)
    return res as T
  }

  /** Debounce request (cancel previous) */
  public debounce<T = any>(config: AxiosRequestConfig): Promise<T> {
    if (this.cancelSource) this.cancelSource.cancel('Request canceled by debounce.')
    this.cancelSource = axios.CancelToken.source()
    config.cancelToken = this.cancelSource.token
    return this.request<T>(config)
  }

  /** Helper for GET */
  public get<T = any>(url: string, params?: any, config?: AxiosRequestConfig) {
    return this.request<T>({ url, method: 'GET', params, ...config })
  }

  /** Helper for POST */
  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request<T>({ url, method: 'POST', data, ...config })
  }

  /** Helper for PUT */
  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request<T>({ url, method: 'PUT', data, ...config })
  }

  /** Helper for PATCH */
  public patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.request<T>({ url, method: 'PUT', data, ...config })
  }

  /** Helper for DELETE */
  public delete<T = any>(url: string, params?: any, config?: AxiosRequestConfig) {
    return this.request<T>({ url, method: 'DELETE', params, ...config })
  }
}

// ✅ Export global instance
export const http = new Http(defaultConfig)
