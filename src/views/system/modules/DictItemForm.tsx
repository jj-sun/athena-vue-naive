import { defineComponent, reactive, ref } from "vue";
import { NSpin, NForm, NInput, NGrid, NFormItemGi, FormValidationError,NRadioGroup, NRadio, NSpace, NInputNumber, NSwitch } from "naive-ui";
import { getAction, httpAction } from "@/api/manage";
import { Method } from '@/utils/request';

export default defineComponent({
    name: 'DictForm',
    emits: ['ok'],
    setup(props, { emit,expose }) {

        let confirmLoading = $ref(false)

        let form = $ref({
            id: '',
            dictId: '',
            itemText: '',
            itemValue: '',
            sortOrder: 0,
            description: '',
            delFlag: 0
        })
        const formRef = ref()
        const rules = {
            itemText: [{
                required: true,
                message: '请输入名称'
            }],
            itemValue: [{
                required: true,
                message: '请输入数据值'
            }]
        }

        const add = (dictId: string) => {
            form.dictId = dictId
        }

        const editForm = (id: string): void => {
            // @ts-ignore
            getAction(`/sys/dictItem/info/${id}`).then((res: Result<any>) => {
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
                        httpurl = '/sys/dictItem/save';
                        method = 'post';
                    } else {
                        httpurl = '/sys/dictItem/update';
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
                                <NInput v-model:value={form.itemText} />
                            </NFormItemGi>
                            <NFormItemGi span={24} path="dictCode" label="字典编码">
                                <NInput v-model:value={form.itemValue} />
                            </NFormItemGi>

                            <NFormItemGi span={24} label="描述">
                                <NInput type="textarea" v-model:value={form.description} />
                            </NFormItemGi>
                            <NFormItemGi span={24} label="排序">
                                <NInputNumber v-model:value={form.sortOrder} />
                            </NFormItemGi>
                            <NFormItemGi span={24} label="是否启用">
                                <NSwitch v-model:value={form.delFlag} size="medium" checkedValue={ 0 }>
                                    {{
                                        checked: () => '开启',
                                        unchecked: () => '关闭'
                                    }}
                                </NSwitch>
                            </NFormItemGi>
                        </NGrid>
                    </NForm>
                </NSpin>
            )
        }
    }
})