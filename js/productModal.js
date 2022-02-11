export default{
    props:["current-item","status"],
    data(){
      return {
        url:'https://vue3-course-api.hexschool.io/v2',
        path:'chloeuvestyle',
      }

    },
   
    methods: {
        confirmItem()
        {
            if(this.status == false ){
            axios.put(`${this.url}/api/${this.path}/admin/product/${this.currentItem.id}`,{data:this.currentItem})
                //後面要把修改的那包item寫在put- api最後面
            .then((res) =>{
                console.log(res);
                this.$emit('emitIn');
                this.$emit('emitClose');
                //按了之後hide出來
            }).catch((err) => {
                alert(err)
                console.log(err);
            })
            }else{
            axios.post(`${this.url}/api/${this.path}/admin/product`,{data:this.currentItem})
                //後面要把修改的那包item寫在put- api最後面
            .then((res) =>{
                console.log(res);
                this.$emit('emitIn'); //原本是this.Getproducts 所以更新完後需要把這個內層資料再傳到外層去 用@emit 
                this.$emit('emitClose');
                //按了之後hide出來
            }).catch((err) => {
                alert(err)
                console.log(err);
            })
            }
        },
    },
    template:`
    <div class="modal-dialog modal-xl">
    <div class="modal-content border-0">
      <div class="modal-header bg-dark text-white">
        <h5 id="productModalLabel" class="modal-title">
          <span v-if="status == true">新增產品</span>
          <span v-else>編輯產品</span>
        </h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-sm-4">
            <div class="mb-3">
              <label for="imageUrl" class="form-label">主要圖片</label>
              <input
                v-model="currentItem.imageUrl"
                type="text"
                class="form-control mb-2"
                placeholder="請輸入圖片連結"
              />
              <img class="img-fluid" :src="currentItem.imageUrl" />
            </div>
            <h3 class="mb-3">多圖新增</h3>
            <div v-if="Array.isArray(currentItem.imagesUrl)">
              <template
                v-for="(img,key) in currentItem.imagesUrl[key]"
                :key="key+1"
              >
                <input
                  v-model="currentItem.imagesUrl[key]"
                  type="text"
                  class="form-control mb-2"
                  placeholder="請輸入圖片連結"
                />
                <img class="img-fluid" :src="currentItem.imagesUrl" />
              </template>
            </div>
            <div>
              <div
                class="mb-1"
                v-for="(obj,i) in currentItem.imagesUrl"
                :key="i"
              >
                <div class="mb-3">
                  <label for="imageUrl" class="form-label">
                    圖片網址
                  </label>
                  <input
                    v-model="currentItem.imagesUrl[i]"
                    type="text"
                    class="form-control"
                    placeholder="請輸入圖片連結"
                  />
                </div>
                <img class="img-fluid" :src="currentItem.imagesUrl[i]" />
              </div>
              <div>
                <button
                  type="button"
                  v-if="!currentItem.imagesUrl?.length || currentItem.imagesUrl[currentItem.imagesUrl?.length-1]"
                  class="btn btn-outline-primary btn-sm d-block w-100"
                  @click="currentItem.imagesUrl.push('')"
                >
                  新增圖片
                </button>
              </div>
              <div>
                <button
                  type="button"
                  v-else
                  class="btn btn-outline-danger btn-sm d-block w-100"
                  @click="currentItem.imagesUrl.pop()"
                >
                  刪除最後一個圖片
                </button>
              </div>
            </div>
          </div>
          <div class="col-sm-8">
            <div class="mb-3">
              <label for="title" class="form-label">標題</label>
              <input
                v-model="currentItem.title"
                id="title"
                type="text"
                class="form-control"
                placeholder="請輸入標題"
              />
            </div>

            <div class="row">
              <div class="mb-3 col-md-6">
                <label for="category" class="form-label">分類</label>
                <input
                  v-model="currentItem.category"
                  id="category"
                  type="text"
                  class="form-control"
                  placeholder="請輸入分類"
                />
              </div>
              <div class="mb-3 col-md-6">
                <label for="price" class="form-label">單位</label>
                <input
                  v-model="currentItem.unit"
                  id="unit"
                  type="text"
                  class="form-control"
                  placeholder="請輸入單位"
                />
              </div>
            </div>

            <div class="row">
              <div class="mb-3 col-md-6">
                <label for="origin_price" class="form-label">原價</label>
                <!-- 轉型成number -->
                <input
                  v-model.number="currentItem.origin_price"
                  id="origin_price"
                  type="number"
                  min="0"
                  class="form-control"
                  placeholder="請輸入原價"
                />
              </div>
              <div class="mb-3 col-md-6">
                <label for="price" class="form-label">售價</label>
                <!-- 轉型成number 才不會報錯-->
                <input
                  v-model.number="currentItem.price"
                  id="price"
                  type="number"
                  min="0"
                  class="form-control"
                  placeholder="請輸入售價"
                />
              </div>
            </div>
            <hr />

            <div class="mb-3">
              <label for="description" class="form-label">產品描述</label>
              <textarea
                v-model="currentItem.description"
                id="description"
                type="text"
                class="form-control"
                placeholder="請輸入產品描述"
              ></textarea>
            </div>
            <div class="mb-3">
              <label for="content" class="form-label">說明內容</label>
              <textarea
                v-model="currentItem.content"
                id="content"
                type="text"
                class="form-control"
                placeholder="請輸入說明內容"
              ></textarea>
            </div>
            <div class="mb-3">
              <div class="form-check">
                <!-- //checkbox使用false true ? -->
                <input
                  v-model="currentItem.is_enabled"
                  :true-value="1"
                  :false-value="0"
                  id="is_enabled"
                  class="form-check-input"
                  type="checkbox"
                />
                <!-- //checkbox使用false true ? -->
                <label class="form-check-label" for="is_enabled">
                  是否啟用
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-outline-secondary"
          data-bs-dismiss="modal"
        >
          取消
        </button>
        <button
          type="button"
          class="btn btn-suscces"
          @click="confirmItem"
        >
          確認
        </button>
      </div>
    </div>
  </div>
    `
};