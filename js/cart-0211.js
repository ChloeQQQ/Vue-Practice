// import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js'; 

const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

const apiUrl = 'https://vue3-course-api.hexschool.io/';
const apiPath = 'chloeuvestyle';


loadLocaleFromURL('https://unpkg.com/@vee-validate/i18n@4.1.0/dist/locale/zh_TW.json');

configure({ // 用來做一些設定
  generateMessage: localize('zh_TW'), //啟用 locale 
});

const app = Vue.createApp({
    data(){
        return{
            cartData:[],
            products:[],
            productId:'',
            isLoading:'',

            order:{
                user:{
                  name: '',
                  email: '',
                  tel: '',
                  address: '',
                },
            message: '',
         }
          
        }
    },
    methods: {
        getProduct(){
            axios.get(`${apiUrl}/v2/api/${apiPath}/products/all`)
            .then((res)=>{
                console.log(res);
                this.products = res.data.products;
            });
        },
        openModal(id){
            this.productId = id ;
            this.$refs.productModal.openTheModal();
            },
            // /v2/api/{api_path}/cart
            //加入購物車需要加入參數/把資料格式
        getCard(){
            axios.get(`${apiUrl}/v2/api/${apiPath}/cart`)
            .then((res)=>{
                console.log(res);
                this.cartData = res.data.data;
            });
        },
        addToCart(id,qty = 1){
            const data = {
            product_id: id,qty,
            }
            this.isLoading = id;
             //有id的時候啟動loading  
            axios.post(`${apiUrl}/v2/api/${apiPath}/cart`,{data})
            .then((res)=>{
                this.getCard();
                this.$refs.productModal.closeTheModal();
                this.isLoading = '';
                //載入後清空loading 
            });
        },
        //對於指定的id 從遠端的對應id刪除資料再回傳更新至遠端
        deleteCart(id){
            this.isLoading = id;
            axios.delete(`${apiUrl}/v2/api/${apiPath}/cart/${id}`)
            .then((res)=>{
                this.getCard();
                this.isLoading = '';
                //載入後清空loading 
            });
        },
        updateCart(item){
            const data = {
                product_id: item.id,
                qty: item.qty
            }
            this.isLoading = item.id;
             //有id的時候啟動loading  
            axios.put(`${apiUrl}/v2/api/${apiPath}/cart/${item.id}`,{data})
            .then((res)=>{
                this.getCard();
                this.isLoading = '';
                //載入後清空loading 
            });
        }, 
        ordered(){
        const data = {
            
                user:{
                  name: 'this.order.name',
                  email: 'this.order.email',
                  tel: 'this.order.tel',
                  address: 'this.order.address',
                },
            message: 'this.order.message',
         
        }
        axios.post(`${apiUrl}/v2/api/${apiPath}/order`,{data})
            .then((res)=>{
                // alert("您成功囉");
                this.$refs.form.resetForm();
                //使用refs的from 觸發套件內的resetForm()方法
                this.getCard();
              
            }).catch((err)=>{
                console.log(err)
            });        
        },
        clean(){
            axios.delete(`${apiUrl}/v2/api/${apiPath}/carts`)
            .then((res)=>{
                // this.updateCart='';
                this.getCard()
               
            }).catch((err)=>{
                console.log(err)
            });        

        }
    },

    mounted() {
        this.getProduct();
        this.getCard();
    },
});

//元件使用product-modal 的 查看更多的modal

app.component('product-modal',{
    template:'#userProductModal',
    props:['id'],
    data(){
        return{
            myModal:{},
            product:{},
            qty:1,
        }
    },
    //使用watch去監控id的變動 有變動時可以取得遠端的變化 觸發getproduct
    watch:{
        id() {
            this.getProduct();
        },

    },
    methods: {
        openTheModal(){
            this.myModal.show();
        },
        closeTheModal(){
            this.myModal.hide();
        },
        getProduct(){
            axios.get(`${apiUrl}/v2/api/${apiPath}/product/${this.id}`)
            .then((res)=>{
                console.log(res);
                this.product = res.data.product;
            });
        },
        addCart(){
            console.log(this.qty);
            this.$emit('add-cart', this.id, this.qty);
        },

    },
    mounted() {
        //mounted先掛載 
        //先命名myModal 帶入bootstrap的Modal 
        //myModal show出來      
    this.myModal = new bootstrap.Modal(this.$refs.modal);
    }
});
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);

app.mount('#app');