import{u as C,r as c,e as w,f as M,j as s,C as S,b as L,P as R,c as q,d as $}from"./index-8yGwq-yZ.js";const E=()=>({headers:{Authorization:"Bearer "+window.localStorage.getItem("token")}}),F=({id:u,endpoint:n,initialItemsToLoad:i=15,searchName:f=""})=>{const{i18n:h}=C(),[_,p]=c.useState(0),[o,y]=c.useState(1e5),P=r=>{let a="";return n==="products"?(a=`products?page=${r}&paginate=${i}`,f&&(a+=`&name=${encodeURIComponent(f)}`)):u?a=`products/${u}`:a=`${n}?page=${r}&paginate=${i}`,a+=`&price[gte]=${_}&price[lte]=${o}`,a},{data:g,isLoading:x,error:b,hasNextPage:d,fetchNextPage:e,isFetchingNextPage:l}=w({queryKey:["products",n,u,i,f,_,o],queryFn:async({pageParam:r=1})=>{try{const a=P(r);if(!a)return{data:[],nextPage:null};const v=(await M.get(a,E())).data.data.map(t=>{var j;return{id:parseInt(t.id),name:t.name,name_am:t.name_am,price:t.price,discount:t.discount.toString(),image:((j=t.image_paths)==null?void 0:j[0])||"",created_at:t.created_at,originalPrice:(parseFloat(t.price)*(1+parseFloat(String(t.discount))/100)).toFixed(2),unit:t.measurement_type,left_in_stock:t.left_in_stock,description:t.description,description_am:t.description_am,supplier:t.supplier,brand:t.brand,measurement_type:t.measurement_type,category_id:t.category_id,category:t.category,subcategory:t.subcategory,subcategory_id:t.subcategory_id,stores:t.stores,total_quantity:t.total_quantity,rating:t.rating,is_non_stocked:t.is_non_stocked,is_active:t.is_active,image_paths:t.image_paths,updated_at:t.updated_at,max_quantity_per_order:t.max_quantity_per_order}});return{data:v,nextPage:v.length===i?r+1:null}}catch(a){return console.error("Error fetching products:",a),{data:[],nextPage:null}}},getNextPageParam:r=>r.nextPage,initialPageParam:1,enabled:!!(n&&(n==="products"||u||n==="popular-products"||n==="personalized-products"))}),m=c.useMemo(()=>(g==null?void 0:g.pages.flatMap(r=>r.data))??[],[g]),N=c.useMemo(()=>[...m].map(a=>({...a,name:(h.language==="am"?a.name_am:a.name)??"",description:(h.language==="am"?a.description_am:a.description)??""})),[m,h.language]),k=()=>{!l&&d&&e()};return{products:m,filteredProducts:N,isLoading:x,error:b,hasMore:!!d,page:(g==null?void 0:g.pages.length)??1,minPrice:_,maxPrice:o,loadMore:k,handlePriceChange:(r,a)=>{p(r),y(a)},isFetchingNextPage:l}},B=()=>{const{t:u}=C(),n=c.useRef(null),i=c.useRef(0),[f,h]=c.useState(!1),[_,p]=c.useState(!1),{filteredProducts:o,loadMore:y,hasMore:P,isLoading:g,isFetchingNextPage:x}=F({id:void 0,endpoint:"popular-products",initialItemsToLoad:7});c.useEffect(()=>{if(o.length>i.current&&i.current!==0){const e=i.current;i.current=o.length,requestAnimationFrame(()=>{const l=n.current;if(l){const m=l.children[e];m&&m.scrollIntoView({behavior:"smooth",block:"nearest",inline:"start"})}})}else i.current=o.length},[o]);const b=e=>{const l=n.current;l&&l.scrollBy({left:e==="left"?-200:200,behavior:"smooth"})},d=()=>{const e=n.current;e&&(h(e.scrollLeft>0),p(e.scrollLeft+e.clientWidth<e.scrollWidth))};return c.useEffect(()=>{d();const e=n.current;return e&&e.addEventListener("scroll",d),()=>{e&&e.removeEventListener("scroll",d)}},[o]),s.jsxs("section",{className:"mb-0",children:[s.jsxs("div",{className:"flex justify-between items-center mb-6",children:[s.jsx("h2",{className:"text-2xl sm:text-3xl leading-[19px] font-semibold",children:u("best_selling_items")}),!x&&P&&s.jsx("button",{"aria-label":"Load More",onClick:y,className:"bg-[#e9a83a] hover:bg-[#fed874] text-white text-sm sm:text-base transition-colors py-2 px-4 rounded-lg font-semibold",children:u("loadMore")}),x&&s.jsx("div",{className:"flex justify-center ",children:s.jsx("div",{className:"animate-spin rounded-full h-8 w-8 border-b-2 border-[#e9a83a]"})})]}),s.jsxs("div",{className:"relative",children:[f&&s.jsx("button",{"aria-label":"Left",onClick:()=>b("left"),className:"absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2 shadow-md z-10",children:s.jsx(S,{})}),_&&s.jsx("button",{"aria-label":"Right",onClick:()=>b("right"),className:"absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-2 shadow-md z-10",children:s.jsx(L,{})}),s.jsx("div",{ref:n,className:"grid auto-cols-[10.5rem] grid-flow-col gap-3 overflow-x-auto",children:x||g?Array.from({length:14}).map((e,l)=>s.jsx(R,{},l)):o.map(e=>s.jsx(q,{id:e.id,name:e.name,price:e.price,image:e.image||$,originalPrice:e.originalPrice,discount:e.discount?Number(e.discount):void 0,left_in_stock:e.max_quantity_per_order!==null?e.max_quantity_per_order:e.left_in_stock},e.id))})]})]})};export{B as default};
