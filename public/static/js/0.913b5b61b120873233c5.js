webpackJsonp([0],{"13uV":function(e,t){},"2NXm":function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=i("Bnbg"),n=i("t4xX"),s={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("el-carousel",{attrs:{interval:4e3,type:"card",height:"300px"}},e._l(6,function(t){return i("el-carousel-item",{key:t,attrs:{name:"aaa"}},[i("div",{staticClass:"headerPic"},[i("div",{staticStyle:{height:"200px","padding-left":"50px","padding-right":"50px","border-radius":"30px"}},[i("a",[i("img",{staticClass:"headerImg",attrs:{src:e.recommendImg}})])])])])}),1)},staticRenderFns:[]};var o={name:"index",data:function(){return{headerItems:[],movieItems:[],videoState:!1,videoSrc:"",playerOptions:{width:document.documentElement.clientWidth,notSupportedMessage:"此视频暂无法播放，请稍后再试"}}},components:{IndexHeaderPic:i("VU/8")({data:function(){return{value2:0}},props:["recommendSrc","recommendImg","recommendTitle","item"]},s,!1,function(e){i("13uV")},"data-v-5f342a7c",null).exports,MovieIndexHeader:a.a,MoviesList:n.a},created:function(){var e=this;this.$http.get("http://kr.xj173.cn:5050/showIndex").then(function(t){e.headerItems=t.body.data,console.log(t.body.data)}),this.$http.get("http://kr.xj173.cn:5050/getIndexMovie").then(function(t){e.movieItems=t.body.data,console.log(t.body.data)})},methods:{checkVideoFun:function(e){this.videoState=!0,this.videoSrc=e},masksCloseFun:function(){this.videoState=!1}}},r={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"container",staticStyle:{"background-color":"#DAEBE3"}},[i("div",[i("movie-index-header")],1),e._v(" "),i("div",{staticClass:"contentPic"},[i("el-carousel",{attrs:{interval:4e3,type:"card",height:"300px"}},e._l(e.headerItems,function(t){return i("el-carousel-item",{key:t._id,staticStyle:{width:"800px"},attrs:{name:"aaa"}},[i("div",{staticClass:"headerPic"},[i("div",{staticStyle:{height:"200px","padding-left":"50px","padding-right":"50px","border-radius":"30px"}},[i("img",{staticClass:"headerImg",attrs:{src:t.recommendImg},on:{click:function(i){return e.checkVideoFun(t.recommendSrc)}}})])])])}),1)],1),e._v(" "),1==e.videoState?i("div",{staticClass:"mask",on:{click:e.masksCloseFun}}):e._e(),e._v(" "),1==e.videoState?i("div",{staticClass:"videomasks"},[i("video",{attrs:{src:e.videoSrc,controls:"controls",autoplay:"",options:e.playerOptions}})]):e._e(),e._v(" "),i("div",{staticClass:"contentMain"},[i("div",{staticClass:"contentLeft",staticStyle:{display:"inline-block","text-align":"left","margin-left":"130px"}},e._l(e.movieItems,function(e){return i("movies-list",{key:e._id,attrs:{id:e._id,movieName:e.movieName,movieNumSuppose:e.movieNumSuppose,movieImg:e.movieImg}})}),1)])])},staticRenderFns:[]};var c=i("VU/8")(o,r,!1,function(e){i("rCbQ")},"data-v-119a4781",null);t.default=c.exports},rCbQ:function(e,t){}});
//# sourceMappingURL=0.913b5b61b120873233c5.js.map