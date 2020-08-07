// pages/uiTest/uitest.js
Component({
	data: {
		indicatorDots: false,
		test1: [1, 2, 3, 4, 5],
		test2: [0],
		test: []
	},

	methods: {
		changeIndicatorDots() {
			this.setData({
				indicatorDots: !this.data.indicatorDots
			})
			
			if (this.data.indicatorDots) {
				this.setData({
					test: this.data.test1
				});
			} else {
				this.setData({
					test: this.data.test2
				});
			}

		}
	},

	ready() {
		this.setData({
			test: this.data.test2
		});
	}

})