import { defineComponent, reactive, ref } from "vue";
import { NSpin, NForm, NInput, NGrid, NFormItemGi, FormValidationError,NRadioGroup,NRadio,NSpace } from "naive-ui";
import { getAction, httpAction } from "@/api/manage";
import { Method } from '@/utils/request';

export default defineComponent({
    name: 'RoleForm',
    emits: ['ok'],
    setup(props, { emit,expose }) {

        let confirmLoading = $ref(false)

        let form = $ref({
            id: '',
            roleName: '',
            roleCode: '',
            remark: '',
            delFlag: 0
        })
        const formRef = ref()
        const rules = {
            roleName: [{
                required: true,
                message: '请输入角色名'
            }],
            roleCode: [{
                required: true,
                message: '请输入角色编码'
            }]
        }

        const add = () => {
            
        }

        const editForm = (id: string): void => {
            // @ts-ignore
            getAction(`/sys/role/info/${id}`).then((res: Result<any>) => {
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
                        httpurl = '/sys/role/save';
                        method = 'post';
                    } else {
                        httpurl = '/sys/role/update';
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
                    <NForm model={form} ref={formRef} rules={rules} size="medium" labelPlacement={'left'} labelWidth={60}>
                        <NGrid cols={24} x-xGap={24}>

                            <NFormItemGi span={24} path="roleName" label="角色名">
                                <NInput v-model:value={form.roleName} />
                            </NFormItemGi>
                            <NFormItemGi span={24} path="roleCode" label="角色编码">
                                <NInput v-model:value={form.roleCode} />
                            </NFormItemGi>

                            <NFormItemGi span={24} label="备注">
                                <NInput v-model:value={form.remark} />
                            </NFormItemGi>

                            <NFormItemGi span={24} label="状态">
                                <NRadioGroup v-model:value={form.delFlag}>
                                    <NSpace>
                                        <NRadio value={ 0 }>正常</NRadio>
                                        <NRadio value={ 1 }>禁用</NRadio>
                                    </NSpace>
                                </NRadioGroup>
                            </NFormItemGi>
                        </NGrid>
                    </NForm>
                </NSpin>
            )
        }
    }
})