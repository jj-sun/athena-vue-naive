import { DataTableColumn, NAlert, NCard, NDataTable, NDivider, NSkeleton,NTag } from "naive-ui";
import { defineComponent, ref,h, onMounted } from "vue";
import * as moment from 'moment'
import { getAction } from "@/api/manage";

interface DataItem extends BaseModel {
    param: string,
    text: string,
    value: string
}

const textInfo = {
    'system.cpu.count': { type: 'success', text: 'CPU 数量', unit: '核' },
    'system.cpu.usage': { type: 'success', text: '系统 CPU 使用率', unit: '%' },
    'process.start.time': { type: 'warning', text: '应用启动时间点', unit: '' },
    'process.uptime': { type: 'warning', text: '应用已运行时间', unit: '秒' },
    'process.cpu.usage': { type: 'warning', text: '当前应用 CPU 使用率', unit: '%' }
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
    name: 'SystemInfo',
    setup() {
        moment.locale('zh-cn')
        const time = ref('')
        const data = ref([])
        const loading = ref(true)

        const convert = (value: number, type: any) => {
            if (type === Number) {
                return Number(value * 100).toFixed(2)
              } else if (type === Date) {
                return moment(value * 1000).format('YYYY-MM-DD HH:mm:ss')
              }
              return value
        }

        const loadInfo = () => {
            loading.value = true
            time.value = moment().format('YYYY年MM月DD日 HH时mm分ss秒')
            Promise.all([
                getAction('actuator/metrics/system.cpu.count'),
                getAction('actuator/metrics/system.cpu.usage'),
                getAction('actuator/metrics/process.start.time'),
                getAction('actuator/metrics/process.uptime'),
                getAction('actuator/metrics/process.cpu.usage')
            ]).then((r: any) => {
                let info = ref([])
                r.forEach((value, id) => {
                    let param = value.name
                    let val = value.measurements[0].value
                    if (param === 'system.cpu.usage' || param === 'process.cpu.usage') {
                        val = convert(val, Number)
                    }
                    if (param === 'process.start.time') {
                        val = convert(val, Date)
                    }
                    info.value.push({ id: param + id, param: param, text: 'false value', value: val })
                })
                data.value = info.value
            }).catch(e => {
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
                            上次更新时间：{ time.value }
                            <NDivider vertical/>
                            <a onClick={ handleClickRefresh } style={ "color: #18a058" }>立即更新</a>
                        </NAlert>
                        <NDataTable remote loading={ loading.value } columns={ createColumns() } data={ data.value } />
                    </NCard>
                </div>
            )
        }
    }
})