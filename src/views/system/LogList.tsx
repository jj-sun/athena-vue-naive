import { h, defineComponent, reactive, ref, Ref, onMounted, CSSProperties } from "vue";
import { NCard, NDataTable, NForm, NFormItem, NInput, NGrid, NGi, NButton, NSpace, DataTableColumn, NBadge } from "naive-ui";
import { getAction } from "@/api/manage";

interface DataItem {
    id: string,
    username: string,
    realname: string,
    operation: string,
    method: string,
    params: string,
    time: number,
    ip: number,
    createDate: null
}

const createColumns = (): Array<DataTableColumn<DataItem>> => {
    return [
        {
            type: 'expand',
            renderExpand(rowData: DataItem) {
                return [
                    h('div',{ style: { marginBottom: '5px' } }, { default: () => [
                        h(NBadge, { dot: true,type: 'success', style: { verticalAlign: 'middle', marginRight: '10px' } }, { default: () => '' }),
                        h('span', { style: { verticalAlign: 'middle' } }, { default: () => `请求方法: ${ rowData.method }` })
                    ] }),
                    h('div',{}, { default: () => [
                        h(NBadge, { dot: true,type: 'info', style: { verticalAlign: 'middle',marginRight: '10px' } }, { default: () => '' }),
                        h('span', { style: { verticalAlign: 'middle' } }, { default: () => `请求参数: ${ rowData.params }` })
                    ] })
                ]
            }
        },{
            title: '序号',
            key: 'seq',
            width: 20,
            render(rowData: DataItem, rowIndex: number) {
                return rowIndex + 1
            }
        }, {
            title: '用户操作',
            key: 'operation',
            width: 90
        }, {
            title: '用户名',
            key: 'username',
            width: 90
        },{
            title: '执行时长',
            key: 'time',
            width: 90
        }, {
            title: 'IP地址',
            key: 'ip',
            width: 90
        }, {
            title: '创建时间',
            key: 'createDate',
            width: 160
        }
    ]
}

export default defineComponent({
    name: 'LogList',
    setup() {
        const url = reactive({
            list: '/sys/log/list'
        })
        const search = reactive({
            operation: '',
            page: 1,
            pageSize: 10
        })

        const loading = ref(false)
        const pagination = reactive({
            page: 1,
            pageCount: 1,
            pageSize: 10,
            itemCount: 0,
            showSizePicker: true,
            pageSizes: [10, 20, 30, 40],
            prefix: ({ itemCount }) => {
                return `共${itemCount}条`
            },
            onUpdatePage: (page: number) => {
                pagination.page = page
                loadData(0)
            },
            onUpdatePageSize: (pageSize: number) => {
                pagination.pageSize = pageSize
                pagination.page = 1
                searchQuery()
            }
        })
        const data: Ref<DataItem[]> = ref([])


        const tableOperator: CSSProperties = {
            marginBottom: '8px'
        }

        const rowKey = (rowData: DataItem): string => {
            return rowData.id
        }

        const getSearchQuery = () => {
            let params = Object.assign({}, search)
            params.page = pagination.page
            params.pageSize = pagination.pageSize
            return params
        }

        const loadData = (args: number) => {
            loading.value = true
            if (args === 1) {
                pagination.page = 1
            }
            let params = getSearchQuery()
            // @ts-ignore
            getAction(url.list, params).then((r: Result<any>) => {
                if (r.success) {
                    data.value = r.result.list
                    pagination.itemCount = r.result.totalCount
                    pagination.pageCount = r.result.totalPage
                } else {
                    window.$message.error(r.message)
                }
                loading.value = false

            })
        }

        const reload = () => {
            loadData(1)
        }

        const searchQuery = () => {
            loadData(1)
        }
        const searchReset = () => {
            search.operation = ''
            loadData(1)
        }

        onMounted(() => {
            loadData(1)
        })

        return () => {

            return (
                <div>
                    <NCard>
                        <div>
                            <NForm inline labelPlacement={'left'} labelWidth={70}>
                                <NGrid xGap={12} cols={4}>
                                    <NGi>
                                        <NFormItem label="搜索日志" >
                                            <NInput v-model:value={search.operation} placeholder='输入日志关键字' />
                                        </NFormItem>
                                    </NGi>
                                    {/* <NGi>
                                        <NFormItem label="姓名">
                                            <NInput v-model:value={search.realname} placeholder='输入姓名' />
                                        </NFormItem>
                                    </NGi> */}
                                    <NGi>
                                        <NSpace>
                                            <NButton type='primary' onClick={searchQuery}>查询</NButton>
                                            <NButton type='default' onClick={searchReset}>重置</NButton>
                                        </NSpace>
                                    </NGi>
                                </NGrid>
                            </NForm>
                        </div>
                        <div>
                            <NDataTable remote loading={loading.value} columns={createColumns()} data={data.value} pagination={pagination} rowKey={rowKey} />
                        </div>

                    </NCard>
                </div>

            )
        }
    }
})
