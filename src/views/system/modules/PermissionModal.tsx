import { defineComponent,ref, Ref, nextTick } from "vue";
import { NCard, NDrawer, NSpace, NButton } from "naive-ui";
import PermissionForm from "./PermissionForm";

export default defineComponent({
    name: 'PermissionModal',
    emits: ['ok'],
    setup(props,{ emit,expose }) {
        const realForm = ref()
        let visible = $ref(false)
        let title = $ref('新增')

        const add = async () => {
            visible = true
            title = '新增'
            await nextTick()
            realForm.value.add()
        }
        const addSubordinate = async (parentId: string) => {
            visible = true
            title = '新增'
            await nextTick()
            realForm.value.addSubordinate(parentId)
        }
        const edit = async (id: string) => {
            visible = true
            title = '编辑'
            await nextTick()
            realForm.value.editForm(id)
        }
        const close = () => {
            visible = false
        }
        const submitCallback = () => {
            close()
            emit('ok')
        }
        const handleOk = () => {
            realForm.value.submitForm()
        }
        

        const updateVisible = (show: boolean) => {
            visible = show
        }

        expose({
            add,
            addSubordinate,
            edit
        })

        return () => {
            return (
                <div>
                    <NDrawer show={ visible } placement="right" width="600px" onUpdate:show={ updateVisible }>
                        <NCard style={ 'width: 600px' }
                                title={ title }
                                bordered={ false } 
                                size="huge"
                                closable
                                aria-modal={ true }
                                segmented={ true }
                                onClose={ close }>
                                {{
                                    default: () => <PermissionForm ref={ realForm } onOk={ submitCallback }/>,
                                    action: () => (
                                        <NSpace style={ 'justifyContent: flex-end' }>
                                            <NButton onClick={ close }>关闭</NButton>
                                            <NButton type="primary" onClick={ handleOk }>确定</NButton>
                                        </NSpace>
                                    )
                                }}
                        </NCard>
                        
                    </NDrawer>
                </div>  
            )
        }
       
    }
})