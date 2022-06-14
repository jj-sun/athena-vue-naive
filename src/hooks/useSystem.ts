import { getAction } from "@/api/manage"

export default function useSystem() {

    const loadRoleSelect = (result: any) => {
        // @ts-ignore
        getAction('/sys/role/select').then((res: Result<any>) => {
            if(res.success) {
                result.value = res.result
            }
        })
    }

    const loadDeptTree = (result: any) => {
        // @ts-ignore
        getAction('/sys/dept/select').then((res: Result<any>) => {
            if(res.success) {
                result.value = res.result
            }
        })
    }
    
    return {
        loadRoleSelect,
        loadDeptTree
    }

}