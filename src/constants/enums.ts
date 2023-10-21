export enum UserRole {
    Admin,
    User
}

export enum Sex {
    Male,
    Female
}

export enum UserVerifyStatus {
    Unverified,
    Verified,
    Banned
}

export enum TokenTypes {
    AccessToken,
    RefreshToken,
    ForgotPasswordToken,
    EmailVerifyToken
}

export enum MediaTypes {
    Image,
    Video
}

export enum CartStatus {
    Pending, // Chưa đặt hàng
    Ordered // Đã đặt hàng
}

export enum PaymentMethod {
    CreditCard, // Thẻ tín dụng
    Cash // Tiền mặt
}

export enum OrderStatus {
    PendingPayment, // Chờ thanh toán (chỉ áp dụng cho thanh toán bằng thẻ tín dụng)
    PendingConfirmation, // Chờ xác nhận
    Processing, // Đang lấy hàng
    Shipping, // Đang giao hàng
    Completed, // Đã giao hàng
    Cancelled // Đã hủy
}
