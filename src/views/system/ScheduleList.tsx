import {h, defineComponent, reactive, onMounted, CSSProperties} from "vue";
import { NCard, NDataTable, NForm, NFormItem, NInput, NGrid, NGi, NButton, NSpace, NPopconfirm, NAlert, DataTableColumn, NIcon, NTag } from "naive-ui";
import { getAction } from "@/api/manage";
import ScheduleModal from './modules/ScheduleModal';
import { PlusOutlined } from '@vicons/antd'
import useBaseList from "@/hooks/useBaseList";

interface DataItem extends BaseModel {
    beanName: string,
    parameter: string,
    cronExpression: string,
    status: number,
    remark: string
}

export default defineComponent({
    name: 'ScheuleList',
    setup() {
        const createColumns = ( { edit, handleDelete } ): Array<DataTableColumn<DataItem>> => {
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
                    title: 'bean名称',
                    key: 'beanName'
                },
                {
                    title: '参数',
                    key: 'parameter'
                },
                {
                    title: 'cron表达式',
                    key: 'cronExpression'
                }, {
                    title: '备注',
                    key: 'remark'
                }, {
                    title: '状态',
                    key: 'status',
                    render(rowData: DataItem) {
                        let type = rowData.status === 0 ? 'success' : 'error'
                        let name = rowData.status === 0 ? '正常' : '暂停'
                        return (<NTag type={type} size='small'>{name}</NTag>)
                        //return h(NTag, { type: type, size: 'small' }, { default: () => name })
                    }
                }, {
                    title: '操作',
                    key: 'action',
                    fixed: 'right',
                    render(rowData: DataItem) {
                        return (
                            <NSpace>
                                <NButton secondary size="tiny" type='primary' onClick={ () => edit(rowData.id) }>编辑</NButton>
                                <NPopconfirm onPositiveClick={ () => handleDelete(rowData.id) }>
                                    {{
                                        trigger: () => (<NButton secondary size="tiny" type='error'>删除</NButton>),
                                        default: () => '确定删除?'
                                    }}
                                </NPopconfirm>
                                <NPopconfirm onPositiveClick={ () => handleSchduleJob(url.pause,rowData.id) }>
                                    {{
                                        trigger: () => (<NButton secondary size="tiny" type='primary'>暂停</NButton>),
                                        default: () => '确定暂停?'
                                    }}
                                </NPopconfirm>
                                <NPopconfirm onPositiveClick={ () => handleSchduleJob(url.resume,rowData.id) }>
                                    {{
                                        trigger: () => (<NButton secondary size="tiny" type='primary'>恢复</NButton>),
                                        default: () => '确定恢复?'
                                    }}
                                    
                                </NPopconfirm>
                                <NPopconfirm onPositiveClick={ () => handleSchduleJob(url.run,rowData.id) }>
                                    {{
                                        trigger: () => (<NButton secondary size="tiny" type='primary'>立即执行</NButton>),
                                        default: () => '确定立即执行?'
                                    }}
                                    
                                </NPopconfirm>
                            </NSpace>
                        )
                     }
                }
            ]
        }

        const url = reactive({
            list: '/sys/schedule/list',
            delete: '/sys/schedule/delete',
            deleteBatch: '/sys/schedule/deleteBatch',
            pause: "/sys/schedule/pause",
            resume: "/sys/schedule/resume",
            run: "/sys/schedule/run"
        })
        const search = reactive({
            beanName: '',
            page: 1,
            pageSize: 10
        })

        const searchReset = () => {
            search.beanName = ''
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
            reload,
            modalFormOk,
            searchQuery} = useBaseList(url, search)
      

        const tableOperator: CSSProperties = {
            marginBottom: '8px'
        }

    
        const handleSchduleJob = (url: string,id: string) => {
            // @ts-ignore
            getAction(url, { id: id }).then((r: Result<any>) => {
                if(r.success) {
                    window.$message.success(r.message)
                    reload()
                } else {
                    window.$message.error(r.message)
                }
            })
        }

        onMounted(() => {
            loadData(1)
        })

        return () => {

            return (
                <div>
                    <NCard>
                        <div>
                            <NForm inline labelPlacement={'left'}>
                                <NGrid xGap={12} cols={4}>
                                    <NGi>
                                        <NFormItem >
                                            <NInput  v-model:value={ search.beanName } placeholder='bean名称'/>
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
                            <NDataTable remote loading={ loading.value } columns={ createColumns( { edit,handleDelete }) } data={data.value} pagination={pagination} rowKey={ rowKey } onUpdateCheckedRowKeys={ handleCheck }/>
                        </div>
                        <ScheduleModal ref={ modalForm } onOk={ modalFormOk } ></ScheduleModal>

                    </NCard>
                </div>

            )
        }
    }
})
