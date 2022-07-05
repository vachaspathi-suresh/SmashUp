export const baseRoute = "http://localhost:5000";

/*******************  user-routes *********************/

export const loginRoute = `${baseRoute}/api/auth/login`;
export const signupRoute = `${baseRoute}/api/auth/signup`;
export const getUserNamesRoute = `${baseRoute}/api/auth/get-usernames`;
export const setAvatarRoute = `${baseRoute}/api/auth/set-avatar`;
export const addFriendRoute = `${baseRoute}/api/auth/add-friend`;
export const getFriendsRoute = `${baseRoute}/api/auth/get-friends`;
export const getUsersRoute = `${baseRoute}/api/auth/get-users`;
export const delFriendRoute = `${baseRoute}/api/auth/delete-friend`;
export const logoutRoute = `${baseRoute}/api/auth/logout`;
export const delAccountRoute = `${baseRoute}/api/auth/del-account`;
export const changePasswordRoute = `${baseRoute}/api/auth/new-pass`;
export const forgetPasswordRoute = `${baseRoute}/api/auth/forget-password`;
export const verifyResetRoute = `${baseRoute}/api/auth/verify-reset`;
export const resetPasswordRoute = `${baseRoute}/api/auth/reset-password`;

/******************* msg-routes *************************/

export const addMsgRoute = `${baseRoute}/api/msg/add-msg`;
export const getMsgsRoute = `${baseRoute}/api/msg/get-msgs`;
export const unreadMsgsRoute = `${baseRoute}/api/msg/unread-msgs`;
export const delMsgsRoute = `${baseRoute}/api/msg/del-msgs`;
export const getAvatarsRoute = `${baseRoute}/api/res/avatar`;
