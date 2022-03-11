import { NCard, NCol, NDrawerContent, NGi, NGrid, NIcon, NProgress, NRow, NStatistic } from 'naive-ui'
import { CSSProperties, defineComponent, onMounted } from 'vue'
import { Chart } from '@antv/g2'

export default defineComponent({
  name: 'Dashboard',
  setup() {

    const grid: CSSProperties = {
      marginBottom: '20px'
    }

    const data = [
      { day: '1', value: 40 },
      { day: '2', value: 60 },
      { day: '3', value: 80 },
      { day: '4', value: 100 },
      { day: '5', value: 60 },
    ];
    const data1 = [
      { type: '未知', value: 654, percent: 0.02 },
      { type: '17 岁以下', value: 654, percent: 0.02 },
      { type: '18-24 岁', value: 4400, percent: 0.2 },
      { type: '25-29 岁', value: 5300, percent: 0.24 },
      { type: '30-39 岁', value: 6200, percent: 0.28 },
      { type: '40-49 岁', value: 3300, percent: 0.14 },
      { type: '50 岁以上', value: 1500, percent: 0.06 },
    ];
    
    const init = () => {

      let chart = new Chart({
        container: 'container',
        autoFit: true,
        height: 40,
      });

      chart.data(data);
      chart.scale({
        value: {
          min: 20,
          nice: true,
        }
      });
      chart.axis(false);

      chart.tooltip({
        showCrosshairs: true,
        shared: true,
      });
      
      chart.area().position('day*value');
      chart.line().position('day*value');
      
      chart.render();
    }

    const digram1 = () => {
      const chart = new Chart({
        container: 'container1',
        autoFit: true,
        height: 300,
        padding: [50, 20, 50, 20],
      });
      chart.data(data1);
      chart.scale('value', {
        alias: '销售额(万)',
      });
      
      chart.axis('type', {
        tickLine: {
          alignTick: false,
        },
      });
      chart.axis('value', false);
      
      chart.tooltip({
        showMarkers: false,
      });
      chart.interval().position('type*value');
      chart.interaction('element-active');
      
      // 添加文本标注
      data1.forEach((item) => {
        chart
          .annotation()
          .text({
            position: [item.type, item.value],
            content: item.value,
            style: {
              textAlign: 'center',
            },
            offsetY: -30,
          })
          .text({
            position: [item.type, item.value],
            content: (item.percent * 100).toFixed(0) + '%',
            style: {
              textAlign: 'center',
            },
            offsetY: -12,
          });
      });
      chart.render();
    }
    onMounted(() => {
      init()
      digram1()
    })

    return () => {
      return (
        <div>
          
            <NGrid style={ grid } xGap={ 12 } cols={4}>
              <NGi>
                <NCard segmented={ { footer: true } } contentStyle={ 'height: 250px' }>
                  {{
                    header: () => (
                      <NStatistic label='当日访问量' value='+1000'>
                        
                      </NStatistic>
                    ),
                    default: () => (
                      '较昨日新增：500'
                    ),
                    footer: () => (
                      '总访问量: 5000'
                    )
                  }} 
                </NCard>
              </NGi>
              <NGi>
                <NCard segmented={ { footer: true } }>
                {{
                    header: () => (
                      <NStatistic label='当日活跃用户' value='+3000'>
                        
                      </NStatistic>
                    ),
                    default: () => (
                      '较昨日新增：500'
                    ),
                    footer: () => (
                      '总用户量: 10000'
                    )
                  }} 
                </NCard> 
              </NGi>
              <NGi>
                <NCard segmented={ { footer: true } }>
                {{
                    header: () => (
                      <NStatistic label='当月销售额' value='￥50000'>
                        100
                      </NStatistic>
                    ),
                    default: () => (
                      <NProgress type='line' percentage={ 80 } indicatorPlacement='outside' height={ 10 } />
                    ),
                    footer: () => (
                      '总销售额: ￥100000'
                    )
                  }} 
                </NCard> 
              </NGi>
              <NGi>
                <NCard segmented={ { footer: true } }>
                {{
                    header: () => (
                      <NStatistic label='当月订单量' value='100笔'>
                        
                      </NStatistic>
                    ),
                    default: () => (
                      <div id="container"></div>
                    ),
                    footer: () => (
                      '累计订单量: 672笔'
                    )
                  }} 
                </NCard> 
              </NGi>
            </NGrid>
            <NCard title='活跃年龄'>
            <div id="container1"></div>
            </NCard>
         
          
        </div>
      )
    }
  },
})
