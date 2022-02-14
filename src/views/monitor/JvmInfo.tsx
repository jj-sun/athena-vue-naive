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
    'jvm.memory.max': { type: 'success', text: 'JVM 最大内存', unit: 'MB' },
    'jvm.memory.committed': { type: 'success', text: 'JVM 可用内存', unit: 'MB' },
    'jvm.memory.used': { type: 'success', text: 'JVM 已用内存', unit: 'MB' },
    'jvm.buffer.memory.used': { type: 'warning', text: 'JVM 缓冲区已用内存', unit: 'MB' },
    'jvm.buffer.count': { type: 'warning', text: '当前缓冲区数量', unit: '个' },
    'jvm.threads.daemon': { type: 'success', text: 'JVM 守护线程数量', unit: '个' },
    'jvm.threads.live': { type: 'success', text: 'JVM 当前活跃线程数量', unit: '个' },
    'jvm.threads.peak': { type: 'success', text: 'JVM 峰值线程数量', unit: '个' },
    'jvm.classes.loaded': { type: 'warning', text: 'JVM 已加载 Class 数量', unit: '个' },
    'jvm.classes.unloaded': { type: 'warning', text: 'JVM 未加载 Class 数量', unit: '个' },
    'jvm.gc.memory.allocated': { type: 'error', text: 'GC 时, 年轻代分配的内存空间', unit: 'MB' },
    'jvm.gc.memory.promoted': { type: 'error', text: 'GC 时, 老年代分配的内存空间', unit: 'MB' },
    'jvm.gc.max.data.size': { type: 'error', text: 'GC 时, 老年代的最大内存空间', unit: 'MB' },
    'jvm.gc.live.data.size': { type: 'error', text: 'FullGC 时, 老年代的内存空间', unit: 'MB' },
    'jvm.gc.pause.count': { type: 'info', text: '系统启动以来GC 次数', unit: '次' },
    'jvm.gc.pause.total_time': { type: 'info', text: '系统启动以来GC 总耗时', unit: '秒' },
    'jvm.gc.pause.max': { type: 'info', text: '系统启动以来GC 最大耗时', unit: '秒' }
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
                getAction('actuator/metrics/jvm.memory.max'),
                getAction('actuator/metrics/jvm.memory.committed'),
                getAction('actuator/metrics/jvm.memory.used'),
                getAction('actuator/metrics/jvm.buffer.memory.used'),
                getAction('actuator/metrics/jvm.buffer.count'),
                getAction('actuator/metrics/jvm.threads.daemon'),
                getAction('actuator/metrics/jvm.threads.live'),
                getAction('actuator/metrics/jvm.threads.peak'),
                getAction('actuator/metrics/jvm.classes.loaded'),
                getAction('actuator/metrics/jvm.classes.unloaded'),
                getAction('actuator/metrics/jvm.gc.memory.allocated'),
                getAction('actuator/metrics/jvm.gc.memory.promoted'),
                getAction('actuator/metrics/jvm.gc.max.data.size'),
                getAction('actuator/metrics/jvm.gc.live.data.size'),
                getAction('actuator/metrics/jvm.gc.pause')
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
                        if (param === 'jvm.memory.max'
                            || param === 'jvm.memory.committed'
                            || param === 'jvm.memory.used'
                            || param === 'jvm.buffer.memory.used'
                            || param === 'jvm.gc.memory.allocated'
                            || param === 'jvm.gc.memory.promoted'
                            || param === 'jvm.gc.max.data.size'
                            || param === 'jvm.gc.live.data.size'
                        ) {
                            val = convert(val, Number)
                        }
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