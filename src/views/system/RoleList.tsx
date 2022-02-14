import {h, defineComponent, reactive, ref,Ref, onMounted, CSSProperties} from "vue";
import { NCard, NDataTable, NForm, NFormItem, NInput, NGrid, NGi, NButton, NSpace, NDivider, NPopconfirm, NAlert, DataTableColumn, NIcon, NTag } from "naive-ui";
import { getAction, deleteAction } from "@/api/manage";
import { RowKey } from "naive-ui/lib/data-table/src/interface";
import RoleModal from './modules/RoleModal';
import { PlusOutlined } from '@vicons/antd'
import RolePermissionDrawer from './modules/RolePermissionDrawer'

interface DataItem extends BaseModel {
    roleName: string,
    roleCode: string,
    remark: string,
    roleIdList: null 
}

const createColumns = ( { edit,handlePermission, handleDelete } ): Array<DataTableColumn<DataItem>> => {
    return [
        {
            type: 'selection',
        }, {
            title: '序号',
            key: 'seq',
            render(rowData: DataItem, rowIndex: number) {
                return rowIndex + 1
            }
        }, {
            title: '角色名',
            key: 'roleName'
        },
        {
            title: '角色编码',
            key: 'roleCode'
        },
        {
            title: '备注',
            key: 'remark'
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
                    h('a', { onClick: () => handlePermission(rowData.id), style: {
                        color: '#18a058'
                    } }, { default: () => '授权' } ),
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
            list: '/sys/role/list',
            delete: '/sys/role/delete',
            deleteBatch: '/sys/role/deleteBatch',
        })
        const  search = reactive({
            roleName: '',
            roleCode: '',
            page: 1,
            pageSize: 10
        })
        const checkedRowKeysRef: Ref<Array<RowKey>> = ref([])

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
        const drawerRef = ref()

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
        const handleBatchDelete = () => {
          
          if(checkedRowKeysRef.value.length > 0) {
            let ids = checkedRowKeysRef.value.join()
            // @ts-ignore
            deleteAction(url.deleteBatch, { ids: ids }).then((r: Result<any>) => {
                if(r.success) {
                    window.$message.success(r.message)
                    reload()
                    clearSelected()
                } else {
                    window.$message.error(r.message)
                }
            })
          }
        
        }
        const handleCheck = (rowKeys: Array<RowKey>) => {
            checkedRowKeysRef.value =  rowKeys
        }
        const clearSelected = () => {
            checkedRowKeysRef.value.length = 0
        }

        const handlePermission = (id: string) => {
            drawerRef.value.show(id)
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
            search.roleName = ''
            search.roleCode = ''
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
                            <NForm inline labelPlacement={'left'} labelWidth={60}>
                                <NGrid xGap={12} cols={4}>
                                    <NGi>
                                        <NFormItem label="角色名" >
                                            <NInput  v-model:value={ search.roleName } placeholder='输入角色名'/>
                                        </NFormItem>
                                    </NGi>
                                    <NGi>
                                        <NFormItem label="角色编码">
                                            <NInput v-model:value={ search.roleCode } placeholder='输入角色编码'/>
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
                                <NPopconfirm onPositiveClick={ handleBatchDelete }>
                                    {{
                                        default: () => '确认删除？',
                                        trigger: () => <NButton v-show={ checkedRowKeysRef.value.length > 0 }>批量删除</NButton>
                                    }}

                                </NPopconfirm>
                            </NSpace>
                        </div>
                        <div>
                            <NAlert type='info' showIcon={ false } style="margin-bottom: 16px">
                                <i></i> 已选择
                                <a style="font-weight: 600">{ checkedRowKeysRef.value.length }</a>项
                                <a style={ "margin-left: 24px;color: #18a058" } onClick={ clearSelected }>清空</a>
                            </NAlert>
                            <NDataTable remote loading={ loading.value } columns={ createColumns( { edit,handlePermission,handleDelete }) } data={data.value} pagination={pagination} rowKey={ rowKey } onUpdateCheckedRowKeys={ handleCheck }/>
                        </div>
                        <RoleModal ref={ modalForm } onOk={ modalFormOk } ></RoleModal>
                        <RolePermissionDrawer ref={ drawerRef } onOk={ modalFormOk } />
                    </NCard>
                </div>

            )
        }
    }
})
