import { h, defineComponent, reactive, ref, Ref, onMounted, CSSProperties } from "vue";
import { NCard, NDataTable, NForm, NFormItem, NInput, NGrid, NGi, NButton, NSpace, DataTableColumn, NBadge, NCode } from "naive-ui";
import useBaseList from "@/hooks/useBaseList";

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

        const searchReset = () => {
            search.operation = ''
            loadData(1)
        }
        const { 
            loading,
            pagination,
            data,
            rowKey,
            loadData,
            searchQuery } = useBaseList(url, search)

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
