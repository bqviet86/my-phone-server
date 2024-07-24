"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RefreshToken {
    constructor(refreshToken) {
        this._id = refreshToken._id;
        this.token = refreshToken.token;
        this.user_id = refreshToken.user_id;
        this.iat = new Date(refreshToken.iat * 1000); // Convert Epoch time to Date
        this.exp = new Date(refreshToken.exp * 1000); // Convert Epoch time to Date
        this.created_at = refreshToken.created_at || new Date();
    }
}
exports.default = RefreshToken;
