let tempArr = []; // 暂存
let _origArr = [];
let ignoreNum = 0; // 忽略个数
let legalArr; // 最终合法数组
let mustIndexs = []; // 必要
let oneSideIndexs = []; // 必须在一侧的数
let maxNum = 30;

function jisuan(origArr, mustIndexs, oneSideIndexs) {
	tempArr = [];
	legalArr = [];
	ignoreNum = 0;
	mustIndexs = mustIndexs;
	oneSideIndexs = oneSideIndexs;
	let oldDate = new Date().getTime();
	zcpyj(origArr);
	console.log('耗时：' + new Date().getTime() - oldDate);

	return legalArr;
}

/**
 * 张昌蒲严教
 **/
function zcpyj(arr) {
	if (arr.length == 0) {
		return;
	}

	_origArr = arr;

	ignoreNum = 0; // 忽略个数

	let newArr = reSetArr(arr);

	while (ignoreNum <= newArr.length - 2 && legalArr.length <= maxNum) {
		let setLeftLen = 1;

		let copyArr = newArr.concat();
		if (ignoreNum > 0) {
			getPLZH(copyArr, ignoreNum);
			let ignoreArr = tempArr.concat();
			for (let i = 0; i < ignoreArr.length; i++) {
				let map = ignoreArr[i];
				copyArr = newArr.concat();
				let str = '';
				for (let i = map.leftArr.length - 1; i >= 0; i--) {
					copyArr.splice(map.leftArr[i].index, 1);
					str += map.leftArr[i].index + ' ';
				}
				// console.log('------- 忽略下标：' + str + '-------');

				setLeftLen = 1;
				while (setLeftLen <= copyArr.length - 1 && legalArr.length <= maxNum) {
					getPLZH(copyArr, setLeftLen);
					setIgnoreArr(tempArr, map.leftArr);
					checkSatisfy(arr, tempArr);
					setLeftLen++;
					// await sleep(0);
				}
			}
		} else {
			// console.log('------- 没有忽略 -------')
			while (setLeftLen <= copyArr.length - ignoreNum - 1 && legalArr.length <= maxNum) {
				getPLZH(copyArr, setLeftLen);
				setIgnoreArr(tempArr, []);
				checkSatisfy(arr, tempArr);
				// consoleLog(tempArr);
				setLeftLen++;
				// await sleep(0);
			}
		}

		ignoreNum++;

		// await sleep(0);
	}
}

function isArrEqu(arr1, arr2) {
	return arr1.sort().toString() == arr2.sort().toString();
}

function setIgnoreArr(arr, ignoreArr) {
	arr.forEach(map => {
		map.ignoreArr = ignoreArr;
	})
}

function checkSatisfy(origArr, arr) {
	arr.forEach(map => {
		if (legalArr.length > maxNum) {
			return;
		}
		let newMap = {
			leftIndexs: [],
			rightIndexs: [],
			ignoreIndexs: map.ignoreArr.map(val => val.index)
		};

		map.leftArr.forEach(left => {
			newMap.leftIndexs.push(left.index);
		})

		for (let i = 0; i < origArr.length; i++) {

			if (newMap.leftIndexs.includes(i)) {
				continue;
			}


			if (newMap.ignoreIndexs.includes(i)) {
				continue;
			}

			newMap.rightIndexs.push(i);
		}

		let _newMap = {
			leftArr: [],
			rightArr: [],
			leftIndexs: newMap.leftIndexs,
			rightIndexs: newMap.rightIndexs,
			ignoreIndexs: newMap.ignoreIndexs,
			ignoreArr: newMap.ignoreIndexs.map(index => origArr[index])
		}

		newMap.leftIndexs.forEach(index => {
			_newMap.leftArr.push(parseInt(origArr[index]));
		})

		newMap.rightIndexs.forEach(index => {
			_newMap.rightArr.push(parseInt(origArr[index]));
		})

		_newMap.leftSum = getSum(_newMap.leftArr);
		_newMap.rightSum = getSum(_newMap.rightArr);

		if (_newMap.leftSum == _newMap.rightSum) {
			let isExist = false;
			for (let i = 0; i < legalArr.length; i++) {
				if ((isArrEqu(legalArr[i].leftArr, _newMap.leftArr) &&
						isArrEqu(legalArr[i].rightArr, _newMap.rightArr)) ||
					(isArrEqu(legalArr[i].leftArr, _newMap.rightArr) &&
						isArrEqu(legalArr[i].rightArr, _newMap.leftArr))) {
					isExist = true;
					break;
				}
			}
			if (!isExist) {
				legalArr.push(_newMap);
			}
		}
	})
}

// 求和
function getSum(arr) {
	let sum = 0;
	arr.forEach(num => sum += num);
	return sum;
}

// 获取排列数组
function getPLZH(arr, num) {
	tempArr = [];
	return recursion(arr, num, []);
}

function recursion(arr, num, _recArr) {
	for (let i = 0; i < arr.length; i++) {
		if (_recArr.length + 1 == num) {
			let leftArr = [];
			let str = '';
			_recArr.forEach(map => {
				str += map.arr[map.index] + ' ';
				leftArr.push(map.arr[map.index]);
			})

			str += arr[i];
			leftArr.push(arr[i]);
			tempArr.push({
				leftArr: leftArr,
				ignoreNum: ignoreNum
			});
		} else {
			let newArr = arr.concat();
			newArr.splice(0, i + 1);

			let recArr = _recArr.concat();
			recArr.push({
				index: i,
				arr: arr
			})
			recursion(newArr, num, recArr);
		}
	}
}

function reSetArr(arr) {
	if (!arr || arr.length == 0) {
		return arr;
	}

	let newArr = [];
	let index = 0;
	arr.forEach(map => {
		newArr.push({
			val: map,
			index: index++,
		})
	})

	return newArr;
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

function toInt(val) {
	return val ? parseInt(val + '') : 0;
}

exports.jisuan = jisuan;