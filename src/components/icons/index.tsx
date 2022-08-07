import { NCard, NModal,NSpace,NButton, NIcon } from "naive-ui";
import { Component, defineComponent } from "vue";
import * as antd from '@vicons/antd'
import { NScrollbar } from "naive-ui/lib/_internal";

export default defineComponent({
    name: 'icons',
    emits: ['ok'],
    setup(props,{ emit,expose }) {

        let visible: boolean = $ref(false)

        let selectedIcon: string = $ref()

        const showIcon = () => {
            visible = true
        }
        const close = () => {
            visible = false
        }
        const handleOk = () => {
            close()
            emit('ok', selectedIcon)
        }
        
        expose({
            showIcon
        })

        return () => {
            return (
               <NModal show={ visible }>
                   <NCard style={ 'width: 600px' }
                        title='图标'
                        bordered={ false } 
                        size="huge"
                        closable
                        aria-modal={ true }
                        segmented={ true }
                        onClose={ close }>
                        {{
                            default: () => (
                                <NScrollbar style="max-height: 260px">
                                    <NSpace size="large">                                           
                                        {
                                            Object.keys(antd).map((item:string) => {
                                                return <NButton onClick={ () => selectedIcon = item } ><NIcon size={20} component={ antd[item] as Component } /></NButton>
                                            })
                                        }                                          
                                    </NSpace>
                                </NScrollbar>
                            ),
                            action: () => (
                                <NSpace style={ 'justifyContent: flex-end' }>
                                    <NButton onClick={ close }>关闭</NButton>
                                    <NButton type="primary" onClick={ handleOk }>确定</NButton>
                                </NSpace>
                            )
                        }}
                    </NCard>
               </NModal>
            )
        }
    }
})