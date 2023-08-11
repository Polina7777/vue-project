<script lang="ts">
import useValidate from '@vuelidate/core'
import { required, email, numeric, alpha, minLength, maxLength } from '@vuelidate/validators'
import { ref } from 'vue'
import { userApi } from '@/api-requests/user-api'
import { categoryApi } from '@/api-requests/category-api'
import { recipesApi } from '@/api-requests/recipes-api'

export default {
  props: ['user'],
  created() {
    this.getCategories()
  },
  data() {
    return {
      v$: useValidate(),
      imageUrl: null,
      title: '',
      description: '',
      image: '',
      smallInfoKcal: '',
      smallInfoGrams: '',
      mins: '',
      serve: '',
      steps: [],
      ingredientArr:{name:'',image:''},
      ingredients: [],
      ingredientsArr: [{name:'',image:''}],
      categories: '',
      category: ref({id:''}),
      stepsArr: [{name:'Step 1',description:''}],
      errMsg: ref<string>(),
      rules: {
        title: { required, alpha, $autoDirty: true, $lazy: true },
        description: { required, alpha, maxLength: maxLength(30), $autoDirty: true, $lazy: true },
        // image: { required },
        smallInfoKcal: { required, numeric },
        smallInfoGrams: { required, numeric },
        mins: { required, numeric },
        serve: { required, numeric },
       // steps: { required, maxLength: maxLength(300) }
      },
      error: ref<boolean>()
    }
  },
  methods: {
    async submit() {
      const isFormCorrect = await this.v$.$validate()
      if (isFormCorrect) {
        // this.login()
        this.$router.push('/')
      } else {
        alert('Form failed validation')
      }
    },
    async getCategories() {
      // this.loading = true
      // this.error = false
      try {
        this.categories = await categoryApi.getCategoriesOfRecipes()
        this.categories.splice(2, 1)
      } catch (err) {
        // this.error = true
      } finally {
        // this.loading = false
      }
    },
    async addStep() {
      const stepCount = this.stepsArr.length
      return this.stepsArr.push({name:`Step ${stepCount + 1}`,description:''})
    },
    async deleteStep(index: number) {
      return this.stepsArr.splice(index)
    },
    async addIngredient() {
      return this.ingredientsArr.push({name:'',image:''})
    },
    async deleteIngredient(index: number) {
      return this.ingredientsArr.splice(index)
    },
    handleImageChange(event) {
      const file = event.target.files[0]
      if (file) {
        this.imageUrl = URL.createObjectURL(file)
      }
    },
       async submitForm() {
        console.log(this.stepsArr)
        console.log(this.title,this.description,3,this.image,this.smallInfoKcal,this.smallInfoGrams,this.mins,this.serve,this.stepsArr,this.ingredientsArr)
      try {
      const res = await recipesApi.createNewRecipe(this.title,this.description,3,this.image,this.smallInfoKcal,this.smallInfoGrams,this.mins,this.serve,this.stepsArr,this.ingredientsArr)
      if (res.data){
        // localStorage.setItem('jwt', res.jwt)
        //  localStorage.setItem('userData', JSON.stringify(res.user))
        // this.$router.push('/')
        // this.user({
        //   jwt:res.jwt,
        //   user:res.user
        // })
        console.log(res)
      } else {
        alert(res.error.message)
      }

       } catch(error) {
        console.log(error)
          // this.error = true
          //  this.password = ''
             }
           },

    // async login() {
    //   try {
    //   const res = await userApi.loginUser(this.email,this.password)
    //   if (res.data){
    //     localStorage.setItem('jwt', res.jwt)
    //      localStorage.setItem('userData', JSON.stringify(res.user))
    //     this.$router.push('/')
    //     this.user({
    //       jwt:res.jwt,
    //       user:res.user
    //     })
    //   } else {
    //     alert(res.error.message)
    //   }

    //    } catch(error) {
    //     console.log(error)
    //       this.error = true
    //        this.password = ''
    //          }
    //        },
    // userBearer(jwt:string,user:any){
    //   try {
    //     const res2 = userApi.userBearer(jwt,user)
    //     this.$router.push('/')
    //   } catch (error) {
    //     this.error = true
    //     console.log(error)
    //   }
    // }
  },
  validations() {
    return {
      title: { required, alpha, $autoDirty: true, $lazy: true },
      description: { required, alpha, maxLength: maxLength(30), $autoDirty: true, $lazy: true },
      //image: { required },
      smallInfoKcal: { required, numeric },
      smallInfoGrams: { required, numeric },
      mins: { required, numeric },
      serve: { required, numeric },
     // steps: { required, maxLength: maxLength(300)}
    }
  }
}
</script>

<template>
  <div class="recipes_inputs__wrapper">
    <input class="auth_input" type="file" placeholder="Image" @change="handleImageChange" />
    <img :src="imageUrl" alt="image" v-if="imageUrl" />
    <!-- <span class="error" v-if="v$.image.$error">
      {{ v$.image.$errors[0].$message }}
    </span> -->
    <label for="title">Title:</label>
    <input class="auth_input" type="text" placeholder="Title" v-model="title" />
    <span class="error" v-if="v$.title.$error">
      {{ v$.title.$errors[0].$message }}
    </span>
    <label for="description">Description:</label>
    <input class="auth_input" type="text" placeholder="Description" v-model="description" />
    <span class="error" v-if="v$.description.$error">
      {{ v$.description.$errors[0].$message }}
    </span>
    <div class="picker_box">
      <label for="category">Category:</label>
      <div class="picker_wrapper" v-for="(item, index) in categories">
        <input type="radio" :value="item.attributes.id" v-model="category.id" />
        <label for="item">{{ item.attributes.name }}</label>
      </div>
    </div>
<div class="ingredients_wrapper">
  <label for="ingredients">Ingredients:</label>
      <ul>
        <li class="ingredient" v-for="(item, index) in ingredientsArr">
          <div class="input_wrapper">
            <input class="auth_input" type="text" v-model="item.name" />
            <!-- <input class="auth_input" type="text" v-model="item.image" /> -->
            <button class="submit_button" @click="deleteIngredient(index)">-</button>
            <!-- <span class="error" v-if="v$.steps.$error">
        {{ v$.steps.$errors[0].$message }}
      </span> -->
          </div>
        </li>
      </ul>
      <button class="submit_button" @click="addIngredient">Add Ingredient</button>
</div>

    <div class="info_wrapper">
      <div class="info_item">
        <label class="label_info" for="Kcal">Kcal:</label>
        <input class="auth_input" type="text" placeholder="Kcal" v-model="smallInfoKcal" />
        <span class="error" v-if="v$.smallInfoKcal.$error">
          {{ v$.smallInfoKcal.$errors[0].$message }}
        </span>
      </div>
      <div class="info_item">
        <label class="label_info" for="Grams">Grams:</label>
        <input class="auth_input" type="text" placeholder="Grams" v-model="smallInfoGrams" />
        <span class="error" v-if="v$.smallInfoGrams.$error">
          {{ v$.smallInfoGrams.$errors[0].$message }}
        </span>
      </div>
      <div class="info_item">
        <label class="label_info" for="Mins">Mins:</label>
        <input class="auth_input" type="text" placeholder="Mins" v-model="mins" />
        <span class="error" v-if="v$.mins.$error">
          {{ v$.mins.$errors[0].$message }}
        </span>
      </div>
      <div class="info_item">
        <label class="label_info" for="Serve">Serve:</label>
        <input class="auth_input" type="text" placeholder="Serve" v-model="serve" />
        <span class="error" v-if="v$.serve.$error">
          {{ v$.serve.$errors[0].$message }}
        </span>
      </div>
    </div>
    <div class="process">
      <label for="process">Process: </label>
      <ul>
        <li class="step" v-for="(item, index) in stepsArr">
          <label for="step">{{ item.name }}</label>
          <div class="input_wrapper">
            <input class="auth_input" type="text" v-model="item.description" />
            <button class="submit_button" @click="deleteStep(index)">-</button>
            <!-- <span class="error" v-if="v$.steps.$error">
        {{ v$.steps.$errors[0].$message }}
      </span> -->
          </div>
        </li>
      </ul>
      <button class="submit_button" @click="addStep">Add Step</button>
    </div>
  </div>
  <button class="submit_button" @click="submitForm">Submit</button>
</template>
<style scoped>
.recipes_inputs__wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  color: rgb(229, 229, 242);
  padding-bottom: 30px;
}
label {
  align-self: start;
  padding: 10px;
}
.input_wrapper {
  display: flex;
  flex-direction: row;
}
h2 {
  font-size: 1rem;
}
.process {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.step {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.info_wrapper {
  display: flex;
  flex-direction: row;
  gap: 10px;
}
.auth_input,
.name {
  display: flex;
  flex-direction: column;
  color: rgb(233, 233, 239);
  width: 100%;
  border: 2px solid rgb(199, 199, 232);
  background-color: transparent;
  border-radius: 10px;
  margin: 10px 0;
  padding: 10px;
  outline: none;
  flex-wrap: wrap;
}
.picker_box {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}
.name_input {
  width: 100%;
  font-size: 1rem;
}
.submit_button {
  padding: 5px 8px;
  border: 2px solid rgb(199, 199, 232);
  background-color: var(--background-general);
  border-radius: 10px;
  color: rgb(240, 240, 245);
  font-size: 1rem;
  align-items: center;
}
.error {
  font-size: 0.7rem;
  color: rgb(176, 9, 9);
}
</style>
