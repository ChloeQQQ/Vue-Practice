import {createApp} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';
        
const app = createApp({
    data() {
        return {
            url:'https://vue3-course-api.hexschool.io/v2',
            path:'chloevuestyle',
            user:{
                username :'',
                password:'',
                
            },
            contents:[],
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
            axios.post((`${this.url}/api/user/check`))
            .then((res) => { 
                // console.log(res.data);
                //成功
                this.getProducts();
            
            //如果沒有登入成功 跳回登入畫面
            }).catch((err) => {
                //失敗
                alert('go home')
                window.location = "API-0114.html";
            })
        },
        getProducts(){
            //取產品列表-使用get //帶入變數path
            axios.get((`${this.url}/api/${this.path}/admin/products`))
            .then((res) => { 
                // console.log(res.data);
                this.contents = res.data;
            }).catch((err) => {
                alert('What!!')
            })
        },
        isClose(item){
            if(item.is_enabled == 1){
            item.is_enabled = 2
            }else{
            item.is_enabled = 1
            } 
        },
        //delete 寫在v-on-delete得
        delItem(item){
            axios.delete((`${this.url}/api/${this.path}/admin/product/${item.id}`))
            .then((res) => { 
                console.log(res);
                window.location = "Product-0114.html"
            }).catch((err) => {
                alert('What!!')
            })
        }
    },
    computed:{
        //computed 計算回傳資料到dom/data
        itemLength(){
            return this.contents.products.length;
        }
    }
});
app.mount('#app');
