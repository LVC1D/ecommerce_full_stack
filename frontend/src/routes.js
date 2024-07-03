const ROUTES = {
    HOME: '/',
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    PRODUCT: (productId) => `/products/${productId}`,
    ORDER: (orderId) => `/orders/${orderId}`,
    ORDERS: `/orders`,
    PROFILE: (id) => `/users/${id}`,
    NOT_FOUND: '/404',
};

export default ROUTES;