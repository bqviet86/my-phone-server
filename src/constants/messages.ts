export const USERS_MESSAGES = {
    VALIDATION_ERROR: 'Lỗi xác thực',
    NAME_IS_REQUIRED: 'Tên không được để trống',
    NAME_MUST_BE_A_STRING: 'Tên phải là một chuỗi',
    NAME_LENGTH_MUST_BE_FROM_1_TO_100: 'Tên phải có độ dài từ 1 đến 100 ký tự',
    EMAIL_IS_REQUIRED: 'Email không được để trống',
    EMAIL_IS_INVALID: 'Email không hợp lệ',
    EMAIL_ALREADY_EXISTS: 'Email đã tồn tại',
    PASSWORD_IS_REQUIRED: 'Mật khẩu không được để trống',
    PASSWORD_MUST_BE_A_STRING: 'Mật khẩu phải là một chuỗi',
    PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Mật khẩu phải có độ dài từ 6 đến 50 ký tự',
    PASSWORD_MUST_BE_STRONG:
        'Mật khẩu phải có độ dài từ 6 đến 50 ký tự và chứa ít nhất 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt',
    CONFIRM_PASSWORD_IS_REQUIRED: 'Xác nhận mật khẩu không được để trống',
    CONFIRM_PASSWORD_MUST_BE_A_STRING: 'Xác nhận mật khẩu phải là một chuỗi',
    CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Xác nhận mật khẩu phải có độ dài từ 6 đến 50 ký tự',
    CONFIRM_PASSWORD_MUST_BE_STRONG:
        'Xác nhận mật khẩu phải có độ dài từ 6 đến 50 ký tự và chứa ít nhất 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt',
    CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD: 'Xác nhận mật khẩu phải giống với mật khẩu',
    DATE_OF_BIRTH_MUST_BE_ISO8601: 'Ngày sinh phải là ISO8601',
    SEX_IS_INVALID: 'Giới tính không hợp lệ',
    PHONE_NUMBER_IS_REQUIRED: 'Số điện thoại không được để trống',
    PHONE_NUMBER_IS_INVALID: 'Số điện thoại không hợp lệ',
    USER_NOT_FOUND: 'Không tìm thấy người dùng',
    PASSWORD_INVALID: 'Mật khẩu không hợp lệ',
    ACCESS_TOKEN_IS_REQUIRED: 'Access token không được để trống',
    REFRESH_TOKEN_IS_REQUIRED: 'Refresh token không được để trống',
    USED_REFRESH_TOKEN_OR_NOT_EXIST: 'Refresh token đã được sử dụng hoặc không tồn tại',
    EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Email verify token không được để trống',
    FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token không được để trống',
    INVALID_FORGOT_PASSWORD_TOKEN: 'Forgot password token không hợp lệ',
    USER_NOT_VERIFIED: 'Người dùng chưa được xác thực',
    OLD_PASSWORD_NOT_MATCH: 'Mật khẩu cũ không khớp',
    INVALID_ADDRESS_ID: 'ID địa chỉ không hợp lệ',
    ADDRESS_NOT_FOUND: 'Không tìm thấy địa chỉ',
    PROVINCE_IS_REQUIRED: 'Tỉnh/Thành phố không được để trống',
    PROVINCE_MUST_BE_A_STRING: 'Tỉnh/Thành phố phải là một chuỗi',
    DISTRICT_IS_REQUIRED: 'Quận/Huyện không được để trống',
    DISTRICT_MUST_BE_A_STRING: 'Quận/Huyện phải là một chuỗi',
    WARD_IS_REQUIRED: 'Phường/Xã không được để trống',
    WARD_MUST_BE_A_STRING: 'Phường/Xã phải là một chuỗi',
    SPECIFIC_ADDRESS_IS_REQUIRED: 'Địa chỉ cụ thể không được để trống',
    SPECIFIC_ADDRESS_MUST_BE_A_STRING: 'Địa chỉ cụ thể phải là một chuỗi',
    USER_NOT_ADMIN: 'Người dùng không phải là admin',

    REGISTER_SUCCESS: 'Đăng ký thành công',
    LOGIN_SUCCESS: 'Đăng nhập thành công',
    LOGOUT_SUCCESS: 'Đăng xuất thành công',
    EMAIL_ALREADY_VERIFIED_BEFORE: 'Email đã được xác thực trước đó',
    EMAIL_VERIFY_SUCCESS: 'Xác thực email thành công',
    RESEND_VERIFY_EMAIL_SUCCESS: 'Gửi lại email xác thực thành công',
    CHECK_EMAIL_TO_RESET_PASSWORD: 'Vui lòng kiểm tra email để đặt lại mật khẩu',
    VERIFY_FORGOT_PASSWORD_SUCCESS: 'Xác thực token đặt lại mật khẩu thành công',
    RESET_PASSWORD_SUCCESS: 'Đặt lại mật khẩu thành công',
    REFRESH_TOKEN_SUCCESS: 'Refresh token thành công',
    GET_ME_SUCCESS: 'Lấy thông tin người dùng thành công',
    UPDATE_AVATAR_SUCCESS: 'Cập nhật ảnh đại diện thành công',
    UPDATE_ME_SUCCESS: 'Cập nhật thông tin người dùng thành công',
    CHANGE_PASSWORD_SUCCESS: 'Đổi mật khẩu thành công',
    CREATE_ADDRESS_SUCCESS: 'Tạo địa chỉ thành công',
    GET_ADDRESS_SUCCESS: 'Lấy địa chỉ thành công',
    UPDATE_ADDRESS_SUCCESS: 'Cập nhật địa chỉ thành công',
    DELETE_ADDRESS_SUCCESS: 'Xóa địa chỉ thành công'
}

export const MEDIAS_MESSAGES = {
    INVALID_FILE_TYPE: 'Loại file không hợp lệ',
    NO_IMAGE_PROVIDED: 'Không có ảnh nào được cung cấp',
    NO_VIDEO_PROVIDED: 'Không có video nào được cung cấp',
    IMAGE_NOT_FOUND: 'Không tìm thấy ảnh',
    VIDEO_NOT_FOUND: 'Không tìm thấy video',

    UPLOAD_IMAGE_SUCCESS: 'Tải ảnh lên thành công',
    UPLOAD_VIDEO_SUCCESS: 'Tải video lên thành công'
}
