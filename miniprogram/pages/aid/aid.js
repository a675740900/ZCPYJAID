// pages/aid/aid.js

let yanjiao = require('../common/yanjiao.js')

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
		baseNum: 8, // 基础个数
		tempArr: [], // 暂存数据
		_origArr: [], // 原生数组
		ignoreNum: 0, // 忽略个数
		legalArr: [], // 最终合法数组
		rules: [{
				title: '必要',
				type: 'must',
				infos: []
			},
			{
				title: '在一侧',
				type: 'oneSide',
				infos: []
			}
		],
		rulesCurFocus: '', // 当前选中的类型
		rulesFocusArr: [], // 当前选中数组

		demoArr: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'], // 点数按钮
		eqArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], // 对比数组
	},

	/**
	 * 监听
	 */
	observers: {
		rulesCurFocus: function () {
			this.setOrigArrChecked();
		}
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		/**
		 * 设置选中类型的数组
		 */
		setOrigArrChecked() {
			let info = this.data.rules.find(rule => rule.type == this.data.rulesCurFocus);

			let _origArr = this.data._origArr;

			_origArr.forEach(data => {
				data.checked = false
			})

			if (info) {
				info.infos.forEach(info => {
					_origArr[info.index].checked = true;
				})
			}
			this.setData({
				_origArr: _origArr
			})
			console.log(this.data.rulesFocusArr);
		},

		/**
		 * 初始化背景色
		 */
		initOrigArrChecked() {
			let _origArr = this.data._origArr
			_origArr.forEach(data => {
				data.checked = false;
			})
		},

		/**
		 * 初始化页面
		 */
		initComponent() {
			let origArr = [];
			for (let i = 0; i < this.data.baseNum; i++) {
				origArr.push({
					index: i,
					val: '?'
				});
			}
			this.setData({
				_origArr: origArr,
				rulesCurFocus: 'must' // 默认选中必要
			});
		},

		clearOrigArr() {
			let origArr = this.data._origArr;
			origArr.forEach(item => {
				item.val = '?'
			});

			this.setData({
				_origArr: origArr
			})
		},

		/**
		 * 最上层区块点击事件
		 * @param {*} event 
		 */
		bolckClick(event) {
			this.setData({
				rulesCurFocus: event.currentTarget.dataset.rule.type
			})
		},

		/**
		 * 原数据点击事件
		 * @param {*} event 
		 */
		origValTouch(event) {
			if (!this.data.rulesCurFocus) {
				return;
			}

			let item = event.currentTarget.dataset.item;

			if (item.val == '?') {
				return;
			}

			let rules = this.data.rules;
			let rule = rules.find(rule => rule.type == this.data.rulesCurFocus);

			if (rule) {
				if (item.checked) {
					rule = this.removeRule(rule, item.index);
				} else {
					let info = {
						index: item.index,
						num: item.val
					};
					rule = this.addRule(rule, info);
				}

				let origArr = this.data._origArr;
				origArr[item.index].checked = !origArr[item.index].checked;

				this.setData({
					_origArr: origArr,
					rules: rules
				})
			}
		},

		/**
		 * 移除block指定index
		 * @param {*} rule 
		 * @param {*} index 
		 */
		removeRule(rule, index) {
			let _index = rule.infos.findIndex(info => info.index == index);

			if (index > -1) {
				rule.infos.splice(_index, 1);
			}

			return rule;
		},

		addRule(rule, info) {
			return rule.infos.push(info);
		},

		/**
		 * 点数按钮点击事件
		 */
		demoClick(event) {
			let index = this.data._origArr.findIndex(item => item.val == '?');
			if (index > -1) {
				let origArr = this.data._origArr;
				origArr[index].val = event.currentTarget.dataset.item;

				this.setData({
					_origArr: origArr
				})
			}
		},

		yanjiao() {
			let origArr = this.data._origArr.filter(item => item.val != '?').map(item => this.data.eqArr[this.data.demoArr.indexOf(item.val)]);
			let mustIndexs = [];
			let oneSideIndexs = [];
			let mustRule = this.data.rules.find(rule => rule.type == 'must');
			if (mustRule) {
				mustIndexs = mustRule.infos.map(info => info.index);
			}
			let oneSideRule = this.data.rules.find(rule => rule.type == 'oneSide');
			if (oneSideRule) {
				oneSideIndexs = oneSideRule.infos.map(info => info.index);
			}

			if (origArr && origArr.length > 0) {
				let legal = yanjiao.jisuan(origArr, mustIndexs, oneSideIndexs);
				console.log(legal);
			}
		}
	},

	ready() {
		this.initComponent();
	}
})