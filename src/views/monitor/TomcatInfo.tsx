import { DataTableColumn, NAlert, NCard, NDataTable, NDivider, NSkeleton, NTag } from "naive-ui";
import { defineComponent, ref, h, onMounted } from "vue";
import * as moment from 'moment'
import { getAction } from "@/api/manage";

interface DataItem extends BaseModel {
    param: string,
    text: string,
    value: string
}

const textInfo = {
    'tomcat.sessions.created': { type: 'success', text: 'tomcat 已创建 session 数', unit: '个' },
          'tomcat.sessions.expired': { type: 'success', text: 'tomcat 已过期 session 数', unit: '个' },
          'tomcat.sessions.active.current': { type: 'success', text: 'tomcat 当前活跃 session 数', unit: '个' },
          'tomcat.sessions.active.max': { type: 'success', text: 'tomcat 活跃 session 数峰值', unit: '个' },
          'tomcat.sessions.rejected': { type: 'success', text: '超过session 最大配置后，拒绝的 session 个数', unit: '个' },

          'tomcat.global.sent': { type: 'warning', text: '发送的字节数', unit: 'bytes' },
          'tomcat.global.request.max': { type: 'warning', text: 'request 请求最长耗时', unit: '秒' },
          'tomcat.global.request.count': { type: 'warning', text: '全局 request 请求次数', unit: '次' },
          'tomcat.global.request.total_time': { type: 'warning', text: '全局 request 请求总耗时', unit: '秒' },

          'tomcat.servlet.request.max': { type: 'error', text: 'servlet 请求最长耗时', unit: '秒' },
          'tomcat.servlet.request.count': { type: 'error', text: 'servlet 总请求次数', unit: '次' },
          'tomcat.servlet.request.total_time': { type: 'error', text: 'servlet 请求总耗时', unit: '秒' },

          'tomcat.threads.current': { type: 'info', text: 'tomcat 当前线程数（包括守护线程）', unit: '个' },
          'tomcat.threads.config.max': { type: 'info', text: 'tomcat 配置的线程最大数', unit: '个' }
}

const createColumns = (): Array<DataTableColumn<DataItem>> => {
    return [
        {
            title: '参数',
            key: 'param',
            render(rowData: DataItem) {
                return h(NTag, { type: textInfo[rowData.param].type, size: 'small' }, { default: () => rowData.param })
            }
        },
        {
            title: '描述',
            key: 'text',
            render(rowData: DataItem) {
                return textInfo[rowData.param].text
            }
        },
        {
            title: '当前值',
            key: 'value',
            render(rowData: DataItem) {
                return `${rowData.value} ${textInfo[rowData.param].unit}`
            }
        }
    ]
}

export default defineComponent({
    name: 'JvmInfo',
    setup() {
        moment.locale('zh-cn')
        const time = ref('')
        const data = ref([])
        const loading = ref(true)

        const convert = (value: number, type: any) => {
            if (type === Number) {
                return Number(value / 1048576).toFixed(3)
            } else if (type === Date) {
                return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
            }
            return value
        }

        const loadInfo = () => {
            loading.value = true
            time.value = moment().format('YYYY年MM月DD日 HH时mm分ss秒')
            Promise.all([
                getAction('actuator/metrics/tomcat.sessions.created'),
                getAction('actuator/metrics/tomcat.sessions.expired'),
                getAction('actuator/metrics/tomcat.sessions.active.current'),
                getAction('actuator/metrics/tomcat.sessions.active.max'),
                getAction('actuator/metrics/tomcat.sessions.rejected'),
                getAction('actuator/metrics/tomcat.global.sent'),
                getAction('actuator/metrics/tomcat.global.request.max'),
                getAction('actuator/metrics/tomcat.global.request'),
                getAction('actuator/metrics/tomcat.threads.current'),
                getAction('actuator/metrics/tomcat.threads.config.max')
            ]).then((r: any) => {
                let info = ref([])
                r.forEach((value, id) => {
                    value.measurements.forEach((item, idx) => {
                        let param
                        if(value.measurements.length > 1) {
                            param = value.name + '.' + item.statistic.toLowerCase()
                        } else {
                            param = value.name
                        }
                        let val = item.value
                        info.value.push({ id: param + id, param: param, text: 'false value', value: val })
                    })
                })
                data.value = info.value
            }).catch(e => {
                console.log(e)
                window.$message.error('获取服务器信息失败')
            }).finally(() => {
                loading.value = false
            })
        }
        const handleClickRefresh = () => {
            loadInfo()
        }
        onMounted(() => {
            loadInfo()
        })

        return () => {
            return (
                <div>
                    <NCard>
                        <NAlert type="info" style="margin-bottom: 16px">
                            上次更新时间：{time.value}
                            <NDivider vertical />
                            <a onClick={handleClickRefresh} style={"color: #18a058"}>立即更新</a>
                        </NAlert>
                        <NDataTable remote loading={loading.value} columns={createColumns()} data={data.value} />
                    </NCard>
                </div>
            )
        }
    }
})