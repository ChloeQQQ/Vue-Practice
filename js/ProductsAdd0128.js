import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';
import pagination from './pagination.js';


let productModalTwo = '';
let delProduct = '';

const app = createApp({
    components:{
        pagination,
    },
    data() {
        return {
            url:'https://vue3-course-api.hexschool.io/v2',
            path:'chloeuvestyle',
            user:{
                username :'',
                password:'',
            },
            contents:{
                products:[]
            },
            status: true,

            currentItem:{
                imagesUrl:[],
            },
            pagination:{},
        }
    },
    created() {
        //讓他在created時就做這個function
        this.checkLogin();
    },
    methods: {
        checkLogin(){
            //取得token
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)chloeToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            console.log(token);
            //驗證token
            axios.defaults.headers.common['Authorization'] = token;
            //帶入api - check是否成功登入
            axios.post(`${this.url}/api/user/check`)
            .then((res) => { 
                // console.log(res.data);
                //成功
                this.getProducts();
            
            //如果沒有登入成功 跳回登入畫面
            }).catch((err) => {
                //失敗
                alert(err.data.message)
                window.location = "API-0114.html";
            })
        },
        getProducts(page = 1){
            //取產品列表-使用get //帶入變數path
            axios.get(`${this.url}/api/${this.path}/admin/products/?page=${page}`)
            .then((res) => { 
                // console.log(res.data);
                this.contents = res.data;
                this.pagination = res.data.pagination;
            }).catch((err) => {
                alert(err.data.message)
            })
        },
        DeleteItem(item){
            this.currentItem = item
            delProduct.show();
        },
        // isClose(item){
        //     //如果item==1 就變成0 如果不是1就變成1
        //     if( item.is_enabled == 1){
        //         item.is_enabled = 0
        //     }else{
        //         item.is_enabled = 1
        //     }
        // },
        confirmDelete(){
        axios.delete(`${this.url}/api/${this.path}/admin/product/${this.currentItem.id}`)
        .then((res) =>{
            this.getProducts();
            delProduct.hide();
        }).catch((err) => {
            alert(err.data.message)
        })
        },

        addItem(){
            this.status = true;
            productModalTwo.show();//按了之後show出來
            this.currentItem = {
                imagesUrl:[]
            } 
        },
        editItem(item){
            this.status = false;
            productModalTwo.show();
            this.currentItem = {
                ...item
            }
            // console.log(item);
        },
        
    },
    mounted() {
        productModalTwo = new bootstrap.Modal(document.querySelector('#productModal'))
        delProduct = new bootstrap.Modal(document.querySelector('#delProductModal'))
        // productModalTwo.show(); //打開

      
    },  
});
app.component('productModal', {
    data(){
        return {
        url:'https://vue3-course-api.hexschool.io/v2',
        path:'chloeuvestyle',
        }
    },
    props:["currentItem","status"], //因為需要外層的資料 所以props把外層的資料傳內層
    template:'#templateFor',
    methods: {
        confirmItem()
        {
            if(this.status == false ){
            axios.put(`${this.url}/api/${this.path}/admin/product/${this.currentItem.id}`,{data:this.currentItem})
                //後面要把修改的那包item寫在put- api最後面
            .then((res) =>{
                console.log(res);
                this.$emit('emitIn');
                productModalTwo.hide(); //按了之後hide出來
            }).catch((err) => {
                alert(err.data.message)
                console.log(err);
            })
            }else{
            axios.post(`${this.url}/api/${this.path}/admin/product`,{data:this.currentItem})
                //後面要把修改的那包item寫在put- api最後面
            .then((res) =>{
                console.log(res);
                this.$emit('emitIn'); //原本是this.Getproducts 所以更新完後需要把這個內層資料再傳到外層去 用@emit 
                productModalTwo.hide(); //按了之後hide出來
            }).catch((err) => {
                alert(err.data.message)
                console.log(err);
            })
            }
        },

    },
})


app.mount('#app');