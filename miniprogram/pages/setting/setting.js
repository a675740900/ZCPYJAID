// pages/setting/setting.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {

	},

	/**
	 * 组件的初始数据
	 */
	data: {
		maxLenArr: [1, 3, 5, 10, 20, 30, 50],
		defaultLen: 30,
		value: [5]
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		bindChange(e) {
			let that = this;
			const val = e.detail.value;
			wx.setStorage({
				key: "maxLen",
				data: that.data.maxLenArr[val[0]]
			})
		}
	},

	ready() {
		let that = this;
		wx.getStorage({
			key: 'maxLen',
			success(res) {
				let value = [];
				if (res.data) {
					value = [that.data.maxLenArr.indexOf(res.data)];
					that.setData({
						value: value
					})
				}
			}
		})
	}
})