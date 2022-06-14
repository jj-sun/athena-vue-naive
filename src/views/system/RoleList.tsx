import {h, defineComponent, reactive, ref,Ref, onMounted, CSSProperties} from "vue";
import { NCard, NDataTable, NForm, NFormItem, NInput, NGrid, NGi, NButton, NSpace, NDivider, NPopconfirm, NAlert, DataTableColumn, NIcon, NTag } from "naive-ui";
import RoleModal from './modules/RoleModal';
import { PlusOutlined } from '@vicons/antd'
import RolePermissionDrawer from './modules/RolePermissionDrawer'
import useBaseList from "@/hooks/useBaseList";

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
        const drawerRef = ref()

        const handlePermission = (id: string) => {
            drawerRef.value.show(id)
        }
        const searchReset = () => {
            search.roleName = ''
            search.roleCode = ''
            loadData(1)
        }
        const { 
            checkedRowKeysRef,
            loading,
            pagination,
            data,
            modalForm,
            rowKey,
            loadData,
            handleAdd,
            edit,
            handleDelete,
            handleBatchDelete,
            handleCheck,
            clearSelected,
            modalFormOk,
            searchQuery} = useBaseList(url, search)

        onMounted(() => {
            loadData(1)
        })

        const tableOperator: CSSProperties = {
            marginBottom: '8px'
        }

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
