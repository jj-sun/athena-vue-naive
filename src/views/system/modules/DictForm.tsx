import { defineComponent, reactive, ref } from "vue";
import { NSpin, NForm, NInput, NGrid, NFormItemGi, FormValidationError,NRadioGroup, NRadio, NSpace } from "naive-ui";
import { getAction, httpAction } from "@/api/manage";
import { Method } from '@/utils/request';

export default defineComponent({
    name: 'DictForm',
    emits: ['ok'],
    setup(props, { emit,expose }) {

        let confirmLoading = $ref(false)

        let form = $ref({
            id: '',
            dictName: '',
            dictCode: '',
            type: 0,
            description: ''
        })
        const formRef = ref()
        const rules = {
            dictName: [{
                required: true,
                message: '请输入字典名称'
            }],
            dictCode: [{
                required: true,
                message: '请输入字典编码'
            }],
            type: [{
                required: true,
                message: '请选择类型'
            }]
        }

        const add = () => {
            
        }

        const editForm = (id: string): void => {
            // @ts-ignore
            getAction(`/sys/dict/info/${id}`).then((res: Result<any>) => {
                if(res.success) {
                    form = res.result
                }
            })
        }
        const submitForm = () => {
            formRef.value.validate((error: Array<FormValidationError>) => {
                if (!error) {
                    confirmLoading = true
                    let httpurl = '';
                    let method: Method = 'put';
                    if (!form.id) {
                        httpurl = '/sys/dict/save';
                        method = 'post';
                    } else {
                        httpurl = '/sys/dict/update';
                        method = 'put';
                    }
                    let formData = Object.assign({}, form);
                    console.log("表单提交数据", formData);
                    // @ts-ignore
                    httpAction(httpurl, formData, method).then((res: Result<any>) => {
                        if (res.success) {
                            window.$message.success(res.message);
                            emit('ok');
                        } else {
                            window.$message.warning(res.message);
                        }
                    }).finally(() => {
                        confirmLoading = false
                    })
                } 
            })
        }

        expose({
            add,
            editForm,
            submitForm
        })

        return () => {
            return (
                <NSpin show={confirmLoading}>
                    <NForm model={form} ref={formRef} rules={rules} size="medium" labelPlacement={'left'} labelWidth={80}>
                        <NGrid cols={24} x-xGap={24}>

                            <NFormItemGi span={24} path="dictName" label="字典名称">
                                <NInput v-model:value={form.dictName} />
                            </NFormItemGi>
                            <NFormItemGi span={24} path="dictCode" label="字典编码">
                                <NInput v-model:value={form.dictCode} />
                            </NFormItemGi>

                            <NFormItemGi span={24} path="type" label="字典类型">
                                {/* <NInput v-model:value={form.value.type} /> */}
                                <NRadioGroup v-model:value={form.type}>
                                    <NSpace>
                                        <NRadio value={ 0 }>字符</NRadio>
                                        <NRadio value={ 1 }>数字</NRadio>
                                    </NSpace>
                                </NRadioGroup>
                            </NFormItemGi>

                            <NFormItemGi span={24} label="描述">
                                <NInput type="textarea" v-model:value={form.description} />
                            </NFormItemGi>
                        </NGrid>
                    </NForm>
                </NSpin>
            )
        }
    }
})