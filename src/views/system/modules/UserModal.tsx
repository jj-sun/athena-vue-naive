import { defineComponent,ref, Ref, nextTick } from "vue";
import { NCard, NModal, NSpace, NButton, NDrawer } from "naive-ui";
import UserForm from "./UserForm";

export default defineComponent({
    name: 'UserModal',
    emits: ['ok'],
    setup(props,{ emit,expose }) {
        const realForm = ref()
        const visible = ref(false)
        const title = ref('新增')

        const add = async () => {
            visible.value = true
            title.value = '新增'
            await nextTick()
            realForm.value.add()
        }
        const edit = async (id: string) => {
            visible.value = true
            title.value = '编辑'
            await nextTick()
            realForm.value.editForm(id)
        }
        const close = () => {
            visible.value = false
        }
        const submitCallback = () => {
            close()
            emit('ok')
        }
        const handleOk = () => {
            realForm.value.submitForm()
        }

        const updateVisible = (show: boolean) => {
            visible.value = show
        }
        
        expose({
            add,
            edit
        })

        return () => {
            return (
                <div>
                    <NDrawer show={ visible.value } placement="right" width="600px" onUpdate:show={ updateVisible }>
                        <NCard style={ 'width: 600px' }
                                title={ title.value }
                                bordered={ false } 
                                size="huge"
                                closable
                                aria-modal={ true }
                                segmented={ true }
                                onClose={ close }>
                                {{
                                    default: () => <UserForm ref={ realForm } onOk={ submitCallback }/>,
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