import {h, defineComponent, reactive, ref,Ref, onMounted, CSSProperties} from "vue";
import { NCard, NDataTable, NButton, NSpace, NDivider, NPopconfirm, NAlert, DataTableColumn, NIcon, NForm,NGrid,NGi,NFormItem,NInput } from "naive-ui";
import { getAction, deleteAction } from "@/api/manage";
import { RowKey } from "naive-ui/lib/data-table/src/interface";
import DeptModal from './modules/DeptModal';
import { PlusOutlined } from '@vicons/antd'

interface DataItem extends BaseModel {
    parentId: string,
    deptName: string,
    deptCode: string,
    description: string,
    sortOrder: number
    children: Array<DataItem>
}

const createColumns = ( { edit, handleDelete }:{ edit: (id:string) => void, handleDelete: (id:string) => void } ): Array<DataTableColumn<DataItem>> => {
    return [
        {
            type: 'selection',
        }, {
            title: '部门名称',
            key: 'deptName'
        },{
            title: '部门编码',
            key: 'deptCode'
        }, {
            title: '描述',
            key: 'description'
        }, {
            title: '排序',
            key: 'sortOrder'
        },{
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
    name: 'DeptList',
    setup() {
        const url = reactive({
            list: '/sys/dept/list',
            delete: '/sys/dept/delete',
            deleteBatch: '/sys/dept/deleteBatch',
        })
        const  search = reactive({
            deptName: '',
            delFlag: null
        })
        const checkedRowKeysRef: Ref<Array<RowKey>> = ref([])

        const loading = ref(false)
       
        const data: Ref<DataItem[]> = ref([])

        const modalForm = ref()

        const tableOperator: CSSProperties = {
            marginBottom: '8px'
        }

        const rowKey = (rowData: DataItem): string => {
            return rowData.id
        }

        const getSearchQuery = () => {
            let params = Object.assign({}, search)
           
            return params
        }

        const loadData = () => {
            loading.value = true
            
            let params = getSearchQuery()
            // @ts-ignore
            getAction(url.list, params).then((r: Result<any>) => {
                if(r.success) {
                    data.value = r.result
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
        const reload = () => {
            loadData()
        }
        const modalFormOk = () => {
            reload()
        }

        const searchQuery = () => {
            loadData()
        }
        const searchReset = () => {
            search.deptName = ''
            search.delFlag = null
            loadData()
        }

        onMounted(() => {
            loadData()
        })

        return () => {

            return (
                <div>
                    <NCard>
                    <div>
                            <NForm inline labelPlacement={'left'} labelWidth={60}>
                                <NGrid xGap={12} cols={4}>
                                    <NGi>
                                        <NFormItem label="部门名称" >
                                            <NInput  v-model:value={ search.deptName } placeholder='输入部门名称'/>
                                        </NFormItem>
                                    </NGi>
                                    {/* <NGi>
                                        <NFormItem label="状态">
                                            <NInput v-model:value={ search.delFlag } placeholder='输入状态'/>
                                        </NFormItem>
                                    </NGi> */}
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
                            <NDataTable remote loading={ loading.value } columns={ createColumns( { edit,handleDelete }) } data={data.value} rowKey={ rowKey } onUpdateCheckedRowKeys={ handleCheck }/>
                        </div>
                        <DeptModal ref={ modalForm } onOk={ modalFormOk } ></DeptModal>

                    </NCard>
                </div>

            )
        }
    }
})
