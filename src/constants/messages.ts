export const USERS_MESSAGES = {
    VALIDATION_ERROR: 'Bạn cung cấp dữ liệu chưa hợp lệ',
    NAME_IS_REQUIRED: 'Tên không được để trống',
    NAME_MUST_BE_A_STRING: 'Tên phải là một chuỗi',
    NAME_LENGTH_MUST_BE_FROM_1_TO_100: 'Tên phải có độ dài từ 1 đến 100 ký tự',
    EMAIL_IS_REQUIRED: 'Email không được để trống',
    EMAIL_IS_INVALID: 'Email không hợp lệ',
    EMAIL_ALREADY_EXISTS: 'Email đã tồn tại',
    YOU_HAVE_NOT_REGISTERED_WITH_THIS_EMAIL: 'Bạn chưa đăng ký tài khoản với email này',
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
    INCORRECT_PASSWORD: 'Mật khẩu không chính xác',
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
    SEARCH_MUST_BE_A_STRING: 'Từ khóa tìm kiếm (search) phải là một chuỗi',

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
    GET_ALL_USERS_SUCCESS: 'Lấy tất cả người dùng thành công',
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

export const BRANDS_MESSAGES = {
    NAME_IS_REQUIRED: 'Tên không được để trống',
    NAME_MUST_BE_A_STRING: 'Tên phải là một chuỗi',
    NAME_LENGTH_MUST_BE_FROM_1_TO_20: 'Tên phải có độ dài từ 1 đến 20 ký tự',
    BRAND_ID_IS_INVALID: 'ID thương hiệu không hợp lệ',
    BRAND_IS_NOT_FOUND: 'Không tìm thấy thương hiệu',

    CREATE_BRAND_SUCCESS: 'Tạo thương hiệu thành công',
    GET_ALL_BRAND_SUCCESS: 'Lấy tất cả thương hiệu thành công',
    DELETE_BRAND_SUCCESS: 'Xóa thương hiệu thành công'
}

export const PHONES_MESSAGES = {
    COLOR_IS_REQUIRED: 'Màu không được để trống',
    COLOR_MUST_BE_A_STRING: 'Màu phải là một chuỗi',
    COLOR_LENGTH_MUST_BE_FROM_1_TO_20: 'Màu phải có độ dài từ 1 đến 20 ký tự',
    CAPACITY_IS_REQUIRED: 'Dung lượng không được để trống',
    CAPACITY_MUST_BE_A_STRING: 'Dung lượng phải là một chuỗi',
    CAPACITY_LENGTH_MUST_BE_FROM_1_TO_20: 'Dung lượng phải có độ dài từ 1 đến 20 ký tự',
    PRICE_MUST_BE_A_NUMBER: 'Giá phải là một số',
    PRICE_BEFORE_DISCOUNT_MUST_BE_A_NUMBER: 'Giá gốc phải là một số',
    QUANTITY_MUST_BE_A_NUMBER: 'Số lượng phải là một số',
    IMAGES_MUST_BE_AN_ARRAY_OF_STRING: 'Ảnh phải là một mảng các chuỗi',
    INVALID_PHONE_OPTION_ID: 'ID option của điện thoại không hợp lệ',
    PHONE_OPTION_NOT_FOUND: 'Không tìm thấy option của điện thoại',
    NAME_IS_REQUIRED: 'Tên không được để trống',
    NAME_MUST_BE_A_STRING: 'Tên phải là một chuỗi',
    NAME_LENGTH_MUST_BE_FROM_1_TO_200: 'Tên phải có độ dài từ 1 đến 200 ký tự',
    NO_IMAGE_PROVIDED: 'Ảnh của điện thoại không được cung cấp',
    IMAGE_MUST_BE_A_STRING: 'Ảnh của điện thoại phải là một chuỗi',
    IMAGE_NOT_FOUND: 'Không tìm thấy ảnh của điện thoại',
    MUST_PROVIDE_AT_LEAST_ONE_OPTION: 'Phải cung cấp ít nhất một option',
    HAVE_PHONE_OPTION_NOT_FOUND: 'Option của điện thoại không được tìm thấy',
    DESCRIPTION_IS_REQUIRED: 'Mô tả không được để trống',
    DESCRIPTION_MUST_BE_A_STRING: 'Mô tả phải là một chuỗi',
    BRAND_IS_REQUIRED: 'Thương hiệu không được để trống',
    BRAND_MUST_BE_A_STRING: 'Thương hiệu phải là một chuỗi',
    INVALID_BRAND_ID: 'ID thương hiệu không hợp lệ',
    BRAND_NOT_FOUND: 'Không tìm thấy thương hiệu',
    SCREEN_TYPE_IS_REQUIRED: 'Loại màn hình không được để trống',
    SCREEN_TYPE_MUST_BE_A_STRING: 'Loại màn hình phải là một chuỗi',
    SCREEN_TYPE_LENGTH_MUST_BE_FROM_1_TO_200: 'Loại màn hình phải có độ dài từ 1 đến 200 ký tự',
    RESOLUTION_IS_REQUIRED: 'Độ phân giải không được để trống',
    RESOLUTION_MUST_BE_A_STRING: 'Độ phân giải phải là một chuỗi',
    RESOLUTION_LENGTH_MUST_BE_FROM_1_TO_200: 'Độ phân giải phải có độ dài từ 1 đến 200 ký tự',
    OPERATING_SYSTEM_IS_REQUIRED: 'Hệ điều hành không được để trống',
    OPERATING_SYSTEM_MUST_BE_A_STRING: 'Hệ điều hành phải là một chuỗi',
    OPERATING_SYSTEM_LENGTH_MUST_BE_FROM_1_TO_200: 'Hệ điều hành phải có độ dài từ 1 đến 200 ký tự',
    MEMORY_IS_REQUIRED: 'Bộ nhớ không được để trống',
    MEMORY_MUST_BE_A_STRING: 'Bộ nhớ phải là một chuỗi',
    MEMORY_LENGTH_MUST_BE_FROM_1_TO_200: 'Bộ nhớ phải có độ dài từ 1 đến 200 ký tự',
    CHIP_IS_REQUIRED: 'Chip không được để trống',
    CHIP_MUST_BE_A_STRING: 'Chip phải là một chuỗi',
    CHIP_LENGTH_MUST_BE_FROM_1_TO_200: 'Chip phải có độ dài từ 1 đến 200 ký tự',
    BATTERY_IS_REQUIRED: 'Pin không được để trống',
    BATTERY_MUST_BE_A_STRING: 'Pin phải là một chuỗi',
    BATTERY_LENGTH_MUST_BE_FROM_1_TO_200: 'Pin phải có độ dài từ 1 đến 200 ký tự',
    REAR_CAMERA_IS_REQUIRED: 'Camera sau không được để trống',
    REAR_CAMERA_MUST_BE_A_STRING: 'Camera sau phải là một chuỗi',
    REAR_CAMERA_LENGTH_MUST_BE_FROM_1_TO_200: 'Camera sau phải có độ dài từ 1 đến 200 ký tự',
    FRONT_CAMERA_IS_REQUIRED: 'Camera trước không được để trống',
    FRONT_CAMERA_MUST_BE_A_STRING: 'Camera trước phải là một chuỗi',
    FRONT_CAMERA_LENGTH_MUST_BE_FROM_1_TO_200: 'Camera trước phải có độ dài từ 1 đến 200 ký tự',
    WIFI_IS_REQUIRED: 'Wifi không được để trống',
    WIFI_MUST_BE_A_STRING: 'Wifi phải là một chuỗi',
    WIFI_LENGTH_MUST_BE_FROM_1_TO_200: 'Wifi phải có độ dài từ 1 đến 200 ký tự',
    JACK_PHONE_IS_REQUIRED: 'Jack cắm tai nghe không được để trống',
    JACK_PHONE_MUST_BE_A_STRING: 'Jack cắm tai nghe phải là một chuỗi',
    JACK_PHONE_LENGTH_MUST_BE_FROM_1_TO_200: 'Jack cắm tai nghe phải có độ dài từ 1 đến 200 ký tự',
    SIZE_IS_REQUIRED: 'Kích thước không được để trống',
    SIZE_MUST_BE_A_STRING: 'Kích thước phải là một chuỗi',
    SIZE_LENGTH_MUST_BE_FROM_1_TO_200: 'Kích thước phải có độ dài từ 1 đến 200 ký tự',
    WEIGHT_IS_REQUIRED: 'Trọng lượng không được để trống',
    WEIGHT_MUST_BE_A_STRING: 'Trọng lượng phải là một chuỗi',
    WEIGHT_LENGTH_MUST_BE_FROM_1_TO_200: 'Trọng lượng phải có độ dài từ 1 đến 200 ký tự',
    INVALID_PHONE_ID: 'ID điện thoại không hợp lệ',
    PHONE_NOT_FOUND: 'Không tìm thấy điện thoại',

    CREATE_PHONE_OPTION_SUCCESSFULLY: 'Tạo option cho điện thoại thành công',
    UPDATE_PHONE_OPTION_SUCCESSFULLY: 'Cập nhật option của điện thoại thành công',
    DELETE_PHONE_OPTION_SUCCESSFULLY: 'Xóa option của điện thoại thành công',
    CREATE_PHONE_SUCCESSFULLY: 'Tạo điện thoại thành công',
    GET_PHONE_SUCCESSFULLY: 'Lấy điện thoại thành công',
    UPDATE_PHONE_SUCCESSFULLY: 'Cập nhật điện thoại thành công',
    DELETE_PHONE_SUCCESSFULLY: 'Xóa điện thoại thành công',
    GET_ALL_PHONES_SUCCESSFULLY: 'Lấy tất cả điện thoại thành công'
}

export const CARTS_MESSAGES = {
    PHONE_ID_IS_REQUIRED: 'ID điện thoại không được để trống',
    PHONE_ID_MUST_BE_A_STRING: 'ID điện thoại phải là một chuỗi',
    PHONE_OPTION_ID_IS_REQUIRED: 'ID option của điện thoại không được để trống',
    PHONE_OPTION_ID_MUST_BE_A_STRING: 'ID option của điện thoại phải là một chuỗi',
    INVALID_PHONE_OPTION_ID: 'ID option của điện thoại không hợp lệ',
    QUANTITY_IS_REQUIRED: 'Số lượng không được để trống',
    QUANTITY_MUST_BE_A_NUMBER: 'Số lượng phải là một số',
    CART_ID_IS_REQUIRED: 'ID giỏ hàng không được để trống',
    CART_ID_MUST_BE_A_STRING: 'ID giỏ hàng phải là một chuỗi',
    INVALID_CART_ID: 'ID giỏ hàng không hợp lệ',
    CART_NOT_FOUND: 'Không tìm thấy giỏ hàng',

    ADD_TO_CART_SUCCESSFULLY: 'Thêm sản phẩm vào giỏ hàng thành công',
    GET_CART_SUCCESSFULLY: 'Lấy tất cả sản phẩm trong giỏ hàng thành công',
    UPDATE_CART_SUCCESSFULLY: 'Cập nhật giỏ hàng thành công',
    DELETE_CART_SUCCESSFULLY: 'Xóa sản phẩm khỏi giỏ hàng thành công'
}

export const ORDERS_MESSAGES = {
    INVALID_PAYMENT_METHOD: 'Phương thức thanh toán không hợp lệ',
    CARTS_IS_EMPTY: 'Giỏ hàng không được để trống',
    INVALID_CARTS_ID: 'ID giỏ hàng không hợp lệ',
    HAVE_CART_NOT_FOUND: 'Có giỏ hàng không được tìm thấy',
    INVALID_ADDRESS_ID: 'ID địa chỉ không hợp lệ',
    ADDRESS_NOT_FOUND: 'Không tìm thấy địa chỉ',
    CONTENT_MUST_BE_A_STRING: 'Nội dung phải là một chuỗi',
    CONTENT_MUST_BE_FROM_0_TO_500_CHARACTERS: 'Nội dung phải có độ dài từ 0 đến 500 ký tự',
    INVALID_ORDER_ID: 'ID đơn hàng không hợp lệ',
    ORDER_NOT_FOUND: 'Không tìm thấy đơn hàng',
    INVALID_ORDER_STATUS: 'Trạng thái đơn hàng không hợp lệ',
    NOT_ALLOWED_TO_UPDATE_ORDER: 'Bạn không được phép cập nhật đơn hàng này',

    CREATE_ORDER_SUCCESSFULLY: 'Tạo đơn hàng thành công',
    ORDER_SUCCESS: 'Đặt hàng thành công',
    ORDER_FAIL: 'Đặt hàng không thành công',
    GET_ORDER_SUCCESSFULLY: 'Lấy đơn hàng thành công',
    GET_ALL_ORDERS_SUCCESSFULLY: 'Lấy tất cả đơn hàng thành công',
    UPDATE_ORDER_SUCCESSFULLY: 'Cập nhật đơn hàng thành công',
    CONFIRM_PAYMENT_SUCCESSFULLY: 'Xác nhận thanh toán thành công'
}
