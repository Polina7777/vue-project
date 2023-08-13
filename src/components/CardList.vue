<script lang="ts">
import { ref } from 'vue'
import FiltersModal from './FiltersModal.vue'
import ChartModal from './ChartModal.vue'
import Error from './Error.vue'
import Loader from './Loader.vue'
import { categoryApi } from '@/api-requests/category-api'
import { filtersApi } from '@/api-requests/filters-api'
import { url_ngrok } from '@/api-requests'
import { favoritesApi } from '@/api-requests/favorites-api'
import { userApi } from '@/api-requests/user-api'
import { recipesApi } from '@/api-requests/recipes-api'
import type { IRecipe, ITag } from '@/interfaces'
import { gsap } from 'gsap'

export default {
  created() {
    this.getCards()
    this.getLikedRecipes()
    if (localStorage.getItem('userData')) {
      this.userInfo = JSON.parse(localStorage.getItem('userData') as string)
    }
  },

  data() {
    return {
      info: ref<any>(),
      userInfo: ref(),
      searchQuery: ref(''),
      categories: ref(),
      smallInfo: ref(),
      pageCount: ref(1),
      allPagesCount: ref(),
      showFiltersModal: ref(false),
      sortAsc: ref(false),
      filters: ref({
        kcal: null,
        serve: null,
        grams: null
      }),
      error: ref(),
      tag: ref(),
      currentTag: ref(),
      loading: ref(),
      favFilter: ref(),
      errorText: ref('No result!'),
      favoritesList: ref(),
      likeClicked: ref(false),
      checkComplite: ref(false),
      userData: ref(),
      cardInfo: ref(),
      likesList: ref(),
      filterByFav: ref(false),
      showChartModal: ref(false),
      allCardInfo: ref()
    }
  },
  watch: {
    pageCount: async function newPage() {
      console.log(this.currentTag)
      if (this.currentTag === null || this.filterByFav) {
        this.filterByFavorites()
      } else if (Object.values(this.filters).filter((item) => item).length) {
        this.getFilteredCardListByFiltersModal()
      } else {
        this.getCards()
      }
    },
    currentTag: async function filterTag() {
      this.favFilter = false
      this.filterByTag(this.currentTag?.id)
    },
    sortAsc: async function sort() {
      this.sortCardList()
    },
    favoritesList: async function checkFav() {
      this.checkIsFavorite(this.info)
    },
    userData: async function getFav() {
      this.getUsersFavoritesList()
    },
    likeClicked: async function () {
      this.getUsersFavoritesList()
      this.getLikedRecipes()
    }
  },
  computed: {
    filteredData() {
      if (this.searchQuery && this.info) {
        return this.info.filter((item: IRecipe) => {
          return item.attributes.title.toLowerCase().includes(this.searchQuery.toLowerCase())
        })
      } else {
        return this.info
      }
    }
  },
  methods: {
    async getCards() {
      this.error = false
      this.loading = true
      this.favFilter = false
      this.userInfo = JSON.parse(localStorage.getItem('userData') as string)
      const user = await userApi.getUsersById(this.userInfo.id)
      this.userData = user
      this.getCategories()
      const sortType = this.sortAsc ? 'asc' : 'desc'
      try {
        const recipesData = await recipesApi.getAllRecipesWithIngredientCollection(
          sortType,
          this.pageCount
        )
        this.info = recipesData.data
        this.allCardInfo = await recipesApi.getAllRecipesWithIngredientCollectionWithoutPagination()
        this.allPagesCount = recipesData.meta.pagination.pageCount
      } catch (err) {
        this.error = true
      } finally {
        this.loading = false
      }
    },
    async getCategories() {
      this.loading = true
      this.error = false
      try {
        this.categories = await categoryApi.getCategoriesOfRecipes()
      } catch (err) {
        this.error = true
      } finally {
        this.loading = false
      }
    },
    favoriteTagClick() {
      this.pageCount = 1
      this.filterByFav = true
      // this.currentTag = {};
      this.loading = true
      this.favFilter = true
      this.error = false
      this.loading = true
      this.filterByFavorites()
    },
    async filterByFavorites() {
      this.loading = true
      this.favFilter = true
      this.error = false
      this.loading = true
      const sortType = this.sortAsc ? 'asc' : 'desc'
      try {
        const user = await userApi.getUsersById(this.userInfo.id)
        const filteredList = await favoritesApi.getFavorites(user.favorite.id)
        const idArr = filteredList.map((item: any) => item.id)
        const resultArray = []
        for (const item of idArr) {
          const response = await fetch(`${url_ngrok}api/foods/${item}?populate=*`)
          const result = await response.json()
          resultArray.push(result.data)
          this.likesList = resultArray
        }
        if (resultArray.length) {
          this.allPagesCount = Math.ceil(resultArray.length / 3)
          if (this.pageCount > this.allPagesCount) {
            return (this.pageCount = 1)
          }
          let array = resultArray
          let size = 3
          let subarray = []
          for (let i = 0; i < Math.ceil(array.length / size); i++) {
            subarray[i] = array.slice(i * size, i * size + size)
          }
          this.info = subarray[this.pageCount - 1]
          return this.info
          // return  this.info = resultArray;
        } else {
          this.error = true
          // this.currentTag = {id:4, attributes:{}}
        }
      } catch (error) {
        this.error = true
        // this.currentTag = {id:4, attributes:{}}
      } finally {
        this.loading = false
      }
    },
    async getLikedRecipes() {
      try {
        const user = await userApi.getUsersById(this.userInfo.id)
        const filteredList = await favoritesApi.getFavorites(user.favorite.id)
        const idArr = filteredList.map((item: any) => item.id)
        const resultArray = []
        for (const item of idArr) {
          const response = await fetch(`${url_ngrok}api/foods/${item}?populate=*`)
          const result = await response.json()
          resultArray.push(result.data)
        }
        return (this.likesList = resultArray)
      } catch (error) {
        this.error = true
      } finally {
        this.loading = false
      }
    },
    async getFilteredCardListByFiltersModal() {
      this.loading = true
      this.error = false
      const sortType = this.sortAsc ? 'asc' : 'desc'
      console.log(this.filters)
      try {
        const filteredCardList = await filtersApi.filtersByFiltersForm(
          this.filters,
          sortType,
          this.pageCount
        )
        if (filteredCardList.filteredData.length) {
          //   if (this.pageCount > this.allPagesCount) {
          //     this.filters ={
          //  kcal: "",
          //  serve: "",
          //  grams: "",
          // }
          //   return this.pageCount = 1
          // }
          this.allPagesCount = filteredCardList.pagination.pageCount
          return (this.info = filteredCardList.filteredData)
        } else {
          this.error = true
          this.currentTag = { id: 4, attributes: {} }
        }
        this.loading = false
      } catch (err) {
        this.error = true
        this.currentTag = { id: 4, attributes: {} }
      } finally {
        this.loading = false
      }
    },
    async sortCardList() {
      this.loading = true
      this.error = false
      try {
        let sortList
        if (this.sortAsc) {
          sortList = this.info?.sort(function (a: IRecipe, b: IRecipe) {
            if (a.attributes.title < b.attributes.title) {
              return -1
            }
            if (a.attributes.title > a.attributes.title) {
              return 1
            }
            return 0
          })
          return (this.info = sortList)
        } else {
          sortList = this.info?.sort(function (a: IRecipe, b: IRecipe) {
            if (b.attributes.title < a.attributes.title) {
              return -1
            }
            if (a.attributes.title > a.attributes.title) {
              return 1
            }
            return 0
          })
          return (this.info = sortList)
        }
      } catch (err) {
        this.error = true
      } finally {
        this.loading = false
      }
    },
    toggleSortType() {
      return (this.sortAsc = !this.sortAsc)
    },

    onClickLeftHandler() {
      console.log('like')
      if (this.pageCount <= 1) {
        return 1
      }
      return this.pageCount--
    },
    onClickRightHandler() {
      console.log('like')
      if (this.pageCount === this.allPagesCount) {
        return 1
      }
      return this.pageCount++
    },
    submitFilters(data: any) {
      this.showFiltersModal = false
      this.filters = data
      this.getFilteredCardListByFiltersModal()
    },
    async filterByTag(tag: string) {
      this.error = false
      this.error = false
      this.favFilter = false
      this.loading = true
      const sortType = this.sortAsc ? 'asc' : 'desc'
      try {
        const result = await filtersApi.filtersByTags(tag, sortType, this.pageCount)
        this.info = result.filteredData
        this.allPagesCount = result.pagination.pageCount
      } catch (err) {
        this.error = true
        this.currentTag = { id: 4, attributes: {} }
      } finally {
        this.loading = false
      }
    },
    handleTagClick(item: ITag) {
      this.error = false
      this.pageCount = 1
      this.favFilter = false
      this.currentTag = item
      this.filterByFav = false
    },
    checkIsFavorite(recipe: IRecipe) {
      const check = this.favoritesList?.find((item: IRecipe) => recipe.id === item.id)
      this.checkComplite = true
      check ? (this.likeClicked = true) : (this.likeClicked = false)
      return check
    },
    likeClick(item: IRecipe) {
      if (!item) return
      this.cardInfo = item
      const checkResult = this.likesList?.find((i: IRecipe) => item.id === i.id)
      if (checkResult) {
        this.deleteFavorite()
      } else {
        this.addNewFavorite()
      }
    },
    async addNewFavorite() {
      if (this.userData) {
        try {
          const favorite = await favoritesApi.setFavorite(this.userData.favorite.id, this.cardInfo)
          this.likeClicked = true
          // this.getUsersFavoritesList();
          this.getLikedRecipes()
        } catch (err) {
          console.log(err, 'error')
        }
      }
    },
    async deleteFavorite() {
      try {
        if (this.userData) {
          const favorite = await favoritesApi.deleteFavorite(
            this.userData.favorite.id,
            this.cardInfo
          )
        }
        this.likeClicked = false
        // this.getUsersFavoritesList();
        this.getLikedRecipes()
      } catch (err) {
        this.error = true
      }
    },
    async getUsersFavoritesList() {
      if (this.userData && this.info) {
        try {
          const favorites = await favoritesApi.getFavorites(this.userData?.favorite.id)
          const check = favorites?.find((item: IRecipe) => this.info?.id === item.id)
          check ? (this.likeClicked = true) : (this.likeClicked = false)
          this.favoritesList = favorites
          this.checkComplite = true
        } catch (err) {
          this.error = true
        }
      }
    }
  },
  components: { FiltersModal, Error, Loader, ChartModal }
}
</script>

<template>
  <div v-if="!error" class="card_list__wrapper">
    <div>
      <Teleport to="body">
        <FiltersModal
          :showFilters="showFiltersModal"
          @close="showFiltersModal = false"
          :submitFilters="submitFilters"
        >
          <template #header>
            <h3 class="title_modal">Filters:</h3>
          </template>
        </FiltersModal>
      </Teleport>
    </div>
    <div>
      <Teleport to="body">
        <ChartModal
          :showChartModal="showChartModal"
          @close="showChartModal = false"
          :allCardInfo="allCardInfo"
        >
          <!-- <template #header>
        <h3 class="title_modal"> Filters:</h3>
      </template> -->
        </ChartModal>
      </Teleport>
    </div>
    <div class="input_wrapper">
      <input class="search_input" v-model="searchQuery" />
    </div>
    <div class="page_info__wrapper">
      <p class="count">Page {{ pageCount }} from {{ allPagesCount }}</p>
    </div>

    <ul class="tag_list">
      <button class="tag_button" @click="favoriteTagClick">
        <h1 title="Favorites" class="tag_title">Favorites</h1>
        <img src="https://www.svgrepo.com/show/422454/heart-love-romantic.svg" class="tag_image" />
      </button>
      <li class="tag" v-for="(item, index) in categories">
        <button class="tag_button" @click="handleTagClick(item)">
          <h1 :title="item.attributes.name" class="tag_title">{{ item.attributes.name }}</h1>
          <img :src="item.attributes.image_url" class="tag_image" />
        </button>
      </li>
    </ul>

    <div class="pagination_wrapper">
      <button
        v-if="pageCount !== 1 && !searchQuery.length"
        class="arrow"
        @click="onClickLeftHandler"
      >
        &lt
      </button>
      <div class="list_wrapper">
        <div class="buttons_wrapper">
          <button class="sort_button" @click="toggleSortType">
            <img src="https://www.svgrepo.com/show/356266/sort-descending.svg" class="sort_image" />
          </button>
          <button id="show-modal" @click="showFiltersModal = true">Filters</button>
          <button id="show-modal" @click="showChartModal = true">Chart</button>
        </div>
        <!-- <div class="list_wrapper"> -->
        <!-- <TransitionGroup  
class="card_list" 
name="card"
 tag="ul"
> -->
        <ul class="card_list">
          <li class="card" v-for="(item, index) in filteredData" :key="item" :data-index="index">
            <button class="button_like" @click="() => likeClick(item)">
              <img
                class="like"
                v-if="(likesList?.find((i:IRecipe) => item.id === i.id))"
                src="https://www.svgrepo.com/show/422454/heart-love-romantic.svg"
              />
              <img
                class="like"
                v-if="!(likesList?.find((i:IRecipe) => item.id === i.id))"
                src="https://www.svgrepo.com/show/408364/heart-love-like-favorite.svg"
              />
            </button>
            <RouterLink
              :key="item.id"
              :to="{ name: 'recipe', params: { id: item.id } }"
              :likeClicked="likeClicked"
              :checkComplite="checkComplite"
              :userData="userData"
              :favoritesList="favoritesList"
              :likeClick="likeClick"
              class="router_link"
            >
              <img :src="item.attributes.image_url" class="image" />
              <div class="recipe_text__wrapper">
                <h1 :title="item.attributes.title" class="title">{{ item.attributes.title }}</h1>
                <div class="small_info">
                  <p :kcal="item.attributes.small_extra_info.data.attributes.kcal" class="kcal">
                    {{ item.attributes.small_extra_info.data.attributes.kcal }}
                  </p>
                  <p :grams="item.attributes.small_extra_info.data.attributes.grams" class="kcal">
                    {{ item.attributes.small_extra_info.data.attributes.grams }}
                  </p>
                </div>
                <h3 :description="item.attributes.description" class="description">
                  {{ item.attributes.description }}
                </h3>
              </div>
            </RouterLink>
          </li>
        </ul>
        <!-- </TransitionGroup> -->
      </div>

      <button
        v-if="pageCount !== allPagesCount && !searchQuery.length"
        class="arrow"
        @click="onClickRightHandler"
      >
        >
      </button>
    </div>
  </div>
  <div v-else="error" class="error_wrapper">
    <Error :errorText="errorText" />
    <button class="error_button" @click="getCards">Try again</button>
  </div>
</template>

<style scoped>
/* .card {
  transition: all 800ms ease-in-out 500px;
  backface-visibility: hidden;
  z-index: 1;
}
.card-move {
  transition: all 800ms ease-in-out 500ms;
}

.card-enter-active {
  transition: all 800ms ease-out 500px;
}
.card-leave-active {
  transition: all 800ms ease-in;
  position: absolute;
  z-index: 0;
}

.card-enter, .card-leave-to {
  opacity: 0;
  transition: all 800ms ease-in;
} */
.card_list__wrapper {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding:0 20px;
  width: 100vw;
  /* min-height: 97vh; */
  /* height: 97vh; */
}
.error_wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}
.page_info__wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* padding-top: 50px; */
}
.buttons_wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}
.pagination_wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  height: 100%;
}
.error_button {
  padding: 10px 18px;
  border: 2px solid rgb(199, 199, 232);
  background-color: var(--background-general);
  border-radius: 10px;
  color: var(--text-secondary);
  font-size: 1rem;
  z-index: 1000;
}
.search_input,
.input_wrapper {
  z-index: 1000;
}
.card_list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
  padding: 40px 0;
  justify-content: center;
  background-color: var(--background-general);
  width: 100%;
}
.list_wrapper {
  width: 95%;
}
.image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  align-self: center;
  margin: 10px;
}
.tag_image {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  align-self: center;
}
.sort_image {
  align-self: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.sort_button {
  background-color: transparent;
  border-color: transparent;
  z-index: 1001;
}
.tag {
  display: flex;
  flex-direction: row-reverse;
}
.tag_title {
  font-size: 1rem;
}
.button_like {
  align-self: end;
  background-color: transparent;
  border: transparent;
  z-index: 1001;
}
.like {
  width: 40px;
  height: 40px;
}
.tag_list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  list-style: none;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 20px;

}
.router_link {
  z-index: 1000;
}
.tag_button {
  display: flex;
  flex-direction: row-reverse;
  padding: 5px 9px;
  min-width: 120px;
  border-radius: 10px;
  border: 1px solid var(--text-primary);
  /* background-color: var(--background-general); */
  color: var(--text-primary);
  justify-content: center;
  align-items: center;
  gap: 7px;
  z-index: 1000;
  background-color: transparent;
}
.small_info {
  display: flex;
  gap: 11px;
  margin: 10px;
  padding-left: 40px;
}
input {
  padding: 10px;
  border: 2px solid rgb(199, 199, 232);
  /* background-color: var(--background-secondary); */
  background-color: transparent;
  border-radius: 10px;
  font-size: 1rem;
  color: rgb(156, 140, 170);
  outline: none;
  z-index: 1000;
}
.arrow {
  height: 40px;
  width: 40px;
  border-radius: 50%;
  font-size: 1rem;
  color: var(--background-general);
  background-color: rgb(230, 225, 234);
  z-index: 1000;
}
.card {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 290px;
  height: 405px;
  padding: 10px;
  border: 2px solid rgb(199, 199, 232);
  background-color: var(--background-secondary);
  border-radius: 10px;
  color: rgba(0, 0, 255, 0.129);
}
#show-modal {
  padding: 5px 10px;
  height: 35px;
  border: 2px solid rgb(199, 199, 232);
  background-color: var(--background-general);
  border-radius: 10px;
  color: rgb(224, 224, 243);
  font-size: 1rem;
  margin: 0 5px;
  z-index: 1000;
}
.title {
  font-size: 1.2rem;
  text-align: center;
}
.description {
  font-size: 0.8rem;
  padding: 15px;
}
.count {
  font-size: 1rem;
  padding: 10px;
  color: var(--text-secondary);
  font-weight: 600;
}
.title_modal {
  color: var(--text-secondary);
  font-size: 1rem;
}

@media (max-width: 570px) {
  .arrow {
    height: 40px;
    width: 40px;
  }
  .card {
    padding: 10px;
    margin: 10px;
  }
  .card_list__wrapper {
    padding: 10px;
  }
  .tag_title {
    font-size: 1rem;
    z-index: 1000;
  }
  .tag_image {
    width: 20px;
    height: 20px;
    z-index: 1000;
  }
  .tag_button {
    min-width: 100px;
  }
}
@media (max-width: 970px) {
  .image {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    align-self: center;
    margin: 5px;
    position: absolute;
    top: 40px;
    left: 21px;
    z-index: 1000;
  }
  .card {
    display: flex;
    width: 90%;
    padding: 10px;
    border-radius: 10px;
    /* height: fit-content; */
    height: 250px;
    min-height: 250px;
    position: relative;
  }
  .recipe_text__wrapper {
    padding-left: 150px;
  }
  .small_info {
    padding: 0px 7px;
  }
  .title {
    font-size: 1.2rem;
    padding: 10px 0;
  }
  .description {
    padding: 10px;
  }
  .like {
    width: 30px;
    height: 30px;
    position: absolute;
    left: 20px;
  }
  .arrow {
    width: 27px;
    height: 27px;
    z-index: 3000;
  }
  .tag_list {
    padding: 10px;
  }
}
@media (max-width: 490px) {
  .image {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    align-self: center;
    margin: 5px;
    position: absolute;
    top: 40px;
    left: 21px;
  }
  @media (max-width: 450px) {
    .image {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      align-self: center;
      margin: 5px;
      position: absolute;
      top: 30px;
      left: 21px;
    }
  }
  .small_info {
    padding: 0px 5px;
    font-size: 0.7rem;
  }
  .title {
    font-size: 1rem;
    padding: 7px 0;
  }
  .description {
    font-size: 0.7rem;
    padding: 10px;
    position: absolute;
    left: 10px;
    top: 150px;
  }
  .card {
    min-height: 250px;
    min-width: 290px;
  }
  .recipe_text__wrapper {
    padding-left: 120px;
    padding-top: 30px;
  }
  .arrow {
    width: 27px;
    height: 27px;
    z-index: 1000;
  }
}
</style>
