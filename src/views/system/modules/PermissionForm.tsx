import { Component, defineComponent, onMounted, reactive, ref } from "vue";
import { NSpin, NForm, NInput, NGrid, NFormItemGi, FormValidationError,NRadioGroup, NRadio,NSpace, NSwitch, NInputNumber, NTreeSelect, NIcon, NButton, NInputGroup } from "naive-ui";
import { getAction, httpAction } from "@/api/manage";
import { Method } from '@/utils/request';
import Icons from "@/components/icons";
import { SettingTwotone } from '@vicons/antd'
import * as antd from '@vicons/antd'

export default defineComponent({
    name: 'PermissionForm',
    emits: ['ok'],
    setup(props, { emit,expose }) {

        let confirmLoading = $ref(false)

        let form = $ref({
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
        let treeSelectOptions = $ref([])

        const formRef = ref()

        const iconsRef = ref()

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
            form.type = 1
            form.parentId = parentId
        }
        const editForm = (id: string): void => {
            // @ts-ignore
            getAction(`/sys/permission/info/${id}`).then((res: Result<any>) => {
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
                        httpurl = '/sys/permission/save';
                        method = 'post';
                    } else {
                        httpurl = '/sys/permission/update';
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

        const loadTree = () => {
            // @ts-ignore
            getAction('/sys/permission/select').then((res: Result<any>) => {
                if(res.success) {
                    treeSelectOptions = res.result
                }
            })
        }
        const chooseIcon = () => {
            iconsRef.value.showIcon()
        }
        const handleIconChoose = (icon: string) => {
            form.icon = icon
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
                <NSpin show={confirmLoading}>
                    <NForm model={form} ref={formRef} rules={rules} size="medium" labelPlacement={'left'} labelWidth={80}>
                        <NGrid cols={24} x-xGap={24}>
                        <NFormItemGi span={24} path="username" label="类型">
                            
                                <NRadioGroup v-model:value={form.type}>
                                    <NSpace>
                                        <NRadio value={ 0 }>目录</NRadio>
                                        <NRadio value={ 1 }>菜单</NRadio>
                                        <NRadio value={ 2 }>按钮</NRadio>
                                    </NSpace>
                                </NRadioGroup>
                            </NFormItemGi>
                            <NFormItemGi span={24} path="name" label={ form.type === 2 ? '按钮/权限' : '菜单名称' }>
                                <NInput v-model:value={form.name} />
                            </NFormItemGi>
                            {
                                form.type !== 0 ?
                                <NFormItemGi span={24} path="parentId" label="上级菜单">
                                    <NTreeSelect options={ treeSelectOptions } v-model:value={ form.parentId }/>
                                </NFormItemGi>
                                : <></>
                            }
                            
                            {
                                form.type !== 2 ?
                                <NFormItemGi span={24} path="url" label="菜单路径">
                                    <NInput v-model:value={form.url} />
                                </NFormItemGi> 
                                : <></>
                            }
                            {
                                form.type !== 2 ?
                                <NFormItemGi span={24} path="component" label="前端组件">
                                    <NInput v-model:value={form.component} />
                                </NFormItemGi>
                                : <></>
                            }
                            {
                                form.type !== 0 ? 
                                <NFormItemGi span={24} label="授权标识">
                                    <NInput v-model:value={form.perms} />
                                </NFormItemGi>
                                : <></>
                            }
                            
                            {
                                form.type !== 2 ?
                                <NFormItemGi span={24} label="菜单图标">
                                    <NInputGroup>
                                        <NInput disabled style={ 'width: 90%' } v-model:value={form.icon} placeholder='请选择图标'>
                                            {{
                                                prefix: () => <NIcon component={ antd[form.icon] }/>
                                            }}
                                        </NInput>
                                        <NButton type="default" onClick={ chooseIcon }>
                                            {{
                                                icon: () => <NIcon component={ SettingTwotone }/>
                                            }}
                                        </NButton>
                                    </NInputGroup>
                                </NFormItemGi>
                                : <></>
                            }
                            
                            <NFormItemGi span={24} label="排序">
                                <NInputNumber v-model:value={form.orderNum} />
                            </NFormItemGi>
                            <NFormItemGi span={24} label="隐藏路由">
                                <NSwitch v-model:value={form.hidden}/>
                            </NFormItemGi>
                        </NGrid>
                    </NForm>
                    <Icons ref={ iconsRef } onOk={ handleIconChoose }/>
                </NSpin>
            )
        }
    }
})