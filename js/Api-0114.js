import {createApp} from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.26/vue.esm-browser.min.js';

let {prjName} = Vue-Practice;
        
const app = createApp({
    data() {
        return {
            url:'https://vue3-course-api.hexschool.io/v2',
            path:'chloevuestyle',
            user:{
                username :'',
                password:'',
                
            }
        }
    },
    methods: {
        login(){
            // 登入帳號
            axios.post(`${this.url}/admin/signin`, this.user)
            .then((res) =>{
            // 寫入token / expired
            const {token, expired} = res.data;
            console.log(res.data);
            //使用反引號（使用變數） 存到cookie //把token = chloeToken expired 轉型
            document.cookie = `chloeToken=${token};expires=${new Date(expired)}; path=/`;
            window.location = './Product-0114.html';

            }).catch((error) => {
                alert("登入失敗囉");
            })
        }
    },
});
app.mount('#app');
