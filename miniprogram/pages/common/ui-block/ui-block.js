// pages/common/ui-block/ui-block.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		title: {
			type: String,
			value: '未配置'
		},
		arr: {
			type: Array,
			value: [{num:1},{num:2}]
		},
		focus: {
			type: Boolean,
			value: false
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		backgroundColor: 'none',
		focusColor: '#ebebeb',
	},

	observers: {
		focus: function() {
			this.setBackgroundColor();
		}
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		setBackgroundColor() {
			this.setData({
				backgroundColor: this.properties.focus ? this.data.focusColor : 'none'
			})
		}
	},

	ready() {
		// this.setBackgroundColor();
		console.log(this)
	},
})