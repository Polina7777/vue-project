<script lang="ts">
import useValidate from '@vuelidate/core'
import { required, numeric, alpha, maxLength } from '@vuelidate/validators'
import { ref } from 'vue'
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
      imageUrl: '',
      title: '',
      description: '',
      image: '',
      smallInfoKcal: '',
      smallInfoGrams: '',
      mins: '',
      serve: '',
      steps: [],
      ingredients: [],
      ingredientsArr: [{ name: '', image: '' }],
      categories: [],
      category: null,
      stepsArr: [{ name: 'Step 1', description: '' }],
      picked: ref(),
      errMsg: ref<string>(),
      rules: {
        title: { required, alpha, $autoDirty: true, $lazy: true },
        description: { required, alpha, maxLength: maxLength(100), $autoDirty: true, $lazy: true },
        smallInfoKcal: { required, numeric, $autoDirty: true, $lazy: true },
        smallInfoGrams: { required, numeric, $autoDirty: true, $lazy: true },
        mins: { required, numeric, $autoDirty: true, $lazy: true },
        serve: { required, numeric, $autoDirty: true, $lazy: true }
      },
      error: ref<boolean>()
    }
  },
  methods: {
    async submit() {
      const isFormCorrect = await this.v$.$validate()
      if (isFormCorrect) {
        this.submitForm()
        this.$router.push('/recipes')
      } else {
        alert('Form failed validation')
      }
    },
    async getCategories() {
      try {
        this.categories = await categoryApi.getCategoriesOfRecipes()
        this.categories.splice(2, 1)
      } catch (err) {
        console.log(err)
      }
    },
    async addStep() {
      const stepCount = this.stepsArr.length
      return this.stepsArr.push({ name: `Step ${stepCount + 1}`, description: '' })
    },
    async deleteStep(index: number) {
      if (this.ingredientsArr.length > 1) {
        return this.stepsArr.splice(index)
      }
    },
    async addIngredient() {
      return this.ingredientsArr.push({ name: '', image: '' })
    },
    async deleteIngredient(index: number) {
      if (this.ingredientsArr.length > 1) {
        return this.ingredientsArr.splice(index)
      }
    },
    handleImageChange(event:any) {
      const file = event.target.files[0]
      if (file) {
        this.imageUrl = URL.createObjectURL(file)
      }
    },
    async submitForm() {
      try {
        const res = await recipesApi.createNewRecipe(
          this.title,
          this.description,
          this.category,
          this.image,
          this.smallInfoKcal,
          this.smallInfoGrams,
          this.mins,
          this.serve,
          this.stepsArr,
          this.ingredientsArr
        )
        if (res.data) {
          console.log(res)
        } else {
          alert(res.error.message)
        }
      } catch (error) {
        console.log(error)
      }
    }
  },
  validations() {
    return {
      title: { required, alpha, $autoDirty: true, $lazy: true },
      description: { required, alpha, maxLength: maxLength(100), $autoDirty: true, $lazy: true },
      smallInfoKcal: { required, numeric, $autoDirty: true, $lazy: true },
      smallInfoGrams: { required, numeric, $autoDirty: true, $lazy: true },
      mins: { required, numeric, $autoDirty: true, $lazy: true },
      serve: { required, numeric, $autoDirty: true, $lazy: true }
    }
  }
}
</script>

<template>
  <div class="recipes_inputs__wrapper">
    <input class="recipe_input" type="file" placeholder="Image" @change="handleImageChange" />
    <img :src="imageUrl" alt="image" v-if="imageUrl" />
    <p>Title:</p>
    <input class="recipe_input" type="text" placeholder="Title" v-model="title" />
    <span class="error" v-if="v$.title.$error">
      {{ v$.title.$errors[0].$message }}
    </span>
    <p>Description:</p>
    <input class="recipe_input" type="text" placeholder="Description" v-model="description" />
    <span class="error" v-if="v$.description.$error">
      {{ v$.description.$errors[0].$message }}
    </span>
    <div class="picker_box">
      <p class="category_title">Category:</p>
      <label v-for="(item, index) in categories" :key="index">
        <input type="radio" :value="item.id" v-model="category" />
        {{ item.attributes.name }}
      </label>
    </div>

    <div class="ingredients_wrapper">
      <p for="ingredients">Ingredients:</p>
      <div class="input_wrapper" v-for="(item, index) in ingredientsArr">
        <input class="recipe_input" type="text" v-model="item.name" />
        <button class="count_button" @click="deleteIngredient(index)">-</button>
      </div>
      <button class="count_button" @click="addIngredient">+</button>
    </div>

    <div class="info_wrapper">
      <div class="info_item">
        <label class="label_info" for="Kcal">Kcal:</label>
        <input class="recipe_input" type="text" placeholder="Kcal" v-model="smallInfoKcal" />
        <span class="error" v-if="v$.smallInfoKcal.$error">
          {{ v$.smallInfoKcal.$errors[0].$message }}
        </span>
      </div>
      <div class="info_item">
        <label class="label_info" for="Grams">Grams:</label>
        <input class="recipe_input" type="text" placeholder="Grams" v-model="smallInfoGrams" />
        <span class="error" v-if="v$.smallInfoGrams.$error">
          {{ v$.smallInfoGrams.$errors[0].$message }}
        </span>
      </div>
      <div class="info_item">
        <label class="label_info" for="Mins">Mins:</label>
        <input class="recipe_input" type="text" placeholder="Mins" v-model="mins" />
        <span class="error" v-if="v$.mins.$error">
          {{ v$.mins.$errors[0].$message }}
        </span>
      </div>
      <div class="info_item">
        <label class="label_info" for="Serve">Serve:</label>
        <input class="recipe_input" type="text" placeholder="Serve" v-model="serve" />
        <span class="error" v-if="v$.serve.$error">
          {{ v$.serve.$errors[0].$message }}
        </span>
      </div>
    </div>
    <p>Process:</p>
    <div class="process">
      <div class="step" v-for="(item, index) in stepsArr">
        <label for="step">{{ item.name }}</label>
        <div class="input_wrapper">
          <input class="recipe_input" type="text" v-model="item.description" />
          <button class="count_button" @click="deleteStep(index)">-</button>
        </div>
      </div>

      <button class="count_button" @click="addStep">+</button>
    </div>
  </div>
  <button class="submit_button" @click="submit">Submit</button>
</template>
<style scoped>
.modal_wrapper {
  padding: 20px;
}
.recipes_inputs__wrapper {
  padding: 10px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  color: rgb(229, 229, 242);
}
label {
  align-self: start;
  padding: 5px;
  font-size: 1rem;
}
input,
.info_item {
  margin: 0;
  z-index: 1000;
}
.picker_box {
  display: flex;
  flex-wrap: wrap;
}
.modal_wrapper {
  overflow: scroll;
}
.input_wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}
p {
  font-size: 1.3rem;
  align-self: start;
}
.process,
.ingredients_wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 0.3px solid rgb(147, 147, 170);
  background-color: var(--background-general);
  border-radius: 10px;
  padding: 10px 20px;
  margin: 20px;
}
.step {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.info_wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
}
.recipe_input {
  display: flex;
  flex-direction: column;
  color: rgb(233, 233, 239);
  width: 100%;
  border: 2px solid rgb(199, 199, 232);
  background-color: transparent;
  border-radius: 10px;
  margin: 5px 0;
  padding: 10px;
  outline: none;
  flex-wrap: wrap;
  z-index: 1000;
}
.picker_box {
  display: flex;
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
  gap: 10px;
  z-index: 1000;
}

.submit_button {
  padding: 20px;
  margin: 30px;
}
.submit_button,
.count_button {
  border: 2px solid rgb(199, 199, 232);
  background-color: var(--background-general);
  border-radius: 10px;
  color: rgb(240, 240, 245);
  font-size: 1rem;
  align-items: center;
  z-index: 1000;
}
.count_button {
  margin: 2px;
  width: 30px;
  height: 30px;
  text-align: center;
  background-color: rgb(147, 147, 170);
}
.error {
  font-size: 0.7rem;
  color: rgb(176, 9, 9);
}
@media (max-width: 900px) {
  p,
  label {
    font-size: 0.8rem;
  }
  .recipe_input {
    padding: 7px;
  }
  .count_button {
    min-width: 25px;
    width: 25px;
    height: 25px;
    font-size: 0.9rem;
    text-align: center;
    border-radius: 8px;
    padding: 0 5px;
    background-color: rgb(147, 147, 170);
  }
  .submit_button {
    padding: 5px;
  }
}
</style>
