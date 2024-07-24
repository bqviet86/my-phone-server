"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStatus = exports.PaymentStatus = exports.PaymentMethod = exports.CartStatus = exports.MediaTypes = exports.TokenTypes = exports.UserVerifyStatus = exports.Sex = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole[UserRole["Admin"] = 0] = "Admin";
    UserRole[UserRole["User"] = 1] = "User";
})(UserRole || (exports.UserRole = UserRole = {}));
var Sex;
(function (Sex) {
    Sex[Sex["Male"] = 0] = "Male";
    Sex[Sex["Female"] = 1] = "Female";
})(Sex || (exports.Sex = Sex = {}));
var UserVerifyStatus;
(function (UserVerifyStatus) {
    UserVerifyStatus[UserVerifyStatus["Unverified"] = 0] = "Unverified";
    UserVerifyStatus[UserVerifyStatus["Verified"] = 1] = "Verified";
    UserVerifyStatus[UserVerifyStatus["Banned"] = 2] = "Banned";
})(UserVerifyStatus || (exports.UserVerifyStatus = UserVerifyStatus = {}));
var TokenTypes;
(function (TokenTypes) {
    TokenTypes[TokenTypes["AccessToken"] = 0] = "AccessToken";
    TokenTypes[TokenTypes["RefreshToken"] = 1] = "RefreshToken";
    TokenTypes[TokenTypes["ForgotPasswordToken"] = 2] = "ForgotPasswordToken";
    TokenTypes[TokenTypes["EmailVerifyToken"] = 3] = "EmailVerifyToken";
})(TokenTypes || (exports.TokenTypes = TokenTypes = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes[MediaTypes["Image"] = 0] = "Image";
    MediaTypes[MediaTypes["Video"] = 1] = "Video";
})(MediaTypes || (exports.MediaTypes = MediaTypes = {}));
var CartStatus;
(function (CartStatus) {
    CartStatus[CartStatus["Pending"] = 0] = "Pending";
    CartStatus[CartStatus["Ordered"] = 1] = "Ordered"; // Đã đặt hàng
})(CartStatus || (exports.CartStatus = CartStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod[PaymentMethod["CreditCard"] = 0] = "CreditCard";
    PaymentMethod[PaymentMethod["Cash"] = 1] = "Cash"; // Tiền mặt
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus[PaymentStatus["PendingPayment"] = 0] = "PendingPayment";
    PaymentStatus[PaymentStatus["Paid"] = 1] = "Paid"; // Đã thanh toán
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus[OrderStatus["PendingPayment"] = 0] = "PendingPayment";
    OrderStatus[OrderStatus["PendingConfirmation"] = 1] = "PendingConfirmation";
    OrderStatus[OrderStatus["Processing"] = 2] = "Processing";
    OrderStatus[OrderStatus["Shipping"] = 3] = "Shipping";
    OrderStatus[OrderStatus["Completed"] = 4] = "Completed";
    OrderStatus[OrderStatus["Cancelled"] = 5] = "Cancelled"; // Đã hủy
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
