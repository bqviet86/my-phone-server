"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../../constants/enums");
class User {
    constructor(user) {
        const date = new Date();
        this._id = user._id;
        this.name = user.name;
        this.email = user.email;
        this.date_of_birth = user.date_of_birth;
        this.sex = user.sex;
        this.phone_number = user.phone_number;
        this.password = user.password;
        this.email_verify_token = user.email_verify_token || '';
        this.forgot_password_token = user.forgot_password_token || '';
        this.verify = user.verify || enums_1.UserVerifyStatus.Unverified;
        this.role = user.role || enums_1.UserRole.User;
        this.avatar = user.avatar || '';
        this.created_at = user.created_at || date;
        this.updated_at = user.updated_at || date;
    }
}
exports.default = User;
