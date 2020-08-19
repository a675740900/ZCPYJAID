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

		showArr: ['A', '2', '3', 'J', '4', '5', '6', 'Q', '7', '8', '9', 'K', '10'], // 点数按钮
		demoArr: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'], // 点数按钮
		eqArr: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ,12 ,13], // 对比数组

		showNum: false, // 列式显示

		isCounting: false,

		maxLen: 30, // 最大显示列数
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
		showNumClick() {
			this.setData({
				showNum: !this.data.showNum
			})
		},
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

			this.setData({
				_origArr: _origArr
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

		delete() {
			let origArr = this.data._origArr;
			let index = origArr.findIndex(item => item.val == '?');
			let rules = this.data.rules;
			if (index == 0) {
				return;
			}

			if (index == -1) {
				index = origArr.length;
			}

			rules.forEach(rule => {
				let ruleInfoIndex = rule.infos.findIndex(info => info.index == index - 1);
				if (ruleInfoIndex > -1) {
					rule.infos.splice(ruleInfoIndex, 1);
				}
			})

			origArr[index - 1].val = '?';
			origArr[index - 1].checked = false;

			this.setData({
				_origArr: origArr,
				rules: rules
			})
		},

		clearOrigArr() {
			let origArr = this.data._origArr;
			let rules = this.data.rules;
			let legalArr = this.data.legalArr;
			origArr.forEach(item => {
				item.val = '?';
				item.checked = false;
			});

			rules.forEach(rule => {
				rule.infos = [];
			})

			legalArr = [];

			this.setData({
				_origArr: origArr,
				rules: rules,
				legalArr: legalArr,
				showNum: false
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
			wx.vibrateShort({}); // 振动
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
			wx.vibrateShort({});
			let index = this.data._origArr.findIndex(item => item.val == '?');
			if (index > -1) {
				let origArr = this.data._origArr;
				origArr[index].val = event.currentTarget.dataset.item;

				this.setData({
					_origArr: origArr
				})
			}
		},

		async yanjiao() {
			wx.vibrateShort({});
			await this.setMaxLen();
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
				this.setData({
					isCounting: true
				})
				let legal = yanjiao.jisuan(origArr, mustIndexs, oneSideIndexs, this.data.maxLen);
				console.log(legal);
				this.setLegalArr(legal);
				this.setData({
					isCounting: false
				})
			}
		},

		setLegalArr(legalArr) {
			let unique = 0;
			legalArr.forEach(item => {
				item.unique = `unique_${++unique}`;
				item.leftStr = item.leftArr.map(val => this.data.demoArr[val - 1]).join(' ');
				item.rightStr = item.rightArr.map(val => this.data.demoArr[val - 1]).join(' ');
				item.ignoreStr = item.ignoreArr.map(val => this.data.demoArr[val - 1]).join(' ');

				let isMust = true;
				let leftSide = true;
				let rightSide = true;
				this.data.rules.forEach(rule => {
					if (rule.type == 'must') {
						for (let i = 0; i < rule.infos.length; i++) {
							if (item.ignoreIndexs.includes(rule.infos[i].index)) {
								isMust = false;
								return;
							}
						}

					} else if (rule.type == 'oneSide') {
						for (let i = 0; i < rule.infos.length; i++) {
							if (!item.leftArr.includes(this.data.demoArr.indexOf(rule.infos[i].num) + 1)) {
								leftSide = false;
								break;
							}
						}

						if (!leftSide) {
							for (let i = 0; i < rule.infos.length; i++) {
								if (!item.rightArr.includes(this.data.demoArr.indexOf(rule.infos[i].num) + 1)) {
									rightSide = false;
									break;
								}
							}
						}
					}
				})
				if (!isMust || !leftSide && !rightSide) {
					item.biandan = true;
				}
			})
			this.setData({
				legalArr: legalArr,
				showNum: true
			})
		},

		setMaxLen() {
			let that = this;
			return new Promise(resolve => {
				wx.getStorage({
					key: 'maxLen',
					success(res) {
						if (res.data) {
							that.setData({
								maxLen: res.data
							})
						}
					},complete() {
						resolve();
					}

				})
			})
		},
	},

	ready() {
		this.initComponent();
		this.setMaxLen();
	}
})