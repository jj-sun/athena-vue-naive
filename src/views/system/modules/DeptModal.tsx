import { defineComponent,ref, nextTick } from "vue";
import { NCard, NSpace, NButton, NModal } from "naive-ui";
import DeptForm from "./DeptForm";

export default defineComponent({
    name: 'DeptModal',
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
        
        expose({
            add,
            edit
        })

        return () => {
            return (
                <div>
                    <NModal show={ visible.value }>
                        <NCard style={ 'width: 600px' }
                                title={ title.value }
                                bordered={ false } 
                                size="huge"
                                closable
                                aria-modal={ true }
                                segmented={ true }
                                onClose={ close }>
                                {{
                                    default: () => <DeptForm ref={ realForm } onOk={ submitCallback }/>,
                                    action: () => (
                                        <NSpace style={ 'justifyContent: flex-end' }>
                                            <NButton onClick={ close }>关闭</NButton>
                                            <NButton type="primary" onClick={ handleOk }>确定</NButton>
                                        </NSpace>
                                    )
                                }}
                        </NCard>
                        
                    </NModal>
                </div>  
            )
        }
       
    }
})