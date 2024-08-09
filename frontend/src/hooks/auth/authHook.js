import Cookies from 'js-cookie';

const setAccessToken = (accessToken) => {
    Cookies.set('accessToken', accessToken, {secure: true, expires: 1/72});
}

export const getAccessToken = () => {
    if (!Cookies.get('accessToken')) return null;
    return Cookies.get('accessToken');
}

const setRefreshToken = (refreshToken) => {
    Cookies.set('refreshToken', refreshToken, {secure: true, expires: 1/24});
}

export const getRefreshToken = () => {
    if (!Cookies.get('refreshToken')) return null;
    return Cookies.get('refreshToken');
}

const setUser = (user) => {
    Cookies.set('user', JSON.stringify(user), {secure: true});
}

export const getUser = () => {
    if (!Cookies.get('user')) return null;
    return JSON.parse(Cookies.get('user'));
}

export const signIn = (accessToken, refreshToken, user) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUser(user);
    setIsAuthenticated(true);
}

export const staySignedIn = (accessToken, refreshToken) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setIsAuthenticated(true);
}

export const signOut = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('user');
    setIsAuthenticated(false);
}

const setIsAuthenticated = (isAuthenticated) => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
}

export const isAuthenticated = () => {
    if (!localStorage.getItem('isAuthenticated')) return false;
    return localStorage.getItem('isAuthenticated');
}
