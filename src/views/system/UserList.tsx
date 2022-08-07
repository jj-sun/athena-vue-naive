import { defineComponent, reactive, onMounted, CSSProperties} from "vue";
import { NCard, NDataTable, NForm, NFormItem, NInput, NGrid, NGi, NButton, NSpace, NDivider, NPopconfirm, NAlert, DataTableColumn, NIcon, NTag,PaginationProps } from "naive-ui";
import UserModal from './modules/UserModal';
import { PlusOutlined } from '@vicons/antd'
import useBaseList from "@/hooks/useBaseList";

interface DataItem extends BaseModel {
    username: string,
    realname: string,
    email: string,
    mobile: string,
    sex: number,
    password: string,
    salt: string,
    userType: number,
    roleIdList: null 
}

const createColumns = ( { edit,handleDelete }: { edit:(id:string) => void,handleDelete:(id:string) => void } ): Array<DataTableColumn<DataItem>> => {
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
            title: '用户名',
            key: 'username'
        },
        {
            title: '姓名',
            key: 'realname'
        },{
            title: '性别',
            key: 'key',
            render(rowData: DataItem) {
                let type = rowData.sex === 1 ? 'success' : 'error'
                let name = rowData.sex === 1 ? '男性' : '女性'
                if(rowData.sex === 0) {
                    type = 'default'
                    name = '保密'
                }
                //return h(NTag, { type: type, size: 'small' }, { default: () => name })
                return (<NTag type={type} size='small'>{ name }</NTag>)     
            }
        },
        {
            title: '邮箱',
            key: 'email'
        }, {
            title: '手机号码',
            key: 'mobile'
        },{
            title: '部门',
            key: 'deptCode_dictText'
        }, {
            title: '状态',
            key: 'delFlag',
            render(rowData: DataItem) {
                let type = rowData.delFlag === 0 ? 'success' : 'error'
                let name = rowData.delFlag === 0 ? '正常' : '禁用'
                //return h(NTag, { type: type, size: 'small' }, { default: () => name })
                return (<NTag type={ type } size='small'>{ name }</NTag>)
            }
        }, {
            title: '操作',
            key: 'action',
            fixed: 'right',
            render(rowData: DataItem) {
                return (
                    <NSpace>
                        <NButton text tag='a' type='primary' onClick={ () => edit(rowData.id) }>编辑</NButton>
                        <NPopconfirm onPositiveClick={ () => handleDelete(rowData.id)}>
                            {{
                                trigger: () => (<NButton text tag='a' type='error'>删除</NButton>),
                                default: () => '确定删除？'
                            }}
                        </NPopconfirm>
                    </NSpace>
                )
            }
        }
    ]
}

export default defineComponent({
    name: 'UserList',
    setup() {
        const url = reactive({
            list: '/sys/user/list',
            delete: '/sys/user/delete',
            deleteBatch: '/sys/user/deleteBatch',
        })

        const search = reactive({
            username: '',
            realname: '',
            page: 1,
            pageSize: 10
        })

        const searchReset = () => {
            search.username = ''
            search.realname = ''
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
        
        
        const tableOperator: CSSProperties = {
            marginBottom: '8px'
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
                                        <NFormItem label="用户名" >
                                            <NInput  v-model:value={ search.username } placeholder='输入用户名'/>
                                        </NFormItem>
                                    </NGi>
                                    <NGi>
                                        <NFormItem label="姓名">
                                            <NInput v-model:value={ search.realname } placeholder='输入姓名'/>
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
                                        trigger: () => <NButton type="error" v-show={ checkedRowKeysRef.value.length > 0 }>批量删除</NButton>
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
                            <NDataTable remote loading={ loading.value } columns={ createColumns( {edit, handleDelete} ) } data={data.value} pagination={ pagination as PaginationProps } rowKey={ rowKey } onUpdateCheckedRowKeys={ handleCheck }/>
                        </div>
                        <UserModal ref={ modalForm } onOk={ modalFormOk } ></UserModal>

                    </NCard>
                </div>

            )
        }
    }
})
