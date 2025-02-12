import { environment } from "src/environments/environment";

export const GlobalComponent = {
   // Api Calling
   API_URL : `${environment.defaultauth}/authenticate`,
   // API_URL : 'http://127.0.0.1:3000/',
   headerToken : {'Authorization': `Bearer ${sessionStorage.getItem('token')}`},

   // Auth Api
   AUTH_API:`${environment.defaultauth}/authenticate`,

    
    // Products Api
    product:'apps/product',
    productDelete:'apps/product/',

    // Orders Api
    order:'apps/order',
    orderId:'apps/order/',

    // Customers Api
    customer:'apps/customer',
}