import { defineComponent, watch, ref } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
    name: 'InnerLink',
    setup() {  
        const route = useRoute()

        let url = ref('/athena/druid')
        let id = ref('')
        console.log(route)
        watch(
            () => route.fullPath,
            () => {
                console.log(url.value)
                //url.value = route.meta.url as string
                id.value = route.meta.key as string
            }
        )

        return () => {
            return (
                <div>
                    <iframe id={ id.value } src={ url.value } frameborder="no" width="100%" height="800px" scrolling="auto">
                        
                    </iframe>
                </div>
            )
        }
    }
})