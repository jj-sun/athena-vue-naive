import {h, defineComponent, reactive, ref,Ref, onMounted, CSSProperties} from "vue";
import { NCard, NDataTable, NForm, NFormItem, NInput, NGrid, NGi, NButton, NSpace, NDivider, NPopconfirm, NAlert, DataTableColumn, NIcon, NTag } from "naive-ui";
import DictModal from './modules/DictModal';
import DictItemList from "./DictItemList";
import { PlusOutlined } from '@vicons/antd'
import useBaseList from "@/hooks/useBaseList";

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

        const dictItemListRef = ref()

        const tableOperator: CSSProperties = {
            marginBottom: '8px'
        }

        const searchReset = () => {
            search.dictName = ''
            search.dictCode = ''
            loadData(1)
        }

        const handleDictItemEdit = (id: string) => {
            dictItemListRef.value.show(id)
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

        return () => {

            return (
                <div>
                    <NCard>
                        <div>
                            <NForm inline labelPlacement={'left'} labelWidth={80}>
                                <NGrid xGap={12} cols={4}>
                                    <NGi>
                                        <NFormItem label="字典名称" >
                                            <NInput  v-model:value={ search.dictName } placeholder='输入字典名称'/>
                                        </NFormItem>
                                    </NGi>
                                    <NGi>
                                        <NFormItem label="字典编码">
                                            <NInput v-model:value={ search.dictCode } placeholder='输入字典编码'/>
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
