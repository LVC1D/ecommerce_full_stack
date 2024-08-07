const ROUTES = {
    HOME: '/',
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    PRODUCT: (productId) => `/products/${productId}`,
    ORDER: (orderId) => `/orders/${orderId}`,
    ORDERS: `/orders`,
    PROFILE: (userId) => `/users/${userId}`,
    // CART: (cartId) => `/cart/${cartId}/items`,
    CHECKOUT: (cartId) => `/cart/${cartId}/checkout`,
    SUCCESS: '/success',
    CANCEL: '/cancel',
    NOT_FOUND: '/404',
};

export default ROUTES;