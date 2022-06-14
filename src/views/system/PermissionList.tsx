import {h, defineComponent, reactive, ref,Ref, onMounted, CSSProperties} from "vue";
import { NCard, NDataTable, NButton, NSpace, NDivider, NPopconfirm, NAlert, DataTableColumn, NIcon, NTag } from "naive-ui";
import { getAction, deleteAction } from "@/api/manage";
import PermissionModal from './modules/PermissionModal';
import { PlusOutlined } from '@vicons/antd'
import * as antd from '@vicons/antd'
import useBaseList from "@/hooks/useBaseList";

interface DataItem extends BaseModel {
    parentId: string,
    parentName: string,
    name: string,
    url: string,
    component: null
    perms: string,
    type: number,
    icon?: string,
    orderNum: number,
    children: Array<DataItem>
}

const createColumns = ( { addSubordinate,edit, handleDelete } ): Array<DataTableColumn<DataItem>> => {
    return [
        {
            type: 'selection',
        }, {
            title: '菜单名称',
            key: 'name'
        },
        {
            title: '菜单类型',
            key: 'type',
            render(rowData: DataItem) {
                let typeMap = ['目录', '菜单', '按钮']
                let tagType = ['success', 'info', 'warning']
                return h(NTag, { type: tagType[rowData.type], size: 'small' }, { default: () => typeMap[rowData.type] })
            }
        },
        {
            title: 'icon',
            key: 'icon',
            render(rowData: DataItem) {
                return h(NIcon, { component: antd[rowData?.icon] }, { default: () => '' })
            }
        }, {
            title: '组件',
            key: 'component'
        }, {
            title: '路径',
            key: 'url'
        }, {
            title: '排序',
            key: 'orderNum'
        },{
            title: '操作',
            key: 'action',
            fixed: 'right',
            render(rowData: DataItem) {
                return [h('a', { onClick: () => edit(rowData.id), style: {
                        color: '#18a058'
                    } }, { default: () => '编辑' } ),
                    h(NDivider, { vertical: true }),
                    h('a', { onClick: () => addSubordinate(rowData.id), style: { color: '#18a058' } }, { default: () => '添加下级' }),
                    h(NDivider, { vertical: true }),
                    h(NPopconfirm,{ onPositiveClick: () => handleDelete(rowData.id) }, { default: () => '确定删除?', trigger: () => h('a', { style:{ color: '#18a058' } }, '删除')})
                    ]
            }
        }
    ]
}

export default defineComponent({
    name: 'PermissionList',
    setup() {
        const url = reactive({
            list: '/sys/permission/list',
            delete: '/sys/permission/delete',
            deleteBatch: '/sys/permission/deleteBatch',
        })
        const  search = reactive({
            username: '',
            realname: ''
        })
    
        const tableOperator: CSSProperties = {
            marginBottom: '8px'
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
 
        const addSubordinate = (parentId: string) => {
            modalForm.value.addSubordinate(parentId)
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
     
        const reload = () => {
            loadData()
        }
        const modalFormOk = () => {
            reload()
        }

        const { 
            checkedRowKeysRef,
            loading,
            data,
            modalForm,
            rowKey,
            handleAdd,
            edit,
            handleCheck,
            clearSelected} = useBaseList(url, search)

        onMounted(() => {
            loadData()
        })

        return () => {

            return (
                <div>
                    <NCard>
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
                            <NDataTable remote loading={ loading.value } columns={ createColumns( { addSubordinate,edit,handleDelete }) } data={data.value} rowKey={ rowKey } onUpdateCheckedRowKeys={ handleCheck }/>
                        </div>
                        <PermissionModal ref={ modalForm } onOk={ modalFormOk } ></PermissionModal>

                    </NCard>
                </div>

            )
        }
    }
})
