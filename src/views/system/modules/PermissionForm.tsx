import { defineComponent, onMounted, reactive, ref } from "vue";
import { NSpin, NForm, NInput, NGrid, NFormItemGi, FormValidationError,NRadioGroup, NRadio,NSpace, NSwitch, NInputNumber, NTreeSelect } from "naive-ui";
import { getAction, httpAction } from "@/api/manage";
import { Method } from '@/utils/request';

export default defineComponent({
    name: 'PermissionForm',
    emits: ['ok'],
    setup(props, { emit,expose }) {

        const confirmLoading = ref(false)

        const form = ref({
            id: '',
            parentId: '',
            name: '',
            url: '',
            component: '',
            perms: '',
            type: 0,
            icon: '',
            hidden: 1,
            orderNum: 0
        })
        const treeSelectOptions = ref([])
        const formRef = ref()
        const rules = {
            name: [{
                required: true,
                message: '请输入用户名'
            }],
            parentId: [{
                required: true,
                message: '请输入手机号'
            }],
            url: [{
                required: true,
                message: '请输入姓名'
            }],
            component: [{
                required: true,
                message: '请输入邮箱'
            }]
            
        }


        const add = () => {
            
        }
        const addSubordinate = (parentId: string) => {
            form.value.type = 1
            form.value.parentId = parentId
        }
        const editForm = (id: string): void => {
            // @ts-ignore
            getAction(`/sys/permission/info/${id}`).then((res: Result<any>) => {
                if(res.success) {
                    form.value = res.result
                }
            })
        }
        const submitForm = () => {
            formRef.value.validate((error: Array<FormValidationError>) => {
                if (!error) {
                    confirmLoading.value = true
                    let httpurl = '';
                    let method: Method = 'put';
                    if (!form.value.id) {
                        httpurl = '/sys/permission/save';
                        method = 'post';
                    } else {
                        httpurl = '/sys/permission/update';
                        method = 'put';
                    }
                    let formData = Object.assign({}, form.value);
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
                        confirmLoading.value = false
                    })
                } 
            })
        }

        const loadTree = () => {
            // @ts-ignore
            getAction('/sys/permission/select').then((res: Result<any>) => {
                if(res.success) {
                    treeSelectOptions.value = res.result
                }
            })
        }
        onMounted(() => {
            loadTree()
        })

        expose({
            add,
            addSubordinate,
            editForm,
            submitForm
        })

        return () => {
            return (
                <NSpin show={confirmLoading.value}>
                    <NForm model={form.value} ref={formRef} rules={rules} size="medium" labelPlacement={'left'} labelWidth={80}>
                        <NGrid cols={24} x-xGap={24}>
                        <NFormItemGi span={24} path="username" label="类型">
                            
                                <NRadioGroup v-model:value={form.value.type}>
                                    <NSpace>
                                        <NRadio value={ 0 }>目录</NRadio>
                                        <NRadio value={ 1 }>菜单</NRadio>
                                        <NRadio value={ 2 }>按钮</NRadio>
                                    </NSpace>
                                </NRadioGroup>
                            </NFormItemGi>
                            <NFormItemGi span={24} path="name" label={ form.value.type === 2 ? '按钮/权限' : '菜单名称' }>
                                <NInput v-model:value={form.value.name} />
                            </NFormItemGi>
                            {
                                form.value.type !== 0 ?
                                <NFormItemGi span={24} path="parentId" label="上级菜单">
                                    <NTreeSelect options={ treeSelectOptions.value } v-model:value={ form.value.parentId }/>
                                </NFormItemGi>
                                : <></>
                            }
                            
                            {
                                form.value.type !== 2 ?
                                <NFormItemGi span={24} path="url" label="菜单路径">
                                    <NInput v-model:value={form.value.url} />
                                </NFormItemGi> 
                                : <></>
                            }
                            {
                                form.value.type !== 2 ?
                                <NFormItemGi span={24} path="component" label="前端组件">
                                    <NInput v-model:value={form.value.component} />
                                </NFormItemGi>
                                : <></>
                            }
                            {
                                form.value.type !== 0 ? 
                                <NFormItemGi span={24} label="授权标识">
                                    <NInput v-model:value={form.value.perms} />
                                </NFormItemGi>
                                : <></>
                            }
                            
                            {
                                form.value.type !== 2 ?
                                <NFormItemGi span={24} label="菜单图标">
                                    <NInput v-model:value={form.value.icon} />
                                </NFormItemGi>
                                : <></>
                            }
                            
                            <NFormItemGi span={24} label="排序">
                                <NInputNumber v-model:value={form.value.orderNum} />
                            </NFormItemGi>
                            <NFormItemGi span={24} label="隐藏路由">
                                <NSwitch v-model:value={form.value.hidden}/>
                            </NFormItemGi>
                        </NGrid>
                    </NForm>
                </NSpin>
            )
        }
    }
})