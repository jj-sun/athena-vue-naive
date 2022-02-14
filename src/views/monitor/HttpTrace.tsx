import { DataTableColumn, NAlert, NCard, NDataTable, NDivider, NSkeleton, NTag } from "naive-ui";
import { defineComponent, ref, h, onMounted, reactive } from "vue";
import * as moment from 'moment'
import { getAction } from "@/api/manage";

interface DataItem{
    timestamp: string,
    request: {
        method: string,
        uri: string
    },
    response: {
        status: number
    },
    timeTaken: number
}

const createColumns = (): Array<DataTableColumn<DataItem>> => {
    return [
        {
            title: '请求时间',
            key: 'timestamp',
            render(rowData: DataItem) {
                return moment(rowData.timestamp).format('YYYY-MM-DD HH:mm:ss')
            }
        },
        {
            title: '请求方法',
            key: 'request.method',
            render(rowData: DataItem) {
                let type: string
                if(rowData.request.method === 'GET') {
                    type = 'success'
                } else if(rowData.request.method === 'POST') {
                    type = 'info'
                }
                else if(rowData.request.method === 'PUT') {
                    type = 'warning'
                }else {
                    //delete
                    type = 'error'
                }
                return h(NTag,{ type: type, size: 'small' }, { default: () => rowData.request.method })
            }
        },
        {
            title: '请求URL',
            key: 'request.uri',
            render(rowData: DataItem) {
                return rowData.request.uri.split('?')[0]
            }
        },
        {
            title: '响应状态',
            key: 'response.status',
            render(rowData: DataItem) {
                let type: string
                if(rowData.response.status < 200) {
                    type = 'default'
                } else if(rowData.response.status < 201) {
                    type = 'success'
                } else if(rowData.response.status < 399) {
                    type = 'info'
                } else if(rowData.response.status < 403) {
                    type = 'warning'
                } else if(rowData.response.status < 501) {
                    type = 'error'
                } else {
                    type = 'default'
                }
                return h(NTag,{ type: type, size: 'small' }, { default: () => rowData.response.status })
            }
        },
        {
            title: '请求耗时',
            key: 'timeTaken',
            render(rowData: DataItem) {
                //rowData.timeTaken
                let type: string
                if(rowData.timeTaken < 500) {
                    type = 'success'
                } else if(rowData.timeTaken < 1000) {
                    type = 'info'
                }
                else if(rowData.timeTaken < 1500) {
                    type = 'warning'
                }else {
                    //delete
                    type = 'error'
                }
                return h(NTag,{ type: type, size: 'small' }, { default: () => `${rowData.timeTaken} ms` })
            }
        }
    ]
}

export default defineComponent({
    name: 'HttpTrace',
    setup() {
        const data = ref([])
        const loading = ref(true)

        const pagination = reactive({
            defaultPage: 1,
            defaultPageSize: 10,
            pageSize: 10,
            showSizePicker: true,
            pageSizes: [5, 10, 20,30]
        })

        const loadInfo = () => {
            loading.value = true
            getAction('/actuator/httptrace').then((r: any) => {
                let filterData = ref<any>([])
                for (let d of r.traces) {
                  if (d.request.method !== 'OPTIONS' && d.request.uri.indexOf('httptrace') === -1) {
                    filterData.value.push(d)
                  }
                }
                data.value = filterData.value
            }).catch(e => {
                console.error(e)
                window.$message.error('获取HTTP信息失败')
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
                            共追踪到 { data.value.length } 条近期HTTP请求记录
                            <NDivider vertical />
                            <a onClick={ handleClickRefresh } style={"color: #18a058"}>立即更新</a>
                        </NAlert>
                        <NDataTable loading={loading.value} pagination={ pagination } columns={createColumns()} data={data.value} />
                    </NCard>
                </div>
            )
        }
    }
})