import {h, defineComponent, reactive, ref,Ref, onMounted, CSSProperties} from "vue";
import { NDataTable, NForm, NFormItem, NInput, NGrid, NGi, NButton, NSpace, NDivider, NPopconfirm, NAlert, DataTableColumn, NIcon, NTag, NDrawer, NDrawerContent, NSelect } from "naive-ui";
import { getAction, deleteAction } from "@/api/manage";
import DictItemModal from './modules/DictItemModal';
import { PlusOutlined } from '@vicons/antd'

interface DataItem extends BaseModel {
    dictId: string,
    itemText: string,
    itemValue: string,
    sortOrder: number,
    description: string
}

const createColumns = ( { edit, handleDelete } ): Array<DataTableColumn<DataItem>> => {
    return [
        {
            title: '序号',
            key: 'seq',
            render(rowData: DataItem, rowIndex: number) {
                return rowIndex + 1
            }
        }, {
            title: '名称',
            key: 'itemText'
        },
        {
            title: '数据值',
            key: 'itemValue'
        },{
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
                    h(NPopconfirm,{ onPositiveClick: () => handleDelete(rowData.id) }, { default: () => '确定删除?', trigger: () => h('a', { style:{ color: '#18a058' } }, '删除')})
                    ]
            }
        }
    ]
}

export default defineComponent({
    name: 'UserList',
    setup(props, { expose }) {
        const url = reactive({
            list: '/sys/dictItem/list',
            delete: '/sys/dictItem/delete'
        })
        const  search = reactive({
            itemText: '',
            delFlag: null,
            dictId: '',
            page: 1,
            pageSize: 10
        })

        const selectDelFlag = [
            {
                label: '正常',
                value: 0
            },
            {
                label: '禁用',
                value: 1
            }
        ]

        const dictId = ref('')

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

        const visible = ref(false)

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
            modalForm.value.add(dictId.value)
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
            search.itemText = ''
            search.delFlag = null
            loadData(1)
        }
        const show = (id: string) => {
            visible.value = true
            search.dictId = id
            dictId.value = id
            loadData(1)
        }
        const close = () => {
            visible.value = false
        }

        onMounted(() => {
            loadData(1)
        })

        expose({
            show,
            close
        })

        return () => {

            return (
                <NDrawer show={visible.value} width="600px" onMaskClick={ close }>
                    <NDrawerContent title="字典编辑" closable>
                            <div>
                                <NForm inline labelPlacement={'left'} labelWidth={50}>
                                    <NGrid xGap={8} cols={3}>
                                        <NGi>
                                            <NFormItem label="名称" >
                                                <NInput  v-model:value={ search.itemText } placeholder='请输入用名称'/>
                                            </NFormItem>
                                        </NGi>
                                        <NGi>
                                            <NFormItem label="状态">
                                                {/* <NInput v-model:value={ search.delFlag } placeholder='请选择状态'/> */}
                                                <NSelect v-model:value={ search.delFlag } options={ selectDelFlag } clearable />
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
                                <NDataTable remote loading={ loading.value } columns={ createColumns( { edit,handleDelete }) } data={data.value} pagination={pagination} rowKey={ rowKey }/>
                            </div>
                            <DictItemModal ref={ modalForm } onOk={ modalFormOk } ></DictItemModal>

                        
                    </NDrawerContent>
                   
                </NDrawer>

            )
        }
    }
})
