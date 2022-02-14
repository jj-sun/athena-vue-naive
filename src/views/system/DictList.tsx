import {h, defineComponent, reactive, ref,Ref, onMounted, CSSProperties} from "vue";
import { NCard, NDataTable, NForm, NFormItem, NInput, NGrid, NGi, NButton, NSpace, NDivider, NPopconfirm, NAlert, DataTableColumn, NIcon, NTag } from "naive-ui";
import { getAction, deleteAction } from "@/api/manage";
import DictModal from './modules/DictModal';
import DictItemList from "./DictItemList";
import { PlusOutlined } from '@vicons/antd'

interface DataItem extends BaseModel {
    dictName: string,
    dictCode: string,
    type: number,
    description: string
}

const createColumns = ( { edit,handleDictItemEdit, handleDelete } ): Array<DataTableColumn<DataItem>> => {
    return [
        {
            title: '序号',
            key: 'seq',
            render(rowData: DataItem, rowIndex: number) {
                return rowIndex + 1
            }
        }, {
            title: '字典名称',
            key: 'dictName'
        },
        {
            title: '字典编码',
            key: 'dictCode'
        },
        {
            title: '字典类型',
            key: 'type',
            render(rowData: DataItem) {
                let type = rowData.delFlag === 0 ? 'success' : 'info'
                let name = rowData.delFlag === 0 ? '字符串' : '数字'
                return h(NTag, { type: type, size: 'small' }, { default: () => name })
            }
        }, {
            title: '描述',
            key: 'description'
        }, {
            title: '状态',
            key: 'delFlag',
            render(rowData: DataItem) {
                let type = rowData.delFlag === 0 ? 'success' : 'error'
                let name = rowData.delFlag === 0 ? '正常' : '禁用'
                return h(NTag, { type: type, size: 'small' }, { default: () => name })
            }
        }, {
            title: '操作',
            key: 'action',
            fixed: 'right',
            render(rowData: DataItem) {
                return [h('a', { onClick: () => edit(rowData.id), style: {
                        color: '#18a058'
                    } }, { default: () => '编辑' } ),
                    h(NDivider, { vertical: true }),
                    h('a', { onClick: () => handleDictItemEdit(rowData.id),style: { color: '#18a058' } }, { default: () => '字典编辑' }),
                    h(NDivider, { vertical: true }),
                    h(NPopconfirm,{ onPositiveClick: () => handleDelete(rowData.id) }, { default: () => '确定删除?', trigger: () => h('a', { style:{ color: '#18a058' } }, '删除')})
                    ]
            }
        }
    ]
}

export default defineComponent({
    name: 'UserList',
    setup() {
        const url = reactive({
            list: '/sys/dict/list',
            delete: '/sys/dict/delete'
        })
        const  search = reactive({
            dictName: '',
            dictCode: '',
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
            pageSizes: [10,20,30,40],
            prefix: ( { itemCount  } ) => {
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

        const modalForm = ref()
        const dictItemListRef = ref()

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
            if(args === 1) {
                pagination.page = 1
            }
            let params = getSearchQuery()
            // @ts-ignore
            getAction(url.list, params).then((r: Result<any>) => {
                if(r.success) {
                    data.value = r.result.list
                    pagination.itemCount = r.result.totalCount
                    pagination.pageCount = r.result.totalPage
                } else {
                    window.$message.error(r.message)
                }
                loading.value = false

            })
        }

        const handleAdd = () => {
            modalForm.value.add()
        }

        const edit = (id: string) => {
            //let data = toRaw(rowData)
            modalForm.value.edit(id)
        }
        const handleDelete = (id: string) => {
            // @ts-ignore
            deleteAction(url.delete, { id: id }).then((r: Result<any>) => {
                if(r.success) {
                    window.$message.success(r.message)
                    reload()
                } else {
                    window.$message.error(r.message)
                }
            })
        }
       
        const reload = () => {
            loadData(1)
        }
        const modalFormOk = () => {
            reload()
        }

        const searchQuery = () => {
            loadData(1)
        }
        const searchReset = () => {
            search.dictName = ''
            search.dictCode = ''
            loadData(1)
        }

        const handleDictItemEdit = (id: string) => {
            dictItemListRef.value.show(id)
        }
        onMounted(() => {
            loadData(1)
        })

        return () => {

            return (
                <div>
                    <NCard>
                        <div>
                            <NForm inline labelPlacement={'left'} labelWidth={80}>
                                <NGrid xGap={12} cols={4}>
                                    <NGi>
                                        <NFormItem label="字典名称" >
                                            <NInput  v-model:value={ search.dictName } placeholder='输入用户名'/>
                                        </NFormItem>
                                    </NGi>
                                    <NGi>
                                        <NFormItem label="字典编码">
                                            <NInput v-model:value={ search.dictCode } placeholder='输入姓名'/>
                                        </NFormItem>
                                    </NGi>
                                    <NGi>
                                        <NSpace>
                                            <NButton type='primary' onClick={ searchQuery }>查询</NButton>
                                            <NButton type='default' onClick={ searchReset }>重置</NButton>
                                        </NSpace>
                                    </NGi>
                                </NGrid>
                            </NForm>
                        </div>

                        <div style={ tableOperator }>
                            <NSpace>
                                <NButton type='primary' onClick={ handleAdd }>
                                    {{
                                        default: () => '新增',
                                        icon: () => (
                                            <NIcon>
                                                <PlusOutlined/>
                                            </NIcon>
                                        )
                                    }}
                                </NButton>
                            </NSpace>
                        </div>
                        <div>
                            <NDataTable remote loading={ loading.value } columns={ createColumns( { edit,handleDictItemEdit,handleDelete }) } data={data.value} pagination={pagination} rowKey={ rowKey }/>
                        </div>
                        <DictModal ref={ modalForm } onOk={ modalFormOk } ></DictModal>
                        <DictItemList ref={ dictItemListRef }/>
                    </NCard>
                </div>

            )
        }
    }
})
