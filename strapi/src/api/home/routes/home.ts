export default {
    routes: [
        { method: 'GET', path: '/home', handler: 'home.index', config: { auth: false } },
    ],
};
