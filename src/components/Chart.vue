  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import {  BarChart} from 'vue-chart-3';
  import { Chart, registerables } from "chart.js";
  
  Chart.register(...registerables);
//   const chartBy = ref('Time')
  export default defineComponent({
    props: ['allCardInfo'],
    name: 'Home',
    data(){
    return {
      chartBy: ref('Time'),
    }
    },
    components: { BarChart },
    setup(props) {
        const labels = props.allCardInfo.map((item,index)=>{
             return item.attributes.title
            })
        const dataCalories = props.allCardInfo.map((item,index)=>{ 
            const data = item.attributes.extra_info.data.attributes.kcal;
            const result = data.replace(/kcal/i,'')
            return Number(result)
        })
        const dataTime = props.allCardInfo.map((item,index)=>{
             const data = item.attributes.extra_info.data.attributes.min;
             const result = data.replace(/mins/i,'')
             return Number(result)
            })
      const testDataByTime = {
        labels: labels,
        datasets: [
          {
       label:'mins',
        barThickness: 15,
            data: dataTime,
            backgroundColor: ['#77CEFF', '#0079AF', '#123E6B', '#97B0C4', '#A5C8ED'],
          },
        ],
      };
      console.log(testDataByTime)
      const testDataByCalories = {
        labels: labels,
        datasets: [
          {
            label:'calories',
        barThickness: 15,
            data: dataCalories,
            backgroundColor: ['#77CEFF', '#0079AF', '#123E6B', '#97B0C4', '#A5C8ED'],
          },
        ],
      };
  
      return { testDataByTime, testDataByCalories };
    },
    
  });
  
  </script>



  <template>
        <!-- <div class="picker_wrapper"> -->
    <div class="picker_box">
    <h2>Chart by:</h2>
    <div class="picker_wrapper">
  <!-- <input class="name" placeholder="Chart by ..." v-model="chartBy">  -->
  <input type="radio" id="time" value="Time" v-model="chartBy">
  <label for="time">Time</label>
  <input type="radio" id="calories" value="Calories" v-model="chartBy">
  <label for="calories">Calories</label>
</div>
</div>
<!-- <button class="submit_button" @click=submit>Submit</button> -->
<!-- 
<BarChart  :chartData="testDataByTime" />
    <BarChart :chartData="testDataByCalories" /> -->
    <BarChart v-if="chartBy === 'Time'" :chartData="testDataByTime" />
    <BarChart v-if="chartBy === 'Calories'" :chartData="testDataByCalories" />
  </template>


<style scoped>
.picker_box{
color: var(--text-primary);
display: flex;
flex-direction: column;
justify-content: baseline;
align-items: center;
padding: 5px;

}
.picker_wrapper{
display: flex;
flex-direction: row;
gap: 10px;
color: var(--text-primary);
justify-content: var();
align-items: center;
padding: 10px;
font-weight: 600;
font-size: 1rem;
}
label{
    padding-right: 10px;
}
h2{
    font-weight: 600;
    font-size: 1.3rem;
}
#bar-chat {
width: 300px;
}
</style>