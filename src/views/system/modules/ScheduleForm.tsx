import { defineComponent, reactive, ref } from "vue";
import { NSpin, NForm, NInput, NGrid, NFormItemGi, FormValidationError } from "naive-ui";
import { getAction, httpAction } from "@/api/manage";
import { Method } from '@/utils/request';

export default defineComponent({
    name: 'ScheduleForm',
    emits: ['ok'],
    setup(props, { emit,expose }) {

        const url = reactive({
            save: '/sys/schedule/save',
            update: '/sys/schedule/update',
            info: '/sys/schedule/info/',
        })

        let confirmLoading = $ref(false)

        let form = $ref({
            id: '',
            beanName: '',
            parameter: '',
            cronExpression: '',
            status: 0,
            remark: '',
        })
        const formRef = ref()
        const rules = {
            beanName: [{
                required: true,
                message: '请输入bean名称'
            }],
            cronExpression: [{
                required: true,
                message: '请输入cron表达式'
            }]
        }

        const add = () => {
            
        }

        const editForm = (id: string): void => {
            // @ts-ignore
            getAction(`${url.info}${id}`).then((res: Result<any>) => {
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
                        httpurl = url.save;
                        method = 'post';
                    } else {
                        httpurl = url.update;
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
                    <NForm model={form} ref={formRef} rules={rules} size="medium" labelPlacement={'left'} labelWidth={90}>
                        <NGrid cols={24} x-xGap={24}>

                            <NFormItemGi span={24} path="beanName" label="bean名称">
                                <NInput v-model:value={form.beanName} />
                            </NFormItemGi>
                            <NFormItemGi span={24} label="参数">
                                <NInput v-model:value={form.parameter} />
                            </NFormItemGi>

                            <NFormItemGi span={24} path="cronExpression" label="cron表达式">
                                <NInput v-model:value={form.cronExpression} />
                            </NFormItemGi>

                            <NFormItemGi span={24} label="备注">
                                <NInput type="textarea" v-model:value={form.remark} />
                            </NFormItemGi>
                        </NGrid>
                    </NForm>
                </NSpin>
            )
        }
    }
})