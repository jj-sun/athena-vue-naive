import { defineComponent,ref, nextTick } from "vue";
import { NCard, NSpace, NButton, NModal } from "naive-ui";
import DeptForm from "./DeptForm";

export default defineComponent({
    name: 'DeptModal',
    emits: ['ok'],
    setup(props,{ emit,expose }) {
        const realForm = ref()
        let visible: boolean = $ref(false)
        let title: string = $ref('新增')

        const add = async () => {
            visible = true
            title = '新增'
            await nextTick()
            realForm.value.add()
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
        
        expose({
            add,
            edit
        })

        return () => {
            return (
                <div>
                    <NModal show={ visible }>
                        <NCard style={ 'width: 600px' }
                                title={ title }
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