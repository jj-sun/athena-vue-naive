import {h, defineComponent, reactive, ref,Ref, onMounted, CSSProperties} from "vue";
import { NDataTable, NForm, NFormItem, NInput, NGrid, NGi, NButton, NSpace, NDivider, NPopconfirm, NAlert, DataTableColumn, NIcon, NTag, NDrawer, NDrawerContent, NSelect } from "naive-ui";
import DictItemModal from './modules/DictItemModal';
import { PlusOutlined } from '@vicons/antd'
import useBaseList from "@/hooks/useBaseList";

interface DataItem extends BaseModel {
    dictId: string,
    itemText: string,
    itemValue: string,
    sortOrder: number,
    description: string
}

const createColumns = ( { edit, handleDelete }: { edit: (id:string) => void,handleDelete:(id:string) => void } ): Array<DataTableColumn<DataItem>> => {
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
                return (
                    <NSpace>
                        <NButton text tag='a' type='primary' onClick={ () => edit(rowData.id) }>编辑</NButton>
                        <NPopconfirm onPositiveClick={ () => handleDelete(rowData.id) }>
                            {{
                                trigger: () => (<NButton text tag='a' type='error'>删除</NButton>),
                                default: () => '确定删除?'
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

        const visible = ref(false)

        const tableOperator: CSSProperties = {
            marginBottom: '8px'
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

        const { 
            loading,
            pagination,
            data,
            modalForm,
            rowKey,
            loadData,
            handleAdd,
            edit,
            handleDelete,
            modalFormOk,
            searchQuery} = useBaseList(url, search)

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
                                                <NInput  v-model:value={ search.itemText } placeholder='请输入名称'/>
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
