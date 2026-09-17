export default {
  'radio.ZtRadioGroup.props.variant': { description:'兼容旧版样式配置，新代码使用 segmented 属性；segmented 为 true 时优先启用连体样式。' },
  'form.ZtForm.props.size': { description:'控制表单及其子控件的尺寸；子控件显式设置的 size 优先。' },
  'select.ZtSelect.props.modelValue': { description:'当前选中值；单选为空时为 null，多选为空时为 []。' },
  'date-picker.ZtDatePicker.events.change': { description:'用户完成日期选择或执行清空后触发。' },
  'date-time-picker.ZtDateTimePicker.events.change': { description:'用户点击确定提交日期时间，或执行清空后触发。' },
  'upload.ZtUpload.props.request': { description:'接管单个文件上传；可直接传入经过 Axios 拦截器封装的接口方法。' },
  'input-otp.ZtInputOtp.events.complete': { description:'输入达到配置位数时触发；不表示验证码已经通过服务端校验。' },
}
