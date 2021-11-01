// 2020-11-10 LG* 谜一样的方法 
// ??? <-.<- ???
// 当 data.length === 1 且 data[0].pid != null and data[0].pid != 0 时, 就无法跳出循环 --> 最终导致浏览器崩溃
// ??? ->.-> ???
// 衍生一哈 --> 当 data[i].pid != null and data[i].pid != 0 时, 就无法跳出循环 --> 最终导致浏览器崩溃
// PS: 可能在具体的业务处理中，不会产生以上情况，但是本人在第一次测试的时候就遇到了这种情况 <-.->|||

// 2020-11-19 新發現 =>.=> 這個方法太歡樂了 --> 歡樂之處在於他對於數據（也就是data）有嚴格の限制
// 限制為：根節點的數據必須在葉子節點之前，如果根節點的數據在葉子節點之後，就會出現樹形結構錯亂的bug

// 綜上所述，這個方法只能處理理想化的數據，就是 --> 數組（data）首位數據的pid == null or pid == 0, 且後續的數據必須嚴格按照根節點在葉子節點之前

// 最終決定 --> 全部換了 <+.+>

// 格式化树数据
export function toTreeData_bak(data) {
	var pos = {};
	var tree = [];
	var i = 0;
	while (data.length != 0) {
		if (data[i].pid == null || data[i].pid == 0) {
			tree.push({
				id: data[i].id,
				name: data[i].name,
				total: data[i].total,
				tb: data[i].tb,
				children: []
			});
			pos[data[i].id] = [tree.length - 1];
			data.splice(i, 1);
			i--;
		} else {
			var posArr = pos[data[i].pid];
			if (posArr != undefined) {
				var obj = tree[posArr[0]];
				for (var j = 1; j < posArr.length; j++) {
					obj = obj.children[posArr[j]];
				}
				obj.children.push({
					id: data[i].id,
					name: data[i].name,
					total: data[i].total,
					tb: data[i].tb,
					children: []
				});
				pos[data[i].id] = posArr.concat([obj.children.length - 1]);
				data.splice(i, 1);
				i--;
			}
			// 2020-11-10 LG* 补充的else判断 
			// 去掉的话就会产生开头描述的bug
			// 这个方法的诞生也许并不符合这个的方法的思想 <-.->||| (胡诌的)
			else {
				tree.push({
					id: data[i].id,
					name: data[i].name,
					total: data[i].total,
					tb: data[i].tb,
					children: []
				});
				pos[data[i].id] = [tree.length - 1];
				data.splice(i, 1);
				i--;
			}
		}
		i++;
		if (i > data.length - 1) {
			i = 0;
		}
	}
	return tree;
}

export function toTreeData(data){
	const id = 'id',
	parentId = 'pid',
	children ='children',
	rootId = 0;

	//对源数据深度克隆
	const cloneData = JSON.parse(JSON.stringify(data))
	
	//循环所有项
	const treeData = cloneData.filter(father => {
		let branchArr = cloneData.filter(child => {
			//返回每一项的子级数组
			return father[id] === child[parentId]
		});
		branchArr.length > 0 ? father[children] = branchArr : '';
		//返回第一层
		return father[parentId] === rootId;
	});
	return treeData != '' ? treeData : data;
}