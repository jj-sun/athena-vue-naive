import { defineComponent, onMounted, reactive, ref } from "vue";
import { NSpin, NForm, NInput, NGrid, NFormItemGi, FormValidationError,NRadioGroup,NRadio,NSpace, NSelect, NTreeSelect, TreeSelectOption } from "naive-ui";
import { getAction, httpAction } from "@/api/manage";
import { Method } from '@/utils/request';
import { SelectMixedOption } from "naive-ui/lib/select/src/interface";
import useSystem from "@/hooks/useSystem";

export default defineComponent({
    name: 'UserForm',
    emits: ['ok'],
    setup(props, { emit,expose }) {

        const { loadRoleSelect, loadDeptTree } = useSystem()

        const url = reactive({
            save: '/sys/user/save',
            update: '/sys/user/update',
            info: '/sys/user/info/'
        })

        let confirmLoading = $ref(false)

        let form = $ref({
            id: '',
            username: '',
            realname: '',
            email: '',
            mobile: '',
            deptCode: '',
            delFlag: 0,
            roleIdList: []
        })
        const formRef = ref()
        const rules = {
            username: [{
                required: true,
                message: '请输入用户名'
            }],
            realname: [{
                required: true,
                message: '请输入姓名'
            }],
            email: [{
                required: true,
                message: '请输入邮箱'
            }],
            mobile: [{
                required: true,
                message: '请输入手机号'
            }]
        }

        let roleSelectOptions = $ref(Array<SelectMixedOption>())
        let deptTreeOptions = $ref(Array<TreeSelectOption>())

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


        onMounted(() => {
            loadRoleSelect(roleSelectOptions)
            loadDeptTree(deptTreeOptions)
        })

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

                            <NFormItemGi span={24} path="username" label="用户名">
                                <NInput v-model:value={form.username} />
                            </NFormItemGi>
                            <NFormItemGi span={24} path="realname" label="姓名">
                                <NInput v-model:value={form.realname} />
                            </NFormItemGi>

                            <NFormItemGi span={24} path="email" label="邮箱">
                                <NInput v-model:value={form.email} />
                            </NFormItemGi>

                            <NFormItemGi span={24} path="mobile" label="手机号">
                                <NInput v-model:value={form.mobile} />
                            </NFormItemGi>
                            <NFormItemGi span={24} label="部门">
                                <NTreeSelect v-model:value={ form.deptCode } options={ deptTreeOptions }/>
                            </NFormItemGi>
                            <NFormItemGi span={24} label="角色">
                                <NSelect v-model:value={ form.roleIdList } multiple options={ roleSelectOptions }/>
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