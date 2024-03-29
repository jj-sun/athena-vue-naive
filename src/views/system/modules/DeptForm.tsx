import { defineComponent, onMounted, reactive, ref } from "vue";
import { NSpin, NForm, NInput, NGrid, NFormItemGi, FormValidationError,NRadioGroup, NRadio,NSpace, NSwitch, NInputNumber, NTreeSelect } from "naive-ui";
import { getAction, httpAction } from "@/api/manage";
import { Method } from '@/utils/request';
import useSystem from "@/hooks/useSystem";

export default defineComponent({
    name: 'DeptForm',
    emits: ['ok'],
    setup(props, { emit,expose }) {

        const { loadDeptTree } = useSystem()

        let confirmLoading = $ref(false)

        let form = $ref({
            id: '',
            parentId: '',
            deptName: '',
            deptCode: '',
            description: '',
            sortOrder: 0,
            delFlag: 0
        })
        let treeSelectOptions = $ref([])
        let formRef = ref()
        const rules = {
            deptName: [{
                required: true,
                message: '请输入部门名称'
            }],
            parentId: [{
                required: true,
                message: '请选择上级'
            }],
            deptCode: [{
                required: true,
                message: '请输入部门编码'
            }]
        }


        const add = () => {
            
        }
        const editForm = (id: string): void => {
            // @ts-ignore
            getAction(`/sys/dept/info/${id}`).then((res: Result<any>) => {
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
                        httpurl = '/sys/dept/save';
                        method = 'post';
                    } else {
                        httpurl = '/sys/dept/update';
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
            loadDeptTree($$(treeSelectOptions))
        })

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
                            <NFormItemGi span={24} path="deptName" label="部门名称">
                                <NInput v-model:value={form.deptName} />
                            </NFormItemGi>
                            <NFormItemGi span={24} label="上级菜单">
                                <NTreeSelect options={ treeSelectOptions } v-model:value={ form.parentId }/>
                            </NFormItemGi>
                            <NFormItemGi span={24} path="deptCode" label="部门编码">
                                <NInput v-model:value={form.deptCode} />
                            </NFormItemGi>
                            <NFormItemGi span={24} label="描述">
                                <NInput v-model:value={form.description} />
                            </NFormItemGi>
                            <NFormItemGi span={24} label="排序">
                                <NInputNumber v-model:value={form.sortOrder} />
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