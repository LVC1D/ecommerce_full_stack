const ROUTES = {
    HOME: '/',
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    ORDER: (userId, orderId) => `/users/${userId}/orders/${orderId}`,
    ORDERS: (id) => `/users/${id}/orders`,
    PROFILE: (id) => `/users/${id}`,
    NOT_FOUND: '/404',
};

export default ROUTES;